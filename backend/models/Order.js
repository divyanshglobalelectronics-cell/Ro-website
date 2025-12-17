const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    customer: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String },
      pincode: { type: String },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['upi', 'card', 'netbanking', 'cod'], default: 'cod' },
    // Payment/Gateway fields
    transactionId: { type: String }, // merchant txnid sent to PayU
    gatewayTransactionId: { type: String }, // PayU mihpayid
    gateway: { type: String, default: null }, // e.g., 'payu'
    paymentMeta: { type: Object, default: null }, // optional raw meta such as bank_ref_num
    notes: { type: String },
    // Refund fields
    refunded: { type: Boolean, default: false },
    refundAmount: { type: Number, default: 0, min: 0 },
    refundedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
