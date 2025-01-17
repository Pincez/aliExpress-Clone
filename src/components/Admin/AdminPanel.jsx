import React from "react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

const AdminPanel = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-500 mt-6">Admin Panel</h1>
      <div className="mt-6 w-full max-w-4xl space-y-6">
        <ProductForm />
        <ProductList />
      </div>
    </div>
  );
};

export default AdminPanel;
