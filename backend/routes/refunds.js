const express = require('express');
const Refund = require('../models/Refund');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { sendMail } = require('../utils/mailer');

const router = express.Router();

// All routes here require auth
router.use(auth);

// POST /api/refunds - submit a refund request (user-owned orders only)
// Body: { orderId, reason, amountRequested? }
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, reason, amountRequested } = req.body || {};
    if (!orderId || !reason) return res.status(400).json({ error: 'orderId and reason are required' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user && String(order.user) !== String(userId)) {
      return res.status(403).json({ error: 'You can only request refund for your own orders' });
    }

    const existingPending = await Refund.findOne({ order: orderId, status: 'pending' });
    if (existingPending) return res.status(409).json({ error: 'A pending refund already exists for this order' });

    // Enforce eligibility: order must be delivered and within window
    const windowDays = Number(process.env.REFUND_WINDOW_DAYS) || 7;
    const delivered = String(order.status).toLowerCase() === 'delivered';
    const baseDate = order.createdAt ? new Date(order.createdAt) : null; // if no deliveredAt, fallback to createdAt
    if (!delivered || !baseDate) {
      return res.status(400).json({ error: 'Refunds are allowed only for delivered orders within the allowed window' });
    }
    const deadline = new Date(baseDate);
    deadline.setDate(deadline.getDate() + windowDays);
    if (new Date() > deadline) {
      return res.status(400).json({ error: `Refund window expired. Allowed within ${windowDays} days of delivery.` });
    }

    const refund = await Refund.create({
      order: orderId,
      user: userId,
      reason: String(reason).slice(0, 2000),
      amountRequested: amountRequested != null ? Number(amountRequested) : undefined,
      status: 'pending',
    });

    // Notify user (and optionally admin) - best effort
    try {
      const toUser = order.customer?.email || null;
      if (toUser) {
        await sendMail({
          to: toUser,
          subject: 'Refund request received',
          html: `<p>Your refund request has been received for order <b>${order._id}</b>.</p>
                 <p>Status: <b>pending</b></p>
                 <p>Reason:</p>
                 <blockquote>${String(reason).slice(0, 1000)}</blockquote>`
        });
      }
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || null;
      if (adminEmail) {
        await sendMail({
          to: adminEmail,
          subject: 'New refund request',
          html: `<p>A new refund request has been submitted.</p>
                 <p>Order: <b>${order._id}</b></p>
                 <p>User: ${order.customer?.email || ''}</p>
                 <p>Amount: ${amountRequested != null ? Number(amountRequested) : order.subtotal}</p>`
        });
      }
    } catch (e) {
      console.warn('Refund mail error', e?.message || e);
    }

    return res.status(201).json(refund);
  } catch (err) {
    console.error('Refund create error', err);
    return res.status(500).json({ error: 'Failed to submit refund request' });
  }
});

// GET /api/refunds/mine - list my refund requests
router.get('/mine', async (req, res) => {
  try {
    const userId = req.user.id;
    const refunds = await Refund.find({ user: userId }).sort({ createdAt: -1 }).populate('order', 'subtotal status createdAt');
    return res.json({ refunds });
  } catch (err) {
    console.error('Refund list error', err);
    return res.status(500).json({ error: 'Failed to fetch refunds' });
  }
});

module.exports = router;
