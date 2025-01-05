import React from "react";
import Card from "./Card";
import all_product from "../assets/Frontend_Assets/all_product"; // Import the data

const CardGrid = ({ category }) => {
  // Filter products based on category if provided, otherwise show all
  const filteredProducts = category
    ? all_product.filter((product) => product.category === category)
    : all_product;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
        Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            image={product.image}
            title={product.name}
            description={product.category}
            price={product.new_price}
            product={product} // Pass the product object to the Card
          />
        ))}
      </div>
    </div>
  );
};

export default CardGrid;
