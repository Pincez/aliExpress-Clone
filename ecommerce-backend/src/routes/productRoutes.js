const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct } = require('../controllers/productController');

// Get all products
router.get('/', getAllProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Create a new product
router.post('/', createProduct);

module.exports = router;
