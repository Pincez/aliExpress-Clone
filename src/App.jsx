import React from "react";
import Navbar from "./components/NavBar";
import Banner from "./components/Banner";
import CardGrid from "./components/CardGrid";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Women from "./pages/Women"; // Import Women page
import Men from "./pages/Men"; // Import Men page
import Kids from "./pages/Kids"; // Import Kids page
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // Import CartProvider
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import "./App.css"

const App = () => {
  return (
    <CartProvider> {/* Wrap the entire app with CartProvider */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Banner />
                  <CardGrid /> {/* Home Page with all products */}
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/women" element={<Women />} /> {/* Women page */}
            <Route path="/men" element={<Men />} /> {/* Men page */}
            <Route path="/kids" element={<Kids />} /> {/* Kids page */}
            <Route path="/CartPage" element={<CartPage />} />
            <Route path="/ProductPage/:id" element={<ProductPage />} />
          </Routes>
        </div>
        <footer className="bg-gray-100 text-center py-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </footer>
      </div>
    </CartProvider>
  );
};

export default App;
