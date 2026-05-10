import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  
  // 1. Tambahin state untuk nangkep apa yang diketik petugas
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            username,
            password
        });
        
        // Simpan token ke localStorage
        localStorage.setItem('token', response.data.token); 
        
        alert(response.data.message);
        navigate('/dashboard-admin'); 
    } catch (err) {
        alert(err.response?.data?.message || 'Login Gagal');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2 className="logo-text">SIPAKAT</h2>
          <p>Portal Petugas SAMSAT</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          {/* Box merah ini bakal muncul otomatis kalau password salah */}
          {errorMsg && (
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <div className="input-group">
            {/* Ubah email jadi username biar sinkron sama database */}
            <label htmlFor="username">Username Petugas</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Masukkan username (contoh: admin)..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Kata Sandi</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Masukkan kata sandi..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Ingat saya
            </label>
            <span className="forgot-password">Lupa Sandi?</span>
          </div>
          
          <button type="submit" className="btn-login-submit">
            Masuk ke Sistem
          </button>
        </form>

        <p className="back-link" onClick={() => navigate('/')}>
          ← Kembali ke Beranda
        </p>
      </div>
    </div>
  );
};

export default Login;