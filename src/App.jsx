import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster
import Navbar from "./components/NavBar";
import Homepage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import CategoryPage from "./components/CategoryPage"; 
import SubCategoryPage from "./components/SubCategoryPage";
import SearchResults from "./pages/SearchResults";
import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";
import axios from "axios";

axios.defaults.withCredentials = true;

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} /> {/* ✅ Add Toaster */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/products/:_id" element={<ProductPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/category/:categoryName/:subCategoryName" element={<SubCategoryPage />} />
            </Routes>
          </div>
          <footer className="bg-gray-100 text-center py-4">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Pincez.inc. All rights reserved.
            </p>
          </footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
