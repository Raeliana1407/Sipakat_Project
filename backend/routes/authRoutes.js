const express = require('express');
const router = express.Router();
// Import fungsi tambahPetugas juga
const { loginPetugas, tambahPetugas } = require('../controllers/authController');

// URL untuk nembak login
router.post('/login', loginPetugas);

// URL baru untuk nambahin admin/petugas
router.post('/register', tambahPetugas);

module.exports = router;