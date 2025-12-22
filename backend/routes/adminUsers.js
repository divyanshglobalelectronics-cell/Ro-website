const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const AuditLog = require('../models/AuditLog');

const router = express.Router();

router.use(auth);
router.use(auth.requireAdmin);

// GET /api/admin/users - list users
// Supports optional server-side pagination and filters when query params are present.
router.get('/', async (req, res) => {
  try {
    const { page, limit, filter, q, sortBy, sortDir } = req.query;

    // Backwards-compatible: if no pagination/filter params provided, return full array (existing behaviour)
    const hasQuery = page || limit || filter || q || sortBy || sortDir;
    if (!hasQuery) {
      const users = await User.find({}).select('-passwordHash -resetToken -resetExpires');
      return res.json(users);
    }

    const p = Math.max(1, parseInt(page || '1', 10));
    const l = Math.min(1000, Math.max(1, parseInt(limit || '50', 10)));

    const query = {};
    if (filter === 'admins') query.isAdmin = true;
    if (filter === 'blocked') query.isBlocked = true;
    if (filter === 'new7') {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      query.createdAt = { $gte: since };
    }
    if (q) {
      const re = new RegExp(String(q), 'i');
      query.$or = [{ name: re }, { email: re }];
    }

    const sortField = sortBy || 'createdAt';
    const sortOrder = sortDir === 'asc' ? 1 : -1;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash -resetToken -resetExpires')
      .sort({ [sortField]: sortOrder })
      .skip((p - 1) * l)
      .limit(l);

    res.json({ users, total, page: p, limit: l });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/admin/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash -resetToken -resetExpires');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/admin/users/:id - update user (name, isAdmin, phone, address, isBlocked)
router.put('/:id', async (req, res) => {
  try {
    const allowed = ['name', 'isAdmin', 'phone', 'address', 'isBlocked'];
    const update = {};

    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) {
        // Add phone validation
        if (k === 'phone') {
          const phone = req.body[k];
          const phoneRegex = /^[6-9]\d{9}$/; // starts with 6-9 and total 10 digits
          if (!phoneRegex.test(phone)) {
            return res.status(400).json({ error: 'Invalid phone number. Must be 10 digits' });
          }
        }
        update[k] = req.body[k];
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
      .select('-passwordHash -resetToken -resetExpires');

    if (!user) return res.status(404).json({ error: 'User not found' });
    try {
      await AuditLog.create({
        user: req.user?.id,
        userEmail: req.user?.email,
        userName: req.user?.name,
        action: 'update_user',
        resourceType: 'user',
        resourceId: String(user._id),
        details: { update },
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
    } catch (logErr) {
      console.warn('[UPDATE USER] Failed to write audit log:', logErr && logErr.message);
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    try {
      await AuditLog.create({
        user: req.user?.id,
        userEmail: req.user?.email,
        userName: req.user?.name,
        action: 'delete_user',
        resourceType: 'user',
        resourceId: String(user._id),
        details: { email: user.email, name: user.name },
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
    } catch (logErr) {
      console.warn('[DELETE USER] Failed to write audit log:', logErr && logErr.message);
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
