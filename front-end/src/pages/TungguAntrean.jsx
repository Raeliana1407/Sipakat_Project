import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './TungguAntrean.css';

const TungguAntrean = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tiketData = location.state || {
    nomor: 'A-001', // Default kalau gak ada data
    layanan: 'Pajak Tahunan'
  };

  const [antreanSaatIni, setAntreanSaatIni] = useState('-');
  const [sisaAntrean, setSisaAntrean] = useState(0);
  const [status, setStatus] = useState('Menunggu');

  // Tarik data asli dari Backend setiap 3 detik
  useEffect(() => {
    const fetchStatusReal = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/antrean');
        const semuaAntrean = response.data;
        
        if (semuaAntrean.length === 0) return;

        // Cari antrean loket yang lagi dilayani (status 'Dipanggil')
        const ygLagiDipanggil = semuaAntrean.filter(item => item.status === 'Dipanggil');
        
        if (ygLagiDipanggil.length > 0) {
          // Ambil yang paling terakhir dipanggil
          setAntreanSaatIni(ygLagiDipanggil[ygLagiDipanggil.length - 1].nomor_antrean);
        } else {
          // Kalau ga ada yang dipanggil, cek yang Selesai
          const ygSelesai = semuaAntrean.filter(item => item.status === 'Selesai');
          if (ygSelesai.length > 0) {
            setAntreanSaatIni(ygSelesai[ygSelesai.length - 1].nomor_antrean);
          } else {
            setAntreanSaatIni('-'); // Belum ada pelayanan mulai
          }
        }

        // Cari data antrean si User ini sendiri dari DB
        const dataUserDb = semuaAntrean.find(item => item.nomor_antrean === tiketData.nomor);
        if (dataUserDb) {
           setStatus(dataUserDb.status); // Kalau admin klik "Panggil", ini jadi "Dipanggil"
           
           // Hitung Sisa Antrean (hitung berapa antrean yang id-nya < id User dan statusnya masih 'Menunggu')
           const ygNganggur = semuaAntrean.filter(item => 
              item.status === 'Menunggu' && item.id < dataUserDb.id
           );
           setSisaAntrean(ygNganggur.length);
        }
        
      } catch (error) {
        console.error("Gagal nyambung ke database:", error);
      }
    };

    fetchStatusReal(); // Tarik pas halaman pertama kali dibuka
    const polling = setInterval(fetchStatusReal, 3000); // Polling setiap 3 detik cek DB!

    return () => clearInterval(polling);
  }, [tiketData.nomor]);

  return (
    <div className="tunggu-wrapper">
      <nav className="navbar-alt">
        <div className="nav-logo">
          <span className="logo-text">SIPAKAT</span>
        </div>
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Kembali ke Beranda
        </button>
      </nav>

      <div className="tunggu-content">
        <div className="tunggu-header">
          <p className="subtitle">Pantauan Real-Time</p>
          <h1 className="title">Status Antrean</h1>
        </div>

        <div className="status-grid">
          <div className="status-card highlight-card">
            <h3>Nomor Anda</h3>
            <div className="nomor-besar highlight">{tiketData.nomor}</div>
            <p className="layanan-text">{tiketData.layanan}</p>
            <div className={`badge-status ${status === 'Menunggu' ? 'waiting' : 'ready'}`}>
              {status === 'Dipanggil' ? 'Menuju Loket' : status}
            </div>
          </div>

          <div className="status-card">
            <h3>Sedang Dilayani (Loket A)</h3>
            <div className="nomor-besar">{antreanSaatIni}</div>
            <div className="info-tambahan">
              <div className="info-box">
                <span className="label">Sisa Antrean Depan Anda</span>
                <span className="value">{status === 'Selesai' ? '0' : sisaAntrean} Orang</span>
              </div>
              <div className="info-box">
                <span className="label">Estimasi Waktu</span>
                <span className="value">{status === 'Selesai' ? '0' : sisaAntrean * 5} Menit</span>
              </div>
            </div>
          </div>
        </div>
        
        {status === 'Dipanggil' && (
          <div className="alert-ready" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(46, 204, 113, 0.15)', border: '1px solid #2ecc71', borderRadius: '8px', width: '100%', textAlign: 'center' }}>
            <strong>Giliran Anda tiba!</strong> Silakan segera menuju ke Loket Pelayanan.
          </div>
        )}
        
        {status === 'Selesai' && (
          <div className="alert-ready" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(107, 114, 128, 0.15)', border: '1px solid #6b7280', color: '#aaa', borderRadius: '8px', width: '100%', textAlign: 'center' }}>
            Pelayanan untuk nomor antrean Anda sudah <strong>Selesai</strong>. Terima kasih.
          </div>
        )}
      </div>
    </div>
  );
};

export default TungguAntrean;