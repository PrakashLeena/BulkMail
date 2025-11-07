# BulkMail - Final Environment Setup

## 🚨 CRITICAL: Fix Mixed Content Error

Your frontend is deployed on **HTTPS** but trying to call **HTTP** endpoints. This causes a "Mixed Content" security error.

## 🔧 Required Vercel Environment Variables

### Frontend Project (bulk-mail-woad.vercel.app)
Set this environment variable:

```
REACT_APP_API_URL=https://bulk-mail-xr7v.vercel.app
```

**Important:** Use `https://` NOT `http://`

### Backend Project (bulk-mail-xr7v.vercel.app)
Make sure these are set:

```
MONGODB_URI=mongodb+srv://kiboxsonleena2004_db_user:20040620@cluster0.fk6vzxs.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=https://bulk-mail-woad.vercel.app
NODE_ENV=production
```

## 🔍 How to Fix the Mixed Content Error

1. **Go to your Frontend Vercel Project Dashboard**
2. **Settings → Environment Variables**
3. **Update or Add:**
   - Name: `REACT_APP_API_URL`
   - Value: `https://bulk-mail-xr7v.vercel.app` (your backend URL with HTTPS)
4. **Click "Redeploy"** to apply the changes

## ✅ Verification Steps

After redeploying, test these endpoints:

1. **Frontend:** `https://bulk-mail-woad.vercel.app`
2. **Backend Health:** `https://bulk-mail-xr7v.vercel.app/api/health`
3. **Backend Test:** `https://bulk-mail-xr7v.vercel.app/api/test`

## 🎯 Expected Result

- ✅ No more "Mixed Content" warnings
- ✅ Frontend can successfully call backend APIs
- ✅ Email sending functionality works
- ✅ All requests use HTTPS

## 🔗 Current URLs

- **Frontend:** https://bulk-mail-woad.vercel.app
- **Backend:** https://bulk-mail-xr7v.vercel.app

The backend URL in `REACT_APP_API_URL` must include `https://` and point to your actual backend deployment.
