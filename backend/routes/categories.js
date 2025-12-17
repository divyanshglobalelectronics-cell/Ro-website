const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

// GET /api/categories
router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find({}).sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
