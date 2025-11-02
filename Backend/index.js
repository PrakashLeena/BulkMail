const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Create a router for API routes
const apiRouter = express.Router();

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

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Root API endpoint
apiRouter.get("/", (req, res) => {
  res.json({ message: "Bulk Mail API is running" });
});

// Send mail endpoint
apiRouter.post("/sendmail", async (req, res) => {
  const { message, recipients } = req.body;

  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ error: "No recipients provided" });
  }

  try {
    const data = await Credential.find();
    if (!data || data.length === 0) {
      return res.json(false);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].user,
        pass: data[0].pass, // Gmail app password
      },
    });

    // Send emails one by one
    for (let i = 0; i < recipients.length; i++) {
      await transporter.sendMail({
        from: data[0].user,
        to: recipients[i],
        subject: "Message from Bulk Mail",
        text: message,
      });
    }

    console.log("All mails sent successfully ✅");
    res.json(true);

  } catch (error) {
    console.error("Error sending mail:", error);
    res.json(false);
  }
});

// Mount the API router
app.use("/api", apiRouter);

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// For all other routes, serve the frontend
app.use(express.static(path.join(__dirname, '../Frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/build/index.html'));
});

// Export the Express API for Vercel serverless functions
module.exports = app;

// Only start the server if this file is run directly (not imported as a module)
if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}
