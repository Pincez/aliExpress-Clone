const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    phoneNumber: {
      type: String,
    },

    paymentMethod: {
      type: String,
      enum: ['mpesa', 'airtel', 'paypal'],
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending', // ✅ use lowercase to match enum
    },

    // --------------------------
    // PayPal Specific Fields
    // --------------------------
    paypalOrderId: {
      type: String,
    },
    paypalPayerId: {
      type: String,
    },
    paypalEmail: {
      type: String,
    },
    currency: {
      type: String,
      default: 'USD',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);

