// utils/mpesaUtils.js
const axios = require("axios");

const getMpesaToken = async () => {
  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;

  const credentials = `${consumerKey}:${consumerSecret}`;
  const encoded = Buffer.from(credentials).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${encoded}`,
      },
    }
  );

  return response.data.access_token;
};

const generateMpesaPassword = (shortCode, passkey, timestamp) => {
  const dataToEncode = `${shortCode}${passkey}${timestamp}`;
  return Buffer.from(dataToEncode).toString("base64");
};

module.exports = {
  getMpesaToken,
  generateMpesaPassword
};

