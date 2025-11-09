# Learn2Earn Backend Server

This is the backend API server for Learn2Earn with MongoDB authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - The `.env` file is already configured with your MongoDB connection string
   - Update `JWT_SECRET` to a secure random string in production

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

#### POST /api/auth/login
Login existing user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/verify
Verify JWT token (requires Authorization header)
```
Headers: {
  "Authorization": "Bearer <token>"
}
```

### Health Check

#### GET /api/health
Check if server is running
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- CORS is enabled for frontend communication
- Change `JWT_SECRET` in production to a secure random string
- Consider using environment variables for sensitive data
