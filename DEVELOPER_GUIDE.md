# Quick Developer Guide - ROwebsite

## Getting Started

### Prerequisites
- Node.js 18+ (Currently using 20.17.0)
- MongoDB connection
- Git

### Installation

```bash
# Backend setup
cd backend
npm install
cp .env.example .env  # Configure your environment
npm run seed  # Optional: seed database

# Frontend setup
cd ../frontend
npm install
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### Production Build

```bash
cd frontend
npm run build
```

## Admin User Creation

```bash
cd backend

# Method 1: Interactive
npm run create-admin

# Method 2: Environment variables
ADMIN_NAME="John Admin" ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="securepass123" npm run create-admin

# Method 3: With arguments
node create_admin.js --name "John" --email "admin@example.com" --password "securepass123"
```

## API Endpoints

### Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/me
```

### Products
```
GET    /api/products              # List all
GET    /api/products?category=slug
GET    /api/products?tech=RO
GET    /api/products/:slug        # Single product
POST   /api/products (admin only)
PUT    /api/products/:slug (admin only)
DELETE /api/products/:slug (admin only)
```

### Orders
```
GET    /api/orders/mine           # User's orders
GET    /api/orders/:id            # Single order
POST   /api/orders                # Create order
```

### Categories
```
GET    /api/categories
POST   /api/categories (admin only)
```

### Inquiries
```
POST   /api/inquiries             # Contact form
GET    /api/inquiries (admin only)
```

## Common Tasks

### Add a New Page

1. Create file: `frontend/src/pages/NewPage.jsx`
2. Import styles and components
3. Use existing patterns:
```jsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Your content */}
  </div>
</div>
```
4. Add route in `App.js`

### Add a Protected Route

```jsx
import { useAuth } from './context/AuthContext';

function ProtectedPage() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  return <YourComponent />;
}
```

### Add Loading State

```jsx
import Loader from './components/Loader';

function MyComponent() {
  const [loading, setLoading] = useState(false);
  if (loading) return <Loader label="Loading..." />;
  // ... rest of component
}
```

### Create API Call

```jsx
import { apiGet, apiPost } from './api/client';

// GET
const data = await apiGet('/api/products');

// POST with auth
const order = await apiPost('/api/orders', payload, { authToken });
```

### Show Toast

```jsx
import { useToast } from './context/ToastContext';

function MyComponent() {
  const { showToast } = useToast();
  
  showToast('Success!', { type: 'success' });
  showToast('Error!', { type: 'error' });
}
```

## Styling Guidelines

### Page Background
```jsx
// Standard gradient
className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
```

### Cards
```jsx
className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow p-6"
```

### Buttons
```jsx
// Primary
className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md transition-all"

// Secondary
className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
```

### Form Inputs
```jsx
className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
```

## Environment Variables

### Backend (.env)
```
# Database
MONGODB_URI=mongodb://localhost:27017/rowebsite

# Security
JWT_SECRET=your-super-secret-key-here

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_GLOBAL=100
RATE_LIMIT_AUTH=5
RATE_LIMIT_INQUIRIES=12
DISABLE_RATE_LIMIT=false

# Email (optional)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Debugging

### Backend
```bash
# Enable verbose logging
DEBUG=app:* npm start

# MongoDB shell
mongosh rowebsite
```

### Frontend
```bash
# React DevTools browser extension
# Redux DevTools for state debugging
# Check Console tab for errors
```

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB
mongod
```

### CORS Error
```
Solution: Check FRONTEND_URL in backend .env matches your frontend URL
```

### Token Expired
```
User will be redirected to login automatically
Frontend stores token in localStorage
Backend validates on each protected route
```

### Build Failed
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Testing

### Manual Testing Checklist
- [ ] Signup works
- [ ] Login works
- [ ] Products load
- [ ] Filters work
- [ ] Cart add/remove
- [ ] Checkout completes
- [ ] Profile updates
- [ ] Logout works
- [ ] Mobile responsive

### Security Testing
- [ ] Token not in console
- [ ] Rate limiting works
- [ ] Invalid token rejected
- [ ] Non-admin denied
- [ ] CORS working

## Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Connect repo
3. Set `REACT_APP_API_URL` environment variable
4. Deploy

### Backend Deployment (Heroku/Railway)
1. Set all environment variables
2. Connect MongoDB Atlas
3. Deploy
4. Update `FRONTEND_URL`

## Performance Tips

1. **Lazy Load Routes**: Use React.lazy()
2. **Optimize Images**: Use WebP format
3. **Minimize Re-renders**: Use useMemo/useCallback
4. **Code Splitting**: Implement route-based code splitting
5. **Database Indexes**: Add indexes on frequently queried fields

## Security Reminders

- ✅ Never commit .env files
- ✅ Always use HTTPS in production
- ✅ Validate all inputs on backend
- ✅ Sanitize user data
- ✅ Use strong JWT secrets
- ✅ Enable CORS properly
- ✅ Set security headers
- ✅ Implement rate limiting
- ✅ Hash passwords with bcrypt
- ✅ Use prepared statements for queries

## Useful Commands

```bash
# Backend
npm start              # Start server
npm run seed          # Seed database
npm run create-admin  # Create admin user

# Frontend
npm start             # Start dev server
npm run build         # Production build
npm test              # Run tests
npm run eject         # Eject from CRA

# General
git status
git add .
git commit -m "message"
git push origin main
```

## Resources

- React Docs: https://react.dev
- Express Docs: https://expressjs.com
- Mongoose Docs: https://mongoosejs.com
- Tailwind CSS: https://tailwindcss.com
- JWT Info: https://jwt.io

## Support

For issues or questions:
1. Check existing documentation
2. Review error messages carefully
3. Check browser console
4. Check server logs
5. Enable DEBUG mode

---

**Quick Start Summary**:
```bash
# Backend
cd backend && npm install && npm start

# Frontend (new terminal)
cd frontend && npm install && npm start

# Admin
cd backend && npm run create-admin
```

Then visit http://localhost:3000
