# OAuth Configuration Guide

## Current Production Setup

### Google OAuth Settings

**Google Cloud Console Configuration:**
- Client ID: `your-client-id.apps.googleusercontent.com` (stored in backend `.env`)
- Client Secret: `your-client-secret` (stored in backend `.env`)

**Authorized JavaScript origins:**
```
https://enterpriseaisaas-production.up.railway.app
```

**Authorized redirect URIs:**
```
https://enterpriseaisaas-production.up.railway.app/api/auth/google/callback
```

### Backend Configuration

Your `backend-fastapi/.env` should have:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.railway.app/api/auth/google/callback

# Frontend URL (where users will be redirected after OAuth)
FRONTEND_URL=https://your-frontend.railway.app
```

### Frontend Configuration

Your `frontend/.env` should have:

```env
VITE_API_URL=https://enterpriseaisaas-production.up.railway.app
```

## OAuth Flow

1. **User clicks "Sign in with Google"** on frontend
   - Frontend redirects to: `https://enterpriseaisaas-production.up.railway.app/api/auth/google`

2. **Backend redirects to Google OAuth**
   - Google shows consent screen
   - User authorizes the application

3. **Google redirects back to backend**
   - Redirect to: `https://enterpriseaisaas-production.up.railway.app/api/auth/google/callback`
   - Backend receives authorization code

4. **Backend exchanges code for tokens**
   - Gets user profile from Google
   - Creates/updates user in Supabase
   - Generates JWT token

5. **Backend redirects to frontend**
   - Redirect to: `https://unique-freedom-production-db37.up.railway.app/auth/callback?token=...`
   - Frontend stores token and redirects to dashboard

## Important Notes

### ⚠️ Common Issues

1. **Missing HTTPS in redirect URI**
   - ❌ Wrong: `enterpriseaisaas-production.up.railway.app/api/auth/google/callback`
   - ✅ Correct: `https://enterpriseaisaas-production.up.railway.app/api/auth/google/callback`

2. **Mismatched URLs**
   - Backend `.env` must match Google Cloud Console exactly
   - Check for trailing slashes, http vs https, etc.

3. **CORS Issues**
   - Backend must allow frontend domain in CORS settings
   - Check `main.py` has correct `allow_origins`

### Testing OAuth

1. **Test the OAuth flow:**
   ```
   Visit: https://unique-freedom-production-db37.up.railway.app/signin
   Click: "Sign in with Google"
   ```

2. **Check backend logs** for any errors during OAuth flow

3. **Verify redirect** happens correctly through all steps

## Railway Deployment

### Backend Environment Variables

Set these in Railway dashboard for your backend service:

```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.railway.app/api/auth/google/callback
FRONTEND_URL=https://your-frontend.railway.app
```

**Note:** Replace with your actual values from Google Cloud Console and Railway deployment URLs.

### Frontend Environment Variables

Set these in Railway dashboard for your frontend service:

```
VITE_API_URL=https://enterpriseaisaas-production.up.railway.app
```

## Updating OAuth Settings

### When you change domains:

1. **Update Google Cloud Console:**
   - Add new domain to Authorized JavaScript origins
   - Add new callback URL to Authorized redirect URIs

2. **Update Backend `.env`:**
   - Change `GOOGLE_REDIRECT_URI`
   - Change `FRONTEND_URL`

3. **Update Frontend `.env`:**
   - Change `VITE_API_URL`

4. **Redeploy both services** on Railway

## Security Checklist

- [ ] OAuth credentials are in `.env` (not committed to git)
- [ ] `.env` is in `.gitignore`
- [ ] Production uses HTTPS for all URLs
- [ ] CORS is configured to allow only your frontend domain
- [ ] JWT_SECRET is strong and unique (32+ characters)
- [ ] OAuth redirect URIs match exactly in Google Console and backend
- [ ] Frontend URL matches your deployed frontend domain

## Troubleshooting

### "redirect_uri_mismatch" error

**Cause:** The redirect URI in your request doesn't match Google Cloud Console

**Solution:**
1. Check Google Cloud Console → Credentials → Your OAuth Client
2. Verify redirect URI exactly matches (including https://)
3. Update backend `.env` if needed
4. Restart backend service

### OAuth redirects to localhost

**Cause:** Backend is using development URLs

**Solution:**
1. Check backend `.env` has production URLs
2. Verify Railway environment variables are set
3. Redeploy backend service

### "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not configured or app not verified

**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Complete all required fields
3. Add test users if app is in testing mode
4. For production, submit for verification

## Support

If OAuth is still not working:
1. Check Railway logs for both frontend and backend
2. Verify all URLs match exactly (no typos)
3. Test with a different Google account
4. Clear browser cookies and cache
5. Check Google Cloud Console for any warnings or errors
