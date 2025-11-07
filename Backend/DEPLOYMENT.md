# Vercel Deployment Guide for BulkMail Backend

## Issues Fixed

1. ✅ Added `vercel.json` configuration for serverless deployment
2. ✅ Converted MongoDB connection to lazy-loading pattern (serverless-friendly)
3. ✅ Removed retry logic that doesn't work in serverless environment
4. ✅ Added connection caching to improve cold start performance
5. ✅ Made all endpoints async and ensure DB connection before use

## Environment Variables Required in Vercel

Go to your Vercel project settings → Environment Variables and add:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.fk6vzxs.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

**IMPORTANT:** 
- Replace the MongoDB credentials with your actual credentials
- Update `FRONTEND_URL` with your actual frontend URL
- Never commit `.env` file to git

## Deployment Steps

### Option 1: Redeploy via Vercel Dashboard
1. Go to your Vercel dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add/update the environment variables above
5. Go to Deployments tab
6. Click "Redeploy" on the latest deployment

### Option 2: Deploy via Vercel CLI
```bash
cd Backend
vercel --prod
```

### Option 3: Push to Git (if connected)
```bash
git add .
git commit -m "Fix: Serverless compatibility for Vercel deployment"
git push origin main
```

## Testing After Deployment

Test these endpoints to verify deployment:

1. **Root endpoint:**
   ```
   GET https://your-backend.vercel.app/
   ```

2. **Health check:**
   ```
   GET https://your-backend.vercel.app/api/health
   ```

3. **Test endpoint:**
   ```
   GET https://your-backend.vercel.app/api/test
   ```

All should return JSON responses without the generic error.

## Common Issues

### Issue: "Something went wrong!" error
**Cause:** Missing environment variables or MongoDB connection failure
**Solution:** 
- Check Vercel environment variables are set correctly
- Verify MongoDB URI is correct and database is accessible
- Check Vercel function logs for detailed error

### Issue: MongoDB connection timeout
**Cause:** MongoDB Atlas IP whitelist or connection string issues
**Solution:**
- Add `0.0.0.0/0` to MongoDB Atlas Network Access (allow all IPs)
- Verify connection string format is correct

### Issue: CORS errors from frontend
**Cause:** `FRONTEND_URL` not set correctly
**Solution:**
- Set `FRONTEND_URL` environment variable to your actual frontend domain
- Include protocol (https://)

## Viewing Logs

To see detailed error logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click on "Deployments"
4. Click on the latest deployment
5. Click "View Function Logs"

## Key Changes Made

### vercel.json
- Configured Express app as Vercel serverless function
- Routes all requests to `index.js`

### index.js
- Added `require('dotenv').config()` for environment variables
- Converted to lazy MongoDB connection pattern
- Added connection caching for better performance
- All endpoints now ensure DB connection before executing
- Removed process exit handlers (not needed in serverless)
