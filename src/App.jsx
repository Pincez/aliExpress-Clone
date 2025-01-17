import React from "react";
import Navbar from "./components/NavBar";
import Banner from "./components/Banner";
import CardGrid from "./components/CardGrid";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Women from "./pages/Women"; // Women page
import Men from "./pages/Men"; // Men page
import Kids from "./pages/Kids"; // Kids page
import { Routes, Route, useParams } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // CartProvider
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminPanel from "./components/Admin/AdminPanel"; // Admin panel
import ProtectedRoute from "./components/Admin/ProtectedRoute"; // Protected route
import { AuthProvider } from "./context/AuthContext"; // AuthProvider
import all_product from "./assets/Frontend_Assets/all_product"; // Import product data
import "./App.css";

const ProductPageWrapper = () => {
  const { id } = useParams();
  const productId = parseInt(id, 10);
  const product = all_product.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Product not found.</p>
        <a href="/" className="text-blue-500 hover:underline">
          Go back to Home
        </a>
      </div>
    );
  }

  return <ProductPage product={product} />;
};

const App = () => {
  return (
    <AuthProvider> {/* Wrap the app with AuthProvider */}
      <CartProvider> {/* Wrap the app with CartProvider */}
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  <> {/* Home page with banner and products */}
                    <Banner />
                    <CardGrid />
                  </>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/women" element={<Women />} /> {/* Women page */}
              <Route path="/men" element={<Men />} /> {/* Men page */}
              <Route path="/kids" element={<Kids />} /> {/* Kids page */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:id" element={<ProductPageWrapper />} />
              <Route path="/ProductPage/:id" element={<ProductPageWrapper />} /> {/* Optional */}
              <Route path="/checkout" element={<CheckoutPage />} /> {/* Checkout page */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute> {/* Protect the admin panel */}
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <footer className="bg-gray-100 text-center py-4">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
