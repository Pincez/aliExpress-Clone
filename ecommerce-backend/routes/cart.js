const express = require("express");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();

// Middleware to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Middleware to validate cart item input (for POST only)
const validateCartItem = (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ error: "Invalid productId" });
  }

  if (quantity !== undefined && (typeof quantity !== "number" || quantity < 1)) {
    return res.status(400).json({ error: "Quantity must be a positive number" });
  }

  next();
};

// Calculate total helper
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + ((item.productId?.price || item.price) * item.quantity);
  }, 0);
};

// Format cart response helper
const formatCartResponse = (cart) => {
  const items = cart.items.map((item) => ({
    ...item.toObject(),
    price: item.productId?.price || item.price,
    name: item.productId?.name || item.name,
    image: item.productId?.image || item.image,
  }));
  return { items, total: calculateTotal(items) };
};

// GET: Fetch user's cart
router.get("/", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const cart = await Cart.findOne({ userId }).populate("items.productId", "name price image");
    if (!cart) return res.json({ items: [], total: 0 });

    res.json(formatCartResponse(cart));
  } catch (error) {
    console.error("Cart fetch error:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST: Add or increment item in cart
router.post("/", validateCartItem, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      });
    }

    await cart.save();
    await cart.populate("items.productId", "name price image");
    res.json(formatCartResponse(cart));
  } catch (error) {
    console.error("Cart add error:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// PUT: Update quantity of specific item
router.put("/:productId", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be a positive number" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId", "name price image");

    res.json(formatCartResponse(cart));
  } catch (error) {
    console.error("Cart update error:", error);
    res.status(500).json({ error: "Failed to update cart item quantity" });
  }
});

// DELETE: Remove item from cart
router.delete("/:productId", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    if (cart.items.length === initialLength) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    await cart.save();
    await cart.populate("items.productId", "name price image");

    res.json(formatCartResponse(cart));
  } catch (error) {
    console.error("Cart remove error:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

// DELETE: Clear entire cart
router.delete("/", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    await Cart.findOneAndDelete({ userId });
    res.json({ items: [], total: 0 });
  } catch (error) {
    console.error("Cart clear error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
