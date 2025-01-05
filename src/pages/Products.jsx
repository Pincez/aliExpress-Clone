import React from "react";
import CardGrid from "../components/CardGrid"; // Ensure the import path is correct

const Products = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">All Products</h2>
      <CardGrid /> {/* Shows all products */}
    </div>
  );
};

export default Products;
