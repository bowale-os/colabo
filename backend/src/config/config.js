require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET, // add more as needed
};
