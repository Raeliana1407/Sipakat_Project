import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  // State untuk Tab Aktif (Default buka Antrean)
  const [activeTab, setActiveTab] = useState('antrean');

  // State Data
  const [daftarAntrean, setDaftarAntrean] = useState([]);
  const [daftarKendaraan, setDaftarKendaraan] = useState([]);
  const navigate = useNavigate();

  // --- STATE BARU UNTUK MODAL & FORM KENDARAAN ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    plat_nomor: '',
    nama_pemilik: '',
    merek_kendaraan: '',
    tahun_kendaraan: '',
    total_pajak: '',
    tanggal_jatuh_tempo: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Hayo, Anda belum login! Silakan login dulu.');
      navigate('/login'); // Tendang ke halaman login
      return; 
    }
    ambilDataAntrean();
    ambilDataKendaraan(); // Panggil fungsi narik data kendaraan pas halaman dimuat
  }, [navigate]);

  // --- API CALLS ---
  const ambilDataAntrean = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/antrean');
      setDaftarAntrean(response.data);
    } catch (error) {
      console.error('Gagal narik data antrean:', error);
    }
  };

  const ambilDataKendaraan = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kendaraan');
      setDaftarKendaraan(response.data);
    } catch (error) {
      console.error('Gagal narik data kendaraan:', error);
    }
  };

  // --- FUNGSI ANTREAN ---
  const handleUpdateStatus = async (id, statusBaru) => {
    try {
      await axios.put(`http://localhost:5000/api/antrean/${id}`, { status: statusBaru });
      ambilDataAntrean();
    } catch (error) {
      alert('Gagal update status antrean!');
    }
  };

  const handleTambahManual = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/antrean', {
        layanan: 'Pembayaran Pajak (Manual)',
        kode_loket: 'A' 
      });
      alert(`Berhasil cetak tiket: ${response.data.nomor_antrean}`);
      ambilDataAntrean();
    } catch (error) {
      alert('Gagal bikin antrean manual!');
    }
  };

  // --- FUNGSI KENDARAAN (BARU) ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmitKendaraan = async (e) => {
    e.preventDefault();
    try {
      // 1. Ambil token yang disave pas login tadi
      const token = localStorage.getItem('token');

      // 2. Nembak API sekalian bawa Token di bagian Headers
      const response = await axios.post('http://localhost:5000/api/kendaraan', formData, {
        headers: {
          'Authorization': `Bearer ${token}` // <-- Tiket masuk satpamnya di sini
        }
      });
      
      alert(response.data.message);
      
      setIsModalOpen(false); // Tutup pop-up
      ambilDataKendaraan(); // Refresh tabel
      
      // Kosongin form
      setFormData({
        plat_nomor: '', nama_pemilik: '', merek_kendaraan: '', 
        tahun_kendaraan: '', total_pajak: '', tanggal_jatuh_tempo: ''
      });
    } catch (error) {
      console.error("Detail Error:", error); 
      
      // 3. Tangkap error khusus dari Validation Middleware (express-validator)
      if (error.response && error.response.data && error.response.data.errors) {
        const pesanError = error.response.data.errors.map(err => err.msg).join('\n');
        alert("Validasi Gagal:\n" + pesanError);
      } 
      // 4. Tangkap error kalau Token JWT ga ada/salah (401/403)
      else if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        alert(`Akses Ditolak: ${error.response.data.message}\nSilakan login ulang!`);
      }
      // Tangkap error dari database (misal plat dobel)
      else if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error); 
      } 
      else if (error.response) {
        alert(`Gagal! Server merespon dengan status: ${error.response.status}.`);
      } else {
        alert('Gagal konek ke server! Pastikan backend nyala.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  // Format Tanggal
  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-logo">SIPAKAT ADMIN</h1>
        <button className="btn-logout" onClick={handleLogout}>Keluar Sistem</button>
      </header>

      <main className="dashboard-content">
        <div className="table-card">
          
          {/* TAB NAVIGASI */}
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'antrean' ? 'active' : ''}`}
              onClick={() => setActiveTab('antrean')}
            >
              Manajemen Antrean
            </button>
            <button 
              className={`tab-btn ${activeTab === 'kendaraan' ? 'active' : ''}`}
              onClick={() => setActiveTab('kendaraan')}
            >
              Data Kendaraan
            </button>
          </div>

          {/* --- TAB ANTREAN --- */}
          {activeTab === 'antrean' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 className="table-title" style={{ border: 'none', margin: 0, padding: 0 }}>Daftar Antrean Kendaraan</h3>
                <button onClick={handleTambahManual} style={{ backgroundColor: '#D4AF37', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                  + Cetak Antrean Manual
                </button>
              </div>
              
              <table className="samsat-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nomor Antrean</th>
                    <th>Layanan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarAntrean.length > 0 ? (
                    daftarAntrean.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td className="nomor-highlight">{item.nomor_antrean}</td>
                        <td>{item.layanan}</td>
                        <td>
                          <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
                        </td>
                        <td style={{ display: 'flex', gap: '10px' }}>
                          {item.status === 'Menunggu' && (
                            <button onClick={() => handleUpdateStatus(item.id, 'Dipanggil')} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#34d399', color: '#064e3b', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Panggil</button>
                          )}
                          {item.status === 'Dipanggil' && (
                            <button onClick={() => handleUpdateStatus(item.id, 'Selesai')} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Selesai</button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>Belum ada antrean yang masuk hari ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* --- TAB KENDARAAN --- */}
          {activeTab === 'kendaraan' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 className="table-title" style={{ border: 'none', margin: 0, padding: 0 }}>Database Pajak Kendaraan</h3>
                {/* TOMBOL DENGAN ONCLICK UNTUK BUKA MODAL */}
                <button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: '#D4AF37', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                  + Tambah Data Kendaraan
                </button>
              </div>
              
              <table className="samsat-table">
                <thead>
                  <tr>
                    <th>Plat Nomor</th>
                    <th>Nama Pemilik</th>
                    <th>Merek & Tahun</th>
                    <th>Total Pajak</th>
                    <th>Jatuh Tempo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarKendaraan.length > 0 ? (
                    daftarKendaraan.map((item) => (
                      <tr key={item.id}>
                        <td className="nomor-highlight">{item.plat_nomor}</td>
                        <td style={{ fontWeight: 'bold' }}>{item.nama_pemilik}</td>
                        <td>{item.merek_kendaraan} ({item.tahun_kendaraan})</td>
                        <td style={{ color: '#D4AF37' }}>{formatRupiah(item.total_pajak)}</td>
                        <td>{formatTanggal(item.tanggal_jatuh_tempo)}</td>
                        <td>
                          <span className={`badge ${item.status_pajak.toLowerCase().replace(' ', '.')}`}>
                            {item.status_pajak}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>Belum ada data kendaraan terdaftar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

        </div>
      </main>

      {/* --- MODAL TAMBAH KENDARAAN (OVERLAY) --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Registrasi Kendaraan Baru</h3>
            <form onSubmit={handleSubmitKendaraan}>
              <div className="form-group">
                <label>Plat Nomor</label>
                <input type="text" name="plat_nomor" placeholder="Contoh: DP 1234 XX" value={formData.plat_nomor} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Nama Pemilik</label>
                <input type="text" name="nama_pemilik" placeholder="Nama sesuai STNK" value={formData.nama_pemilik} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Merek & Tipe Kendaraan</label>
                <input type="text" name="merek_kendaraan" placeholder="Contoh: Honda Vario 160" value={formData.merek_kendaraan} onChange={handleInputChange} required />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Tahun</label>
                  <input type="number" name="tahun_kendaraan" placeholder="2022" value={formData.tahun_kendaraan} onChange={handleInputChange} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Total Pajak (Rp)</label>
                  <input type="number" name="total_pajak" placeholder="250000" value={formData.total_pajak} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Tanggal Jatuh Tempo</label>
                <input type="date" name="tanggal_jatuh_tempo" value={formData.tanggal_jatuh_tempo} onChange={handleInputChange} required />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-save">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardAdmin;