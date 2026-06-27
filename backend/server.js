const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit'); 
const db = require('./config/database'); 

// Import rute
const antreanRoutes = require('./routes/antreanRoutes'); 
const authRoutes = require('./routes/authRoutes');
const kendaraanRoutes = require('./routes/kendaraanRoutes');

const app = express();
const PORT = 5000;

app.use(helmet()); 
app.use(cors());
app.use(express.json());

// Limiter cuma nyala kalau BUKAN mode test
if (process.env.NODE_ENV !== 'test') {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, 
        max: 100, 
        message: { error: "Terlalu banyak request dari IP ini, coba lagi dalam 15 menit." },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api', limiter);
}

// Daftarin alamat URL utama
app.use('/api/antrean', antreanRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/kendaraan', kendaraanRoutes);

app.get('/', (req, res) => {
    res.send('Halo Bro! Backend SIPAKAT sudah menyala 🔥');
});

// KUNCI UTAMA: Database cuma sinkron dan server cuma listen kalau BUKAN test
if (process.env.NODE_ENV !== 'test') {
    db.sync({ force: false }) 
      .then(() => {
        console.log('Database tersinkronisasi via Sequelize!');
        app.listen(PORT, () => {
            console.log(`Server SIPAKAT berjalan di http://localhost:${PORT}`);
        });
      })
      .catch(err => {
        console.error('Waduh, gagal sinkronisasi database:', err);
      });
}

// WAJIB ADA DI BARIS PALING AKHIR
module.exports = app;