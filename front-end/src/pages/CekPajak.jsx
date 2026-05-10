import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CekPajak.css';

const CekPajak = () => {
  const navigate = useNavigate();
  const [platNomor, setPlatNomor] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasilPajak, setHasilPajak] = useState(null);

  const handleCekPajak = (e) => {
    e.preventDefault();
    setLoading(true);
    setHasilPajak(null);

    // Simulasi loading nembak API backend (selama 1.5 detik)
    setTimeout(() => {
      setLoading(false);
      // Mockup data kembalian dari database
      setHasilPajak({
        nopol: platNomor.toUpperCase(),
        pemilik: 'Hamba Allah',
        merek: 'HONDA VARIO 150',
        tahun: 2021,
        pajakPokok: 'Rp 250.000',
        swdkllj: 'Rp 35.000',
        denda: 'Rp 0',
        total: 'Rp 285.000',
        status: 'AKTIF',
        jatuhTempo: '15 Agustus 2026'
      });
    }, 1500);
  };

  return (
    <div className="cek-pajak-wrapper">
      <nav className="navbar navbar-alt">
        <div className="nav-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <span className="logo-text">SIPAKAT</span>
        </div>
        <button className="btn-back" onClick={() => navigate('/')}>← Kembali</button>
      </nav>

      <main className="cek-pajak-content">
        <div className="header-text">
          <p className="subtitle">Layanan Mandiri</p>
          <h1 className="title">Cek Pajak Kendaraan</h1>
          <p className="description">Masukkan nomor polisi kendaraan Anda untuk melihat rincian tagihan pajak secara real-time.</p>
        </div>

        <form onSubmit={handleCekPajak} className="search-form">
          <input 
            type="text" 
            placeholder="Contoh: DP 1234 XY" 
            value={platNomor}
            onChange={(e) => setPlatNomor(e.target.value)}
            required
            className="input-plat"
          />
          <button type="submit" className="btn-search">
            {loading ? 'Mencari...' : 'Cek Sekarang'}
          </button>
        </form>

        {/* Kartu Hasil Pencarian (Muncul setelah tombol diklik) */}
        {hasilPajak && (
          <div className="result-card fade-in">
            <div className="result-header">
              <h2>{hasilPajak.nopol}</h2>
              <span className={`status-badge ${hasilPajak.status === 'AKTIF' ? 'active' : ''}`}>
                {hasilPajak.status}
              </span>
            </div>
            
            <div className="result-details">
              <div className="detail-item">
                <span className="label">Merek/Tipe</span>
                <span className="value">{hasilPajak.merek} ({hasilPajak.tahun})</span>
              </div>
              <div className="detail-item">
                <span className="label">Jatuh Tempo</span>
                <span className="value highlight">{hasilPajak.jatuhTempo}</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="result-billing">
              <div className="bill-row">
                <span>PKB (Pajak Kendaraan Bermotor)</span>
                <span>{hasilPajak.pajakPokok}</span>
              </div>
              <div className="bill-row">
                <span>SWDKLLJ</span>
                <span>{hasilPajak.swdkllj}</span>
              </div>
              <div className="bill-row">
                <span>Denda</span>
                <span>{hasilPajak.denda}</span>
              </div>
              <div className="divider"></div>
              <div className="bill-row total">
                <span>Total Tagihan</span>
                <span>{hasilPajak.total}</span>
              </div>
            </div>

            <button className="btn-action" onClick={() => navigate('/login')}>
              Lanjut Ambil Antrean SAMSAT
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CekPajak;