const axios = require('axios');
require('dotenv').config();

let accessToken = null;

// 1. Generate token
const getAirtelToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.AIRTEL_BASE_URL}/auth/oauth2/token`,
      {
        client_id: process.env.AIRTEL_CLIENT_ID,
        client_secret: process.env.AIRTEL_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Failed to get Airtel token:', error.response?.data || error.message);
    throw error;
  }
};

// 2. Generate unique reference
const generateReference = () => {
  return 'AIR' + Date.now(); // e.g. AIR1722958120000
};

// 3. Initiate payment
const initiateAirtelPayment = async ({ phone, amount, reference, token }) => {
  try {
    const payload = {
      reference: reference,
      subscriber: {
        country: 'KE',
        currency: 'KES',
        msisdn: phone,
      },
      transaction: {
        amount: amount.toString(),
        country: 'KE',
        currency: 'KES',
        id: reference,
      },
    };

    const response = await axios.post(
      `${process.env.AIRTEL_BASE_URL}/merchant/v1/payments/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Airtel Payment Error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  getAirtelToken,
  generateReference,
  initiateAirtelPayment,
};
