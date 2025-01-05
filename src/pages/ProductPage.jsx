import React from "react";
import { useParams } from "react-router-dom";
import all_product from "../assets/Frontend_Assets/all_product"; // Import your product data
import { useCart } from "../context/CartContext";

const ProductPage = () => {
  const { id } = useParams();
  const product = all_product.find((item) => item.id === parseInt(id));
  const { addToCart } = useCart();

  if (!product) {
    return <p className="text-center text-gray-500">Product not found.</p>;
  }

  // Suggested products (excluding the current product)
  const suggestedProducts = all_product
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 object-cover rounded-lg"
        />

        {/* Product Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h2>
          <p className="text-lg text-gray-700 mb-4">${product.new_price.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
          <button
            onClick={() => addToCart({ ...product, quantity: 1 })}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Suggested Products */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-800 mb-4">You might also like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestedProducts.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded"
              />
              <h4 className="text-sm font-medium text-gray-700 mt-2">{item.name}</h4>
              <p className="text-sm text-gray-500">${item.new_price.toFixed(2)}</p>
              <button
                onClick={() => addToCart({ ...item, quantity: 1 })}
                className="text-blue-500 hover:underline mt-2 block"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
