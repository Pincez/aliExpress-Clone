const { createOrder, captureOrder } = require('../utils/paypalUtils');
const Transaction = require('../models/Transaction');

// Create PayPal Order
const createPaypalOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const order = await createOrder(amount);
    res.status(200).json(order);
  } catch (error) {
    console.error('PayPal Order Error:', error.message);
    res.status(500).json({ message: 'Failed to create PayPal order' });
  }
};

// Capture PayPal Order
const capturePaypalPayment = async (req, res) => {
  try {
    const { orderID, userId } = req.body;

    if (!orderID) {
      return res.status(400).json({ message: 'Missing order ID' });
    }

    const captured = await captureOrder(orderID);

    // Extract transaction details
    const purchaseUnit = captured.purchase_units?.[0];
    const payment = captured?.payer;
    const transactionId = captured.id;
    const amount = parseFloat(purchaseUnit.amount.value);

    // Save transaction in DB
    const transaction = new Transaction({
      userId: userId || null,
      method: 'paypal',
      provider: 'paypal',
      status: captured.status,
      transactionId,
      amount,
      currency: purchaseUnit.amount.currency_code,
      metadata: {
        payer: payment,
        purchase_unit: purchaseUnit,
        raw: captured,
      },
    });

    await transaction.save();

    res.status(200).json({ message: 'Payment captured', transaction });
  } catch (error) {
    console.error('PayPal Capture Error:', error.message);
    res.status(500).json({ message: 'Failed to capture PayPal payment' });
  }
};

module.exports = {
  createPaypalOrder,
  capturePaypalPayment,
};
