import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";
import { auth } from "../firebase/firebase"; // Import Firebase Auth
import { signOut } from "firebase/auth";

const Navbar = () => {
  const { cartCount, setCartItems } = useCart(); // Add `setCartItems` for clearing cart
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCartItems([]); // Clear cart items on logout
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-500">
              Logo
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/Men" className="text-gray-700 hover:text-blue-500">
              Men
            </Link>
            <Link to="/Women" className="text-gray-700 hover:text-blue-500">
              Women
            </Link>
            <Link to="/Kids" className="text-gray-700 hover:text-blue-500">
              Kids
            </Link>
            <Link to="/Footwear" className="text-gray-700 hover:text-blue-500">
              Footwear
            </Link>
            <Link to="/Accessories" className="text-gray-700 hover:text-blue-500">
              Accessories
            </Link>
          </div>

          {/* Right Section: Cart and User Actions */}
          <div className="hidden md:flex space-x-4 items-center">
            {/* Cart Icon */}
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-500">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {user.displayName || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Login/Signup
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
