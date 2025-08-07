const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Electronics', 'Toys & Games', 'Beauty & Health', 'Books', 'Clothing'],
      message: 'Invalid category'
    }
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required'],
    enum: {
      values: ['Headphones', 'Speakers', 'Smartwatches', 'Toys', 'Books', 'Clothing', 'Furniture', 'Health'],
      message: 'Invalid subcategory'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be at least 0'],
    set: v => Math.round(v * 100) / 100
  },
  image: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔍 Indexes
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

// ✅ Text index for full-text search across multiple fields
productSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  subcategory: 'text'
});

// 🧠 Virtuals
productSchema.virtual('isInStock').get(function() {
  return this.stock > 0;
});

productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// 🔎 Query helper
productSchema.query.inStock = function() {
  return this.where({ stock: { $gt: 0 } });
};

// 📁 Static method
productSchema.statics.findByCategory = function(category) {
  return this.find({ category }).sort({ price: 1 });
};

// ⏳ Middleware
productSchema.pre('save', function(next) {
  console.log(`Saving product: ${this.name}`);
  next();
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
