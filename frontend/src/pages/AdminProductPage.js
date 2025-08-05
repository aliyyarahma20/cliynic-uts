import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import ProductList from '../components/ProductList';
import { Settings, X, Home, Plus, RefreshCw } from 'lucide-react';
import '../styles/App.css'; // Import global styles

function AdminProductPage() {
  // Check if user is admin
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  if (userData.role !== 'admin') {
    return (
      <div className="page-container">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <X size={24} /> Akses Ditolak
          </h2>
          <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
            Halaman ini hanya dapat diakses oleh admin.
          </p>
          <a href="/products" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={16} /> Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <AdminNavbar />

      {/* Admin Actions Header */}
      <div className="container" style={{ padding: '2rem 0 1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{
              color: '#0e2a55',
              margin: 0,
              fontSize: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Settings size={28} />
              Dashboard Admin
            </h1>
            <p style={{
              color: '#6c757d',
              margin: '0.5rem 0 0 0',
              fontSize: '1.1rem'
            }}>
              Kelola produk kesehatan dengan mudah
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/upload" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} />
              Tambah Produk
            </a>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Admin Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
        </div>
      </div>

      {/* Product List Component */}
      <ProductList />
    </div>
  );
}

// Admin Stats Card Component
function AdminStatsCard({ title, icon, color }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="card-body">
        <div style={{
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
          color: color
        }}>
          {icon}
        </div>
        <h3 style={{
          color: '#0e2a55',
          margin: '0 0 0.5rem 0',
          fontSize: '1.2rem'
        }}>
          {title}
        </h3>
        <p style={{
          color: '#6c757d',
          margin: 0,
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          -
        </p>
        <small style={{ color: '#6c757d' }}>
          Data akan dimuat otomatis
        </small>
      </div>
    </div>
  );
}

export default AdminProductPage;