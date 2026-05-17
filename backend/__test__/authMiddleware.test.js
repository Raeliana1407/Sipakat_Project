const verifyToken = require('../middlewares/authMiddleware');

describe('Unit Test Modul Autentikasi (authMiddleware)', () => {
    let req, res, next;

    // Ini buat ngereset kondisi sebelum ngetes
    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('Skenario 1: Menolak (403) jika token tidak dikirim sama sekali', () => {
        verifyToken(req, res, next); // Tes dijalanin tanpa token
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Akses ditolak! Token tidak ada." });
    });

    it('Skenario 2: Menolak (401) jika token dikirim tapi palsu', () => {
        req.headers['authorization'] = 'Bearer token_palsu';
        verifyToken(req, res, next); // Tes dijalanin pakai token ngasal
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Token tidak valid atau sudah kadaluarsa!" });
    });
});