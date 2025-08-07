import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const CheckoutPage = () => {
  const { cart, clearCart, loading, error } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");

  const [town, setTown] = useState("");

  const [addressDetails, setAddressDetails] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const DELIVERY_FEE = 150;

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=checkout");
    }
  }, [user, navigate]);

  const handlePayment = async () => {
    setPaymentLoading(true);
    setPaymentError("");
    try {
      const res = await axios.post(`/api/payments/${paymentMethod}`, {
        phone,
        amount: cart.total + DELIVERY_FEE,
      });

      if (res.data.success) {
        setPaymentSuccess(true);
        alert("Payment initiated. Follow the instructions on your device.");
      } else {
        throw new Error(res.data.message || "Payment initiation failed");
      }
    } catch (err) {
      console.error(err);
      setPaymentError("Failed to initiate payment. Try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!paymentSuccess) {
        alert("Please complete payment before placing the order.");
        return;
      }

      await axios.post("/api/orders", {
        userId: user._id,
        cart: cart.items,
        total: cart.total + DELIVERY_FEE,
        phone,
        town,
        addressDetails,
        paymentMethod,
      });

      alert("Order placed successfully!");
      await clearCart();
      navigate("/thank-you");
    } catch (err) {
      console.error("Order placement error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-blue-100 text-blue-800 p-4 rounded text-center">
          Your cart is empty.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
        <ul className="divide-y">
          {cart.items.map((item) => (
            <li key={item._id} className="flex justify-between py-2">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
          <li className="flex justify-between font-medium py-2">
            <span>Subtotal</span>
            <span>${cart.total.toFixed(2)}</span>
          </li>
          <li className="flex justify-between font-medium py-2">
            <span>Delivery Fee</span>
            <span>${DELIVERY_FEE.toFixed(2)}</span>
          </li>
          <li className="flex justify-between font-bold py-2 border-t pt-2">
            <span>Total</span>
            <span>${(cart.total + DELIVERY_FEE).toFixed(2)}</span>
          </li>
        </ul>
      </div>

      {/* Payment & Address */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Delivery Info & Payment</h3>

        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 07XXXXXXXX"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Nearby Town</label>
        <input
          type="text"
          value={town}
          onChange={(e) => setTown(e.target.value)}
          placeholder="e.g. Oyugis"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Exact Location</label>
        <textarea
          value={addressDetails}
          onChange={(e) => setAddressDetails(e.target.value)}
          placeholder="e.g. Oyugis Boys gate or market near Nyamira junction"
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        >
          <option value="mpesa">M-Pesa</option>
          <option value="airtel">Airtel Money</option>
          <option value="paypal">PayPal</option>
          <option value="skrill">Skrill</option>
        </select>

        <button
          onClick={handlePayment}
          disabled={paymentLoading || !phone}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {paymentLoading ? "Processing..." : `Pay with ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}`}
        </button>

        {paymentError && <p className="text-red-600 mt-2">{paymentError}</p>}
        {paymentSuccess && <p className="text-green-600 mt-2">Payment success. Proceed to place your order.</p>}

        <button
          onClick={handlePlaceOrder}
          disabled={loading || !paymentSuccess}
          className="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
