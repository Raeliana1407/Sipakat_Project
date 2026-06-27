const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sipakat_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Mantap! Sequelize berhasil nyambung ke Laragon SIPAKAT 🚀');
    } catch (error) {
        console.error('Waduh Bro, gagal konek:', error);
    }
};

// CUMA JALANIN KONEKSI KALAU BUKAN MODE TEST
if (process.env.NODE_ENV !== 'test') {
    testConnection();
}

module.exports = sequelize;