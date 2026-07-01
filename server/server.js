require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

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
