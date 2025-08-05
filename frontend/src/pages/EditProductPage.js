import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import {
  Edit,
  Camera,
  Tag,
  DollarSign,
  Package,
  CheckCircle,
  FolderOpen,
  Save,
  X,
  Image
} from 'lucide-react';
import '../styles/UploadForm.css'; // Reuse upload form styles
import '../styles/App.css'; // Global styles

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [foto, setFoto] = useState(null);
  const [currentFoto, setCurrentFoto] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Pindahkan pengecekan admin ke dalam useEffect
  useEffect(() => {
    // Check admin access
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.role !== 'admin') {
      navigate('/login');
      return; // Return early dari useEffect, bukan dari komponen
    }

    const fetchProduct = async () => {
      try {
        setDataLoading(true);
        const res = await axios.get(`http://localhost:3001/api/products/${id}`);
        const p = res.data;

        if (!p) {
          setMessage('error:Produk tidak ditemukan!');
          return;
        }

        setNama(p.nama_produk);
        setHarga(p.harga);
        setStok(p.stok);
        setCurrentFoto(p.foto_url);
      } catch (err) {
        console.error('Error fetching product:', err);
        setMessage('error:Gagal memuat data produk!');
      } finally {
        setDataLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]); // ✅ Tambahkan navigate ke dependency array

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('error:Ukuran file maksimal 5MB!');
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        setMessage('error:File harus berupa gambar!');
        return;
      }

      setFoto(file);
      setMessage(''); // Clear any previous error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUploadProgress(0);

    // Validasi form
    if (!nama.trim()) {
      setMessage('error:Nama produk tidak boleh kosong!');
      setLoading(false);
      return;
    }

    if (harga <= 0) {
      setMessage('error:Harga harus lebih dari 0!');
      setLoading(false);
      return;
    }

    if (stok < 0) {
      setMessage('error:Stok tidak boleh negatif!');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('nama_produk', nama.trim());
    formData.append('harga', harga);
    formData.append('stok', stok);
    if (foto) {
      formData.append('foto', foto);
    }

    try {
      await axios.put(`http://localhost:3001/api/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setMessage('success:Produk berhasil diupdate!');

      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);

    } catch (err) {
      console.error('Update error:', err);
      if (err.response?.data?.message) {
        setMessage(`error:${err.response.data.message}`);
      } else {
        setMessage('error:Gagal update produk. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return parseInt(value).toLocaleString('id-ID');
  };

  const isSuccess = message.startsWith('success:');
  const isError = message.startsWith('error:');
  const displayMessage = message.replace(/^(success:|error:)/, '');

  if (dataLoading) {
    return (
      <div className="page-container">
        <AdminNavbar />
        <div className="upload-page">
          <div className="upload-container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Memuat data produk...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <AdminNavbar />

      <div className="upload-page">
        <div className="upload-container">
          <div className="upload-card">
            <div className="upload-header">
              <h1>
                <span className="upload-icon">
                  <Edit size={24} />
                </span>
                Edit Produk
              </h1>
              <p className="upload-subtitle">
                Perbarui informasi produk #{id}
              </p>
            </div>

            <div className="upload-body">
              {/* Current Product Image Preview */}
              {currentFoto && !foto && (
                <div style={{
                  textAlign: 'center',
                  marginBottom: '2rem',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px'
                }}>
                  <p style={{
                    color: '#0e2a55',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    Foto Saat Ini:
                  </p>
                  <img
                    src={currentFoto}
                    alt="Current product"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '2px solid #e9ecef'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div style={{ display: 'none', color: '#6c757d', fontSize: '3rem' }}>
                    <Image size={48} />
                  </div>
                </div>
              )}

              <form className="upload-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="nama_produk">
                      Nama Produk
                    </label>
                    <input
                      type="text"
                      id="nama_produk"
                      className="form-input"
                      placeholder="Contoh: Vitamin C 1000mg"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                      disabled={loading}
                      maxLength="100"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="harga">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      id="harga"
                      className="form-input"
                      placeholder="50000"
                      value={harga}
                      onChange={(e) => setHarga(e.target.value)}
                      required
                      disabled={loading}
                      min="1"
                      max="99999999"
                    />
                    {harga && (
                      <small style={{ color: '#6c757d', marginTop: '0.25rem', display: 'block' }}>
                        Rp {formatCurrency(harga)}
                      </small>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="stok">
                      Stok
                    </label>
                    <input
                      type="number"
                      id="stok"
                      className="form-input"
                      placeholder="100"
                      value={stok}
                      onChange={(e) => setStok(e.target.value)}
                      required
                      disabled={loading}
                      min="0"
                      max="9999"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="foto">
                      Foto Produk Baru (Opsional)
                    </label>
                    <div className="file-input-container">
                      <input
                        type="file"
                        id="foto"
                        className="file-input"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                      />
                      <div className={`file-input-display ${foto ? 'has-file' : ''}`}>
                        <div className="file-input-content">
                          <div className="file-input-icon">
                            {foto ? <CheckCircle size={20} /> : <FolderOpen size={20} />}
                          </div>
                          <div className="file-input-text">
                            {foto ? foto.name : 'Pilih foto baru (opsional)'}
                          </div>
                          <div className="file-input-subtext">
                            {foto
                              ? `${(foto.size / 1024 / 1024).toFixed(2)} MB`
                              : 'PNG, JPG, JPEG (Max 5MB)'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Menyimpan... {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">
                          <Save size={16} />
                        </span>
                        Simpan Perubahan
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/products')}
                    disabled={loading}
                    style={{ minWidth: '120px', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <X size={16} /> Batal
                  </button>
                </div>

                {loading && uploadProgress > 0 && (
                  <div className="upload-progress">
                    <div
                      className="upload-progress-bar"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </form>

              {message && (
                <div className={`upload-message ${isSuccess ? 'success' : 'error'}`}>
                  {isSuccess && <CheckCircle size={16} style={{ marginRight: '0.5rem' }} />}
                  {isError && <X size={16} style={{ marginRight: '0.5rem' }} />}
                  {displayMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProductPage;