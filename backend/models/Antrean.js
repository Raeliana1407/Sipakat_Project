const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Antrean = sequelize.define('Antrean', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nomor_antrean: { type: DataTypes.STRING, allowNull: false },
    layanan: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Menunggu' }
}, {
    tableName: 'antrean',
    timestamps: false
});

module.exports = Antrean;