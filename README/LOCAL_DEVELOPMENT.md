# Local Development Guide

## Quick Start

### Option 1: Test on Production (Easiest)

Just visit your deployed frontend to test OAuth:
```
https://unique-freedom-production-db37.up.railway.app/signin
```

Click "Sign in with Google" and it will use the production backend.

### Option 2: Run Everything Locally

If you want to develop and test locally:

#### 1. Start Backend

```bash
cd backend-fastapi
python main.py
```

Backend will run on: `http://localhost:5000`

#### 2. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

#### 3. Environment Files

Vite automatically uses the correct environment file:

- **Development** (`npm run dev`): Uses `.env.development`
  - Points to `http://localhost:5000`
  
- **Production** (`npm run build`): Uses `.env.production`
  - Points to `https://enterpriseaisaas-production.up.railway.app`

## Current Setup

### Frontend Environment Files

**`.env.development`** (for local dev):
```env
VITE_API_URL=http://localhost:5000
VITE_BACKEND_URL=http://localhost:8000
```

**`.env.production`** (for Railway):
```env
VITE_API_URL=https://enterpriseaisaas-production.up.railway.app
VITE_BACKEND_URL=https://web-production-85de.up.railway.app
```

**`.env`** (fallback/override):
```env
VITE_API_URL=https://enterpriseaisaas-production.up.railway.app
```

### How It Works

1. **Local Development:**
   - Run `npm run dev`
   - Vite loads `.env.development`
   - Frontend connects to `localhost:5000`
   - You need backend running locally

2. **Production Build:**
   - Run `npm run build`
   - Vite loads `.env.production`
   - Frontend connects to Railway backend
   - No local backend needed

## Testing OAuth Locally

### Requirements

1. **Backend must be running** on `localhost:5000`
2. **Google OAuth configured** for localhost:
   - Add to Google Cloud Console:
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`

3. **Backend .env** must have:
   ```env
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ```

### Testing Flow

1. Visit: `http://localhost:5173/signin`
2. Click "Sign in with Google"
3. Should redirect to: `http://localhost:5000/api/auth/google`
4. Backend redirects to Google
5. Google redirects back to: `http://localhost:5000/api/auth/google/callback`
6. Backend redirects to: `http://localhost:5173/auth/callback?token=...`

## Common Issues

### "This site can't be reached - localhost refused to connect"

**Problem:** Backend is not running

**Solution:**
```bash
cd backend-fastapi
python main.py
```

### OAuth redirects to localhost in production

**Problem:** Using development environment in production

**Solution:** 
- Railway automatically uses `.env.production`
- Make sure you deployed the latest code
- Check Railway environment variables

### Changes not reflecting

**Problem:** Vite dev server needs restart

**Solution:**
```bash
# Stop dev server (Ctrl+C)
npm run dev
```

## Recommended Workflow

### For Development:
1. Use `.env.development` (already configured)
2. Run backend locally: `python main.py`
3. Run frontend locally: `npm run dev`
4. Test on `http://localhost:5173`

### For Testing Production:
1. Just visit deployed frontend
2. No local setup needed
3. Test on `https://unique-freedom-production-db37.up.railway.app`

### For Deployment:
1. Push to GitHub
2. Railway auto-deploys
3. Uses `.env.production` automatically
4. Test on deployed URL

## Environment Variable Priority

Vite loads environment variables in this order (later overrides earlier):

1. `.env` - Loaded in all cases
2. `.env.local` - Loaded in all cases, ignored by git
3. `.env.[mode]` - Only loaded in specified mode (development/production)
4. `.env.[mode].local` - Only loaded in specified mode, ignored by git

For our setup:
- Development: `.env.development` → `.env`
- Production: `.env.production` → `.env`

## Quick Commands

```bash
# Development
npm run dev          # Start dev server (uses .env.development)

# Production
npm run build        # Build for production (uses .env.production)
npm run preview      # Preview production build locally

# Testing
npm run test         # Run tests
```

## Need Help?

- Backend not starting? Check `backend-fastapi/README.md`
- OAuth not working? Check `README/OAUTH_CONFIGURATION.md`
- Deployment issues? Check `README/PRODUCTION_DEPLOYMENT.md`
