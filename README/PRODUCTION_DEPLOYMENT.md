# Production Deployment Guide

## Environment Variables Configured

All hardcoded `localhost` URLs have been replaced with environment variables for production deployment.

### Frontend Environment Variables

The frontend now uses these environment variables (defined in `.env`):

```env
# Main API URL (FastAPI backend - port 5000)
VITE_API_URL=https://your-backend.railway.app

# WebSocket/Terminal backend (port 8000)
VITE_BACKEND_URL=https://your-websocket-backend.railway.app

# Alternative API base URL (if needed)
VITE_API_BASE_URL=https://your-backend.railway.app
```

### Files Updated

The following files now use environment variables instead of hardcoded URLs:

1. **Authentication Pages**
   - `frontend/src/pages/SignIn.jsx` - Google/Twitter OAuth redirects
   - `frontend/src/pages/SignUp.jsx` - OAuth signup flows
   - `frontend/src/contexts/AuthContext.jsx` - Auth API calls

2. **Services**
   - `frontend/src/services/LanguageService.ts` - Language switching API
   - `frontend/src/services/ExecutionService.ts` - Code execution API
   - `frontend/src/services/GitBackendService.ts` - Git operations API
   - `frontend/src/components/LanguageSelector/LanguageSelector.tsx` - Language selector

3. **Configuration**
   - `frontend/vite.config.js` - Added proxy configuration for development
   - `frontend/.env.example` - Updated with all required variables

## Development Setup

For local development:

```bash
cd frontend
cp .env.example .env
# Edit .env with your local backend URLs
npm install
npm run dev
```

Default `.env` for development:
```env
VITE_API_URL=http://localhost:5000
VITE_BACKEND_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:5000
```

## Production Build

### Build the Frontend

```bash
cd frontend
npm install
npx vite build
```

The build output will be in `frontend/dist/`

### Deploy to Railway

1. **Create Railway Project**
   - Go to https://railway.app
   - Create new project
   - Connect your GitHub repository

2. **Configure Environment Variables**
   
   In Railway dashboard, add these environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_BACKEND_URL=https://your-websocket-backend.railway.app
   VITE_API_BASE_URL=https://your-backend.railway.app
   ```

3. **Configure Build Settings**
   
   Build Command:
   ```bash
   npm install && npx vite build
   ```
   
   Start Command:
   ```bash
   npx serve -s dist
   ```

4. **Deploy**
   - Push to GitHub
   - Railway will automatically build and deploy

## Backend Configuration

Make sure your backend (FastAPI) has the correct CORS settings to allow your frontend domain:

```python
# backend-fastapi/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "https://your-frontend.railway.app",  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## OAuth Configuration

Update your OAuth provider settings with production URLs:

### Google OAuth
- Authorized redirect URIs: `https://your-backend.railway.app/api/auth/google/callback`
- Authorized JavaScript origins: `https://your-frontend.railway.app`

### Twitter/X OAuth
- Callback URL: `https://your-backend.railway.app/api/auth/twitter/callback`
- Website URL: `https://your-frontend.railway.app`

## Testing Production Build Locally

Test the production build before deploying:

```bash
cd frontend
npm run build
npx serve -s dist
```

Then visit http://localhost:3000 and test:
- Google OAuth login
- Twitter/X OAuth login
- Email/password authentication
- All API calls work correctly

## Verification Checklist

- [ ] All environment variables set in Railway
- [ ] Backend CORS configured for production domain
- [ ] OAuth providers updated with production URLs
- [ ] Frontend builds successfully
- [ ] Google OAuth works in production
- [ ] Twitter OAuth works in production
- [ ] Email/password auth works
- [ ] API calls reach backend correctly
- [ ] WebSocket connections work (if applicable)

## Troubleshooting

### OAuth Redirects to Localhost

**Problem:** OAuth still redirects to localhost after deployment

**Solution:** 
1. Check environment variables in Railway dashboard
2. Verify OAuth provider callback URLs
3. Clear browser cache and cookies
4. Check backend logs for redirect URL

### API Calls Fail with CORS Error

**Problem:** Browser shows CORS policy error

**Solution:**
1. Add production frontend URL to backend CORS settings
2. Ensure credentials are included in requests
3. Check backend is deployed and accessible

### Environment Variables Not Working

**Problem:** App still uses localhost URLs

**Solution:**
1. Verify environment variables start with `VITE_`
2. Rebuild the app after changing .env
3. Check Railway build logs for environment variables
4. Ensure variables are set before build, not after

## Support

For issues or questions:
- Check Railway logs for build/runtime errors
- Verify all environment variables are set correctly
- Test locally with production environment variables
- Check browser console for errors
