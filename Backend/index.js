const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// MongoDB connection configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

const connectDB = async (retryCount = 0) => {
  try {
    console.log(`Attempting to connect to MongoDB (Attempt ${retryCount + 1}/${MAX_RETRIES})...`);
    
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb+srv://kiboxsonleena2004_db_user:20040620@cluster0.fk6vzxs.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0",
      {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        heartbeatFrequencyMS: 10000,
      }
    );
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🔄 Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error (Attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDB(retryCount + 1);
    }
    
    console.error('❌ Max retries reached. Could not connect to MongoDB.');
    if (process.env.NODE_ENV !== 'production') {
      console.error('Full error details:', error);
    }
    
    // Don't exit in production to allow the app to start in a degraded state
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
    
    throw error;
  }
};

// Initialize database connection
connectDB().catch(console.error);

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');  
  console.log(`   - Database: ${mongoose.connection.name}`);
  console.log(`   - Host: ${mongoose.connection.host}`);
  console.log(`   - Port: ${mongoose.connection.port}`);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
});

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️  MongoDB disconnected');
  // Attempt to reconnect
  if (process.env.NODE_ENV !== 'test') {
    console.log('Attempting to reconnect to MongoDB...');
    connectDB().catch(console.error);
  }
});

// Close the connection when the Node process ends
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

// MongoDB connection monitoring
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

// Define Mongoose schema
const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
});

const Credential = mongoose.model("Credential", credentialSchema, "BulkMail");

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongoConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  try {
    console.log('Test endpoint hit');
    res.json({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV || 'development',
      mongoConnected: mongoose.connection.readyState === 1,
      mongoState: {
        '0': 'disconnected',
        '1': 'connected',
        '2': 'connecting',
        '3': 'disconnecting'
      }[mongoose.connection.readyState]
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      error: 'Test failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Send mail endpoint
app.post('/api/sendmail', async (req, res) => {
  const { message, recipients } = req.body;

  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ error: "No recipients provided" });
  }

  try {
    const data = await Credential.find();
    if (!data || data.length === 0) {
      return res.json({ success: false, error: 'No email credentials found' });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].user,
        pass: data[0].pass, // Gmail app password
      },
    });

    // Send emails one by one
    const results = [];
    for (let i = 0; i < recipients.length; i++) {
      try {
        const info = await transporter.sendMail({
          from: data[0].user,
          to: recipients[i],
          subject: "Message from Bulk Mail",
          text: message,
        });
        results.push({ to: recipients[i], status: 'success', messageId: info.messageId });
      } catch (error) {
        console.error(`Error sending to ${recipients[i]}:`, error);
        results.push({ to: recipients[i], status: 'error', error: error.message });
      }
    }

    console.log("All mails processed");
    res.json({ success: true, results });

  } catch (error) {
    console.error("Error in sendmail:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'BulkMail API is running',
    environment: process.env.NODE_ENV || 'development',
    mongoConnected: mongoose.connection.readyState === 1,
    apiEndpoints: {
      healthCheck: '/api/health',
      test: '/api/test',
      sendMail: '/api/sendmail (POST)'
    }
  });
});

// Error handling middleware with detailed logging
app.use((err, req, res, next) => {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    request: {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers
    },
    environment: process.env.NODE_ENV || 'development'
  };

  // Log the full error details
  console.error('API Error:', JSON.stringify(errorDetails, null, 2));

  // Return appropriate response based on environment
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json(errorDetails);
  }
  
  // In production, return a generic error message
  res.status(500).json({ 
    error: 'Something went wrong!',
    errorId: Date.now() // For tracking in logs
  });
});

// Export the Express API for Vercel
module.exports = app;

// Start the server if this file is run directly (not imported as a module)
// For Vercel, we export the app directly
const port = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export the Express app for Vercel
