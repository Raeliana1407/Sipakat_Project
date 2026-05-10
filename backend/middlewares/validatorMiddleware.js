const { body, validationResult } = require('express-validator');

const validasiKendaraan = [
    body('plat_nomor')
        .notEmpty().withMessage('Plat nomor tidak boleh kosong!')
        .isString().withMessage('Format plat nomor harus berupa teks.')
        .trim().escape(), 

    body('nama_pemilik')
        .notEmpty().withMessage('Nama pemilik wajib diisi!')
        .trim().escape(),

    body('merek_kendaraan')
        .notEmpty().withMessage('Merek kendaraan wajib diisi!')
        .trim().escape(),

    body('tahun_kendaraan')
        .isNumeric().withMessage('Tahun kendaraan harus berupa angka!')
        .toInt(),

    body('total_pajak')
        .isNumeric().withMessage('Total pajak harus berupa angka!')
        .toInt(),

    body('tanggal_jatuh_tempo')
        .notEmpty().withMessage('Tanggal jatuh tempo wajib diisi!')
        .trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validasiKendaraan };