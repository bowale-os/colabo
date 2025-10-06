const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  let token;

  // Check for token in HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      error: 'There is no active session, please log in or create an account'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request (exclude password)
    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) {
      return res.status(401).json({
        error: 'There is no active session, please log in or create an account'
      });
    }

    next();
  } catch (err) {
    res.status(401).json({
      error: 'There is no active session, please log in or create an account'
    });
  }
};

module.exports = authMiddleware;
