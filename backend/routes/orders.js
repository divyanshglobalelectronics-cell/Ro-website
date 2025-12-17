const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - create an order (optional auth)
router.post('/', auth.optional, async (req, res) => {
  try {
    const { items, customer, notes, paymentMethod } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }
    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ error: 'Customer name, phone, and address are required' });
    }

    const subtotal = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const userId = req.user ? req.user.id : null;

    const order = await Order.create({ user: userId, items, customer, subtotal, notes, paymentMethod: paymentMethod || 'cod' });
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/mine - list authenticated user's orders (PROTECTED)
router.get('/mine', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - fetch order (PROTECTED - only authenticated users can access)
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Check ownership: only the user who created the order can view it
    if (order.user && String(order.user) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this order' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
