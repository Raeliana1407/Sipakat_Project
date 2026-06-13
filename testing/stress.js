import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Naik ke 50 VU dalam 30 detik
        { duration: '1m', target: 200 },  // Naik dan tahan di 200 VU selama 1 menit
        { duration: '30s', target: 0 },   // Turun kembali ke 0 VU dalam 30 detik
    ],
};

export default function () {
    const res = http.get('http://localhost:5000/api/kendaraan');
    
    check(res, {
        'status is 200': (r) => r.status === 200,
    });
    
    sleep(1);
}