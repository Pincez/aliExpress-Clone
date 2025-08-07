const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware to verify if the user is authenticated
const protect = async (req, res, next) => {
  try {
    // Check if token is provided either in cookies or in the Authorization header
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated. No token found' });
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID and exclude the password field
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    
    // Handle token expiration or invalid token errors
    res.status(401).json({
      error: 'Invalid or expired token',
      message: err.message
    });
  }
};

module.exports = { protect };
