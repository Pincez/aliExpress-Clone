const mongoose = require("mongoose");

const interactionTypes = [
  'view', 
  'review', 
  'rating', 
  'wishlist', 
  'share', 
  'question', 
  'answer',
  'comparison_view'
];

const productInteractionSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  interactionType: {
    type: String,
    required: true,
    enum: interactionTypes
  },
  // Review-specific fields
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: function() { return this.interactionType === 'review' || this.interactionType === 'rating'; }
  },
  reviewTitle: {
    type: String,
    maxlength: 100,
    required: function() { return this.interactionType === 'review'; }
  },
  reviewComment: {
    type: String,
    maxlength: 1000,
    required: function() { return this.interactionType === 'review'; }
  },
  reviewImages: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  }],
  // Q&A fields
  question: {
    type: String,
    maxlength: 500,
    required: function() { return this.interactionType === 'question'; }
  },
  answer: {
    type: String,
    maxlength: 1000,
    required: function() { return this.interactionType === 'answer'; }
  },
  parentInteraction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductInteraction",
    required: function() { return this.interactionType === 'answer'; }
  },
  // Metadata
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  sharedPlatform: {
    type: String,
    enum: ['facebook', 'twitter', 'whatsapp', 'email', 'other'],
    required: function() { return this.interactionType === 'share'; }
  },
  comparedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: function() { return this.interactionType === 'comparison_view'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
productInteractionSchema.index({ productId: 1, interactionType: 1 });
productInteractionSchema.index({ userId: 1, createdAt: -1 });
productInteractionSchema.index({ interactionType: 1, createdAt: -1 });

// Virtual for formatted rating
productInteractionSchema.virtual('formattedRating').get(function() {
  return this.rating ? `${this.rating}/5` : null;
});

// Static method to get average rating for a product
productInteractionSchema.statics.getAverageRating = async function(productId) {
  const result = await this.aggregate([
    {
      $match: { 
        productId: mongoose.Types.ObjectId(productId),
        interactionType: { $in: ['review', 'rating'] }
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);
  
  return result[0] || { averageRating: 0, reviewCount: 0 };
};

// Update product rating after review/rating is saved
productInteractionSchema.post('save', async function(doc) {
  if (doc.interactionType === 'review' || doc.interactionType === 'rating') {
    const Product = mongoose.model('Product');
    const { averageRating, reviewCount } = await this.constructor.getAverageRating(doc.productId);
    
    await Product.findByIdAndUpdate(doc.productId, {
      rating: averageRating,
      $inc: { reviewCount: 1 }
    });
  }
});

const ProductInteraction = mongoose.models.ProductInteraction || 
  mongoose.model("ProductInteraction", productInteractionSchema);

module.exports = ProductInteraction;