const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Men', 'Women', 'Children', 'Footwear'] },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true }, // URL to the product image
  sizes: { type: [String], default: [] }, // e.g., ['S', 'M', 'L', 'XL']
  brand: { type: String, default: 'Generic' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
