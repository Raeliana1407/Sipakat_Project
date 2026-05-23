const Kendaraan = require('../models/Kendaraan');

const getKendaraan = async (req, res) => {
    try {
        const results = await Kendaraan.findAll();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const tambahKendaraan = async (req, res) => {
    try {
        const { plat_nomor, nama_pemilik, merek_kendaraan, tahun_kendaraan, total_pajak, tanggal_jatuh_tempo } = req.body;

        await Kendaraan.create({
            plat_nomor, nama_pemilik, merek_kendaraan, tahun_kendaraan, total_pajak, tanggal_jatuh_tempo,
            status_pajak: 'Belum Lunas'
        });

        res.json({ message: "Data kendaraan berhasil ditambahkan, Bos!" });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Plat nomor ini sudah terdaftar di sistem!" });
        }
        res.status(500).json({ error: error.message });
    }
};
const updateKendaraan = async (req, res) => {
    try {
        const { id } = req.params;
        await Kendaraan.update(req.body, { where: { id } });
        res.json({ message: "Data kendaraan berhasil diperbarui!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FITUR BARU: Hapus Data
const hapusKendaraan = async (req, res) => {
    try {
        const { id } = req.params;
        await Kendaraan.destroy({ where: { id } });
        res.json({ message: "Data kendaraan berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
  getKendaraan, 
  tambahKendaraan,  
  updateKendaraan, // <-- Tambah ini
  hapusKendaraan   // <-- Tambah ini
};