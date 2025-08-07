import React from "react";
import { useParams } from "react-router-dom";
import CardGrid from "../components/CardGrid";

// Mock data for subcategories
const subCategoryProducts = {
  Clothing: {
    Men: [
      { id: 1, name: "Men's Shirt", price: 25 },
      { id: 2, name: "Men's Jeans", price: 35 },
    ],
    Women: [
      { id: 3, name: "Women's Dress", price: 40 },
      { id: 4, name: "Women's Skirt", price: 30 },
    ],
    Kids: [
      { id: 5, name: "Kids' T-Shirt", price: 15 },
      { id: 6, name: "Kids' Shorts", price: 20 },
    ],
  },
  Electronics: {
    "Mobile Phones": [
      { id: 7, name: "Smartphone", price: 500 },
      { id: 8, name: "Tablet", price: 300 },
    ],
    Laptops: [
      { id: 9, name: "Gaming Laptop", price: 1500 },
      { id: 10, name: "Ultrabook", price: 1200 },
    ],
  },
  // Add more subcategories and products as needed
};

const SubCategoryPage = () => {
  const { categoryName, subCategoryName } = useParams();

  // Fetch products for the selected subcategory
  const subCategoryProductsList =
    subCategoryProducts[categoryName]?.[subCategoryName] || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {categoryName} - {subCategoryName}
      </h1>
      <CardGrid products={subCategoryProductsList} />
    </div>
  );
};

export default SubCategoryPage;