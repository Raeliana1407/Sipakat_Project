const express = require('express');
const router = express.Router();
const { loginPetugas } = require('../controllers/authController');

// URL untuk nembak login
router.post('/login', loginPetugas);

module.exports = router;