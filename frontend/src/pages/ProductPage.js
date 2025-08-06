import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  LogOut,
  X,
  RefreshCw,
  Package,
  Image,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import '../styles/ProductPage.css'; // ✅ Import CSS file

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Gagal memuat produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // ✅ Fixed: Remove currency style to avoid double "Rp"
  const formatCurrency = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 10) return 'low-stock';
    return '';
  };

  const getStockText = (stock) => {
    if (stock === 0) return { icon: <X size={16} />, text: 'Habis' };
    if (stock <= 10) return { icon: <AlertTriangle size={16} />, text: `Sisa ${stock}` };
    return { icon: <CheckCircle size={16} />, text: `Stok: ${stock}` };
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="product-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-header">
        <h1 className="product-title">
          <ShoppingBag size={28} /> Daftar Produk
        </h1>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {error && (
        <div className="error-container">
          <X size={20} />
          {error}
          <button onClick={fetchProducts} className="error-retry-btn">
            <RefreshCw size={16} /> Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={64} />
          </div>
          <h2 className="empty-state-title">Belum Ada Produk</h2>
          <p className="empty-state-text">
            Produk akan ditampilkan di sini setelah ditambahkan oleh admin.
          </p>
        </div>
      ) : (
        <ul className="products-grid">
          {products.map((product) => {
            const stockInfo = getStockText(product.stok);
            return (
              <li key={product.id} className="product-card">
                <div className="product-image-container">
                  {product.foto_url ? (
                    <img
                      src={product.foto_url}
                      alt={product.nama_produk}
                      className="product-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="product-image-placeholder"
                    style={{ display: product.foto_url ? 'none' : 'flex' }}
                  >
                    <Image size={48} />
                  </div>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.nama_produk}</h3>

                  <div className="product-details">
                    <div className="product-price">
                       {formatCurrency(product.harga)}
                    </div>
                    <div className={`product-stock ${getStockStatus(product.stok)}`}>
                      {stockInfo.icon}
                      {stockInfo.text}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ProductPage;