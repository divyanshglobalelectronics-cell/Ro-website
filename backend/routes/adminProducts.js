const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes here require admin privileges
router.use(auth);
router.use(auth.requireAdmin);

// GET /api/admin/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name slug');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/admin/products - create new product
router.post('/', async (req, res) => {
  try {
    console.log('[CREATE PRODUCT] Received request:', JSON.stringify(req.body, null, 2));
    const { title, slug, description, price, images, technology,techimage, capacity,rating,moreDetails, featured, status, category } = req.body;

    if (!title || typeof title !== 'string' || !price) {
      console.warn('[CREATE PRODUCT] Validation failed: Missing title or price');
      return res.status(400).json({ error: 'Title and price are required' });
    }

    // resolve category: allow passing slug or id
    let categoryId = category;
    if (category && typeof category === 'string') {
      // try find by slug first
      const catBySlug = await Category.findOne({ slug: category });
      if (catBySlug) categoryId = catBySlug._id;
    }

    // generate slug if not provided
    const makeSlug = (s) => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    let finalSlug = slug && typeof slug === 'string' ? makeSlug(slug) : makeSlug(title || 'product');

    // ensure unique slug
    const exists = await Product.findOne({ slug: finalSlug });
    if (exists) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    const prod = new Product({
      title: title.trim(),
      slug: finalSlug,
      description: description || '',
      price: Number(price) || 0,
      images: Array.isArray(images) ? images : (images ? [images] : []),
      technology: technology || '',
      capacity: capacity || '',
      featured: !!featured,
      status: status || 'active',
      category: categoryId,
      techimage: Array.isArray(techimage) ? techimage : (techimage ? [techimage] : []),
      rating:rating || '',
      moreDetails: moreDetails || ''
    });

    console.log('[CREATE PRODUCT] Saving product to MongoDB:', { title, slug: finalSlug, price, category: categoryId });
    await prod.save();
    console.log('[CREATE PRODUCT] Product saved successfully with ID:', prod._id);
    const populated = await Product.findById(prod._id).populate('category', 'name slug');
    console.log('[CREATE PRODUCT] Returning populated product:', JSON.stringify(populated, null, 2));
    res.status(201).json(populated);
  } catch (err) {
    console.error('[CREATE PRODUCT] Error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// GET /api/admin/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// PUT /api/admin/products/:id - update product
router.put('/:id', async (req, res) => {
  try {
    const update = {};
    const allowed = ['title', 'description', 'price', 'images', 'attributes', 'featured', 'status', 'category','capacity', 'technology', 'techimage', 'rating', 'moreDetails'];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) update[key] = req.body[key];
    }

    // normalize array fields if provided as comma-separated strings
    if (typeof update.images === 'string') {
      update.images = update.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (typeof update.techimage === 'string') {
      update.techimage = update.techimage
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // If category is provided as slug, resolve to id
    if (update.category && typeof update.category === 'string') {
      const cat = await Category.findOne({ slug: update.category });
      if (cat) update.category = cat._id;
    }

    const prod = await Product.findByIdAndUpdate(req.params.id, update, { new: true }).populate('category', 'name slug');
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
