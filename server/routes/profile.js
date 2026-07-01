const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// All profile routes require authentication
router.use(auth);

// GET /api/profile — fetch current user's full profile
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// PUT /api/profile — update profile fields (name, gender, dob, phone, bio)
router.put('/', async (req, res) => {
  try {
    const { name, gender, dob, phone, bio } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        name: name.trim(),
        gender: gender || '',
        dob: dob || '',
        phone: phone || '',
        bio: bio || '',
      },
      { new: true, select: '-password' }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// PUT /api/profile/password — change password
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password', error: err.message });
  }
});

module.exports = router;
