import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css'; // Import CSS Auth

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validasi password confirmation
    if (password !== confirmPassword) {
      setMessage('❌ Konfirmasi password tidak cocok!');
      setLoading(false);
      return;
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      setMessage('❌ Password minimal 6 karakter!');
      setLoading(false);
      return;
    }

    try {
      await api.post('/register', { username, password });
      setMessage('✅ Registrasi berhasil! Mengalihkan ke login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage('❌ Gagal registrasi. Username mungkin sudah digunakan.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Daftar Akun Baru</h2>
        </div>

        <div className="auth-body">
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                minLength="3"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password (minimal 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Mendaftar...
                </>
              ) : (
                <>
                    Daftar Sekarang
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`auth-message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="auth-footer">
            <p>
              Sudah punya akun? <Link to="/login">Login di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
