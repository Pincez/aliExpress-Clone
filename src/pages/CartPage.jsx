import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const {
    cart,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
  } = useCart();

  const [showClearModal, setShowClearModal] = useState(false);

  if (loading) return <div className="p-4">Loading cart...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!cart || cart.items.length === 0)
    return <div className="p-4">Your cart is empty.</div>;

  const totalPrice = cart.items.reduce((acc, item) => {
    const product = item.productId || item;
    return acc + product.price * item.quantity;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>

      {cart.items.map((item, index) => {
        const product = item.productId || item;
        const id = product._id || item._id || index;
        const name = product.name || "Unnamed Product";
        const price = product.price || 0;
        const image = product.image || "/images/default-product.png";

        return (
          <div key={id} className="flex gap-4 items-center border-b py-4">
            <img
              src={image}
              alt={name}
              className="w-24 h-24 object-cover rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/default-product.png";
              }}
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-gray-600">${price.toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQuantity(id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(id, parseInt(e.target.value))}
                  className="w-16 text-center border rounded"
                />
                <button
                  onClick={() => updateQuantity(id, item.quantity + 1)}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(id)}
                  className="ml-4 text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-6 text-right">
        <p className="text-xl font-bold mb-2">
          Total ({totalItems} items): ${totalPrice.toFixed(2)}
        </p>
        <button
          onClick={() => setShowClearModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Cart
        </button>
        <Link
          to="/checkout"
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </Link>
      </div>

      {/* Clear Cart Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
            <p className="mb-4">Are you sure you want to clear your cart?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  clearCart();
                  setShowClearModal(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
