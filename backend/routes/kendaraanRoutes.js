const express = require('express');
const router = express.Router();
const { getKendaraan, tambahKendaraan } = require('../controllers/kendaraanController');

const verifyToken = require('../middlewares/authMiddleware');
const { validasiKendaraan } = require('../middlewares/validatorMiddleware');

router.get('/', getKendaraan);

// Middleware Authentication dan Validation dipasang di sini
router.post('/', verifyToken, validasiKendaraan, tambahKendaraan);

module.exports = router;