import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login'; 
import CekPajak from './pages/CekPajak';
import Informasi from './pages/Informasi';
import DashboardAdmin from './pages/DashboardAdmin';
import TungguAntrean from './pages/TungguAntrean';

function App() {
  // 1. Ambil memori tema dari browser, kalau gak ada defaultnya false (Dark Mode)
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('tema_sipakat') === 'light';
  });

  // 2. Terapkan kelas 'light-theme' langsung ke <body> HTML biar global!
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
      localStorage.setItem('tema_sipakat', 'light'); // Save ke memori
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('tema_sipakat', 'dark'); // Save ke memori
    }
  }, [isLightMode]);

  return (
    <Router>
      <Routes>
        {/* Lempar saklar temanya ke Home biar tombolnya berfungsi */}
        <Route path="/" element={<Home isLightMode={isLightMode} setIsLightMode={setIsLightMode} />} />
        
        <Route path="/login" element={<Login />} /> 
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/cek-pajak" element={<CekPajak />} />
        <Route path="/informasi" element={<Informasi />} />
        <Route path="/tunggu-antrean" element={<TungguAntrean />} />
      </Routes>
    </Router>
  );
}

export default App;