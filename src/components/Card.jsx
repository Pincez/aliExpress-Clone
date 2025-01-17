import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Card = ({ image, title, description, price, product, rating }) => {
  const { addToCart } = useCart();

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent event propagation to the parent Link
    addToCart(product);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="max-w-sm bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <Link to={`/ProductPage/${product.id}`}>
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-700">{title}</h3>
          <p className="text-gray-600 mt-2">{description}</p>
          <div className="flex items-center mt-2">
            <div className="flex">{renderStars()}</div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-blue-500 font-bold text-lg">${price}</span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleButtonClick} // The logic in CartContext ensures no duplicates
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;
