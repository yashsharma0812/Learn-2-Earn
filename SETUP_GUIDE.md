# Learn2Earn - MongoDB Authentication Setup Guide

## Overview

Your app has been successfully configured to use MongoDB for authentication instead of Supabase. The authentication system includes:
- User registration with password hashing (bcrypt)
- User login with JWT tokens
- Protected routes for authenticated users
- Token verification for persistent sessions

## Project Structure

```
Learn-2-Earn/
├── server/                  # Backend API
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   └── User.js         # User model with auth methods
│   ├── routes/
│   │   └── auth.js         # Authentication endpoints
│   ├── index.js            # Server entry point
│   ├── .env                # Environment variables
│   └── package.json
│
├── src/                     # Frontend
│   ├── contexts/
│   │   └── AuthContext.tsx # Auth state management
│   ├── components/
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── pages/
│   │   └── Auth.tsx        # Login/Register page
│   └── ...
```

## Setup Instructions

### 1. Backend Setup

Open a terminal and navigate to the server directory:

```bash
cd server
npm install  # Already done
npm start
```

The server will run on `http://localhost:3001` and connect to your MongoDB database.

You should see:
```
Connected to MongoDB successfully!
Server is running on http://localhost:3001
```

### 2. Frontend Setup

Open a NEW terminal (keep the backend running) and navigate to the project root:

```bash
cd ..  # Back to project root
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port specified by Vite).

### 3. Testing the Authentication

1. **Open your browser** to `http://localhost:5173`
2. **Navigate to /auth** (or click Sign In)
3. **Create a new account**:
   - Enter username (min 3 characters)
   - Enter email
   - Enter password (min 6 characters)
   - Click "Create Account"
4. **You should be redirected to /dashboard** upon successful registration
5. **Try logging out** and logging back in with your credentials

## MongoDB Database

- **Connection**: mongodb+srv://admin:admin@cluster0.zzinnu7.mongodb.net/
- **Database Name**: learn2earn
- **Collection**: users

### User Schema

```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed with bcrypt),
  username: String,
  points: Number (default: 0),
  completedModules: Array,
  createdAt: Date
}
```

## API Endpoints

### POST /api/auth/register
Register a new user
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}

Response:
{
  "message": "User created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "johndoe",
    "points": 0
  }
}
```

### POST /api/auth/login
Login existing user
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": { ... }
}
```

### GET /api/auth/verify
Verify JWT token
```
Headers:
Authorization: Bearer <jwt-token>

Response:
{
  "user": { ... }
}
```

## Features Implemented

### Backend
- ✅ Express server with CORS enabled
- ✅ MongoDB connection with connection pooling
- ✅ User registration with validation
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token generation (7-day expiry)
- ✅ Token verification endpoint
- ✅ Error handling for duplicate users

### Frontend
- ✅ Auth context for global state management
- ✅ Login and registration forms with validation
- ✅ Protected routes (Dashboard, Modules, Rewards, Profile)
- ✅ Automatic token verification on app load
- ✅ Persistent sessions via localStorage
- ✅ Automatic redirect to /auth for unauthenticated users
- ✅ Logout functionality

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt before storage
2. **JWT Tokens**: Secure token-based authentication
3. **Protected Routes**: Unauthorized users are redirected to login
4. **Token Expiry**: Tokens expire after 7 days
5. **CORS Configuration**: Only allows requests from your frontend

## Troubleshooting

### Backend not starting
- Check if port 3001 is already in use
- Verify MongoDB connection string in `server/.env`
- Check Node.js version (should be 18+)

### Frontend connection issues
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify API_BASE_URL in `src/contexts/AuthContext.tsx`

### MongoDB connection errors
- Verify the MongoDB connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

### Login/Register not working
- Check browser console for errors
- Verify backend server is running and logs show no errors
- Check Network tab in browser DevTools for API responses

## Production Deployment Checklist

Before deploying to production:

1. **Change JWT_SECRET** in `server/.env` to a secure random string
2. **Update CORS settings** in `server/index.js` to only allow your production domain
3. **Use environment variables** for sensitive data (don't commit .env files)
4. **Enable HTTPS** for secure token transmission
5. **Set up proper error logging** and monitoring
6. **Consider adding rate limiting** to prevent brute force attacks
7. **Add email verification** for new accounts (optional)
8. **Implement password reset** functionality (optional)

## Next Steps

You can now:
- Add more user fields to the MongoDB schema
- Implement password reset functionality
- Add profile picture upload
- Create additional API endpoints for modules and rewards
- Implement module progress tracking in MongoDB
- Add admin authentication and protected admin routes

## Support

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify all dependencies are installed
3. Ensure MongoDB connection is active
4. Check that both servers are running simultaneously
