const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email, name: user.name, isAdmin: Boolean(user.isAdmin) }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// GET /api/auth/smtp-verify - development-only SMTP health check
router.get('/smtp-verify', async (_req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }
  try {
    const { verifyTransport } = require('../utils/mailer');
    const status = await verifyTransport();
    return res.json(status);
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    let { name, email, password } = req.body;
    name = typeof name === 'string' ? name.trim() : '';
    email = typeof email === 'string' ? email.trim().toLowerCase() : '';
    password = typeof password === 'string' ? password : '';
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (name.length < 2 || name.length > 60) return res.status(400).json({ error: 'Invalid name' });
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRe.test(email)) return res.status(400).json({ error: 'Invalid email' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    // audit log: user registered
    try {
      await AuditLog.create({
        user: user._id,
        userEmail: user.email,
        userName: user.name,
        action: 'user_registered',
        resourceType: 'user',
        resourceId: String(user._id),
        details: { email: user.email, name: user.name },
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
    } catch (e) {
      console.warn('[AUDIT] Failed to write user_registered log:', e && e.message);
    }
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: Boolean(user.isAdmin) } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    email = typeof email === 'string' ? email.trim().toLowerCase() : '';
    password = typeof password === 'string' ? password : '';
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRe.test(email)) return res.status(400).json({ error: 'Invalid email' });
    const user = await User.findOne({ email });
    if (!user) {
      // audit log: login failed - user not found
      try {
        await AuditLog.create({
          user: undefined,
          userEmail: email,
          userName: '',
          action: 'login_failed',
          resourceType: 'auth',
          resourceId: '',
          details: { reason: 'user_not_found', email },
          ip: req.ip,
          userAgent: req.get('User-Agent') || '',
        });
      } catch (e) {
        console.warn('[AUDIT] Failed to write login_failed log (user_not_found):', e && e.message);
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if(user.isBlocked) return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      // audit log: login failed - bad password
      try {
        await AuditLog.create({
          user: user._id,
          userEmail: user.email,
          userName: user.name,
          action: 'login_failed',
          resourceType: 'auth',
          resourceId: String(user._id),
          details: { reason: 'bad_password', email: user.email },
          ip: req.ip,
          userAgent: req.get('User-Agent') || '',
        });
      } catch (e) {
        console.warn('[AUDIT] Failed to write login_failed log (bad_password):', e && e.message);
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user);
    // audit log: login success
    try {
      await AuditLog.create({
        user: user._id,
        userEmail: user.email,
        userName: user.name,
        action: 'login_success',
        resourceType: 'auth',
        resourceId: String(user._id),
        details: { email: user.email },
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
    } catch (e) {
      console.warn('[AUDIT] Failed to write login_success log:', e && e.message);
    }
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: Boolean(user.isAdmin) } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('_id name email phone address createdAt updatedAt isAdmin');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/auth/me - update name and/or email
router.put('/me', authMiddleware, async (req, res) => {
  try {
    let { name, email, phone, address } = req.body;
    name = typeof name === 'string' ? name.trim() : undefined;
    email = typeof email === 'string' ? email.trim().toLowerCase() : undefined;
    phone = typeof phone === 'string' ? phone.trim() : typeof phone === 'number' ? String(phone) : phone;
    if (address && typeof address === 'object') {
      address = {
        line1: typeof address.line1 === 'string' ? address.line1.trim() : '',
        city: typeof address.city === 'string' ? address.city.trim() : '',
        state: typeof address.state === 'string' ? address.state.trim() : '',
        zip: typeof address.zip === 'string' ? address.zip.trim() : typeof address.zip === 'number' ? String(address.zip) : '',
      };
    }
    if (!name && !email && !phone && !address) return res.status(400).json({ error: 'Nothing to update' });
    const update = {};
    if (typeof name !== 'undefined') {
      if (name && (name.length < 2 || name.length > 60)) return res.status(400).json({ error: 'Invalid name' });
      if (name) update.name = name;
    }
    if (typeof email !== 'undefined') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      if (email && !emailRe.test(email)) return res.status(400).json({ error: 'Invalid email' });
      if (email) update.email = email;
    }
    if (typeof phone !== 'undefined') {
      const phoneRe = /^[0-9+\-()\s]{7,20}$/;
      if (phone && !phoneRe.test(phone)) return res.status(400).json({ error: 'Invalid phone' });
      update.phone = phone || '';
    }
    if (address && typeof address === 'object') {
      if (address.line1 && address.line1.length > 120) return res.status(400).json({ error: 'Address too long' });
      if (address.city && address.city.length > 60) return res.status(400).json({ error: 'City too long' });
      if (address.state && address.state.length > 60) return res.status(400).json({ error: 'State too long' });
      if (address.zip && String(address.zip).length > 12) return res.status(400).json({ error: 'ZIP too long' });
      update.address = {
        line1: address.line1 || '',
        city: address.city || '',
        state: address.state || '',
        zip: address.zip || '',
      };
    }
    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existing) return res.status(409).json({ error: 'Email already in use' });
    }
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('_id name email phone address createdAt updatedAt');
    return res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const u = await User.findById(userId);
    if (!u) return res.status(404).json({ error: 'User not found' });
    await User.findByIdAndDelete(userId);
    // audit log: user deleted their account
    try {
      await AuditLog.create({
        user: userId,
        userEmail: u.email,
        userName: u.name,
        action: 'delete_account',
        resourceType: 'user',
        resourceId: String(userId),
        details: { email: u.email, name: u.name },
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
    } catch (e) {
      console.warn('[AUDIT] Failed to write delete_account log:', e && e.message);
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;

// POST /api/auth/forgot - generate a reset token and email it
const forgotLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });
router.post('/forgot', forgotLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ ok: true }); // do not reveal existence
    const token = crypto.randomBytes(24).toString('hex');
    user.resetToken = token;
    user.resetExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await user.save();
    // audit log: password reset requested
    try {
      await AuditLog.create({
        user: user._id,
        userEmail: user.email,
        userName: user.name,
        action: 'password_reset_requested',
        resourceType: 'auth',
        resourceId: String(user._id),
        details: { email: user.email, expiresAt: user.resetExpires },
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
    } catch (e) {
      console.warn('[AUDIT] Failed to write password_reset_requested log:', e && e.message);
    }
    // Default frontend URL should match local frontend dev server (3000)
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
    try {
      const { sendMail } = require('../utils/mailer');
      const { resetPasswordTemplate } = require('../utils/emailTemplates');
      const html = resetPasswordTemplate({ name: user.name, resetUrl });
      await sendMail({
        to: user.email,
        subject: 'Reset your password',
        html,
      });
      if (process.env.NODE_ENV !== 'production') {
        console.log('Password reset email sent');
      }
      return res.json({ ok: true, message: 'If the email exists, a reset link has been sent.' });
    } catch (mailErr) {
      console.warn('Email not sent (SMTP not configured):', mailErr.message);
      // Do not expose token to client. Log URL on server for development convenience.
      if (process.env.NODE_ENV !== 'production') {
        console.log('Password reset URL (dev only):', resetUrl);
      }
      return res.json({ ok: true, message: 'If the email exists, a reset link has been generated.' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to process request' });
  }
});

// POST /api/auth/reset - reset password with a valid token
router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });
    const user = await User.findOne({ resetToken: token, resetExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetExpires = null;
    await user.save();
    // audit log: password reset completed
    try {
      await AuditLog.create({
        user: user._id,
        userEmail: user.email,
        userName: user.name,
        action: 'password_reset_completed',
        resourceType: 'auth',
        resourceId: String(user._id),
        details: { email: user.email },
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
    } catch (e) {
      console.warn('[AUDIT] Failed to write password_reset_completed log:', e && e.message);
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});
