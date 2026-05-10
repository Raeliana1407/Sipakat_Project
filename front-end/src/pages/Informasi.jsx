import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Informasi.css';

const Informasi = () => {
  const navigate = useNavigate();

  return (
    <div className="info-wrapper">
      <nav className="navbar navbar-alt">
        <div className="nav-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <span className="logo-text">SIPAKAT</span>
        </div>
        <button className="btn-back" onClick={() => navigate('/')}>← Kembali</button>
      </nav>

      <main className="info-content">
        <div className="header-text">
          <p className="subtitle">Pusat Bantuan</p>
          <h1 className="title">Informasi Layanan</h1>
          <p className="description">Segala hal yang perlu Anda persiapkan sebelum melakukan pembayaran pajak dan reservasi antrean.</p>
        </div>

        <div className="info-grid">
          {/* Section Persyaratan */}
          <section className="info-card">
            <h2 className="card-title">Persyaratan Berkas</h2>
            <div className="req-list">
              <div className="req-item">
                <h3>1. Pajak Tahunan</h3>
                <ul>
                  <li>KTP Asli sesuai STNK</li>
                  <li>STNK Asli</li>
                  <li>Uang pas (opsional)</li>
                </ul>
              </div>
              <div className="req-item">
                <h3>2. Pajak 5 Tahunan (Ganti Plat)</h3>
                <ul>
                  <li>KTP Asli & Fotokopi</li>
                  <li>STNK & BPKB Asli</li>
                  <li>Kendaraan wajib hadir (Cek Fisik)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section Operasional */}
          <section className="info-card">
            <h2 className="card-title">Jam Operasional</h2>
            <div className="schedule">
              <div className="schedule-row">
                <span>Senin - Kamis</span>
                <span>08:00 - 15:00 WITA</span>
              </div>
              <div className="schedule-row">
                <span>Jumat</span>
                <span>08:00 - 11:30 WITA</span>
              </div>
              <div className="schedule-row">
                <span>Sabtu</span>
                <span>08:00 - 12:00 WITA</span>
              </div>
              <div className="schedule-row closed">
                <span>Minggu & Hari Libur</span>
                <span>TUTUP</span>
              </div>
            </div>
          </section>
        </div>

        {/* Section FAQ */}
        <section className="faq-section">
          <h2 className="section-title">Tanya Jawab Umum</h2>
          <div className="faq-container">
            <div className="faq-item">
              <h3>Apakah ambil antrean online wajib?</h3>
              <p>Sangat disarankan untuk menghindari penumpukan di lokasi. Namun, bagi warga lansia atau yang kesulitan akses internet, loket antrean manual tetap tersedia dengan kuota terbatas.</p>
            </div>
            <div className="faq-item">
              <h3>Bagaimana jika saya terlambat datang dari jadwal antrean?</h3>
              <p>Tiket antrean memiliki toleransi keterlambatan 15 menit. Jika lewat dari waktu tersebut, nomor antrean Anda akan dihanguskan dan harus mengambil nomor baru.</p>
            </div>
            <div className="faq-item">
              <h3>Apakah bayar pajak bisa diwakilkan?</h3>
              <p>Bisa, selama membawa KTP asli yang sesuai dengan nama yang tertera di STNK dan BPKB kendaraan.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Informasi;