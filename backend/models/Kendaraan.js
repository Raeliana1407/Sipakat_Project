const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kendaraan = sequelize.define('Kendaraan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    plat_nomor: { type: DataTypes.STRING, allowNull: false, unique: true },
    nama_pemilik: { type: DataTypes.STRING, allowNull: false },
    merek_kendaraan: { type: DataTypes.STRING, allowNull: false },
    tahun_kendaraan: { type: DataTypes.INTEGER, allowNull: false },
    total_pajak: { type: DataTypes.INTEGER, allowNull: false },
    tanggal_jatuh_tempo: { type: DataTypes.DATEONLY, allowNull: false },
    status_pajak: { type: DataTypes.STRING, defaultValue: 'Belum Lunas' }
}, {
    tableName: 'kendaraan',
    timestamps: false
});

module.exports = Kendaraan;