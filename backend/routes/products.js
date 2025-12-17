const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');

const router = express.Router();

// GET /api/products?category=slug&featured=true
router.get('/', async (req, res) => {
  try {
    const { category: categorySlug, featured, tech } = req.query;
    const filter = { status: 'active' };

    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug });
      if (cat) filter.category = cat._id;
    }
    if (featured === 'true') filter.featured = true;
    if (tech) {
      filter['attributes.technology'] = new RegExp(`^${tech}$`, 'i');
    }

    const products = await Product.find(filter).populate('category', 'name slug');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: 'active' }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
