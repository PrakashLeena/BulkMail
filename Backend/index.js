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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://kiboxsonleena2004_db_user:20040620@cluster0.fk6vzxs.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Failed to connect:", err));

// Define Mongoose schema
const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
});

const Credential = mongoose.model("Credential", credentialSchema, "BulkMail");

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Frontend/build')));
  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/build/index.html'));
  });
} else {
  // In development, just provide a simple response
  app.get('/', (req, res) => {
    res.json({
      message: 'BulkMail API is running in development mode',
      apiEndpoints: {
        healthCheck: '/api/health',
        sendMail: '/api/sendmail (POST)'
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  console.error('Error Details:', {
    message: err.message,
    name: err.name,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    headers: req.headers
  });
  
  // Only show detailed error in development
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      error: 'Something went wrong!',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  res.status(500).json({ 
    error: 'Something went wrong!',
    requestId: req.id
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
