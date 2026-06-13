const Kendaraan = require('../models/Kendaraan');

const getKendaraan = async (req, res) => {
    try {
        const results = await Kendaraan.findAll();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FITUR BARU: Cari kendaraan cuma 1 data berdasarkan plat nomor (Solusi Data Leak)
const cekKendaraanByPlat = async (req, res) => {
    try {
        const { plat_nomor } = req.params;
        const kendaraan = await Kendaraan.findOne({ 
            where: { plat_nomor } 
        });

        if (!kendaraan) {
            return res.status(404).json({ message: "Kendaraan tidak ditemukan" });
        }
        res.json(kendaraan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const tambahKendaraan = async (req, res) => {
    try {
        const { plat_nomor, nama_pemilik, merek_kendaraan, tahun_kendaraan, total_pajak, tanggal_jatuh_tempo, status_pajak } = req.body;

        // Simpan hasil create ke variabel 'kendaraanBaru'
        const kendaraanBaru = await Kendaraan.create({
            plat_nomor, nama_pemilik, merek_kendaraan, tahun_kendaraan, total_pajak, tanggal_jatuh_tempo,
            status_pajak: status_pajak || 'Belum Lunas'
        });

        // Kirim balik datanya biar 'kendaraanIdDummy' di test lu terisi
        res.status(201).json({ 
            message: "Data kendaraan berhasil ditambahkan, Bos!",
            data: kendaraanBaru 
        });
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
        const { plat_nomor, nama_pemilik, merek_kendaraan, tahun_kendaraan, total_pajak, tanggal_jatuh_tempo, status_pajak } = req.body;

        const [updatedRows] = await Kendaraan.update({
            plat_nomor, nama_pemilik, merek_kendaraan, tahun_kendaraan, total_pajak, tanggal_jatuh_tempo, status_pajak
        }, { where: { id } });

        if (updatedRows === 0) {
            return res.status(404).json({ error: "Gagal update! Data tidak ditemukan." });
        }
        res.json({ message: "Data kendaraan berhasil diperbarui!" });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Gagal update! Plat nomor ini sudah dipakai kendaraan lain." });
        }
        res.status(500).json({ error: error.message });
    }
};

// FITUR BARU: Hapus Data
const hapusKendaraan = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Kendaraan.destroy({ where: { id } });
        
        if (deletedRows === 0) {
            return res.status(404).json({ error: "Gagal hapus! Data tidak ditemukan." });
        }
        res.json({ message: "Data kendaraan berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
  getKendaraan, 
  tambahKendaraan,
  cekKendaraanByPlat,  
  updateKendaraan, // <-- Tambah ini
  hapusKendaraan   // <-- Tambah ini
};