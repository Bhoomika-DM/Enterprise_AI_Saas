# Environment Variables Reference

## Frontend Environment Variables

All environment variables for Vite must be prefixed with `VITE_` to be exposed to the client.

### Required Variables

| Variable | Purpose | Development | Production |
|----------|---------|-------------|------------|
| `VITE_API_URL` | Main FastAPI backend (auth, APIs) | `http://localhost:5000` | `https://your-backend.railway.app` |
| `VITE_BACKEND_URL` | WebSocket/Terminal backend | `http://localhost:8000` | `https://your-ws-backend.railway.app` |
| `VITE_API_BASE_URL` | Alternative API base (optional) | `http://localhost:5000` | `https://your-backend.railway.app` |

### Where They're Used

#### VITE_API_URL
Used for authentication and main API calls:
- `frontend/src/pages/SignIn.jsx` - Sign in API, Google OAuth, Twitter OAuth
- `frontend/src/pages/SignUp.jsx` - Sign up API, OAuth redirects
- `frontend/src/contexts/AuthContext.jsx` - Auth verification, OAuth callbacks
- `frontend/src/services/LanguageService.ts` - Language switching
- `frontend/src/components/LanguageSelector/LanguageSelector.tsx` - Language API

#### VITE_BACKEND_URL
Used for WebSocket and real-time features:
- `frontend/src/services/ExecutionService.ts` - Code execution
- `frontend/src/services/GitBackendService.ts` - Git operations
- `frontend/src/components/Terminal/SystemTerminal.tsx` - Terminal WebSocket

#### VITE_API_BASE_URL
Used by API client:
- `frontend/src/services/apiClient.js` - Axios base configuration

## Backend Environment Variables

### FastAPI Backend (.env)

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-random-secret-32-chars-minimum
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.railway.app/api/auth/google/callback

TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_CALLBACK_URL=https://your-backend.railway.app/api/auth/twitter/callback

# Frontend URL (for OAuth redirects)
FRONTEND_URL=https://your-frontend.railway.app

# Server Configuration
PORT=5000
HOST=0.0.0.0
```

## Setting Environment Variables

### Local Development

1. Copy example files:
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend-fastapi/.env.example backend-fastapi/.env
   ```

2. Edit `.env` files with your local values

3. Restart servers after changes

### Railway Deployment

1. Go to Railway dashboard
2. Select your project
3. Click "Variables" tab
4. Add each variable with production values
5. Redeploy if needed

### Vercel Deployment

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable
5. Redeploy

## Validation

### Check Frontend Variables

In browser console:
```javascript
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_BACKEND_URL)
```

### Check Backend Variables

In Python:
```python
import os
print(os.getenv('SUPABASE_URL'))
print(os.getenv('JWT_SECRET'))
```

## Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use different secrets** for development and production
3. **Rotate secrets regularly** in production
4. **Use strong random strings** for JWT_SECRET (32+ characters)
5. **Keep OAuth secrets secure** - Never expose in client code

## Troubleshooting

### Variables Not Loading

**Frontend:**
- Ensure variables start with `VITE_`
- Rebuild after changing `.env`: `npm run build`
- Check browser console for values

**Backend:**
- Ensure `.env` file exists in backend directory
- Check file permissions
- Verify no syntax errors in `.env`

### OAuth Not Working

1. Check `FRONTEND_URL` matches your deployed frontend
2. Verify OAuth callback URLs in provider settings
3. Ensure `GOOGLE_REDIRECT_URI` and `TWITTER_CALLBACK_URL` match backend URL
4. Check CORS settings allow frontend domain

### API Calls Failing

1. Verify `VITE_API_URL` is correct
2. Check backend is running and accessible
3. Verify CORS settings in backend
4. Check network tab in browser DevTools
