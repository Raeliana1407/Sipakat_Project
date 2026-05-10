const express = require('express');
const cors = require('cors');
const db = require('./config/database'); 
// Import rute
const antreanRoutes = require('./routes/antreanRoutes'); 
const authRoutes = require('./routes/authRoutes');
const kendaraanRoutes = require('./routes/kendaraanRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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
    app.listen(PORT, () => {
        console.log(`Server SIPAKAT berjalan di http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Waduh, gagal sinkronisasi database:', err);
  });