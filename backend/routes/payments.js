const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const AuditLog = require('../models/AuditLog');

const router = express.Router();

function sha512(data) {
  return crypto.createHash('sha512').update(data, 'utf8').digest('hex');
}

function getPayuActionUrl() {
  const env = (process.env.PAYU_ENV || 'test').toLowerCase();
  if (env === 'prod' || env === 'production' || env === 'live') return 'https://secure.payu.in/_payment';
  return 'https://test.payu.in/_payment';
}

// POST /api/payments/payu/initiate
// Body: { amount, productinfo, firstname, email, phone, surl?, furl?, orderId?, udf1..udf5 }
router.post('/payu/initiate', async (req, res) => {
  try {
    const key = process.env.PAYU_KEY;
    const salt = process.env.PAYU_SALT;
    if (!key || !salt) return res.status(500).json({ error: 'Payment configuration missing' });

    const {
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      orderId,
      udf1, udf2, udf3, udf4, udf5,
    } = req.body || {};

    if (!amount || !productinfo || !firstname || !email) {
      return res.status(400).json({ error: 'amount, productinfo, firstname, email are required' });
    }

    const txnid = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const successUrl = surl || `${process.env.BACKEND_URL || ''}/api/payments/payu/callback`;
    const failureUrl = furl || `${process.env.BACKEND_URL || ''}/api/payments/payu/callback`;

    const posted = {
      key,
      txnid,
      amount: Number(amount).toFixed(2),
      productinfo: String(productinfo),
      firstname: String(firstname),
      email: String(email),
      phone: phone ? String(phone) : undefined,
      surl: successUrl,
      furl: failureUrl,
      udf1: orderId || udf1 || '',
      udf2: udf2 || '',
      udf3: udf3 || '',
      udf4: udf4 || '',
      udf5: udf5 || '',
    };

    // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
    const hashString = [
      posted.key,
      posted.txnid,
      posted.amount,
      posted.productinfo,
      posted.firstname,
      posted.email,
      posted.udf1 || '', posted.udf2 || '', posted.udf3 || '', posted.udf4 || '', posted.udf5 || '',
      '', '', '', '', '',
      salt,
    ].join('|');
    const hash = sha512(hashString);

    const action = getPayuActionUrl();
    return res.json({ action, params: { ...posted, hash } });
  } catch (err) {
    console.error('PayU initiate error', err);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// PayU callback verification and redirect
router.post('/payu/callback', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const salt = process.env.PAYU_SALT;
    if (!salt) return res.status(500).send('Configuration error');

    const body = req.body || {};
    const { key, txnid, amount, productinfo, firstname, email } = body;
    const rawStatus = body.status;
    const statusLower = String(rawStatus || '').toLowerCase();
    const successLike = statusLower.startsWith('succ');

    // Build all commonly documented PayU response hash sequences
    const udf = [body.udf1, body.udf2, body.udf3, body.udf4, body.udf5, '', '', '', '', ''].map(v => v || '');

    // Reverse sequence (documented in some PayU guides)
    const reverseSeq = [
      salt,
      rawStatus,
      ...udf,
      email || '', firstname || '', productinfo || '', amount || '', txnid || '', key || '',
    ].join('|');
    const reverseHash = sha512(reverseSeq);
    const reverseHashWithAdditional = body.additionalCharges
      ? sha512([String(body.additionalCharges), reverseSeq].join('|'))
      : null;

    // Forward sequence (documented in other PayU guides)
    const forwardSeq = [
      key || '', txnid || '', amount || '', productinfo || '', firstname || '', email || '',
      ...udf,
      rawStatus || '', salt,
    ].join('|');
    const forwardHash = sha512(forwardSeq);
    const forwardHashWithAdditional = body.additionalCharges
      ? sha512([String(body.additionalCharges), forwardSeq].join('|'))
      : null;

    const provided = String(body.hash || '').toLowerCase();
    let ok = [reverseHash, reverseHashWithAdditional, forwardHash, forwardHashWithAdditional]
      .filter(Boolean)
      .some(h => provided === String(h).toLowerCase());

    // Allow permissive success in test if enabled
    if (!ok && successLike && String(process.env.PAYU_PERMISSIVE_SUCCESS).toLowerCase() === 'true') {
      ok = true;
    }

    if (body.udf1) {
      try {
        const order = await Order.findById(body.udf1);
        if (order) {
          if (ok && successLike) {
            order.status = 'confirmed';
            order.paymentMethod = order.paymentMethod || (body.mode ? String(body.mode).toLowerCase() : 'card');
          } else if (statusLower.startsWith('fail')) {
            order.status = 'cancelled';
          }
          // Persist gateway/transaction information
          if (txnid) order.transactionId = txnid;
          if (body.mihpayid) order.gatewayTransactionId = String(body.mihpayid);
          order.gateway = 'payu';
          // Store small subset of meta safely
          order.paymentMeta = {
            bank_ref_num: body.bank_ref_num || null,
            mode: body.mode || null,
            addedon: body.addedon || null,
            error_Message: body.error_Message || null,
          };
          await order.save();

          // If payment just confirmed, create an audit log now to mark the placed order
          if (ok && successLike) {
            try {
              await AuditLog.create({
                user: order.user || null,
                userEmail: order.customer?.email || (order.user && order.user.email) || '',
                userName: order.customer?.name || (order.user && order.user.name) || '',
                action: 'user_placed_order',
                resourceType: 'order',
                resourceId: String(order._id),
                details: { subtotal: order.subtotal, items: order.items, paymentMethod: order.paymentMethod },
                ip: req.ip,
                userAgent: req.get('User-Agent') || '',
              });
            } catch (e) {
              console.warn('[AUDIT] Failed to write user_placed_order log on payment callback:', e && e.message);
            }
          }
        }
      } catch (e) {
        console.error('Order update error', e);
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || '';
    const redirectUrl = frontendUrl
      ? `${frontendUrl.replace(/\/$/, '')}/payment-status?status=${encodeURIComponent(rawStatus)}&txnid=${encodeURIComponent(txnid)}&ok=${ok ? '1' : '0'}&orderId=${encodeURIComponent(body.udf1 || '')}`
      : null;

    if (redirectUrl) {
      return res.send(`<!doctype html><html><head><meta charset="utf-8"/><title>Processing...</title></head><body>
        <script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
        <noscript>Payment ${ok ? 'verified' : 'verification failed'}. <a href="${redirectUrl}">Continue</a></noscript>
      </body></html>`);
    }

    return res.json({ verified: ok, status: rawStatus, txnid });
  } catch (err) {
    console.error('PayU callback error', err);
    return res.status(500).send('Callback processing failed');
  }
});

module.exports = router;
