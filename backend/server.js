const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const healthRouter = require('./routes/health');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const inquiriesRouter = require('./routes/inquiries');
const authRouter = require('./routes/auth');
const adminProductsRouter = require('./routes/adminProducts');
const adminUsersRouter = require('./routes/adminUsers');
const adminOrdersRouter = require('./routes/adminOrders');
const adminLogsRouter = require('./routes/adminLogs');
const adminAnalyticsRouter = require('./routes/adminAnalytics');
const paymentsRouter = require('./routes/payments');
const refundsRouter = require('./routes/refunds');
const adminRefundsRouter = require('./routes/adminRefunds');

const app = express();

app.set('trust proxy', 1);

// Rate limiting middleware (configurable via env)
const globalWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const globalMax = Number(process.env.RATE_LIMIT_GLOBAL) || 100;
const authMax = Number(process.env.RATE_LIMIT_AUTH) || 25;
const moderateMax = Number(process.env.RATE_LIMIT_MODERATE) || 22;

const limiter = rateLimit({
  windowMs: globalWindowMs,
  max: globalMax,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => String(process.env.DISABLE_RATE_LIMIT)?.toLowerCase() === 'true',
});

const strictLimiter = rateLimit({
  windowMs: globalWindowMs,
  max: authMax,
  message: 'Too many login/signup attempts, please try again later.',
  skip: (req) => String(process.env.DISABLE_RATE_LIMIT)?.toLowerCase() === 'true',
});

// Middleware
// Restrict CORS to frontend origin if provided, otherwise allow all during development
const frontendOrigin = process.env.FRONTEND_URL || process.env.CLIENT_URL || null;
app.use(cors({
  origin: frontendOrigin || true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Optionally disable rate limiting in development: set DISABLE_RATE_LIMIT=true
if (String(process.env.DISABLE_RATE_LIMIT)?.toLowerCase() === 'true') {
  console.log('Rate limiting disabled via DISABLE_RATE_LIMIT=true');
} 

// Simple input sanitization to mitigate NoSQL injection via keys like "$" or "."
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  const out = {};
  for (const key of Object.keys(obj)) {
    if (key.includes('$') || key.includes('.')) continue;
    out[key] = sanitizeObject(obj[key]);
  }
  return out;
}

app.use((req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
});

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MERN Stack API' });
});

// API routes
app.use('/api/health', healthRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
// Admin product management (requires admin JWT)
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use('/api/admin/logs', adminLogsRouter);
app.use('/api/admin/analytics', adminAnalyticsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/refunds', refundsRouter);
app.use('/api/admin/refunds', adminRefundsRouter);
// Moderate rate limiting for public write endpoints to prevent spam
const moderateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many requests, please try later.' });

// Apply moderate limiter to public write endpoints unless disabled
if (String(process.env.DISABLE_RATE_LIMIT)?.toLowerCase() === 'true') {
  app.use('/api/inquiries', inquiriesRouter);
  app.use('/api/auth', authRouter);
} else {
  app.use('/api/inquiries', moderateLimiter, inquiriesRouter);
  app.use('/api/auth', strictLimiter, authRouter); // Strict rate limiting on auth
}

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-app';

mongoose.connect(MONGO_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = app;
