const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userEmail: { type: String, default: '' },
    userName: { type: String, default: '' },
    action: { type: String, required: true }, // e.g., create_product, update_product
    resourceType: { type: String, required: true }, // product, user, order
    resourceId: { type: String, required: false },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

// Indexes for common query patterns
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ resourceType: 1, createdAt: -1 });
AuditLogSchema.index({ userEmail: 1, createdAt: -1 });
AuditLogSchema.index({ resourceId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
