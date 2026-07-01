const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Start the app and connect to DB (supports an in-memory DB for free local dev)
const startServer = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-tracker';

    if (process.env.USE_IN_MEMORY_DB === 'true') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('Using in-memory MongoDB for development');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    // Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/transactions', require('./routes/transactions'));
    app.use('/api/budgets', require('./routes/budgets'));
    app.use('/api/categories', require('./routes/categories'));
    app.use('/api/profile', require('./routes/profile'));

    // Root route - quick health/info endpoint
    app.get('/', (req, res) => {
      res.send('Finance Tracker API is running. Use /api/health for JSON status.');
    });

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'Server is running' });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Something went wrong', error: err.message });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
