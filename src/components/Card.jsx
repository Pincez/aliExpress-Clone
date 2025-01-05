import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Card = ({ image, title, description, price, product }) => {
  const { addToCart } = useCart();

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent event propagation to the parent Link
    addToCart(product);
  };

  return (
    <div className="max-w-sm bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <Link to={`/ProductPage/${product.id}`}>
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-700">{title}</h3>
          <p className="text-gray-600 mt-2">{description}</p>
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
