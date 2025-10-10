const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.get('/me', authMiddleware, async (req, res) => {
  // At this point, req.user is the full user object (without password)
  if (!req.user) return res.status(404).json({ error: 'User not found' });
  res.json({
    "user":req.user});
});

// Update current user's profile
router.put('/update', authMiddleware, async (req, res) => {
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;