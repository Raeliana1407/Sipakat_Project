process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server'); 
const Antrean = require('../models/Antrean');
const { Op } = require('sequelize');

jest.mock('../models/Antrean');

describe('Antrean Controller API Testing', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/antrean', () => {
    it('Harus mengembalikan semua data antrean (200)', async () => {
      Antrean.findAll.mockResolvedValue([{ id: 1, nomor_antrean: 'A-001' }]);
      const res = await request(app).get('/api/antrean');
      expect(res.statusCode).toEqual(200);
    });
    it('Harus mengembalikan 500 jika error db', async () => {
      Antrean.findAll.mockRejectedValue(new Error('DB Error'));
      const res = await request(app).get('/api/antrean');
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('POST /api/antrean', () => {
    it('Harus membuat antrean A-001 jika kosong (200)', async () => {
      Antrean.findOne.mockResolvedValue(null);
      Antrean.create.mockResolvedValue({});
      const res = await request(app).post('/api/antrean').send({ layanan: 'Pajak', kode_loket: 'A' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.nomor_antrean).toBe("A-001");
    });

    it('Harus membuat antrean A-002 jika A-001 sudah ada (200)', async () => {
      Antrean.findOne.mockResolvedValue({ nomor_antrean: 'A-001' });
      Antrean.create.mockResolvedValue({});
      const res = await request(app).post('/api/antrean').send({ layanan: 'Pajak', kode_loket: 'A' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.nomor_antrean).toBe("A-002");
    });

    it('Harus mengembalikan 500 jika error', async () => {
      Antrean.findOne.mockRejectedValue(new Error('DB Error'));
      const res = await request(app).post('/api/antrean').send({});
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('PUT /api/antrean/:id', () => {
    it('Harus berhasil update status (200)', async () => {
      Antrean.update.mockResolvedValue([1]);
      const res = await request(app).put('/api/antrean/1').send({ status: 'Selesai' });
      expect(res.statusCode).toEqual(200);
    });
    it('Harus error 500 jika gagal update', async () => {
      Antrean.update.mockRejectedValue(new Error('DB Error'));
      const res = await request(app).put('/api/antrean/1').send({ status: 'Selesai' });
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('DELETE /api/antrean/reset', () => {
    it('Harus berhasil reset total antrean (200)', async () => {
      Antrean.destroy.mockResolvedValue(1);
      const res = await request(app).delete('/api/antrean/reset');
      expect(res.statusCode).toEqual(200);
    });
    it('Harus error 500 jika gagal reset', async () => {
      Antrean.destroy.mockRejectedValue(new Error('DB Error'));
      const res = await request(app).delete('/api/antrean/reset');
      expect(res.statusCode).toEqual(500);
    });
  });
});