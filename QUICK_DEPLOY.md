# Quick Deployment Fix for 404 Error

## Problem
Other devices get 404 errors because the backend is only running on your local machine (localhost:3001).

## Solution - Deploy Backend in 5 Minutes

### Option 1: Railway (Recommended - Easiest)

1. **Go to Railway**: https://railway.app/
2. **Sign in with GitHub** (use your friend's account or yours)
3. **New Project** → **Deploy from GitHub repo**
4. **Select the repository**
5. **Railway will auto-detect the server folder**
6. **Add Environment Variables** (click on your service → Variables):
   ```
   MONGODB_URI = mongodb+srv://admin:admin@cluster0.zzinnu7.mongodb.net/learn2earn?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET = your-secret-key-12345
   FRONTEND_URL = https://your-vercel-app.vercel.app
   ```
7. **Deploy** and wait ~2 minutes
8. **Copy the URL** (e.g., `https://learn-2-earn-production.up.railway.app`)

### Option 2: Render (Free tier)

1. **Go to Render**: https://render.com/
2. **Sign in with GitHub**
3. **New** → **Web Service**
4. **Connect repository**
5. **Configure**:
   - Name: `learn-2-earn-backend`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. **Add Environment Variables** (same as above)
7. **Create Web Service** and wait ~5 minutes
8. **Copy the URL** (e.g., `https://learn-2-earn-backend.onrender.com`)

## Step 2: Update Vercel Environment Variable

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**
3. **Settings** → **Environment Variables**
4. **Add Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app/api` (replace with your Railway/Render URL)
   - Environment: Check all three (Production, Preview, Development)
5. **Save**
6. **Deployments** tab → Click the 3 dots on latest deployment → **Redeploy**

## Step 3: Test

1. Open your Vercel URL on any device
2. Try to register/login
3. It should work on all devices now!

## Troubleshooting

### Still getting 404?
- Check browser console (F12) to see what URL it's trying to reach
- Make sure VITE_API_URL is set correctly in Vercel
- Verify backend is running (visit your Railway/Render URL in browser)

### Backend not starting on Railway/Render?
- Check deployment logs
- Verify environment variables are set
- Make sure MongoDB IP whitelist includes 0.0.0.0/0 in MongoDB Atlas

### CORS errors?
- Add your Vercel URL to FRONTEND_URL environment variable in Railway/Render
