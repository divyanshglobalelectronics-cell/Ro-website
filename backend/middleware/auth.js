const jwt = require('jsonwebtoken');

// Require a valid JWT
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized: Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, name: payload.name, isAdmin: payload.isAdmin };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

// Optional auth: attach user if token valid, otherwise continue
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, name: payload.name, isAdmin: payload.isAdmin };
  } catch (e) {
    // ignore invalid token
  }
  return next();
}

// Require admin privileges (assumes req.user is set)
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Forbidden: Admins only' });
  return next();
}

// Verify ownership factory: getResourceUserId(req) should return owner id
function verifyOwnership(getResourceUserId) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    try {
      const resourceUserId = getResourceUserId(req);
      if (!resourceUserId) return next();
      if (String(resourceUserId) !== String(req.user.id)) {
        return res.status(403).json({ error: 'Forbidden: Access denied' });
      }
      return next();
    } catch (e) {
      return res.status(500).json({ error: 'Server error during ownership check' });
    }
  };
}

module.exports = auth;
module.exports.optional = optionalAuth;
module.exports.requireAdmin = requireAdmin;
module.exports.verifyOwnership = verifyOwnership;
