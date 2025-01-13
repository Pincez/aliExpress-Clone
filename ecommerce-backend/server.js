const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const userRoutes = require('./routes/userRoutes'); // Assuming you have user routes
const productRoutes = require('./routes/productRoutes');

// Initialize app
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.error(
      'Check if your IP address is whitelisted in MongoDB Atlas and if the connection string is correct.'
    );
    process.exit(1); // Exit the application on a connection error
  });

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API!');
});

// API routes
app.use('/api/users', userRoutes); // User-related endpoints
app.use('/api/products', productRoutes); // Product-related endpoints

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
