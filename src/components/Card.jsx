import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Card = ({ product }) => {
  const { addToCart } = useCart();

  const getImageSrc = () => {
    if (!product.image) return "https://via.placeholder.com/300x300?text=No+Image";
    return product.image;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      image: getImageSrc(),
      price: product.price || 0,
      quantity: 1,
    });
  };

  const renderStars = () => {
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;

    return (
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${
              i < fullStars
                ? "text-yellow-400"
                : i === fullStars && hasHalfStar
                ? "text-yellow-400 opacity-50"
                : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-500 ml-1">({product.rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition duration-300 flex flex-col h-full">
      <Link
        to={`/products/${product._id}`}

        className="block flex-grow"
        aria-label={`View details of ${product.name}`}
      >
        <div className="relative pt-[100%] bg-gray-100">
          <img
            src={getImageSrc()}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-contain p-4"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Available";
              e.target.classList.add("object-cover");
            }}
          />
        </div>

        <div className="p-4 flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2" title={product.name}>
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 mt-1">
            {product.description || "No description available."}
          </p>
          {renderStars()}
        </div>
      </Link>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-800">
          ${typeof product.price === "number" ? product.price.toFixed(2) : "N/A"}
        </span>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition"
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;
