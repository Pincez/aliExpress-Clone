import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const BASE_URL = "http://localhost:5000/api/cart";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        const guest = localStorage.getItem("guestCart");
        setCart(guest ? JSON.parse(guest) : { items: [], total: 0 });
        return;
      }

      setLoading(true);
      try {
        const guest = localStorage.getItem("guestCart");
        if (guest) {
          const items = JSON.parse(guest).items;
          for (const it of items) {
            await axios.post(
              BASE_URL,
              { productId: it._id, quantity: it.quantity },
              { withCredentials: true }
            );
          }
          localStorage.removeItem("guestCart");
        }

        const res = await axios.get(BASE_URL, { withCredentials: true });
        const d = res.data;
        if (d.items && d.total !== undefined) setCart(d);
        else if (Array.isArray(d)) setCart({ items: d, total: calculateTotal(d) });
        else setCart({ items: [], total: 0 });
      } catch {
        setCart({ items: [], total: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!product || !product._id) return false;

    try {
      if (user) {
        const res = await axios.post(
          BASE_URL,
          { productId: product._id, quantity },
          { withCredentials: true }
        );
        const d = res.data;
        if (d.items && d.total !== undefined) setCart(d);
        else if (Array.isArray(d)) setCart({ items: d, total: calculateTotal(d) });
      } else {
        const stored = JSON.parse(localStorage.getItem("guestCart")) || { items: [], total: 0 };
        const exist = stored.items.find((i) => i._id === product._id);
        if (exist) exist.quantity += quantity;
        else stored.items.push({ ...product, quantity });
        stored.total = calculateTotal(stored.items);
        localStorage.setItem("guestCart", JSON.stringify(stored));
        setCart(stored);
      }
      return true;
    } catch {
      return false;
    }
  };

  const removeFromCart = async (id) => {
    if (!user) {
      const newItems = cart.items.filter((i) => i._id !== id);
      const newCart = { items: newItems, total: calculateTotal(newItems) };
      setCart(newCart);
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      return;
    }

    try {
      setLoading(true);
      const res = await axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });
      const d = res.data;
      if (d.items && d.total !== undefined) setCart(d);
      else if (Array.isArray(d)) setCart({ items: d, total: calculateTotal(d) });
    } catch (err) {
      setError(err.response?.data?.error || "Remove failed");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem("guestCart");
      setCart({ items: [], total: 0 });
      return;
    }

    try {
      setLoading(true);
      await axios.delete(BASE_URL, { withCredentials: true });
      setCart({ items: [], total: 0 });
    } catch (err) {
      setError(err.response?.data?.error || "Clear failed");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, qty) => {
    if (!user) {
      const newItems = cart.items.map((i) => (i._id === id ? { ...i, quantity: qty } : i));
      const newCart = { items: newItems, total: calculateTotal(newItems) };
      setCart(newCart);
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/${id}`,        // ✅ Corrected: Send productId in URL
        { quantity: qty },          // ✅ Only send quantity in body
        { withCredentials: true }
      );
      const d = res.data;
      if (d.items && d.total !== undefined) setCart(d);
      else if (Array.isArray(d)) setCart({ items: d, total: calculateTotal(d) });
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");  // ✅ Corrected key
    } finally {
      setLoading(false);
    }
  };

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
