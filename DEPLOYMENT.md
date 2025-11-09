# Deployment Guide

This project has two parts that need to be deployed separately:
1. **Frontend** (React + Vite) → Vercel
2. **Backend** (Express + MongoDB) → Railway, Render, or Heroku

## Backend Deployment (Required First!)

### Option 1: Deploy to Railway (Recommended - Free)

1. Go to [Railway.app](https://railway.app/)
2. Sign up/Login with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select this repository
5. Railway will detect the backend in `/server` folder
6. Add environment variables in Railway dashboard:
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = A secure random string
   - `PORT` = 3001 (or leave default)
7. Deploy and copy the **deployment URL** (e.g., `https://your-app.railway.app`)

### Option 2: Deploy to Render (Free tier available)

1. Go to [Render.com](https://render.com/)
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect this repository
5. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables (same as above)
7. Deploy and copy the URL

### Option 3: Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set buildpack to Node.js
5. Configure environment variables
6. Deploy: `git subtree push --prefix server heroku main`

## Frontend Deployment (Vercel)

### Step 1: Set Backend URL in Vercel

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.railway.app/api` (from backend deployment)
   - **Environment**: Production, Preview, Development
4. Save

### Step 2: Redeploy

After pushing to GitHub, Vercel will automatically redeploy with the new environment variable.

## Testing After Deployment

1. Visit your Vercel frontend URL
2. Try to register a new account
3. Check browser console for any CORS errors
4. If you see CORS errors, update backend CORS settings

## Backend CORS Configuration (if needed)

If you get CORS errors, update `server/index.js`:

```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

Replace `your-vercel-app.vercel.app` with your actual Vercel URL.

## Important Security Notes

- ✅ Never commit `.env` files
- ✅ Use strong JWT_SECRET in production
- ✅ MongoDB IP whitelist should include 0.0.0.0/0 or your backend host IPs
- ✅ Use HTTPS for all production URLs
- ✅ Change MongoDB credentials from admin:admin to something secure

## Troubleshooting

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend is running (visit backend URL in browser)
- Check browser console for CORS errors

### Backend deployment fails
- Verify `package.json` exists in server folder
- Check environment variables are set
- Review deployment logs for errors

### MongoDB connection fails
- Whitelist backend deployment IP in MongoDB Atlas
- Or use 0.0.0.0/0 (allow from anywhere)
- Verify connection string is correct
