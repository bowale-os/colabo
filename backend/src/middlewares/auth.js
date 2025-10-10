const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  //receive access token from http header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ error: 'Access token required' });
      }
    const accessToken = authHeader.split(' ')[1];
     // Check for token in HTTP-only cookie
    try {
      const decodedAccess = jwt.verify(accessToken, process.env.JWT_SECRET);
      //Find user in database
      const user = await User.findById(decodedAccess.userId);
      if (!user) {
        return res.status(401).json({
          error: 'user_not_found', // clear error code
          message: 'No active session. Please log in or create an account.',
        });
      }
      req.user = user;
      req.accessToken = accessToken;
      next();

    } catch(err){
    console.log("middleware error", err);
    return res.status(401).json({ error: 'token_expired', message: 'Session expired. Please log in.' });  
  }
}

module.exports = authMiddleware;
