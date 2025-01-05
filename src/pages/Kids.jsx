import React from "react";
import CardGrid from "../components/CardGrid"; // Ensure the import path is correct

const Kids = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">Kids</h2>
      <CardGrid category="kid" /> {/* Show products for kids category */}
    </div>
  );
};

export default Kids;
