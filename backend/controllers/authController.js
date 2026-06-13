const Petugas = require('../models/Petugas');
const jwt = require('jsonwebtoken');

const loginPetugas = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Cari petugas pakai Sequelize
        const user = await Petugas.findOne({ where: { username, password } });

        if (!user) {
            return res.status(401).json({ message: "Username atau Password salah, Bro!" });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, 'rahasia_sipakat_123', { expiresIn: '2h' });

        res.json({ message: "Login Berhasil!", token: token, user: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- TAMBAHIN FUNGSI INI ---
const tambahPetugas = async (req, res) => {
    try {
        const { username, password, nama_lengkap, kode_loket } = req.body;

        // Cek dulu biar nggak ada username yang kembar
        const cekUser = await Petugas.findOne({ where: { username } });
        if (cekUser) {
            return res.status(400).json({ message: "Username sudah terdaftar, pakai yang lain!" });
        }

        // Bikin data admin baru ke database
        const adminBaru = await Petugas.create({
            username,
            password, // Note: Saat ini password tersimpan mentah (plaintext).
            nama_lengkap,
            kode_loket
        });

        res.status(201).json({ message: "Admin/Petugas baru berhasil ditambahkan!", data: adminBaru });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Jangan lupa di-export
module.exports = { loginPetugas, tambahPetugas };