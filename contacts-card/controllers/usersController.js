const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//@desc Register the user
//@route POST /api/v1/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }
  const userAvailabel = await User.findOne({ email });
  if (userAvailabel) {
    res.status(400);
    throw new Error('The user with this email is already register.');
  }

  // hashed Password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    userName,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      userName: user.userName,
      message: 'Registration successfull',
    });
  } else {
    res.status(400);
    throw new Error('User data is not valid');
  }
});

//@desc login the user
//@route POST /api/v1/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  const user = await User.findOne({ email });

  //   compairing password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          userName: user.userName,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '3000m' }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error('Email or password is not valid');
  }
});

//@desc Get Current user Details
//@route GET /api/v1/users/current
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
