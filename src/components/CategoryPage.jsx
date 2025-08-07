import React from "react";
import { useParams } from "react-router-dom";
import CardGrid from "../components/CardGrid";

// Mock data for products
const products = {
  Clothing: [
    { id: 1, name: "Men's Shirt", price: 25 },
    { id: 2, name: "Women's Dress", price: 40 },
    { id: 3, name: "Kids' T-Shirt", price: 15 },
  ],
  Electronics: [
    { id: 4, name: "Smartphone", price: 500 },
    { id: 5, name: "Laptop", price: 1200 },
    { id: 6, name: "Headphones", price: 100 },
  ],
  // Add more categories and products as needed
};

const CategoryPage = () => {
  const { categoryName } = useParams();

  // Fetch products for the selected category
  const categoryProducts = products[categoryName] || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>
      <CardGrid products={categoryProducts} />
    </div>
  );
};

export default CategoryPage;