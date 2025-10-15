// src/routes/auth.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');


 //generate jwt token
const genAccessToken = (user) => {return jwt.sign(
{ userId: user._id, email: user.email, name: user.name },
process.env.JWT_SECRET,
{ expiresIn: '15m' } // or 10m, keep short as best practice!
)};


 //generate jwt token
const genRefreshToken = (user) => { return jwt.sign(
{ userId: user._id, email: user.email, name: user.name },
process.env.JWT_SECRET,
{ expiresIn: '7d' } // or 10m, keep short as best practice!
)};

router.post('/refresh-token', async (req, res) => {
   // Check for token in HTTP-only cookie
  const refreshToken = req.cookies.refreshToken;
  if  (!refreshToken) {
    return res.status(401).json({ error: 'No token provided.' });
  }
  try {
    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    
    //find user in database
    const user = await User.findById(decodedRefresh.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'user not found.' });
    }

    // Generate new access token
    const accessToken = genAccessToken(user);
    const newRefreshToken = genRefreshToken(user);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });      

    //return only new access token
    return res.json({ accessToken });

  } catch(err){
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
}
});

// Login user and generate JWT token
router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found' });
     
    console.log('found existing user!');

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    console.log('checked password successfully');

    // Generate both tokens
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

    //httponly refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    // Send saccestoken and success response
    res.status(200).json({
    message: 'Login successful',
    accessToken,  // <-- ADD THIS LINE to return JWT token
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
});
} catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', async(req, res) => {
    const { name, email, password } = req.body;
    
    try{
        //check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('stopped existing user!')
            return res.status(400).json({ error: 'You have an account with us, please log in.' });
        }

        console.log('check for an existing user!')

        const user = new User({name, email, password });
        await user.save(); //hashes password name and makes object;

        console.log('saved new user and password!')

        // Refresh Token (long-lived)
        const refreshToken = genRefreshToken(user);
        const accessToken = genAccessToken(user);
        
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send success response
        res.status(201).json({ 
          message: 'Registration successful',
          accessToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
    } catch (err){
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

//add blacklist later
router.post('/logout', (req, res) => {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Immediately expire
    });
    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;


//forgot password
//reset-password
//verify-email
//me
//googlelogin
//googlecallback