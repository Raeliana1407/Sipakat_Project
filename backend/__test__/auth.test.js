process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server'); 
const Petugas = require('../models/Petugas');

jest.mock('../models/Petugas');

describe('Auth Controller API Testing', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('Harus berhasil login (200) jika username & password benar', async () => {
      Petugas.findOne.mockResolvedValue({ id: 1, username: 'adminloket' });
      const res = await request(app).post('/api/auth/login').send({ username: 'adminloket', password: '123' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Login Berhasil!");
    });

    it('Harus mengembalikan 401 jika username/password salah', async () => {
      Petugas.findOne.mockResolvedValue(null);
      const res = await request(app).post('/api/auth/login').send({ username: 'salah', password: '123' });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe("Username atau Password salah, Bro!");
    });

    it('Harus mengembalikan 500 jika terjadi server error', async () => {
      Petugas.findOne.mockRejectedValue(new Error('Database Error'));
      const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '123' });
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('POST /api/auth/register', () => {
    it('Harus berhasil menambah petugas baru (201)', async () => {
      Petugas.findOne.mockResolvedValue(null); 
      Petugas.create.mockResolvedValue({ id: 2, username: 'baru' });
      const res = await request(app).post('/api/auth/register').send({ username: 'baru', password: '123', nama_lengkap: 'Baru', kode_loket: 'A' });
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe("Admin/Petugas baru berhasil ditambahkan!");
    });

    it('Harus mengembalikan 400 jika username sudah terdaftar', async () => {
      Petugas.findOne.mockResolvedValue({ username: 'adminloket' }); 
      const res = await request(app).post('/api/auth/register').send({ username: 'adminloket', password: '123' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Username sudah terdaftar, pakai yang lain!");
    });

    it('Harus mengembalikan 500 jika server error saat tambah data', async () => {
      Petugas.findOne.mockRejectedValue(new Error('Database Error'));
      const res = await request(app).post('/api/auth/register').send({ username: 'admin' });
      expect(res.statusCode).toEqual(500);
    });
  });
});