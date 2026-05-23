const Antrean = require('../models/Antrean');
const { Op } = require('sequelize');

const getAntrean = async (req, res) => {
    try {
        const results = await Antrean.findAll();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const tambahAntrean = async (req, res) => {
    try {
        const { layanan, kode_loket } = req.body;
        const prefix = kode_loket || 'A';

        // Cari antrean terakhir hari ini
        const lastAntrean = await Antrean.findOne({
            where: { nomor_antrean: { [Op.like]: `${prefix}-%` } },
            order: [['id', 'DESC']]
        });

        let nomorBaru = `${prefix}-001`;

        if (lastAntrean) {
            const nomorTerakhir = lastAntrean.nomor_antrean;
            const angkaTerakhir = parseInt(nomorTerakhir.split('-')[1]);
            const angkaFormat = String(angkaTerakhir + 1).padStart(3, '0');
            nomorBaru = `${prefix}-${angkaFormat}`;
        }

        await Antrean.create({ nomor_antrean: nomorBaru, layanan: layanan || 'Pembayaran Pajak (Manual)', status: 'Menunggu' });

        res.json({ message: "Antrean berhasil dibuat!", nomor_antrean: nomorBaru });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStatusAntrean = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await Antrean.update({ status }, { where: { id } });
        res.json({ message: `Status antrean berhasil diubah jadi ${status}!` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const hapusAntreanSelesai = async (req, res) => {
    try {
        // Hapus semua data antrean (Reset Total)
        await Antrean.destroy({ where: {}, truncate: true });
        res.json({ message: "History antrean berhasil direset total!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAntrean, tambahAntrean, updateStatusAntrean, hapusAntreanSelesai };