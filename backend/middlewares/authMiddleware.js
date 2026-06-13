const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const header = req.headers['authorization'];
    
    if (!header) {
        return res.status(403).json({ message: "Akses ditolak! Token tidak ada." });
    }

    const token = header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'rahasia_sipakat_123');
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.status(401).json({ message: "Token tidak valid atau sudah kadaluarsa!" });
    }
};

module.exports = verifyToken;