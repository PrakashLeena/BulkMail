const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../Frontend/build')));

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the Express API for Vercel
module.exports = app;

// Only start the server if this file is run directly (not imported as a module)
if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}
