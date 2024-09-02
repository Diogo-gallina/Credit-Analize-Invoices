import dotenv from 'dotenv';

dotenv.config();

export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/credit-analyze-invoice',
  port: process.env.PORT || 8080,
};
