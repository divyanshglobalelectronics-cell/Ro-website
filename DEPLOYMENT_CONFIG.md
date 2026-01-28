# Frontend & Backend Configuration Guide

## Your URLs:
- **Frontend**: https://ro-website-theta.vercel.app/
- **Backend**: https://ro-website-production.up.railway.app/

## Required Configuration Steps:

### 1. RAILWAY (Backend) - Set Environment Variables

1. Go to **https://railway.app/dashboard**
2. Click your project
3. Go to **Variables** tab
4. Add/Update these variables:
   ```
   FRONTEND_URL = https://ro-website-theta.vercel.app
   DISABLE_RATE_LIMIT = false (or leave empty)
   ```
5. **Deploy** (redeploy from GitHub)

### 2. VERCEL (Frontend) - Set Environment Variables

1. Go to **https://vercel.com/dashboard**
2. Click your project (ro-website-theta)
3. Go to **Settings** → **Environment Variables**
4. Add/Update this variable:
   ```
   REACT_APP_API_URL = https://ro-website-production.up.railway.app
   ```
5. Scope: **Production, Preview, Development** (or just Production)
6. Go to **Deployments** tab
7. Click the three dots on latest deployment → **Redeploy**

### 3. What was fixed in code:

✅ **Frontend** (`client.js`):
- Uses `REACT_APP_API_URL` environment variable
- Fallback to Railway backend URL
- Added `credentials: 'include'` for CORS

✅ **Backend** (`server.js`):
- CORS configured to accept requests from Vercel
- Added `credentials: true` support
- Dynamic CORS validation based on `FRONTEND_URL`

## Testing:

After you complete the above steps:

1. **Test Backend Health**: Visit in browser
   ```
   https://ro-website-production.up.railway.app/health
   ```

2. **Check Frontend Console** (F12 → Console):
   - Should see API calls to `https://ro-website-production.up.railway.app/api/...`
   - No 404 errors
   - No CORS errors

3. **Test a Feature**:
   - Try to load Products page
   - Try to Sign up / Login

## Troubleshooting:

If still getting 404 errors:
1. Clear browser cache: `Ctrl + Shift + Delete`
2. Hard refresh: `Ctrl + F5`
3. Check Network tab in DevTools to see actual request URL
4. Verify Railway backend is online

If still getting CORS errors:
1. Ensure `FRONTEND_URL` is set exactly as: `https://ro-website-theta.vercel.app`
2. No trailing slash
3. Use HTTPS not HTTP
