import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  RefreshCw,
  Plus,
  Building2,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import '../styles/ProductList.css'; // Import CSS ProductList

function ProductList() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user data untuk cek role
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = userData.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3001/api/products');
        setProduk(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Gagal memuat produk. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function untuk menentukan status stok
  const getStockStatus = (stok) => {
    if (stok === 0) return 'out-of-stock';
    if (stok <= 5) return 'low-stock';
    return 'in-stock';
  };

  // Function untuk menentukan text stok
  const getStockText = (stok) => {
    if (stok === 0) return 'Habis';
    if (stok <= 5) return 'Stok Terbatas';
    return 'Tersedia';
  };

  // Function untuk handle delete (hanya admin)
  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus produk "${nama}"?`)) return;

    try {
      await axios.delete(`http://localhost:3001/api/products/${id}`);
      setProduk(produk.filter(item => item.id !== id));
      alert('Produk berhasil dihapus!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Gagal menghapus produk!');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="product-list-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Memuat produk...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="product-list-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <AlertTriangle size={48} />
          </div>
          <h3 className="empty-state-title">Terjadi Kesalahan</h3>
          <p className="empty-state-text">{error}</p>
          <button
            className="empty-state-btn"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1 className="product-list-title">
          {isAdmin ? (
            <>
              <Package size={24} /> Kelola Produk
            </>
          ) : (
            <>
              <ShoppingCart size={24} /> Produk Kesehatan
            </>
          )}
        </h1>
        <p className="product-list-subtitle">
          {isAdmin
            ? `Mengelola ${produk.length} produk di toko`
            : `Tersedia ${produk.length} produk kesehatan berkualitas`
          }
        </p>
      </div>

      {produk.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={48} />
          </div>
          <h3 className="empty-state-title">Belum Ada Produk</h3>
          <p className="empty-state-text">
            {isAdmin
              ? 'Mulai tambahkan produk pertama Anda untuk ditampilkan di sini.'
              : 'Saat ini belum ada produk yang tersedia. Silakan kembali lagi nanti.'
            }
          </p>
          {isAdmin && (
            <a href="/upload" className="empty-state-btn">
              <Plus size={16} /> Tambah Produk
            </a>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {produk.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-image-container">
                {item.foto_url ? (
                  <img
                    src={item.foto_url}
                    alt={item.nama_produk}
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="product-image-placeholder"
                  style={{ display: item.foto_url ? 'none' : 'flex' }}
                >
                  <Building2 size={32} />
                </div>

                <div className={`stock-badge ${getStockStatus(item.stok)}`}>
                  {getStockText(item.stok)}
                </div>
              </div>

              <div className="product-info">
                <h3 className="product-name">{item.nama_produk}</h3>

                <div className="product-price">
                  {parseInt(item.harga).toLocaleString('id-ID')}
                </div>

                <div className="product-stock">
                  <div className={`stock-icon ${
                    item.stok === 0 ? 'unavailable' :
                    item.stok <= 5 ? 'limited' : 'available'
                  }`}></div>
                  <span>Stok: {item.stok} unit</span>
                </div>

                {isAdmin ? (
                  <div className="product-actions">
                    <a
                      href={`/admin/edit/${item.id}`}
                      className="action-btn btn-primary-product"
                    >
                      <Edit size={16} /> Edit
                    </a>
                    <button
                      onClick={() => handleDelete(item.id, item.nama_produk)}
                      className="action-btn btn-danger-product"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </div>
                ) : (
                  <div className="product-actions">
                    <button
                      className="action-btn btn-primary-product"
                      disabled={item.stok === 0}
                    >
                      {item.stok === 0 ? (
                        <>
                          <X size={16} /> Habis
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} /> Beli Sekarang
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;