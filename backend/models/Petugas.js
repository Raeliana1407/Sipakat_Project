const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Petugas = sequelize.define('Petugas', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    nama_lengkap: { type: DataTypes.STRING, allowNull: true },
    kode_loket: { type: DataTypes.STRING(10) }
}, {
    tableName: 'petugas',
    timestamps: false
});

module.exports = Petugas;