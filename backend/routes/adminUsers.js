const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);
router.use(auth.requireAdmin);

// GET /api/admin/users - list users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash -resetToken -resetExpires');
    res.json(users);
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
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
