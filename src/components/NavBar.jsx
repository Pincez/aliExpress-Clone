import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar"; // Import the SearchBar component

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-blue-500">
              Logo
            </a>
          </div>

          {/* Menu (Desktop) */}
          <div className="hidden md:flex space-x-6">

            <a href="/Men" className="text-gray-700 hover:text-blue-500">
              Men
            </a>
            <a href="/Women" className="text-gray-700 hover:text-blue-500">
              Women
            </a>
            <a href="/Kids" className="text-gray-700 hover:text-blue-500">
              Kids
            </a>
            <a href="/Footware" className="text-gray-700 hover:text-blue-500">
              Footwear
            </a>
            <a href="/Accessories" className="text-gray-700 hover:text-blue-500">
              Accessories
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>

          {/* Icons */}
          <div className="hidden md:flex space-x-4 items-center">
            {/* Cart Icon */}
            <Link to="/CartPage" className="relative text-gray-700 hover:text-blue-500">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <a href="/Login" className="text-gray-700 hover:text-blue-500">
              <FontAwesomeIcon icon={faSignInAlt} size="lg" />
            </a>
            <a href="/Signup" className="text-gray-700 hover:text-blue-500">
              <FontAwesomeIcon icon={faUserPlus} size="lg" />
            </a>
          </div>

          {/* Hamburger Icon (Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-500 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
