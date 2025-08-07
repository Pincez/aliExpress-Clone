// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();

const {
  initiateStkPush,
  handleMpesaCallback
} = require("../controllers/mpesaController");

const {
  initiateAirtelPush,
  handleAirtelCallback
} = require("../controllers/airtelController");

const {
  createPaypalOrder,
  capturePaypalPayment,
} = require('../controllers/paypalController');

// Dynamic route: POST /api/payments/:method
router.post("/:method", async (req, res) => {
  const { method } = req.params;

  try {
    if (method === "mpesa") {
      return initiateStkPush(req, res);
    } else if (method === "airtel") {
      return initiateAirtelPush(req, res);
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Callbacks
router.post("/mpesa/callback", handleMpesaCallback);
router.post("/airtel/callback", handleAirtelCallback);
router.post('/paypal/create', createPaypalOrder);
router.post('/paypal/capture', capturePaypalPayment);

module.exports = router;
