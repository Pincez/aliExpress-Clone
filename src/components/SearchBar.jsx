// components/SearchBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      const filteredSuggestions = all_product.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
        className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded-md w-full mt-2 shadow-lg">
          {suggestions.map((product) => (
            <li key={product.id} className="hover:bg-gray-100">
              <Link
                to={`/product/${product.id}`}
                className="block px-4 py-2 text-gray-700"
                onClick={() => setQuery("")} // Clear query on selection
              >
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
