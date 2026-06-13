import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CekPajak.css';

const CekPajak = () => {
  const navigate = useNavigate();
  const [platNomor, setPlatNomor] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasilPajak, setHasilPajak] = useState(null);

  // --- STATE BARU BUAT POP-UP ANTREAN ---
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [nomorTiket, setNomorTiket] = useState(null);
  const [isLoadingAntrean, setIsLoadingAntrean] = useState(false);
  const [layananTerpilih, setLayananTerpilih] = useState('Pajak Tahunan');

  const handleCekPajak = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasilPajak(null);

    try {
      // Narik spesifik 1 data dari endpoint yang baru kita bikin
      const response = await axios.get(`http://localhost:5000/api/kendaraan/cek/${platNomor}`);
      const kendaraanDitemukan = response.data;

      // Format rupiah biar rapi
      const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
      
      const pajakPokok = Number(kendaraanDitemukan.total_pajak);
      const swdkllj = 35000;
      const denda = 0; 
      const totalTagihan = pajakPokok + swdkllj + denda;

      setHasilPajak({
        nopol: kendaraanDitemukan.plat_nomor,
        pemilik: kendaraanDitemukan.nama_pemilik,
        merek: kendaraanDitemukan.merek_kendaraan,
        tahun: kendaraanDitemukan.tahun_kendaraan,
        pajakPokok: formatRupiah(pajakPokok),
        swdkllj: formatRupiah(swdkllj),
        denda: formatRupiah(denda),
        total: formatRupiah(totalTagihan),
        status: kendaraanDitemukan.status_pajak || 'Belum Lunas',
        jatuhTempo: new Date(kendaraanDitemukan.tanggal_jatuh_tempo).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      });

    } catch (error) {
      if (error.response && error.response.status === 404) {
         alert('Data kendaraan dengan Plat Nomor tersebut tidak ditemukan di sistem.');
      } else {
         console.error('Gagal narik data kendaraan:', error);
         alert('Terjadi kesalahan sistem saat mengecek pajak. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI BUAT NYETAK ANTREAN ---
  const handleAmbilAntrean = async () => {
    setIsLoadingAntrean(true);
    
    let kodeLoket = 'A';
    if (layananTerpilih === 'Pajak 5 Tahunan (Ganti Plat)') kodeLoket = 'B';
    if (layananTerpilih === 'Balik Nama / Mutasi') kodeLoket = 'C';
    if (layananTerpilih === 'Pengambilan STNK / TNKB') kodeLoket = 'D';

    try {
      const response = await axios.post('http://localhost:5000/api/antrean', {
        layanan: `${layananTerpilih} (Self-Service)`,
        kode_loket: kodeLoket 
      });
      setNomorTiket(response.data.nomor_antrean);
    } catch (error) {
      alert('Maaf, sistem antrean sedang sibuk. Coba lagi nanti!');
    } finally {
      setIsLoadingAntrean(false);
    }
  };

  const handleCloseModal = () => {
    setIsTicketModalOpen(false);
    setNomorTiket(null);
    setLayananTerpilih('Pajak Tahunan'); 
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

        {/* Kartu Hasil Pencarian */}
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

            {/* --- TOMBOL UNTUK BUKA MODAL --- */}
            <button className="btn-action" onClick={() => setIsTicketModalOpen(true)}>
              Lanjut Ambil Antrean SAMSAT
            </button>
          </div>
        )}
      </main>

      {/* --- MODAL POP-UP ANTREAN --- */}
      {isTicketModalOpen && (
        <div className="modal-overlay">
          <div className="ticket-card">
            
            {!nomorTiket ? (
              <>
                <h3>Ambil Nomor Antrean</h3>
                <p className="ticket-info">Silakan pilih jenis layanan SAMSAT yang Anda butuhkan hari ini.</p>
                
                <div className="ticket-select-group">
                  <label>Jenis Layanan:</label>
                  <select 
                    className="ticket-select" 
                    value={layananTerpilih} 
                    onChange={(e) => setLayananTerpilih(e.target.value)}
                  >
                    <option value="Pajak Tahunan">Pajak Tahunan (Pengesahan STNK)</option>
                    <option value="Pajak 5 Tahunan (Ganti Plat)">Pajak 5 Tahunan (Ganti Plat)</option>
                    <option value="Balik Nama / Mutasi">Balik Nama / Mutasi Kendaraan</option>
                    <option value="Pengambilan STNK / TNKB">Pengambilan STNK / TNKB</option>
                  </select>
                </div>
                
                <button 
                  className="btn-ticket-action" 
                  onClick={handleAmbilAntrean}
                  disabled={isLoadingAntrean}
                >
                  {isLoadingAntrean ? 'Mencetak...' : 'Cetak Tiket Antrean'}
                </button>
                
                <button className="btn-close-ticket" onClick={handleCloseModal}>Batal</button>
              </>
            ) : (
              <>
                <h3>Tiket Anda</h3>
                <p className="ticket-info">Harap screenshot atau ingat nomor ini.</p>
                
                <div className="ticket-number">
                  {nomorTiket}
                </div>
                
                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '10px' }}>
                  Layanan: <strong style={{color: 'white'}}>{layananTerpilih}</strong>
                </p>
                
                <p style={{ color: '#34d399', fontWeight: 'bold', marginBottom: '20px' }}>
                  ✓ Berhasil dicetak!
                </p>
                
                <button 
                  className="btn-ticket-action" 
                  onClick={() => {
                    navigate('/tunggu-antrean', { 
                      state: { nomor: nomorTiket, layanan: layananTerpilih } 
                    });
                  }}
                >
                  Pantau Status Antrean
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default CekPajak;