const axios = require("axios");
const mongoose = require('mongoose');
const moment = require("moment");
const Transaction = require("../models/Transaction");
const { generateMpesaPassword, getMpesaToken } = require("../utils/mpesaUtils");

const initiateStkPush = async (req, res) => {
  const { phone, amount, user } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const token = await getMpesaToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = generateMpesaPassword(process.env.MPESA_SHORTCODE, process.env.MPESA_PASSKEY, timestamp);

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: `${process.env.BASE_URL}/api/payments/mpesa/callback`,
      AccountReference: "E-Commerce",
      TransactionDesc: "Payment for goods"
    };

    const { data } = await axios.post(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const transaction = new Transaction({
      userId: new mongoose.Types.ObjectId(user),         // ✅ correct field name
      paymentMethod: 'mpesa',                            // ✅ explicitly set
      phone,
      amount,
      status: "pending",
      checkoutRequestID: data.CheckoutRequestID,
      merchantRequestID: data.MerchantRequestID
    });

    await transaction.save();

    res.status(200).json({ message: "STK Push sent", data });
  } catch (error) {
    console.error("M-Pesa STK Error:", error.response?.data || error.message);
    res.status(500).json({ error: "STK push failed", details: error.message });
  }
};

const handleMpesaCallback = async (req, res) => {
  const callbackData = req.body.Body.stkCallback;
  const { MerchantRequestID, CheckoutRequestID, ResultDesc, ResultCode } = callbackData;

  try {
    const transaction = await Transaction.findOne({ checkoutRequestID: CheckoutRequestID });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (ResultCode === 0) {
      const metadata = callbackData.CallbackMetadata?.Item || [];

      const receiptItem = metadata.find(item => item.Name === "MpesaReceiptNumber");

      transaction.status = "Success";
      transaction.resultDesc = ResultDesc;
      transaction.mpesaReceiptNumber = receiptItem?.Value || "";
    } else {
      transaction.status = "Failed";
      transaction.resultDesc = ResultDesc;
    }

    await transaction.save();
    res.status(200).json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Callback Error:", error);
    res.status(500).json({ error: "Failed to process callback" });
  }
};

module.exports = { initiateStkPush, handleMpesaCallback };
