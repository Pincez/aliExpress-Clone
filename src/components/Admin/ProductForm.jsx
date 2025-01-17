import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProduct({ ...product, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!product.name || !product.price || !product.description || !product.imageUrl) {
      setError("All fields are required.");
      return;
    }

    try {
      const productRef = collection(db, "products");
      await addDoc(productRef, {
        ...product,
        price: parseFloat(product.price),
        createdAt: new Date(),
      });
      setSuccess("Product added successfully!");
      setProduct({ name: "", price: "", description: "", imageUrl: "" });
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">Add Product</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="number"
          id="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          id="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          id="imageUrl"
          placeholder="Image URL"
          value={product.imageUrl}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
