import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:3001/api/login', { username, password });
      const userData = res.data; // { id, username, role }
      localStorage.setItem('user', JSON.stringify(userData));

      setMessage('✅ Login berhasil! Mengalihkan...');

      setTimeout(() => {
        if (userData.role === 'admin') {
          navigate('/admin/products');
        } else {
          navigate('/products');
        }
      }, 1000);

    } catch (err) {
      setMessage('❌ Username atau password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Masuk ke Akun</h2>
        </div>

        <div className="auth-body">
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
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
                  Masuk...
                </>
              ) : (
                <>
                    Masuk
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
              Belum punya akun? <Link to="/register">Daftar di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;