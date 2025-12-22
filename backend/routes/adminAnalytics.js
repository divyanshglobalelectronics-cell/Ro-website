const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
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

// GET /api/admin/analytics/funnel-basic
// Approximated funnel using orders only (no event tracking yet):
// checkout_start -> all orders created in range
// payment_success -> orders with status in ['confirmed','shipped','delivered'] in range
router.get('/funnel-basic', async (req, res) => {
  try {
    const { range = '30d', startDate, endDate, group = 'day' } = req.query || {};

    // Build date range (reuse logic similar to above)
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

    const createdAtMatch = {};
    if (start || end) {
      createdAtMatch.createdAt = {};
      if (start) createdAtMatch.createdAt.$gte = start;
      if (end) createdAtMatch.createdAt.$lte = end;
    }

    const successStatuses = ['confirmed', 'shipped', 'delivered'];
    const dateFormat = group === 'day' ? '%Y-%m-%d' : '%Y-%m';

    const [agg] = await Order.aggregate([
      { $match: createdAtMatch },
      {
        $facet: {
          checkout: [
            { $group: { _id: { $dateToString: { format: dateFormat, date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          paid: [
            { $match: { status: { $in: successStatuses } } },
            { $group: { _id: { $dateToString: { format: dateFormat, date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          totals: [
            { $group: { _id: null, checkout: { $sum: 1 }, paid: { $sum: { $cond: [{ $in: ['$status', successStatuses] }, 1, 0] } } } },
          ],
        },
      },
    ]);

    const byPeriodMap = (arr) => arr.reduce((acc, r) => { acc[r._id] = r.count; return acc; }, {});
    const checkoutMap = byPeriodMap((agg && agg.checkout) || []);
    const paidMap = byPeriodMap((agg && agg.paid) || []);

    // Build a unified series of periods present in either facet
    const periods = Array.from(new Set([ ...Object.keys(checkoutMap), ...Object.keys(paidMap) ])).sort();
    const series = periods.map(p => ({ period: p, checkout_start: checkoutMap[p] || 0, payment_success: paidMap[p] || 0 }));

    const totalsDoc = (agg && agg.totals && agg.totals[0]) || { checkout: 0, paid: 0 };
    const conversion = {
      checkout_to_paid: totalsDoc.checkout ? (totalsDoc.paid / totalsDoc.checkout) : 0,
    };

    res.json({ interval: group, series, totals: { checkout_start: totalsDoc.checkout, payment_success: totalsDoc.paid }, conversion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute funnel' });
  }
});

// GET /api/admin/analytics/customers/segments
// Computes spend, frequency, recency per user and basic segments; plus geo by city/state.
router.get('/customers/segments', async (req, res) => {
  try {
    const { range = 'all', startDate, endDate } = req.query || {};

    const now = new Date();
    let start = null;
    let end = null;
    if (range === '7d') {
      start = new Date(); start.setDate(now.getDate() - 6); end = now;
    } else if (range === '30d') {
      start = new Date(); start.setDate(now.getDate() - 29); end = now;
    } else if (range === '90d') {
      start = new Date(); start.setDate(now.getDate() - 89); end = now;
    } else if (range === 'custom') {
      start = startDate ? new Date(`${startDate}T00:00:00`) : null;
      end = endDate ? new Date(`${endDate}T23:59:59`) : now;
    }

    const matchStage = { status: { $ne: 'cancelled' } };
    if (start || end) {
      matchStage.createdAt = {};
      if (start) matchStage.createdAt.$gte = start;
      if (end) matchStage.createdAt.$lte = end;
    }

    // Aggregate per user
    const usersAgg = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $ifNull: ['$user', 'guest'] },
          orders: { $sum: 1 },
          revenue: { $sum: { $ifNull: ['$subtotal', 0] } },
          lastOrderAt: { $max: '$createdAt' },
          cities: { $addToSet: { $ifNull: ['$customer.city', ''] } },
          states: { $addToSet: { $ifNull: ['$customer.state', ''] } },
        },
      },
    ]);

    // Compute percentiles for R,F,M in JS
    const recencyDays = (d) => Math.floor((now - new Date(d)) / (1000 * 60 * 60 * 24));
    const recencies = usersAgg.map(u => recencyDays(u.lastOrderAt || now));
    const frequencies = usersAgg.map(u => u.orders);
    const monetaries = usersAgg.map(u => u.revenue);

    function quantiles(arr) {
      if (!arr.length) return { q20:0,q40:0,q60:0,q80:0 };
      const a = [...arr].sort((x,y)=>x-y);
      const pick = (p) => a[Math.min(a.length-1, Math.floor(p * a.length))];
      return { q20: pick(0.2), q40: pick(0.4), q60: pick(0.6), q80: pick(0.8) };
    }

    const rq = quantiles(recencies);
    const fq = quantiles(frequencies);
    const mq = quantiles(monetaries);

    const score = (val, q, invert=false) => {
      if (invert) { // lower is better (recency)
        if (val <= q.q20) return 5;
        if (val <= q.q40) return 4;
        if (val <= q.q60) return 3;
        if (val <= q.q80) return 2;
        return 1;
      }
      if (val >= q.q80) return 5;
      if (val >= q.q60) return 4;
      if (val >= q.q40) return 3;
      if (val >= q.q20) return 2;
      return 1;
    };

    const segments = { Champions:0, Loyal:0, 'Big Spenders':0, 'At Risk':0, 'Hibernating':0, 'New':0 };
    const users = usersAgg.map(u => {
      const R = score(recencyDays(u.lastOrderAt || now), rq, true);
      const F = score(u.orders, fq, false);
      const M = score(u.revenue, mq, false);
      // Simple rules
      let label = 'Hibernating';
      if (R >= 4 && F >= 3 && M >= 3) label = 'Champions';
      else if (F >= 4 && M >= 3) label = 'Loyal';
      else if (M >= 4) label = 'Big Spenders';
      else if (R <= 2 && F <= 2) label = 'At Risk';
      else if (R >= 4 && F === 1) label = 'New';
      segments[label] = (segments[label] || 0) + 1;
      return { user: String(u._id), orders: u.orders, revenue: u.revenue, lastOrderAt: u.lastOrderAt, R, F, M, segment: label };
    });

    // Geo summary (city/state) from orders
    const geoAgg = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { state: { $ifNull: ['$customer.state', ''] }, city: { $ifNull: ['$customer.city', ''] } },
          orders: { $sum: 1 },
          revenue: { $sum: { $ifNull: ['$subtotal', 0] } },
          customers: { $addToSet: { $ifNull: ['$user', '$customer.phone'] } },
        },
      },
      { $project: { _id: 0, state: '$_id.state', city: '$_id.city', orders: 1, revenue: 1, customers: { $size: '$customers' } } },
      { $sort: { revenue: -1 } },
    ]);

    res.json({ totals: { users: users.length }, segments, users, geo: geoAgg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute customer segments' });
  }
});

// GET /api/admin/analytics/payment-metrics
// Success rate by payment method within date range
router.get('/payment-metrics', async (req, res) => {
  try {
    const { range = '30d', startDate, endDate } = req.query || {};
    const now = new Date();
    let start = null, end = null;
    if (range === '7d') { start = new Date(); start.setDate(now.getDate() - 6); end = now; }
    else if (range === '30d') { start = new Date(); start.setDate(now.getDate() - 29); end = now; }
    else if (range === '90d') { start = new Date(); start.setDate(now.getDate() - 89); end = now; }
    else if (range === 'custom') { start = startDate ? new Date(`${startDate}T00:00:00`) : null; end = endDate ? new Date(`${endDate}T23:59:59`) : now; }

    const matchStage = {};
    if (start || end) {
      matchStage.createdAt = {};
      if (start) matchStage.createdAt.$gte = start;
      if (end) matchStage.createdAt.$lte = end;
    }
    const success = ['confirmed','shipped','delivered'];

    const agg = await Order.aggregate([
      { $match: matchStage },
      { $group: {
          _id: { $ifNull: ['$paymentMethod', 'unknown'] },
          orders: { $sum: 1 },
          revenue: { $sum: { $ifNull: ['$subtotal', 0] } },
          successOrders: { $sum: { $cond: [{ $in: ['$status', success] }, 1, 0] } },
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const byMethod = agg.map(a => ({
      method: a._id,
      orders: a.orders,
      revenue: a.revenue,
      successOrders: a.successOrders,
      successRate: a.orders ? a.successOrders / a.orders : 0,
    }));

    res.json({ byMethod });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute payment metrics' });
  }
});

// GET /api/admin/analytics/customers/summary
// New vs Returning customers in range, based on whether customer's first-ever order date falls within range.
router.get('/customers/summary', async (req, res) => {
  try {
    const { range = '30d', startDate, endDate } = req.query || {};
    const now = new Date();
    let start = null, end = null;
    if (range === '7d') { start = new Date(); start.setDate(now.getDate() - 6); end = now; }
    else if (range === '30d') { start = new Date(); start.setDate(now.getDate() - 29); end = now; }
    else if (range === '90d') { start = new Date(); start.setDate(now.getDate() - 89); end = now; }
    else if (range === 'custom') { start = startDate ? new Date(`${startDate}T00:00:00`) : null; end = endDate ? new Date(`${endDate}T23:59:59`) : now; }

    const matchRange = {};
    if (start || end) {
      matchRange.createdAt = {};
      if (start) matchRange.createdAt.$gte = start;
      if (end) matchRange.createdAt.$lte = end;
    }

    // First-ever order date per user (all time)
    const firsts = await Order.aggregate([
      { $group: { _id: { $ifNull: ['$user', '$customer.phone'] }, first: { $min: '$createdAt' } } }
    ]);
    const firstMap = new Map(firsts.map(f => [String(f._id), f.first]));

    // Orders within range
    const inRange = await Order.aggregate([
      { $match: matchRange },
      { $group: { _id: { $ifNull: ['$user', '$customer.phone'] }, orders: { $sum: 1 }, revenue: { $sum: { $ifNull: ['$subtotal', 0] } } } }
    ]);

    let newCustomers = 0, returningCustomers = 0, newRevenue = 0, returningRevenue = 0;
    inRange.forEach(c => {
      const key = String(c._id);
      const first = firstMap.get(key);
      if (first && start && first >= start && first <= (end || now)) { newCustomers += 1; newRevenue += c.revenue || 0; }
      else { returningCustomers += 1; returningRevenue += c.revenue || 0; }
    });

    res.json({
      newCustomers, returningCustomers,
      newRevenue, returningRevenue,
      repeatRate: (returningCustomers + newCustomers) ? (returningCustomers / (returningCustomers + newCustomers)) : 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute customer summary' });
  }
});

// GET /api/admin/analytics/categories
// Top products and categories by quantity and revenue
router.get('/categories', async (req, res) => {
  try {
    const { range = '30d', startDate, endDate, topN, categoryId } = req.query || {};
    const now = new Date();
    let start = null, end = null;
    if (range === '7d') { start = new Date(); start.setDate(now.getDate() - 6); end = now; }
    else if (range === '30d') { start = new Date(); start.setDate(now.getDate() - 29); end = now; }
    else if (range === '90d') { start = new Date(); start.setDate(now.getDate() - 89); end = now; }
    else if (range === 'custom') { start = startDate ? new Date(`${startDate}T00:00:00`) : null; end = endDate ? new Date(`${endDate}T23:59:59`) : now; }

    const limitTop = Math.max(1, Math.min(50, Number(topN) || 10));
    const matchStage = { status: { $ne: 'cancelled' } };
    if (start || end) {
      matchStage.createdAt = {};
      if (start) matchStage.createdAt.$gte = start;
      if (end) matchStage.createdAt.$lte = end;
    }

    const catFilter = categoryId && mongoose.Types.ObjectId.isValid(categoryId) ? new mongoose.Types.ObjectId(categoryId) : null;
    // Top products by items (with optional category filter)
    const topProductsPipeline = [
      { $match: matchStage },
      { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
    ];
    if (catFilter) {
      topProductsPipeline.push(
        { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'prod' } },
        { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
        { $match: { 'prod.category': catFilter } },
      );
    }
    topProductsPipeline.push(
      { $group: {
          _id: { product: { $ifNull: ['$items.product', null] }, title: { $ifNull: ['$items.title', 'unknown'] } },
          qty: { $sum: { $ifNull: ['$items.quantity', 0] } },
          revenue: { $sum: { $multiply: [ { $ifNull: ['$items.price', 0] }, { $ifNull: ['$items.quantity', 0] } ] } },
        }
      },
      { $sort: { qty: -1 } },
      { $limit: limitTop },
      { $project: { _id: 0, name: '$_id.title', productId: '$_id.product', qty: 1, revenue: 1 } },
    );
    const topProducts = await Order.aggregate(topProductsPipeline);

    // Top categories via product.category
    const topCategories = await Order.aggregate([
      { $match: matchStage },
      { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'prod' } },
      { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
      ...(catFilter ? [{ $match: { 'prod.category': catFilter } }] : []),
      { $lookup: { from: 'categories', localField: 'prod.category', foreignField: '_id', as: 'cat' } },
      { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
      { $group: {
          _id: { name: { $ifNull: ['$cat.name', 'Unknown'] } },
          qty: { $sum: { $ifNull: ['$items.quantity', 0] } },
          revenue: { $sum: { $multiply: [ { $ifNull: ['$items.price', 0] }, { $ifNull: ['$items.quantity', 0] } ] } },
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: limitTop },
      { $project: { _id: 0, name: '$_id.name', qty: 1, revenue: 1 } },
    ]);

    res.json({ topProducts, topCategories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute category analytics' });
  }
});

// GET /api/admin/analytics/geo
// City/State metrics: orders, revenue, AOV, customers
router.get('/geo', async (req, res) => {
  try {
    const { range = '30d', startDate, endDate, categoryId } = req.query || {};
    const now = new Date();
    let start = null, end = null;
    if (range === '7d') { start = new Date(); start.setDate(now.getDate() - 6); end = now; }
    else if (range === '30d') { start = new Date(); start.setDate(now.getDate() - 29); end = now; }
    else if (range === '90d') { start = new Date(); start.setDate(now.getDate() - 89); end = now; }
    else if (range === 'custom') { start = startDate ? new Date(`${startDate}T00:00:00`) : null; end = endDate ? new Date(`${endDate}T23:59:59`) : now; }

    const matchStage = { status: { $ne: 'cancelled' } };
    if (start || end) {
      matchStage.createdAt = {};
      if (start) matchStage.createdAt.$gte = start;
      if (end) matchStage.createdAt.$lte = end;
    }

    const catFilter = categoryId && mongoose.Types.ObjectId.isValid(categoryId) ? new mongoose.Types.ObjectId(categoryId) : null;
    let agg;
    if (catFilter) {
      // Compute geo metrics only for items in the selected category
      agg = await Order.aggregate([
        { $match: matchStage },
        { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
        { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'prod' } },
        { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
        { $match: { 'prod.category': catFilter } },
        { $group: {
            _id: { state: { $ifNull: ['$customer.state', ''] }, city: { $ifNull: ['$customer.city', ''] } },
            orders: { $addToSet: '$_id' },
            revenueItems: { $sum: { $multiply: [ { $ifNull: ['$items.price', 0] }, { $ifNull: ['$items.quantity', 0] } ] } },
            customers: { $addToSet: { $ifNull: ['$user', '$customer.phone'] } },
          }
        },
        { $project: { _id: 0, state: '$_id.state', city: '$_id.city', ordersCount: { $size: '$orders' }, revenue: '$revenueItems', customers: { $size: '$customers' } } },
        { $addFields: { aov: { $cond: [{ $eq: ['$ordersCount', 0] }, 0, { $divide: ['$revenue', '$ordersCount'] }] } } },
        { $sort: { revenue: -1 } },
      ]);
      // Normalize field names to match without filter
      agg = agg.map(r => ({ state: r.state, city: r.city, orders: r.ordersCount, revenue: r.revenue, customers: r.customers, aov: r.aov }));
    } else {
      agg = await Order.aggregate([
        { $match: matchStage },
        { $group: {
            _id: { state: { $ifNull: ['$customer.state', ''] }, city: { $ifNull: ['$customer.city', ''] } },
            orders: { $sum: 1 },
            revenue: { $sum: { $ifNull: ['$subtotal', 0] } },
            customers: { $addToSet: { $ifNull: ['$user', '$customer.phone'] } },
          }
        },
        { $project: { _id: 0, state: '$_id.state', city: '$_id.city', orders: 1, revenue: 1, customers: { $size: '$customers' }, aov: { $cond: [{ $eq: ['$orders', 0] }, 0, { $divide: ['$revenue', '$orders'] }] } } },
        { $sort: { revenue: -1 } },
      ]);
    }

    res.json({ regions: agg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute geo analytics' });
  }
});

module.exports = router;
