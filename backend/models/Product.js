const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    capacity: { type: String, required:true },
    technology: { type: String,required:true }, // e.g., RO, UV, UF
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    techimage: [{ type: String }],
    rating:{type:String,default:''},
    moreDetails:{type:String,default:''},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
