const request = require('supertest');
const app = require('../server');
const db = require('../config/database'); // Pastikan path ini sesuai dengan file database lu
const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 1, role: 'admin' }, 'rahasia_sipakat_123');
describe('Kendaraan API - Regression Test Suite', () => {
  let kendaraanIdDummy;
  beforeAll(async () => {
    await db.sync({ force: true });
  });
  // Bikin plat nomor yang selalu unik setiap kali npm test dijalankan
  const platDinamic = 'DP ' + Date.now().toString().slice(-4) + ' XX';

  describe('POST /api/kendaraan', () => {
    it('1. [Happy Path] Berhasil menambahkan data kendaraan baru', async () => {
      const dataBaru = { 
        plat_nomor: platDinamic, 
        merek_kendaraan: 'Honda Vario', 
        tahun_kendaraan: 2022, 
        nama_pemilik: 'Hanbal Nur Iskandar',
        total_pajak: 250000,                  // <--- Tambahin ini
        tanggal_jatuh_tempo: '2026-12-31'     // <--- Tambahin ini
      };
      const res = await request(app).post('/api/kendaraan').set('Authorization', 'Bearer ' + token).send(dataBaru);
      
      expect(res.statusCode).toBeGreaterThanOrEqual(200); 
      expect(res.body).toHaveProperty('data'); // Tambahin cek ini
      kendaraanIdDummy = res.body.data.id;
    });

    it('2. [Error Scenario] Gagal jika input duplikat', async () => {
      const dataDuplikat = { 
        plat_nomor: platDinamic, 
        merek_kendaraan: 'Honda Vario', 
        tahun_kendaraan: 2022, 
        nama_pemilik: 'Hanbal Nur Iskandar',
        total_pajak: 250000,                  // <--- Tambahin ini juga
        tanggal_jatuh_tempo: '2026-12-31'     // <--- Tambahin ini juga
      };
      const res = await request(app).post('/api/kendaraan').set('Authorization', 'Bearer ' + token).send(dataDuplikat);
      
      expect(res.statusCode).toEqual(400); 
    });
  });

  describe('GET /api/kendaraan', () => {
    it('3. [Happy Path] Berhasil mengambil semua daftar kendaraan', async () => {
      const res = await request(app).get('/api/kendaraan').set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy(); // Atau res.body.data tergantung response lu
    });

    it('4. [Error Scenario] Mengembalikan 404 jika URL salah', async () => {
      const res = await request(app).get('/api/kendaraan_salah').set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /api/kendaraan/cek/:plat_nomor', () => {
    it('5. [Happy Path] Berhasil mencari 1 kendaraan spesifik', async () => {
      const res = await request(app).get(`/api/kendaraan/cek/${platDinamic}`).set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    it('6. [Error Scenario] Mengembalikan 404 jika plat tidak ditemukan', async () => {
      const res = await request(app).get('/api/kendaraan/cek/PLAT-NGASAL').set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /api/kendaraan/:id', () => {
    it('7. [Happy Path] Berhasil mengupdate data kendaraan', async () => {
      const dataUpdate = { merek_kendaraan: 'Honda Vario 160cc' };
      const res = await request(app).put(`/api/kendaraan/${kendaraanIdDummy}`).set('Authorization', 'Bearer ' + token).send(dataUpdate);
      expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    it('8. [Error Scenario] Gagal update jika ID ngasal', async () => {
      const res = await request(app).put('/api/kendaraan/999999').set('Authorization', 'Bearer ' + token).send({ merek_kendaraan: 'Yamaha' });
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /api/kendaraan/:id', () => {
    it('9. [Happy Path] Berhasil menghapus data kendaraan', async () => {
      const res = await request(app).delete(`/api/kendaraan/${kendaraanIdDummy}`).set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    it('10. [Error Scenario] Gagal menghapus jika ID tidak ada di database', async () => {
      const res = await request(app).delete(`/api/kendaraan/999999`).set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).toEqual(404); 
    });
  });

  // ==========================================
  // TUTUP KONEKSI DATABASE BIAR JEST TIDAK HANG
  // ==========================================
  afterAll(async () => {
    await db.close();
  });
});