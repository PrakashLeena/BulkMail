# BulkMail Backend API

Backend API for the BulkMail application built with Express.js, MongoDB, and Nodemailer.

## Features

- Send bulk emails using Gmail SMTP
- MongoDB integration for storing email credentials
- RESTful API endpoints
- CORS enabled for frontend integration
- Health check endpoints

## Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account
- Gmail account with App Password enabled

## Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=your_frontend_url
PORT=5000
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Running Locally

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Check API and database status

### Test Endpoint
- **GET** `/api/test` - Test API functionality

### Send Mail
- **POST** `/api/sendmail` - Send bulk emails
  - Body: `{ "message": "string", "recipients": ["email1@example.com", "email2@example.com"] }`

## Deployment to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the root directory:
   ```bash
   vercel --prod
   ```

4. Set environment variables in Vercel Dashboard:
   - `MONGODB_URI`
   - `FRONTEND_URL`
   - `NODE_ENV=production`

## Important Notes

- Make sure to add your MongoDB credentials to the database
- Use Gmail App Passwords, not your regular Gmail password
- The credentials should be stored in the `BulkMail` collection in MongoDB
- Schema: `{ user: "your-email@gmail.com", pass: "your-app-password" }`

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure network access is configured properly

### Email Sending Issues
- Verify Gmail App Password is correct
- Check if "Less secure app access" is enabled (if using regular password)
- Ensure credentials are properly stored in MongoDB

### Vercel Deployment Issues
- Make sure all environment variables are set in Vercel Dashboard
- Check build logs for any errors
- Verify the `vercel.json` configuration is correct
