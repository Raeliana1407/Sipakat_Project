const express = require('express');
const router = express.Router();
const { getKendaraan, tambahKendaraan, updateKendaraan, hapusKendaraan, cekKendaraanByPlat } = require('../controllers/kendaraanController');

const verifyToken = require('../middlewares/authMiddleware');
const { validasiKendaraan } = require('../middlewares/validatorMiddleware');

router.get('/', getKendaraan);
router.get('/cek/:plat_nomor', cekKendaraanByPlat);

// Middleware Authentication dan Validation dipasang di sini
router.post('/', verifyToken, validasiKendaraan, tambahKendaraan);
router.put('/:id', verifyToken, updateKendaraan);
router.delete('/:id', verifyToken, hapusKendaraan);

module.exports = router;