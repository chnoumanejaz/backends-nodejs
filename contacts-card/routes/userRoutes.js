const express = require('express');
const {
  registerUser,
  currentUser,
  loginUser,
} = require('../controllers/usersController');
const validationToken = require('../middleware/validateTokenHandler');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/current', validationToken, currentUser);

module.exports = router;
