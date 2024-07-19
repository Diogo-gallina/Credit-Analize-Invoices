import dotenv from 'dotenv';

dotenv.config();

export default {
  mongoUrl: process.env.MONGO_URL,
  port: process.env.PORT || 8080,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
};
