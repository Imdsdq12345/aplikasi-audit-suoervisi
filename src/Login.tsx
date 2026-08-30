import React, { useState } from 'react';

export default function Login({ onLoginSuccess }: { onLoginSuccess: (userRole: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Contoh data dummy pengguna sesuai role yang Anda tentukan
  const usersDatabase = [
    { email: 'ahmad@sit.sch.id', pass: '12345', role: 'Auditor', name: 'Ahmad, M.Pd' },
    { email: 'mgr.sd@sit.sch.id', pass: '12345', role: 'Manajer Unit', name: 'Kepala SD IT' },
    { email: 'lpm@sit.sch.id', pass: '12345', role: 'Manajer LPM', name: 'Dr. H. Abdullah' },
    { email: 'direktur@sit.sch.id', pass: '12345', role: 'Direktur Kesiswaan', name: 'Drs. H. M. Ridwan' },
    { email: 'admin@sit.sch.id', pass: '12345', role: 'Admin', name: 'Admin Sistem' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Proses pencocokan email dan password
    const foundUser = usersDatabase.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.pass === password
    );

    if (foundUser) {
      alert(`Login Berhasil! Selamat datang, ${foundUser.name} (${foundUser.role})`);
      onLoginSuccess(foundUser.role);
    } else {
      setError('Email atau kata sandi yang Anda masukkan salah!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#faf9f6' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: '#1b4332', textAlign: 'center', marginBottom: '8px' }}>SIAS-Kesiswaan</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '20px' }}>Audit Supervisi Kesiswaan SIT</p>
        
        {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#2d6a4f', marginBottom: '5px' }}>Email Pengguna</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="contoh: lpm@sit.sch.id"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#2d6a4f', marginBottom: '5px' }}>Kata Sandi</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', backgroundColor: '#1b4332', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Masuk ke Sistem
          </button>
        </form>
      </div>
    </div>
  );
}
