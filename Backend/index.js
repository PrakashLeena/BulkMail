const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const path = require('path');
require('dotenv').config();

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

// MongoDB connection configuration for serverless
let cachedDb = null;

const connectDB = async () => {
  // Return cached connection if available
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedDb;
  }

  try {
    console.log('Establishing new MongoDB connection...');
    
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://kiboxsonleena2004_db_user:20040620@cluster0.fk6vzxs.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0";
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Serverless-friendly options
      maxPoolSize: 10,
      minPoolSize: 1,
    });
    
    cachedDb = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    cachedDb = null;
    throw error;
  }
};

// Connection event handlers (simplified for serverless)
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
  cachedDb = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️  MongoDB disconnected');
  cachedDb = null;
});

// Define Mongoose schema
const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
});

const Credential = mongoose.model("Credential", credentialSchema, "BulkMail");

// API Routes
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ 
      status: 'ok',
      mongoConnected: mongoose.connection.readyState === 1,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      mongoConnected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test endpoint
app.get('/api/test', async (req, res) => {
  try {
    console.log('Test endpoint hit');
    await connectDB();
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
    // Ensure DB connection
    await connectDB();
    
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
app.get('/', async (req, res) => {
  try {
    await connectDB();
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
  } catch (error) {
    res.json({
      message: 'BulkMail API is running (DB connection pending)',
      environment: process.env.NODE_ENV || 'development',
      mongoConnected: false,
      apiEndpoints: {
        healthCheck: '/api/health',
        test: '/api/test',
        sendMail: '/api/sendmail (POST)'
      }
    });
  }
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
