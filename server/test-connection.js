require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ephemeral-chat';
    await mongoose.connect(uri);
    console.log("MongoDB connection successful!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

testConnection();
