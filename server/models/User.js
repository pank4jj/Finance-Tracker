const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Extended profile fields
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', ''],
    default: '',
  },
  dob: {
    type: String, // stored as YYYY-MM-DD string for simplicity
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
