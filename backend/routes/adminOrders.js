const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const AuditLog = require('../models/AuditLog');
const PDFDocument = require('pdfkit');

const router = express.Router();

router.use(auth);
router.use(auth.requireAdmin);

// GET /api/admin/orders - list orders (recent first)
// Do not include orders that are in 'payment_initiated' state (not yet confirmed)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'payment_initiated' } }).sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/admin/orders/:id - get order details user items products price quantity
router.get('/', async (req, res) => {
  try {
    // Support optional filters: startDate, endDate (YYYY-MM-DD), status, minTotal, maxTotal, limit, sort
    const { startDate, endDate, status, minTotal, maxTotal, limit, sortBy, sortDir } = req.query || {};
    const q = {};
    // Exclude payment_initiated by default
    q.status = { $ne: 'payment_initiated' };
    if (status) {
      if (status === 'all') delete q.status;
      else q.status = status;
    }
    if (startDate || endDate) {
      q.createdAt = {};
      if (startDate) q.createdAt.$gte = new Date(`${startDate}T00:00:00`);
      if (endDate) q.createdAt.$lte = new Date(`${endDate}T23:59:59`);
    }
    if (minTotal) q.subtotal = Object.assign(q.subtotal || {}, { $gte: Number(minTotal) });
    if (maxTotal) q.subtotal = Object.assign(q.subtotal || {}, { $lte: Number(maxTotal) });

    const sortField = sortBy === 'subtotal' ? 'subtotal' : 'createdAt';
    const dir = String(sortDir || 'desc').toLowerCase() === 'asc' ? 1 : -1;

    const lim = Math.min(1000, Math.max(1, Number(limit) || 100));

    const orders = await Order.find(q).sort({ [sortField]: dir }).limit(lim).populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT /api/admin/orders/:id - update order status (e.g., pending -> processing -> completed)
router.put('/:id', async (req, res) => {
  try {
    const allowed = ['status', 'tracking', 'notes'];
    const update = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) update[k] = req.body[k];
    }
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found with given email ID' });
    try {
      await AuditLog.create({
        user: req.user?.id,
        userEmail: req.user?.email,
        userName: req.user?.name,
        action: 'update_order',
        resourceType: 'order',
        resourceId: String(order._id),
        details: { update },
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
    } catch (logErr) {
      console.warn('[UPDATE ORDER] Failed to write audit log:', logErr && logErr.message);
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order please try again' });
  }
});

// GET /api/admin/orders/:id/invoice.pdf - download invoice PDF for paid orders andpaid through non-COD methods
router.get('/:id/invoice.pdf', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Consider order paid/successful if gateway is set (non-COD) and not cancelled
    const isPaid = Boolean(order.gateway) || (order.paymentMethod && order.paymentMethod !== 'cod');
    const isCancelled = order.status === 'cancelled';
    if (!isPaid || isCancelled) {
      return res.status(400).json({ error: 'Invoice available only for successful paid orders' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice_${order._id}.pdf"`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .text('Divyansh Global RO', { align: 'right' })
      .moveDown(0.5);

    // Seller info (placeholder)
    doc
      .fontSize(12)
      .text('Seller:', { continued: true })
      .font('Helvetica-Bold')
      .text(' RO Water Purifier Store')
      .font('Helvetica')
      .text('Address: Your Company Address')
      .text('Email: support@example.com')
      .text('Phone: +91-00000-00000')
      .moveDown();

    // Invoice meta
    doc
      .font('Helvetica')
      .text(`Invoice No: INV-${String(order._id).slice(-8).toUpperCase()}`)
      .text(`Order ID: ${order._id}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleString()}`)
      .moveDown();

    // Bill To
    doc
      .font('Helvetica-Bold')
      .text('Bill To:')
      .font('Helvetica')
      .text(`${order.customer?.name || ''}`)
      .text(`${order.customer?.address || ''}`)
      .text(`${order.customer?.city || ''} ${order.customer?.pincode || ''}`)
      .text(`${order.customer?.phone || ''}`)
      .text(`${order.customer?.email || order.user?.email || ''}`)
      .moveDown();

    // Table header
    const tableTop = doc.y;
    const colX = { item: 50, qty: 320, price: 380, total: 460 };
    doc
      .font('Helvetica-Bold')
      .text('Item', colX.item, tableTop)
      .text('Qty', colX.qty, tableTop)
      .text('Price', colX.price, tableTop)
      .text('Amount', colX.total, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table rows
    doc.font('Helvetica');
    let y = tableTop + 25;
    let computedSubtotal = 0;
    (order.items || []).forEach((it) => {
      const amount = Number(it.price || 0) * Number(it.quantity || 0);
      computedSubtotal += amount;
      doc
        .text(it.title || String(it.product), colX.item, y, { width: 250 })
        .text(String(it.quantity || 0), colX.qty, y)
        .text(`${Number(it.price || 0).toFixed(2)}`, colX.price, y)
        .text(`${amount.toFixed(2)}`, colX.total, y);
      y += 20;
    });

    // Totals
    const subtotal = Number(order.subtotal || computedSubtotal || 0);
    doc.moveDown();
    y += 10;
    doc
      .font('Helvetica-Bold')
      .text('Subtotal:', colX.price, y)
      .text(`${subtotal.toFixed(2)}`, colX.total, y, { align: 'left' });
    y += 18;
    // You can compute taxes/discount here if needed
    doc
      .font('Helvetica-Bold')
      .text('Total:', colX.price, y)
      .text(`${subtotal.toFixed(2)}`, colX.total, y, { align: 'left' })
      .moveDown(2);

    // Payment details
    doc
      .font('Helvetica')
      .text(`Payment Method: ${order.paymentMethod || ''}`)
      .text(`Payment Gateway: ${order.gateway || 'N/A'}`)
      .text(`Transaction ID: ${order.transactionId || 'N/A'}`)
      .text(`Gateway Txn ID: ${order.gatewayTransactionId || 'N/A'}`)
      .moveDown();

    doc.fontSize(10).fillColor('#555').text('Thank you for your purchase!');

    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

module.exports = router;
