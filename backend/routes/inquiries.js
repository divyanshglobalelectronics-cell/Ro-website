const express = require('express');
const Inquiry = require('../models/Inquiry');

const router = express.Router();

// POST /api/inquiries
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, product, service } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    const inquiry = await Inquiry.create({ name, email, phone, message, product: product || null, service: service || null });
    res.status(201).json({ id: inquiry._id, createdAt: inquiry.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

module.exports = router;
