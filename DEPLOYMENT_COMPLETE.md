# 🚀 BulkMail Deployment Guide - Complete Setup

## 📋 Current Status
- ✅ Backend serverless fixes applied
- ✅ Frontend API configuration updated
- ✅ Vercel.json configured
- ✅ Dependencies installed

## 🔧 Required Environment Variables

### Backend (Vercel Project 1)
Go to your **Backend Vercel Project** → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://kiboxsonleena2004_db_user:20040620@cluster0.fk6vzxs.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=https://bulk-mail-woad.vercel.app
NODE_ENV=production
```

**Important Notes:**
- Replace `bulk-mail-woad.vercel.app` with your actual frontend URL
- The MongoDB URI should match exactly what's in your code

### Frontend (Vercel Project 2)
Go to your **Frontend Vercel Project** → Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-backend-project-name.vercel.app
```

Replace `your-backend-project-name.vercel.app` with your actual backend Vercel URL.

## 🚀 Deployment Steps

### Step 1: Redeploy Backend
1. Go to your Backend Vercel project dashboard
2. Click "Deployments" tab
3. Click "Redeploy" on the latest deployment
4. Wait for successful deployment

### Step 2: Redeploy Frontend
1. Go to your Frontend Vercel project dashboard
2. Add the `REACT_APP_API_URL` environment variable
3. Click "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Wait for successful deployment

### Step 3: Test Endpoints

#### Backend Health Check
Visit: `https://your-backend-url.vercel.app/api/health`
Should return: `{"status":"ok","mongoConnected":true,"timestamp":"..."}`

#### Backend Test Endpoint
Visit: `https://your-backend-url.vercel.app/api/test`
Should return API status and MongoDB connection status.

## 🔍 Troubleshooting

### Issue: "Something went wrong!" (Backend)
- Check Vercel function logs for detailed errors
- Verify MongoDB URI is correct and accessible
- Ensure `NODE_ENV=production` is set

### Issue: "Error sending mail"
- Check if email credentials exist in database
- Verify MongoDB connection works
- Check Vercel function logs for email sending errors

### Issue: Frontend can't connect to backend
- Verify `REACT_APP_API_URL` is set correctly in frontend Vercel project
- Check browser console for CORS errors
- Ensure backend `FRONTEND_URL` matches your frontend domain

### Issue: MongoDB connection fails
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Ensure database user has read/write permissions

## 📊 Database Setup

### Add Email Credentials
Your backend needs email credentials in the MongoDB collection. You can add them via MongoDB Atlas or create a script.

Example document structure:
```json
{
  "user": "your-email@gmail.com",
  "pass": "your-app-password"
}
```

## 🎯 Testing Checklist

- [ ] Backend health endpoint returns success
- [ ] Backend test endpoint shows MongoDB connected
- [ ] Frontend loads without console errors
- [ ] Test connection button shows backend status
- [ ] Email sending works (with valid credentials)
- [ ] CORS headers allow frontend-backend communication

## 🔗 URLs to Test

Once deployed, test these URLs:

1. **Frontend:** `https://bulk-mail-woad.vercel.app`
2. **Backend Health:** `https://your-backend.vercel.app/api/health`
3. **Backend Test:** `https://your-backend.vercel.app/api/test`

## 📞 Support

If issues persist:
1. Check Vercel function logs for errors
2. Verify all environment variables are set
3. Test MongoDB connection separately
4. Check browser developer tools for network errors
