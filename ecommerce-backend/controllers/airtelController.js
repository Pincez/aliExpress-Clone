const axios = require("axios");
const Transaction = require("../models/Transaction");
const { getAirtelToken } = require("../utils/airtelUtils");

// INITIATE AIRTEL PAYMENT
const initiateAirtelPush = async (req, res) => {
  const { phone, amount, user } = req.body;

  try {
    const token = await getAirtelToken();

    const transactionId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payload = {
      reference: "E-Commerce",
      subscriber: {
        country: "KE",
        currency: "KES",
        msisdn: phone
      },
      transaction: {
        amount: amount.toString(),
        country: "KE",
        currency: "KES",
        id: transactionId,
        type: "merchant"
      }
    };

    const { data } = await axios.post(
      `${process.env.AIRTEL_BASE_URL}/merchant/v1/payments/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Country": "KE",
          "X-Currency": "KES"
        }
      }
    );

    const transaction = new Transaction({
      user,
      phone,
      amount,
      status: "Pending",
      airtelPaymentId: data?.data?.id || transactionId,
      resultDesc: data?.status?.message || "Payment initiated"
    });

    await transaction.save();

    res.status(200).json({ message: "Airtel payment initiated", data });
  } catch (error) {
    console.error("Airtel Payment Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Airtel payment failed", details: error.message });
  }
};

// HANDLE AIRTEL CALLBACK
const handleAirtelCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    console.log("Airtel callback received:", JSON.stringify(callbackData, null, 2));

    const transactionId = callbackData?.data?.id || callbackData?.transaction?.id;
    const status = callbackData?.status?.code === "200" ? "Success" : "Failed";
    const message = callbackData?.status?.message || "No status message";

    const transaction = await Transaction.findOneAndUpdate(
      { airtelPaymentId: transactionId },
      {
        status,
        resultDesc: message,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Airtel callback processed", transaction });
  } catch (error) {
    console.error("Airtel Callback Error:", error.message);
    res.status(500).json({ error: "Callback handling failed" });
  }
};

// Export both
module.exports = {
  initiateAirtelPush,
  handleAirtelCallback
};
