#!/bin/bash
# Push all configuration changes

cd "$(dirname "$0")"

echo "Adding files..."
git add frontend/src/api/client.js backend/server.js frontend/src/pages/Login.jsx frontend/src/pages/Signup.jsx frontend/src/context/AuthContext.jsx frontend/.env.production frontend/.env.development DEPLOYMENT_CONFIG.md

echo "Committing..."
git commit -m "fix: Configure frontend-backend communication for Vercel+Railway deployment

- Update API client to use REACT_APP_API_URL with Railway fallback
- Add credentials support to all API requests
- Improve backend CORS configuration with dynamic origin validation
- Support both https://ro-website-theta.vercel.app and localhost for development
- Add deployment configuration guide"

echo "Pushing..."
git push

echo "✅ Done! Both Vercel and Railway will auto-redeploy."
echo ""
echo "Now follow the steps in DEPLOYMENT_CONFIG.md to:"
echo "1. Set REACT_APP_API_URL in Vercel dashboard"
echo "2. Set FRONTEND_URL in Railway dashboard"
echo "3. Redeploy your apps"
