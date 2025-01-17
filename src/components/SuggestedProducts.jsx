import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const SuggestedProducts = ({ products }) => {
  const { addToCart } = useCart();

  if (!products || products.length === 0) {
    return null; // Return nothing if no suggested products
  }

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-800 mb-4">You might also like</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <Link to={`/product/${item.id}`}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded"
              />
            </Link>
            <h4 className="text-sm font-medium text-gray-700 mt-2">{item.name}</h4>
            <p className="text-sm text-gray-500">${item.new_price.toFixed(2)}</p>
            <button
              onClick={() => addToCart({ ...item, quantity: 1 })}
              className="bg-blue-500 text-white px-2 py-1 mt-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
