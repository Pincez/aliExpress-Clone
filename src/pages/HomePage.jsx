import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import NewProductsSlider from "../components/NewProductsSlider";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log("🛍️ Fetched products:", data.data); // Debugging
        setProducts(data.data); // Assuming 'data' contains a 'data' field with products
      } catch (err) {
        setError(err.message);
        console.error("⚠️ Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Banner Section */}
        <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <Banner />
        </div>

        {/* New Products Section */}
        <div className="mt-6 w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">New Products</h2>
          <div className="min-h-[500px] w-full flex justify-center">
            {loading ? (
              <div className="text-gray-500">Loading products...</div>
            ) : error ? (
              <div className="text-red-500">Error: {error}</div>
            ) : (
              <NewProductsSlider products={products} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
