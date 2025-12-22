const express = require('express');
const Order = require('../models/Order');
const AuditLog = require('../models/AuditLog');
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

    // For non-COD payment methods, mark the order as payment_initiated and DO NOT
    // consider it a placed order until payment callback confirms it. This keeps
    // unverified orders hidden from user/admin "placed order" listings.
    const pm = (paymentMethod || 'cod').toLowerCase();
    const initialStatus = pm === 'cod' ? 'pending' : 'payment_initiated';

    const order = await Order.create({ user: userId, items, customer, subtotal, notes, paymentMethod: pm, status: initialStatus });

    // Only write a placed-order audit if payment method is COD (immediate) — for
    // online payments, the audit will be created when the payment callback confirms.
    if (pm === 'cod') {
      try {
        await AuditLog.create({
          user: userId,
          userEmail: (req.user && req.user.email) || (customer && customer.email) || '',
          userName: (req.user && req.user.name) || (customer && customer.name) || '',
          action: 'user_placed_order',
          resourceType: 'order',
          resourceId: String(order._id),
          details: { subtotal, items, paymentMethod: order.paymentMethod, customer: { name: customer.name, phone: customer.phone, address: customer.address } },
          ip: req.ip,
          userAgent: req.get('User-Agent') || '',
        });
      } catch (e) {
        console.warn('[AUDIT] Failed to write user_placed_order log:', e && e.message);
      }
    }

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
    // Exclude orders still awaiting payment confirmation
    const orders = await Order.find({ user: userId, status: { $ne: 'payment_initiated' } }).sort({ createdAt: -1 });
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
