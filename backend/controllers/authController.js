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

module.exports = { loginPetugas };