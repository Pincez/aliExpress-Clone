// routes/productInteractions.js

const express = require("express");
const ProductInteraction = require("../models/productInteractions"); // Assuming you have a model for ProductInteraction
const { protect } = require("../middleware/auth");
const router = express.Router();

// Route to create or update a product interaction (like review or rating)
router.post("/", protect, async (req, res) => {
  try {
    const { productId, comment, rating, userName } = req.body;
    if (!productId || !rating) {
      return res.status(400).json({ message: "Product and rating are required." });
    }

    // Check if a review already exists for this product from the user
    let interaction = await ProductInteraction.findOne({ productId, userName });
    if (interaction) {
      interaction.comment = comment || interaction.comment;
      interaction.rating = rating || interaction.rating;
    } else {
      interaction = new ProductInteraction({ productId, comment, rating, userName });
    }

    await interaction.save();
    res.status(201).json(interaction);
  } catch (error) {
    console.error("Error submitting product interaction:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
