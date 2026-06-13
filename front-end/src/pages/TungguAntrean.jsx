import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TungguAntrean.css';

const TungguAntrean = () => {
  const navigate = useNavigate();
  
  // Baca dari localStorage, biarkan isi 'null' kalau dia belum pernah ambil tiket
  const [tiketData, setTiketData] = useState(() => {
    const savedTiket = localStorage.getItem('tiket_sipakat');
    return savedTiket ? JSON.parse(savedTiket) : null;
  });

  const [antreanSaatIni, setAntreanSaatIni] = useState('-');
  const [sisaAntrean, setSisaAntrean] = useState('-');
  const [status, setStatus] = useState('Menunggu');

  useEffect(() => {
    const fetchStatusReal = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/antrean');
        const semuaAntrean = response.data;
        
        if (semuaAntrean.length === 0) {
            setAntreanSaatIni('-');
            return;
        }

        // Cari siapa yang lagi dilayani di loket saat ini
        const ygLagiDipanggil = semuaAntrean.filter(item => item.status === 'Dipanggil');
        if (ygLagiDipanggil.length > 0) {
          setAntreanSaatIni(ygLagiDipanggil[ygLagiDipanggil.length - 1].nomor_antrean);
        } else {
          const ygSelesai = semuaAntrean.filter(item => item.status === 'Selesai');
          if (ygSelesai.length > 0) {
            setAntreanSaatIni(ygSelesai[ygSelesai.length - 1].nomor_antrean);
          } else {
            setAntreanSaatIni('-'); 
          }
        }

        // Hitung sisa antrean HANYA JIKA user ini punya tiket
        if (tiketData) {
          const dataUserDb = semuaAntrean.find(item => item.nomor_antrean === tiketData.nomor);
          if (dataUserDb) {
             setStatus(dataUserDb.status); 
             const ygNganggur = semuaAntrean.filter(item => 
                item.status === 'Menunggu' && item.id < dataUserDb.id
             );
             setSisaAntrean(ygNganggur.length);
          }
        }
        
      } catch (error) {
        console.error("Gagal nyambung ke database:", error);
      }
    };

    fetchStatusReal(); 
    const polling = setInterval(fetchStatusReal, 3000); 

    return () => clearInterval(polling);
  }, [tiketData]);

  // Fungsi untuk reset tiket dan ubah mode layar
  const handleTutupTiket = () => {
    localStorage.removeItem('tiket_sipakat');
    setTiketData(null); // Ubah state jadi null, UI otomatis ganti ke mode 'Belum ada tiket'
  };

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
          
          {/* KARTU 1: NOMOR ANDA (Bisa Dinamis) */}
          <div className="status-card highlight-card">
            <h3>Nomor Anda</h3>
            
            <div className="nomor-besar highlight">{tiketData ? tiketData.nomor : '-'}</div>
            <p className="layanan-text">{tiketData ? tiketData.layanan : 'Anda belum mengambil tiket'}</p>
            
            {tiketData ? (
              // Kalau ada tiket, munculin statusnya (Menunggu/Menuju Loket)
              <div className={`badge-status ${status === 'Menunggu' ? 'waiting' : 'ready'}`}>
                {status === 'Dipanggil' ? 'Menuju Loket' : status}
              </div>
            ) : (
              // Kalau nggak ada tiket, kasih tombol buat balik ke depan biar bisa ngambil
              <button 
                onClick={() => navigate('/')} 
                style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#D4AF37', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Ambil Tiket Sekarang
              </button>
            )}
          </div>

          {/* KARTU 2: SEDANG DILAYANI */}
          <div className="status-card">
            <h3>Sedang Dilayani (Loket A)</h3>
            <div className="nomor-besar">{antreanSaatIni}</div>
            <div className="info-tambahan">
              <div className="info-box">
                <span className="label">Sisa Depan Anda</span>
                {/* Hanya tampilkan angka kalau dia punya tiket */}
                <span className="value">{tiketData ? (status === 'Selesai' ? '0' : sisaAntrean) : '-'} Orang</span>
              </div>
              <div className="info-box">
                <span className="label">Estimasi Waktu</span>
                <span className="value">{tiketData ? (status === 'Selesai' ? '0' : sisaAntrean * 5) : '-'} Menit</span>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* ALERT: Muncul Pas Dipanggil */}
        {tiketData && status === 'Dipanggil' && (
          <div className="alert-ready" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(46, 204, 113, 0.15)', border: '1px solid #2ecc71', borderRadius: '8px', textAlign: 'center' }}>
            <strong>Giliran Anda tiba!</strong> Silakan segera menuju ke Loket Pelayanan.
          </div>
        )}
        
        {/* ALERT: Muncul Pas Selesai */}
        {tiketData && status === 'Selesai' && (
          <div className="alert-ready" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(107, 114, 128, 0.15)', border: '1px solid #6b7280', color: '#aaa', borderRadius: '8px', textAlign: 'center' }}>
            Pelayanan untuk nomor antrean Anda sudah <strong>Selesai</strong>. Terima kasih.
            <br/><br/>
            <button 
              onClick={handleTutupTiket} 
              style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Hapus Tiket Anda
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TungguAntrean;