const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET in environment variables');

// Helper function for error responses
const errorResponse = (res, status, message, error = null) => {
  if (error) console.error(message, error);
  return res.status(status).json({ 
    success: false,
    message,
    ...(error && { error: error.message })
  });
};

// Signup
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', { errors: errors.array() });
    }

    const { name, email, password } = req.body;

    if (await User.exists({ email })) {
      return errorResponse(res, 409, 'User already exists');
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800000 // 7 days
    });

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token,
      message: "Signup successful"
    });

  } catch (err) {
    return errorResponse(res, 500, 'Signup failed', err);
  }
});

// Login
router.post('/login', [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', { errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800000 // 7 days
    });

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token,
      message: "Login successful"
    });

  } catch (err) {
    return errorResponse(res, 500, 'Login failed', err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

// Get current user (using protect middleware)
router.get('/me', protect, async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (err) {
    return errorResponse(res, 500, 'Failed to fetch user', err);
  }
});

module.exports = router;