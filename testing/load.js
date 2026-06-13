import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 50, // 50 Virtual Users
    duration: '1m', // Selama 1 menit
};

export default function () {
    // Menembak endpoint antrean SIPAKAT
    const res = http.get('http://localhost:5000/api/antrean');
    
    // Mengecek apakah response sukses (status 200)
    check(res, {
        'status is 200': (r) => r.status === 200,
    });
    
    sleep(1); // Jeda 1 detik antar request
}