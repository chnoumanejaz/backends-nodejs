const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'Please enter the user name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter the email Address'],
      unique: [true, 'This email is already taken.'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password.'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
