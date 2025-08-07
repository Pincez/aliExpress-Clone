require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { logRequests, logErrors } = require('./middleware/logger');
const { protect } = require('./middleware/auth');

const cartRoutes = require('./routes/cart');
const searchRoutes = require('./routes/search');
const paymentRoutes = require('./routes/paymentRoutes'); // ✅ M-Pesa + Airtel combined
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const productInteractionRoutes = require('./routes/productInteractions');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ======================
// Logging Config Status
// ======================
console.log('\n⚙️  Environment Variables:', {
  NODE_ENV,
  PORT,
  MONGO_URI: process.env.MONGO_URI ? '✅ SET' : '❌ MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING',
  MPESA_KEY: process.env.DARAJA_CONSUMER_KEY ? '✅ SET' : '❌ MISSING',
  AIRTEL_KEY: process.env.AIRTEL_CLIENT_ID ? '✅ SET' : '❌ MISSING',
});

// ======================
// Middleware
// ======================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(logRequests);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: NODE_ENV === 'production' ? 100 : 1000
});
app.use('/api', limiter);

// ======================
// Database Connection
// ======================
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
    console.log('✅ MongoDB connected successfully');

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    if (!collectionNames.includes('payments')) {
      await mongoose.connection.db.createCollection('payments');
      console.log('✅ Created payments collection');
    }
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// ======================
// Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', protect, cartRoutes);
app.use('/api/product-interactions', productInteractionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes); // ✅ M-Pesa & Airtel unified routes
app.use('/api/orders', orderRoutes);

// Health Check
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    services: {
      database: dbStatus,
      mpesa: !!process.env.MPESA_CONSUMER_KEY,
      airtel: !!process.env.AIRTEL_CLIENT_ID,
      jwt: !!process.env.JWT_SECRET,
    },
    timestamp: new Date().toISOString()
  });
});

// Not Found
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.statusCode || 500;
  const message = NODE_ENV === 'development' ? err.message : 'Server error';
  res.status(statusCode).json({ success: false, error: message });
});
app.use(logErrors);

// ======================
// Server Startup
// ======================
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💳 Payments endpoint: http://localhost:${PORT}/api/payments`);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down gracefully...');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('✅ All connections closed');
        process.exit(0);
      });
    });
  });
};

startServer();
