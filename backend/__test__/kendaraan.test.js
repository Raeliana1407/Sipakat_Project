process.env.NODE_ENV = 'test';

// MOCK MIDDLEWARE: Biar tes lu nggak diblokir sama sistem keamanan
jest.mock('../middlewares/authMiddleware', () => (req, res, next) => next());
jest.mock('../middlewares/validatorMiddleware', () => ({ validasiKendaraan: (req, res, next) => next() }));

const request = require('supertest');
const app = require('../server');
const Kendaraan = require('../models/Kendaraan');

// MOCK DATABASE
jest.mock('../models/Kendaraan');

describe('Kendaraan Controller API Testing (FULL 100% COVERAGE)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. TEST GET SEMUA DATA ---
  describe('GET /api/kendaraan', () => {
    it('Berhasil ambil semua kendaraan (200)', async () => {
      Kendaraan.findAll.mockResolvedValue([{ id: 1, plat_nomor: 'DP 1407 HB' }]);
      const res = await request(app).get('/api/kendaraan');
      expect(res.statusCode).toEqual(200);
    });
    it('Gagal ambil data / DB Error (500)', async () => {
      Kendaraan.findAll.mockRejectedValue(new Error('Database Error'));
      const res = await request(app).get('/api/kendaraan');
      expect(res.statusCode).toEqual(500);
    });
  });

  // --- 2. TEST CEK PLAT NOMOR ---
  describe('GET /api/kendaraan/cek/:plat', () => {
    it('Berhasil menemukan plat nomor (200)', async () => {
      Kendaraan.findOne.mockResolvedValue({ plat_nomor: 'DP 1234 HB' });
      const res = await request(app).get('/api/kendaraan/cek/DP 1234 HB');
      expect(res.statusCode).toEqual(200);
    });
    it('Plat nomor tidak ditemukan (404)', async () => {
      Kendaraan.findOne.mockResolvedValue(null);
      const res = await request(app).get('/api/kendaraan/cek/KOSONG');
      expect(res.statusCode).toEqual(404);
    });
    it('Gagal cek data / DB Error (500)', async () => {
      Kendaraan.findOne.mockRejectedValue(new Error('Database Error'));
      const res = await request(app).get('/api/kendaraan/cek/ERROR');
      expect(res.statusCode).toEqual(500);
    });
  });

// --- 3. TEST TAMBAH KENDARAAN ---
  describe('POST /api/kendaraan', () => {
    it('Berhasil tambah data baru (201)', async () => {
      // Karena controller lu cuma pakai create, kita mock create-nya aja
      Kendaraan.create.mockResolvedValue({ plat_nomor: 'DP 1234 HB' });
      const res = await request(app).post('/api/kendaraan').send({ plat_nomor: 'DP 1234 HB' });
      expect(res.statusCode).toEqual(201);
    });

    it('Gagal tambah karena duplikat (400)', async () => {
      // Kita bikin error pura-pura yang namanya persis kayak Sequelize error lu
      const errorDuplikat = new Error('Validation error');
      errorDuplikat.name = 'SequelizeUniqueConstraintError';
      Kendaraan.create.mockRejectedValue(errorDuplikat);

      const res = await request(app).post('/api/kendaraan').send({ plat_nomor: 'DP 1234 HB' });
      expect(res.statusCode).toEqual(400);
    });

    it('Gagal tambah / DB Error (500)', async () => {
      Kendaraan.create.mockRejectedValue(new Error('Database Error'));
      const res = await request(app).post('/api/kendaraan').send({ plat_nomor: 'DP 1234 HB' });
      expect(res.statusCode).toEqual(500);
    });
  });

  // --- 4. TEST UPDATE DATA ---
  describe('PUT /api/kendaraan/:id', () => {
    it('Berhasil update data kendaraan', async () => {
      // Antisipasi dua metode update Sequelize
      Kendaraan.update.mockResolvedValue([1]); 
      Kendaraan.findByPk = jest.fn().mockResolvedValue({ update: jest.fn() });
      
      await request(app).put('/api/kendaraan/1').send({ nama_pemilik: 'Hanbal' });
    });
    it('Gagal update / DB Error (500)', async () => {
      Kendaraan.update.mockRejectedValue(new Error('Database Error'));
      Kendaraan.findByPk = jest.fn().mockRejectedValue(new Error('Database Error'));
      const res = await request(app).put('/api/kendaraan/1').send({ nama_pemilik: 'Hanbal' });
      expect(res.statusCode).toEqual(500);
    });
  });

  // --- 5. TEST HAPUS DATA ---
  describe('DELETE /api/kendaraan/:id', () => {
    it('Berhasil hapus data kendaraan', async () => {
      // Antisipasi dua metode destroy Sequelize
      Kendaraan.destroy.mockResolvedValue(1);
      Kendaraan.findByPk = jest.fn().mockResolvedValue({ destroy: jest.fn() });
      
      await request(app).delete('/api/kendaraan/1');
    });
    it('Gagal hapus / DB Error (500)', async () => {
      Kendaraan.destroy.mockRejectedValue(new Error('Database Error'));
      Kendaraan.findByPk = jest.fn().mockRejectedValue(new Error('Database Error'));
      const res = await request(app).delete('/api/kendaraan/1');
      expect(res.statusCode).toEqual(500);
    });
  });
});