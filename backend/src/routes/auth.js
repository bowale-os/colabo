// src/routes/auth.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');

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

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 // 1 hour
    });

    // Send success response
    res.status(200).json({ 
      message: 'Login successful'
      // user: {
      //   id: user._id,
      //   name: user.name,
      //   email: user.email
      // }
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
            return res.status(400).json({ error: 'You have an account with us, please log in.' });
        }

        console.log('checked existing user!')

        const user = new User({name, email, password });
        await user.save(); //hashes password name and makes object;

        console.log('saved user and password!')

        //generate jwt token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 // 1 hour
        });

        // Send success response
        res.status(201).json({ 
          message: 'Registration successful',
          // user: {
          //   id: user._id,
          //   name: user.name,
          //   email: user.email
          // }
        });
    } catch (err){
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

//add blacklist later
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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