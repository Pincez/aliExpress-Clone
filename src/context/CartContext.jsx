import React, { createContext, useState, useContext } from "react";

// Create the context
const CartContext = createContext();

// Custom hook for using the cart context
export const useCart = () => useContext(CartContext);

// Cart context provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item to the cart or update its quantity
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with a quantity of 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from the cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Decrease item quantity or remove it if quantity is 1
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Remove items with 0 quantity
    );
  };

  // Get the total count of items in the cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, decreaseQuantity, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
