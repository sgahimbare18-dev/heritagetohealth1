const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = 'process.env.MONGO_URI';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected to Atlas database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
