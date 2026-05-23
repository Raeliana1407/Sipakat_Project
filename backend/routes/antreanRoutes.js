const express = require('express');
const router = express.Router();
const { getAntrean, tambahAntrean, updateStatusAntrean, hapusAntreanSelesai } = require('../controllers/antreanController');

// Kalau ada yang akses GET, panggil getAntrean
router.get('/', getAntrean);

// Kalau ada yang akses POST (ngirim data), panggil tambahAntrean
router.post('/', tambahAntrean);

router.put('/:id', updateStatusAntrean)

router.delete('/reset', hapusAntreanSelesai);

module.exports = router;