import React, { useState } from "react";

const CheckoutPage = () => {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const itemsPrice = 100; // Example item price
  const shippingPrice = 10; // Example shipping price
  const taxPrice = itemsPrice * 0.15; // Example tax (15% of items price)
  const [coupon, setCoupon] = useState("");
  const couponDiscount = coupon === "SAVE10" ? 10 : 0; // Example coupon logic
  const totalCost = itemsPrice + shippingPrice + taxPrice - couponDiscount;

  const handlePayment = (method) => {
    if (method === "paypal") {
      alert("Redirecting to PayPal...");
      // Integrate PayPal SDK functionality here
    } else if (method === "googlepay") {
      alert("Processing Google Pay...");
      // Integrate Google Pay API here
    } else if (method === "mpesa") {
      alert("Processing M-Pesa payment...");
      // Integrate M-Pesa functionality here
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-start space-x-8">
      {/* First Card: Delivery Address and Payment Methods */}
      <div className="w-1/2 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Delivery Address</h2>
        <textarea
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Enter your delivery address"
          className="w-full p-2 border rounded mb-4"
          rows={4}
        ></textarea>

        <h3 className="text-lg font-bold text-gray-700 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          <button
            onClick={() => handlePayment("paypal")}
            className={`w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
              selectedPayment === "paypal" && "ring ring-blue-300"
            }`}
          >
            Pay with PayPal
          </button>
          <button
            onClick={() => handlePayment("googlepay")}
            className={`w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
              selectedPayment === "googlepay" && "ring ring-green-300"
            }`}
          >
            Pay with Google Pay
          </button>
          <button
            onClick={() => handlePayment("mpesa")}
            className={`w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 ${
              selectedPayment === "mpesa" && "ring ring-gray-300"
            }`}
          >
            Pay with M-Pesa
          </button>
        </div>
      </div>

      {/* Second Card: Cost Calculation */}
      <div className="w-1/3 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Order Summary</h2>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Items Price:</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>Shipping Price:</span>
            <span>${shippingPrice.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>Tax (15%):</span>
            <span>${taxPrice.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>Coupon Discount:</span>
            <span>-${couponDiscount.toFixed(2)}</span>
          </li>
        </ul>

        <div className="mt-4">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Apply coupon code"
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-lg font-bold">
          <span>Total Cost:</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>

        <button
          onClick={() => alert("Order placed successfully!")}
          className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
