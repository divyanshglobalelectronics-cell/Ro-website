const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);
router.use(auth.requireAdmin);

// GET /api/admin/analytics - sales overview and breakdowns
router.get('/', async (req, res) => {
  try {
    // Query params: range=7d|30d|90d|all|custom, startDate=YYYY-MM-DD, endDate=YYYY-MM-DD,
    // includeCancelled=true|false, group=day|month, topN=<int>
    const { range = 'all', startDate, endDate, includeCancelled = 'false', group = 'month', topN } = req.query || {};

    const matchStage = {};
    if (includeCancelled !== 'true') {
      matchStage.status = { $ne: 'cancelled' };
    }
    // Date filter
    const now = new Date();
    let start = null;
    let end = null;
    if (range === '7d') {
      start = new Date();
      start.setDate(now.getDate() - 6);
      end = now;
    } else if (range === '30d') {
      start = new Date();
      start.setDate(now.getDate() - 29);
      end = now;
    } else if (range === '90d') {
      start = new Date();
      start.setDate(now.getDate() - 89);
      end = now;
    } else if (range === 'custom') {
      start = startDate ? new Date(`${startDate}T00:00:00`) : null;
      end = endDate ? new Date(`${endDate}T23:59:59`) : now;
    }
    if (start || end) {
      matchStage.createdAt = {};
      if (start) matchStage.createdAt.$gte = start;
      if (end) matchStage.createdAt.$lte = end;
    }

    const dateFormat = group === 'day' ? '%Y-%m-%d' : '%Y-%m';
    const limitTop = Math.max(1, Math.min(50, Number(topN) || 5));

    const [result] = await Order.aggregate([
      { $match: matchStage },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: { $ifNull: ['$subtotal', 0] } },
              },
            },
          ],
          totalItems: [
            { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
            {
              $group: {
                _id: null,
                totalItems: { $sum: { $ifNull: ['$items.quantity', 0] } },
              },
            },
          ],
          byPayment: [
            {
              $group: {
                _id: { $ifNull: ['$paymentMethod', 'unknown'] },
                revenue: { $sum: { $ifNull: ['$subtotal', 0] } },
              },
            },
            { $sort: { revenue: -1 } },
          ],
          trend: [
            {
              $group: {
                _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
                revenue: { $sum: { $ifNull: ['$subtotal', 0] } },
              },
            },
            { $sort: { _id: 1 } },
          ],
          mostSold: [
            { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
            {
              $group: {
                _id: { name: { $ifNull: ['$items.title', 'unknown'] } },
                qty: { $sum: { $ifNull: ['$items.quantity', 0] } },
                revenue: {
                  $sum: {
                    $multiply: [
                      { $ifNull: ['$items.price', 0] },
                      { $ifNull: ['$items.quantity', 0] },
                    ],
                  },
                },
              },
            },
            { $sort: { qty: -1 } },
            { $limit: limitTop },
          ],
          byStatus: [
            {
              $group: {
                _id: { $ifNull: ['$status', 'unknown'] },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    const totalsDoc = (result.totals && result.totals[0]) || { totalOrders: 0, totalRevenue: 0 };
    const totalItemsDoc = (result.totalItems && result.totalItems[0]) || { totalItems: 0 };

    const byPayment = (result.byPayment || []).reduce((acc, r) => {
      acc[r._id] = r.revenue;
      return acc;
    }, {});

    // Back-compat: keep key as `trend` with period label in `month` even when grouped by day
    const trend = (result.trend || []).map(t => ({ month: t._id, revenue: t.revenue }));
    // Orders trend (counts)
    const ordersTrend = (result.trend || []).map(t => ({ period: t._id, orders: t.revenue === null ? 0 : undefined }));
    // Note: we don't have counts in the same facet; compute orders counts separately for consistency with date filtering
    // Aggregate again but cheaper: only counts per period
    const countsAgg = await Order.aggregate([
      { $match: matchStage },
      { $group: { _id: { $dateToString: { format: dateFormat, date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const ordersTrendMap = new Map(countsAgg.map(c => [c._id, c.count]));
    const ordersTrendFinal = (result.trend || []).map(t => ({ period: t._id, orders: ordersTrendMap.get(t._id) || 0 }));
    const mostSold = (result.mostSold || []).map(m => ({ name: m._id.name, qty: m.qty, revenue: m.revenue }));
    const byStatus = (result.byStatus || []).reduce((acc, r) => { acc[r._id] = r.count; return acc; }, {});

    const aov = totalsDoc.totalOrders ? totalsDoc.totalRevenue / totalsDoc.totalOrders : 0;

    res.json({
      totalOrders: totalsDoc.totalOrders || 0,
      totalRevenue: totalsDoc.totalRevenue || 0,
      totalItems: totalItemsDoc.totalItems || 0,
      aov,
      byPayment,
      trend,
      ordersTrend: ordersTrendFinal,
      byStatus,
      mostSold,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute analytics' });
  }
});

module.exports = router;
