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

  // --- STATE MODAL & FORM KENDARAAN (DIPERBARUI) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // Penanda kalau lagi mode Edit
  const [formData, setFormData] = useState({
    plat_nomor: '',
    nama_pemilik: '',
    merek_kendaraan: '',
    tahun_kendaraan: '',
    total_pajak: '',
    tanggal_jatuh_tempo: '',
    status_pajak: 'Belum Lunas'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Hayo, Anda belum login! Silakan login dulu.');
      navigate('/login'); // Tendang ke halaman login
      return; 
    }
    ambilDataAntrean();
    ambilDataKendaraan(); // Panggil fungsionalitas narik data kendaraan pas halaman dimuat
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

  const handleResetAntrean = async () => {
    if (window.confirm('Yakin mau mereset/menghapus semua history antrean hari ini?')) {
      try {
        await axios.delete('http://localhost:5000/api/antrean/reset');
        alert('History antrean berhasil dikosongkan!');
        ambilDataAntrean();
      } catch (error) {
        alert('Gagal mereset antrean! Pastikan backend sudah diupdate.');
      }
    }
  };

  // --- FUNGSI FULL CRUD KENDARAAN ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const bukaModalTambah = () => {
    setEditId(null);
    setFormData({ plat_nomor: '', nama_pemilik: '', merek_kendaraan: '', tahun_kendaraan: '', total_pajak: '', tanggal_jatuh_tempo: '', status_pajak: 'Belum Lunas' });
    setIsModalOpen(true);
  };

  const bukaModalEdit = (item) => {
    setEditId(item.id); // Tandai ID yang mau diedit
    setFormData({
      plat_nomor: item.plat_nomor,
      nama_pemilik: item.nama_pemilik,
      merek_kendaraan: item.merek_kendaraan,
      tahun_kendaraan: item.tahun_kendaraan,
      total_pajak: item.total_pajak,
      tanggal_jatuh_tempo: item.tanggal_jatuh_tempo ? item.tanggal_jatuh_tempo.split('T')[0] : '', 
      status_pajak: item.status_pajak || 'Belum Lunas'
    });
    setIsModalOpen(true);
  };

  const handleSubmitKendaraan = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      if (editId) {
        // Jalur Update (PUT)
        const response = await axios.put(`http://localhost:5000/api/kendaraan/${editId}`, formData, config);
        alert(response.data.message || "Data berhasil diperbarui!");
      } else {
        // Jalur Tambah Baru (POST)
        const response = await axios.post('http://localhost:5000/api/kendaraan', formData, config);
        alert(response.data.message || "Data berhasil ditambahkan!");
      }
      
      setIsModalOpen(false);
      ambilDataKendaraan();
    } catch (error) {
      console.error("Detail Error:", error.response ? error.response.data : error);
      
      // Tampilkan pesan error langsung dari backend kalau ada, biar ketahuan penyebab pastinya
      const pesanError = error.response?.data?.error || 'Gagal menyimpan data kendaraan! Cek konsol browser.';
      alert(pesanError);
    }
  };

  const handleDeleteKendaraan = async (id, nopol) => {
    if (window.confirm(`Yakin mau menghapus kendaraan dengan Nopol ${nopol} secara permanen?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/kendaraan/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert('Data kendaraan berhasil dihapus!');
        ambilDataKendaraan();
      } catch (error) {
        alert('Gagal menghapus data kendaraan!');
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
    if (!tanggal) return '-';
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
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleResetAntrean} style={{ backgroundColor: '#ef4444', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Reset History Antrean
                  </button>
                  <button onClick={handleTambahManual} style={{ backgroundColor: '#D4AF37', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                    + Cetak Antrean Manual
                  </button>
                </div>
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
                          <span className={`badge ${item.status ? item.status.toLowerCase() : ''}`}>{item.status}</span>
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
                <button onClick={bukaModalTambah} style={{ backgroundColor: '#D4AF37', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
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
                    <th>Aksi</th>
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
                          <span className={`badge ${item.status_pajak ? item.status_pajak.toLowerCase().replace(' ', '.') : 'belum.lunas'}`}>
                            {item.status_pajak || 'Belum Lunas'}
                          </span>
                        </td>
                        {/* 🔥 BERHASIL DITAMBAHKAN: Kolom Aksi berisi Tombol Edit & Hapus */}
                        <td style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => bukaModalEdit(item)} style={{ padding: '6px 10px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                          <button onClick={() => handleDeleteKendaraan(item.id, item.plat_nomor)} style={{ padding: '6px 10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Hapus</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>Belum ada data kendaraan terdaftar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

        </div>
      </main>

      {/* --- MODAL TAMBAH & EDIT KENDARAAN --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{editId ? 'Edit Data Kendaraan' : 'Registrasi Kendaraan Baru'}</h3>
            <form onSubmit={handleSubmitKendaraan}>
              <div className="form-group">
                <label>Plat Nomor</label>
                <input type="text" name="plat_nomor" value={formData.plat_nomor} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Nama Pemilik</label>
                <input type="text" name="nama_pemilik" value={formData.nama_pemilik} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Merek & Tipe Kendaraan</label>
                <input type="text" name="merek_kendaraan" value={formData.merek_kendaraan} onChange={handleInputChange} required />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Tahun</label>
                  <input type="number" name="tahun_kendaraan" value={formData.tahun_kendaraan} onChange={handleInputChange} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Total Pajak (Rp)</label>
                  <input type="number" name="total_pajak" value={formData.total_pajak} onChange={handleInputChange} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Tanggal Jatuh Tempo</label>
                  <input type="date" name="tanggal_jatuh_tempo" value={formData.tanggal_jatuh_tempo} onChange={handleInputChange} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Status Pajak</label>
                  <select name="status_pajak" value={formData.status_pajak} onChange={handleInputChange} style={{ width: '100%', padding: '10px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                    <option value="Belum Lunas">Belum Lunas</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-save">{editId ? 'Update Data' : 'Simpan Data'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardAdmin;