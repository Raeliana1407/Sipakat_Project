const { Sequelize } = require('sequelize');

// Format: Sequelize('nama_database', 'username', 'password', { konfigurasi })
const sequelize = new Sequelize('sipakat_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

// Tes Koneksi
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Mantap! Sequelize berhasil nyambung ke Laragon SIPAKAT 🚀');
    } catch (error) {
        console.error('Waduh Bro, gagal konek:', error);
    }
};

testConnection();

module.exports = sequelize;