import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = ({ isLightMode, setIsLightMode }) => {
  const navigate = useNavigate();
  const adaTiketAktif = localStorage.getItem('tiket_sipakat');

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [nomorTiket, setNomorTiket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // STATE BARU: Menyimpan pilihan layanan warga
  const [layananTerpilih, setLayananTerpilih] = useState('Pajak Tahunan');

  const handleAmbilAntrean = async () => {
    setIsLoading(true);
    
    // Logika pembagian loket cerdas ala instansi beneran
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
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsTicketModalOpen(false);
    setNomorTiket(null);
    setLayananTerpilih('Pajak Tahunan'); // Reset ke default
  };

  return (
    <div className={`home-wrapper ${isLightMode ? 'light-theme' : ''}`}>
      {/* SECTION 1: HERO */}
      <div className="hero-section">
        <nav className="navbar">
          <div className="nav-logo">
            <span className="logo-text">SIPAKAT</span>
          </div>
          <ul className="nav-links">
            <li onClick={() => window.scrollTo(0,0)}>Beranda</li>
            <li onClick={() => navigate('/cek-pajak')}>Cek Pajak</li>
            <li onClick={() => navigate('/informasi')}>Informasi</li>
          </ul>
          
          {/* --- TOMBOL TEMA & LOGIN PETUGAS --- */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button 
              onClick={() => setIsLightMode(!isLightMode)} 
              style={{ background: 'transparent', border: 'none', fontSize: '1.3rem', cursor: 'pointer', transition: 'transform 0.2s' }}
              title="Ganti Tema"
            >
              {isLightMode ? '🌙' : '☀️'}
            </button>
            <button className="btn-login" onClick={() => navigate('/login')}>Login Petugas</button>
          </div>
        </nav>

        <main className="hero-content">
          <p className="hero-subtitle">Est. 2026</p>
          <h1 className="hero-title">Layanan SAMSAT<br/>Digital & Terintegrasi</h1>
          
          {/* PEMBARUAN: Tombol bersih tanpa inline style hardcoded */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => navigate('/cek-pajak')}>
              Mulai Cek Pajak ➔
            </button>
            <button className="btn-pantau" onClick={() => navigate('/tunggu-antrean')}>
              Pantau Antrean ➔
            </button>
          </div>
        </main>

        <div className="hero-stats">
          <div className="stat-item"><h2>100%</h2><p>TRANSPARANSI</p></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><h2>0 Menit</h2><p>WAKTU TUNGGU</p></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><h2>24/7</h2><p>AKSES MANDIRI</p></div>
        </div>
      </div>

      {/* SECTION 2: DISCOVER / LAYANAN KAMI */}
      <section className="discover-section">
        <p className="section-subtitle">Layanan Unggulan</p>
        <h2 className="section-title">Temukan Kemudahan</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Cek Pajak Online</h3>
            <p>Ketahui rincian tagihan pajak kendaraan Anda secara real-time hanya dengan plat nomor.</p>
            <button className="btn-link" onClick={() => navigate('/cek-pajak')}>Coba Sekarang ➔</button>
          </div>
          <div className="service-card">
            <h3>Reservasi Antrean</h3>
            <p>Ambil nomor antrean dari rumah. Datang sesuai jadwal, hindari penumpukan di loket.</p>
            <button className="btn-link" onClick={() => setIsTicketModalOpen(true)}>Ambil Tiket ➔</button>
          </div>
          <div className="service-card">
            <h3>Riwayat Kendaraan</h3>
            <p>Kelola dan pantau seluruh aset kendaraan Anda dalam satu dashboard terintegrasi.</p>
            <button className="btn-link" onClick={() => navigate('/login')}>Masuk Dashboard ➔</button>
          </div>
        </div>
      </section>

      {/* SECTION 3: HERITAGE / TENTANG KAMI */}
      <section className="heritage-section">
        <div className="heritage-content">
          <p className="section-subtitle">Visi Kami</p>
          <h2 className="section-title">Inovasi dalam<br/>Pelayanan Publik</h2>
          <p className="heritage-text">
            Meninggalkan cara lama, SIPAKAT hadir untuk mendigitalisasi proses administrasi kendaraan bermotor. Kami percaya bahwa pelayanan publik harus cepat, transparan, dan menghargai waktu masyarakat.
          </p>
          <div className="heritage-quote">
            "Pelayanan prima adalah hak setiap warga negara, dan teknologi adalah jembatannya."
          </div>
        </div>
        <div className="heritage-image">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" alt="Gedung Pelayanan Publik" />
        </div>
      </section>

      {/* SECTION 4: JOURNAL / BERITA */}
      <section className="journal-section">
        <p className="section-subtitle">Informasi Terbaru</p>
        <h2 className="section-title">Dari SAMSAT</h2>
        <div className="journal-grid">
          <div className="journal-card">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" alt="News 1" />
            <div className="journal-info">
              <span className="date">15 Maret 2026</span>
              <h3>Pemutihan Pajak Kendaraan Berakhir Bulan Ini</h3>
            </div>
          </div>
          <div className="journal-card">
            <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop" alt="News 2" />
            <div className="journal-info">
              <span className="date">10 Maret 2026</span>
              <h3>Cara Mudah Menggunakan Sistem Antrean Baru</h3>
            </div>
          </div>
          <div className="journal-card">
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop" alt="News 3" />
            <div className="journal-info">
              <span className="date">01 Maret 2026</span>
              <h3>Jam Operasional Khusus Selama Bulan Ramadhan</h3>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="logo-text">SIPAKAT</h2>
            <p>Sistem Informasi Pajak &<br/>Antrean Terintegrasi SAMSAT</p>
          </div>
          <div className="footer-links">
            <h3>Navigasi</h3>
            <p onClick={() => window.scrollTo(0,0)}>Beranda</p>
            <p onClick={() => navigate('/cek-pajak')}>Cek Pajak</p>
            <p onClick={() => navigate('/login')}>Login Admin</p>
          </div>
          <div className="footer-contact">
            <h3>Kontak Kami</h3>
            <p>Jl. Jenderal Sudirman No. 1</p>
            <p>Parepare, Sulawesi Selatan</p>
            <p>Email: info@sipakat.go.id</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 SIPAKAT SAMSAT. All rights reserved.</p>
        </div>
      </footer>

      {/* MODAL POP-UP ANTREAN PUBLIK */}
      {isTicketModalOpen && (
        <div className="modal-overlay">
          <div className="ticket-card">
            
            {!nomorTiket ? (
              <>
                <h3>Ambil Nomor Antrean</h3>
                <p className="ticket-info">Silakan pilih jenis layanan SAMSAT yang Anda butuhkan hari ini.</p>
                
                {/* DROPDOWN PILIHAN LAYANAN */}
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
                  disabled={isLoading}
                >
                  {isLoading ? 'Mencetak...' : 'Cetak Tiket Antrean'}
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
                
                {/* MODIFIKASI BARU DI SINI: Tombol dialihkan ke halaman tunggu antrean dengan membawa state */}
                <button 
                  className="btn-ticket-action" 
                  onClick={() => {
                    // SAVE KE LOCALSTORAGE SEBELUM PINDAH
                    const dataTiketBaru = { nomor: nomorTiket, layanan: layananTerpilih };
                    localStorage.setItem('tiket_sipakat', JSON.stringify(dataTiketBaru));

                    navigate('/tunggu-antrean');
                    setNomorTiket(null);
                    setIsTicketModalOpen(false);
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

export default Home;