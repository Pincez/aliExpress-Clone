import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart } = useCart();

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.quantity * item.new_price,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover"
                />

                <div className="flex-1 px-4">
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-gray-500">
                    ${item.new_price.toFixed(2)} x {item.quantity}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-bold text-gray-700 text-right">
              Total Amount: ${totalAmount.toFixed(2)}
            </h3>
          </div>

          <div className="mt-6 text-right">
            <Link
              to="/checkout" // Update to match route definition in App.js
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;