// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart, faBars, faSearch, faChevronDown, faUser,
  faTshirt, faLaptop, faCouch, faUtensils, faBook, faTools,
  faTimes, faSignOutAlt, faClipboardList, faAddressCard
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";
import axios from "axios";

const categories = [
  { name: "Clothing", icon: faTshirt, subCategories: ["Men", "Women", "Kids"] },
  { name: "Electronics", icon: faLaptop, subCategories: ["Mobile Phones", "Laptops", "Accessories"] },
  { name: "Furniture", icon: faCouch, subCategories: ["Living Room", "Bedroom", "Office"] },
  { name: "Food & Groceries", icon: faUtensils, subCategories: ["Vegetables", "Snacks", "Beverages"] },
  { name: "Books", icon: faBook, subCategories: ["Fiction", "Non-Fiction", "Children"] },
  { name: "Tools & Home Improvement", icon: faTools, subCategories: ["Hand Tools", "Power Tools", "Lighting"] },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const [user, setUser] = useState(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const categoriesRef = useRef(null);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  // Handle outside clicks for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!categoriesRef.current?.contains(event.target)) setIsCategoriesOpen(false);
      if (!accountRef.current?.contains(event.target)) setIsAccountOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (name) => {
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  const highlightMatch = (name) => {
    const query = searchQuery.trim();
    if (!query) return name;
    const parts = name.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? <strong key={i}>{part}</strong> : part
    );
  };

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/suggestions?q=${encodeURIComponent(trimmed)}`);
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex justify-between items-center h-20">
          {/* Logo & Main Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">Logo</Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 text-lg">Home</Link>
              <Link to="/shop" className="text-gray-700 hover:text-blue-600 text-lg">Shop</Link>
              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <FontAwesomeIcon icon={faBars} size="lg" />
                  <span className="text-lg font-semibold">Categories</span>
                  <FontAwesomeIcon icon={faChevronDown} size="sm" />
                </button>
                {isCategoriesOpen && (
                  <div className="absolute left-0 top-12 w-80 bg-white shadow-lg rounded-lg z-50 p-4">
                    <ul className="space-y-4">
                      {categories.map((category) => (
                        <li key={category.name} className="group relative flex items-center space-x-3">
                          <FontAwesomeIcon icon={category.icon} />
                          <Link to={`/category/${category.name}`} className="text-sm font-medium text-gray-700 hover:text-blue-600">
                            {category.name}
                          </Link>
                          <ul className="absolute left-full top-0 ml-2 w-48 bg-white shadow-md rounded-lg p-2 space-y-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            {category.subCategories.map((sub) => (
                              <li key={sub}>
                                <Link to={`/category/${category.name}/${sub}`} className="text-xs text-gray-600 hover:text-blue-600">
                                  {sub}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 mx-6 relative">
            <div className="relative flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-50 bg-white w-full shadow-lg border border-gray-200 rounded-b-lg mt-1 max-h-64 overflow-y-auto">
                {suggestions.map((s) => (
                  <li
                    key={s._id}
                    onClick={() => handleSuggestionClick(s.name)}
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={s.image || "/placeholder.jpg"}
                      alt={s.name}
                      className="w-10 h-10 object-cover rounded-md border"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-800">{highlightMatch(s.name)}</span>
                      {s.category && <span className="text-xs text-gray-500">{s.category}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Account & Cart */}
          <div className="hidden md:flex space-x-6 items-center">
            <div className="relative" ref={accountRef}>
              <button onClick={() => setIsAccountOpen(!isAccountOpen)} className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faUser} size="lg" />
                <span className="text-lg font-semibold">Account</span>
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </button>
              {isAccountOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white shadow-lg rounded-lg z-50 p-4">
                  {user ? (
                    <>
                      <div className="text-sm text-gray-700 p-2 font-medium">Hello, {user.name || user.email}</div>
                      <Link to="/profile" className="flex items-center space-x-2 p-2 hover:text-blue-600">
                        <FontAwesomeIcon icon={faAddressCard} />
                        <span>My Profile</span>
                      </Link>
                      <Link to="/orders" className="flex items-center space-x-2 p-2 hover:text-blue-600">
                        <FontAwesomeIcon icon={faClipboardList} />
                        <span>My Orders</span>
                      </Link>
                      <button onClick={handleLogout} className="flex items-center space-x-2 p-2 w-full text-left hover:text-blue-600">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link to="/login" className="block text-sm text-gray-700 hover:text-blue-600 p-2">Login / Signup</Link>
                  )}
                </div>
              )}
            </div>
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md border-t border-gray-200 px-4 py-4 space-y-4">
            <Link to="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/shop" className="block text-gray-700 hover:text-blue-600">Shop</Link>
            <Link to="/cart" className="block text-gray-700 hover:text-blue-600">Cart</Link>
            {user ? (
              <>
                <div className="text-gray-700">Hello, {user.name || user.email}</div>
                <Link to="/profile" className="block text-gray-700 hover:text-blue-600">My Profile</Link>
                <Link to="/orders" className="block text-gray-700 hover:text-blue-600">My Orders</Link>
                <button onClick={handleLogout} className="block w-full text-left text-gray-700 hover:text-blue-600">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block text-gray-700 hover:text-blue-600">Login / Signup</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
