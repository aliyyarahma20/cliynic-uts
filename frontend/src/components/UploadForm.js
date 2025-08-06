import React, { useState } from 'react';
import api from '../api';
import {
  Upload,
  Tag,
  DollarSign,
  Package,
  Camera,
  CheckCircle,
  X,
  FolderOpen,
  Rocket
} from 'lucide-react';
import '../styles/UploadForm.css';

function UploadForm() {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [foto, setFoto] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Ukuran file maksimal 5MB!');
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        setMessage('File harus berupa gambar!');
        return;
      }

      setFoto(file);
      setMessage(''); // Clear any previous error
    }
  };

  const resetForm = () => {
    setNama('');
    setHarga('');
    setStok('');
    setFoto(null);
    setUploadProgress(0);
    // Reset file input
    const fileInput = document.getElementById('foto');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUploadProgress(0);

    // Validasi form
    if (!nama.trim()) {
      setMessage('Nama produk tidak boleh kosong!');
      setLoading(false);
      return;
    }

    if (harga <= 0) {
      setMessage('Harga harus lebih dari 0!');
      setLoading(false);
      return;
    }

    if (stok < 0) {
      setMessage('Stok tidak boleh negatif!');
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
      const res = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setMessage('success:Produk berhasil diupload!');
      resetForm();

      // Auto clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (err) {
      console.error('Upload error:', err);
      if (err.response?.data?.message) {
        setMessage(`error:${err.response.data.message}`);
      } else {
        setMessage('error:Gagal upload produk. Silakan coba lagi.');
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

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-card">
          <div className="upload-header">
            <h1>
              <span className="upload-icon">
                <Upload size={24} />
              </span>
              Upload Produk Baru
            </h1>
            <p className="upload-subtitle">Tambahkan produk kesehatan ke dalam katalog</p>
          </div>

          <div className="upload-body">
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
                    Foto Produk
                  </label>
                  <div className="file-input-container">
                    <input
                      type="file"
                      id="foto"
                      className="file-input"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      disabled={loading}
                    />
                    <div className={`file-input-display ${foto ? 'has-file' : ''}`}>
                      <div className="file-input-content">
                        <div className="file-input-icon">
                          {foto ? <CheckCircle size={20} /> : <FolderOpen size={20} />}
                        </div>
                        <div className="file-input-text">
                          {foto ? foto.name : 'Pilih file gambar'}
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

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Mengupload... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <span className="btn-icon">
                      <Rocket size={16} />
                    </span>
                    Upload Produk
                  </>
                )}
              </button>

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
  );
}

export default UploadForm;