const express = require('express');
const Refund = require('../models/Refund');
const auth = require('../middleware/auth');
const { sendMail } = require('../utils/mailer');

const router = express.Router();

router.use(auth);
router.use(auth.requireAdmin);

// GET /api/admin/refunds - list all refunds (newest first)
router.get('/', async (req, res) => {
  try {
    const refunds = await Refund.find({}).sort({ createdAt: -1 }).populate('order', 'subtotal status createdAt').populate('user', 'name email');
    return res.json(refunds);
  } catch (err) {
    console.error('Admin refunds list error', err);
    return res.status(500).json({ error: 'Failed to fetch refunds' });
  }
});

// PUT /api/admin/refunds/:id - update status or adminNotes
router.put('/:id', async (req, res) => {
  try {
    const allowed = ['status', 'adminNotes'];
    const update = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) update[k] = req.body[k];
    }
    const refund = await Refund.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!refund) return res.status(404).json({ error: 'Refund not found' });
    // If approved, mark the order as refunded
    if (update.status && String(update.status).toLowerCase() === 'approved') {
      try {
        const ord = await (await Refund.findById(refund._id)).populate('order');
        const orderDoc = ord.order;
        if (orderDoc) {
          const amount = typeof refund.amountRequested === 'number' ? refund.amountRequested : (orderDoc.subtotal || 0);
          orderDoc.refunded = true;
          orderDoc.refundAmount = amount;
          orderDoc.refundedAt = new Date();
          await orderDoc.save();
        }
      } catch (e) {
        console.warn('Failed to mark order refunded', e?.message || e);
      }
    }
    // Best-effort notify user on status change and send them mail about their status update
    try {
      if (Object.prototype.hasOwnProperty.call(update, 'status')) {
        const populated = await Refund.findById(refund._id).populate('order', 'subtotal createdAt customer').populate('user', 'name email');
        const toUser = populated?.order?.customer?.email || populated?.user?.email || null;
        if (toUser) {
          await sendMail({
            to: toUser,
            subject: `Refund ${String(populated.status).toUpperCase()}`,
            html: `<p>Your refund request for order <b>${populated.order?._id || ''}</b> is now <b>${populated.status}</b>.</p>
                   <p>${populated.adminNotes ? 'Notes from admin: ' + populated.adminNotes : ''}</p>`
          });
        }
      }
    } catch (e) {
      console.warn('Refund status mail error', e?.message || e);
    }
    return res.json(refund);
  } catch (err) {
    console.error('Admin refunds update error', err);
    return res.status(500).json({ error: 'Failed to update refund' });
  }
});

module.exports = router;
