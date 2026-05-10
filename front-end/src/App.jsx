import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login'; // Pastikan 'L' nya besar kalau nama filenya Login.jsx
import CekPajak from './pages/CekPajak';
import Informasi from './pages/Informasi';
import DashboardAdmin from './pages/DashboardAdmin';

const DummyPage = ({ title }) => (
  <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', color: '#D4AF37', fontFamily: 'Playfair Display' }}>
    <h1>Halaman {title} (Segera Hadir)</h1>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Rute Login Petugas yang nyambung ke Backend */}
        <Route path="/login" element={<Login />} /> 
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/cek-pajak" element={<CekPajak />} />
        <Route path="/informasi" element={<Informasi />} />
      </Routes>
    </Router>
  );
}

export default App;