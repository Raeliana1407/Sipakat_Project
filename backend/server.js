const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Tambahan Helmet
const rateLimit = require('express-rate-limit'); // Tambahan Rate Limit
const db = require('./config/database'); 

// Import rute
const antreanRoutes = require('./routes/antreanRoutes'); 
const authRoutes = require('./routes/authRoutes');
const kendaraanRoutes = require('./routes/kendaraanRoutes');

const app = express();
const PORT = 5000;

// 1. Implementasi Helmet (Mengamankan HTTP Headers)
app.use(helmet()); 

app.use(cors());
app.use(express.json());

// 2. Implementasi Express Rate Limit (Mencegah Spam/DDoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Waktu 15 menit
    max: 100, // Batas maksimal 100 request per IP dalam 15 menit
    message: { error: "Terlalu banyak request dari IP ini, coba lagi dalam 15 menit." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Terapkan limiter ke semua route API
app.use('/api', limiter);

// Daftarin alamat URL utama
app.use('/api/antrean', antreanRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/kendaraan', kendaraanRoutes);

app.get('/', (req, res) => {
    res.send('Halo Bro! Backend SIPAKAT sudah menyala 🔥');
});

db.sync({ force: false }) 
  .then(() => {
    console.log('Database tersinkronisasi via Sequelize!');
    // Server baru jalan kalau database udah fix nyambung
    if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => {
            console.log(`Server SIPAKAT berjalan di http://localhost:${PORT}`);
        });
    }
  })
  .catch(err => {
    console.error('Waduh, gagal sinkronisasi database:', err);
  });

// WAJIB ADA DI BARIS PALING AKHIR BIAR BISA DI-IMPORT OLEH FILE TEST
module.exports = app;