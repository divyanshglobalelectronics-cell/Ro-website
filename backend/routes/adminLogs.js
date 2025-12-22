const express = require('express');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin-only access
router.use(auth);
router.use(auth.requireAdmin);

// GET /api/admin/logs
// supports query params: action, resourceType, userEmail, from, to, limit, skip, export=csv
router.get('/', async (req, res) => {
  try {
    const { action, resourceType, userEmail, from, to, limit = 100, skip = 0, export: exportFmt, q: keyword } = req.query;
    const q = {};
    if (action) q.action = action;
    if (resourceType) q.resourceType = resourceType;
    if (userEmail) q.userEmail = userEmail;
    if (from || to) q.createdAt = {};
    if (from) q.createdAt.$gte = new Date(from);
    if (to) q.createdAt.$lte = new Date(to);

    // Free-text keyword search across common fields and details (stringified)
    if (keyword && typeof keyword === 'string' && keyword.trim()) {
      const kw = keyword.trim();
      // Build case-insensitive regex with server-side options to avoid passing RegExp object
      q.$or = [
        { action: { $regex: kw, $options: 'i' } },
        { resourceType: { $regex: kw, $options: 'i' } },
        { userEmail: { $regex: kw, $options: 'i' } },
        { userName: { $regex: kw, $options: 'i' } },
        { resourceId: { $regex: kw, $options: 'i' } },
        // Search details safely by converting to string; protect against conversion errors
        { $expr: { $regexMatch: { input: { $convert: { input: "$details", to: "string", onError: "", onNull: "" } }, regex: kw, options: 'i' } } },
      ];
    }

    const logs = await AuditLog.find(q).sort({ createdAt: -1 }).limit(Number(limit)).skip(Number(skip));
    const count = await AuditLog.countDocuments(q);

    if (String(exportFmt) === 'csv') {
      // simple CSV export
      const rows = logs.map((l) => ({
        createdAt: l.createdAt.toISOString(),
        userEmail: l.userEmail,
        userName: l.userName,
        action: l.action,
        resourceType: l.resourceType,
        resourceId: l.resourceId,
        details: JSON.stringify(l.details),
        ip: l.ip,
        userAgent: l.userAgent,
      }));
      const header = Object.keys(rows[0] || {}).join(',') + '\n';
      const body = rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${Date.now()}.csv"`);
      return res.send(header + body);
    }

    res.json({ logs, count });
  } catch (err) {
    console.error('[AUDIT LOGS] Error fetching logs:', err);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

module.exports = router;
