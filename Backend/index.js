const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// Configure your Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kiboxsonleena2004@gmail.com",
    pass: "yvxn npic idoj mikw", // Gmail app password
  },
});

app.post("/sendmail", async function (req, res) {
  const { message, recipients } = req.body; // ✅ get recipients from frontend

  if (!recipients || recipients.length === 0) {
    return res.json(false);
  }

  try {
    // Loop through all emails and send one by one
    for (let i = 0; i < recipients.length; i++) {
      await transporter.sendMail({
        from: "kiboxsonleena2004@gmail.com",
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

app.listen(5000, function () {
  console.log("Server started on http://localhost:5000");
});
