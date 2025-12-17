const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    service: { type: String, default: null },
    status: { type: String, enum: ['new', 'in_progress', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', InquirySchema);
