const express = require("express");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

const Product = require("../models/Product");
const ProductInteraction = require("../models/productInteractions");

const router = express.Router();

// --- Rate Limiter ---
const interactionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many requests, please try again later"
  },
  skipFailedRequests: true
});

// --- Validation Rules ---
const validateInteraction = [
  check("comment").optional().isLength({ max: 500 }),
  check("rating").isInt({ min: 1, max: 5 }),
  check("userName").notEmpty()
];

// --- Helpers ---
function notFound(res) {
  return res.status(404).json({
    success: false,
    message: "Product not found"
  });
}

function handleError(res, error, context) {
  console.error(`Error ${context}:`, error.message || error);
  res.status(500).json({
    success: false,
    message: `Server error while ${context}`
  });
}

async function updateProductRating(productId) {
  const result = await ProductInteraction.aggregate([
    { $match: { productId } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } }
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(result[0].averageRating.toFixed(1))
    });
  }
}

// --- Routes ---

// GET all products with pagination and filters
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filters).skip(skip).limit(limit),
      Product.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    handleError(res, error, "fetching products");
  }
});

// GET products by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ category }).skip(skip).limit(limit),
      Product.countDocuments({ category })
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    handleError(res, error, "fetching products by category");
  }
});

// GET single product by _id
router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(_id);
    if (!product) return notFound(res);

    res.json({ success: true, data: product });
  } catch (error) {
    handleError(res, error, "fetching product");
  }
});

// POST a product interaction (rating/comment)
router.post("/:id/interactions",
  interactionLimiter,
  validateInteraction,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, message: "Invalid product ID" });
      }

      const product = await Product.findById(id);
      if (!product) return notFound(res);

      const interaction = new ProductInteraction({
        productId: product._id,
        userId: req.user.id, // assuming user is available from auth middleware
        ...req.body
      });

      await interaction.save();
      res.status(201).json({ success: true, data: interaction });
    } catch (error) {
      handleError(res, error, "adding interaction");
    }
  }
);

// GET product interactions
router.get("/:id/interactions", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, type } = req.query;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const filter = { productId: id };

    if (type) {
      filter.interactionType = type;
    } else {
      filter.interactionType = { $in: ['review', 'rating'] };
    }

    const interactions = await ProductInteraction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ProductInteraction.countDocuments(filter);

    res.status(200).json({
      success: true,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalInteractions: total,
      data: interactions
    });
  } catch (error) {
    handleError(res, error, "fetching interactions");
  }
});

// GET product search suggestions
router.get("/suggestions", async (req, res) => {
  const query = req.query.q?.trim();
  if (!query || query.length < 2) {
    return res.status(200).json([]); // ✅ graceful fallback
  }
  

  try {
    const regex = new RegExp(query, "i");

    const suggestions = await Product.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: regex } },
            { category: { $regex: regex } },
            { subCategory: { $regex: regex } }
          ]
        }
      },
      {
        $project: {
          name: 1,
          image: 1,
          category: 1,
          subCategory: 1,
          score: {
            $cond: [{ $regexMatch: { input: "$name", regex: regex } }, 3,
              { $cond: [{ $regexMatch: { input: "$category", regex: regex } }, 2, 1] }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ]);

    res.json(suggestions);
  } catch (error) {
    handleError(res, error, "fetching suggestions");
  }
});

module.exports = router;
