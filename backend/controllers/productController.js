const db = require('../db');
const s3 = require('../s3');

const cdnDomain = "https://d2thf5qc7btvzh.cloudfront.net"; // GANTI SESUAI CDN

// ✅ UPLOAD PRODUK BARU
exports.uploadProduct = async (req, res) => {
  try {
    const { nama_produk, harga, stok } = req.body;
    const file = req.file;

    if (!nama_produk || !harga || !stok || !file) {
      return res.status(400).json({ error: 'Semua data wajib diisi' });
    }

    // Upload ke S3
    const key = `produk/${Date.now()}_${file.originalname}`;
    await s3.upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }).promise();

    // URL pakai CDN
    const fotoUrl = `${cdnDomain}/${key}`;

    // Simpan ke DB
    await db.execute(
      'INSERT INTO products (nama_produk, harga, stok, foto_url) VALUES (?, ?, ?, ?)',
      [nama_produk, harga, stok, fotoUrl]
    );

    res.json({ message: 'Produk berhasil diupload', foto_url: fotoUrl });
  } catch (err) {
    console.error('❌ Error upload:', err);
    res.status(500).json({ error: 'Gagal upload produk' });
  }
};

// ✅ HAPUS PRODUK
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal hapus produk' });
  }
};

// ✅ UPDATE PRODUK
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nama_produk, harga, stok } = req.body;
  const file = req.file;

  try {
    let fotoUrl;
    if (file) {
      // Upload ke S3
      const key = `produk/${Date.now()}_${file.originalname}`;
      await s3.upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }).promise();

      // URL pakai CDN
      fotoUrl = `${cdnDomain}/${key}`;
    }

    const query = fotoUrl
      ? 'UPDATE products SET nama_produk=?, harga=?, stok=?, foto_url=? WHERE id=?'
      : 'UPDATE products SET nama_produk=?, harga=?, stok=? WHERE id=?';
    const params = fotoUrl
      ? [nama_produk, harga, stok, fotoUrl, id]
      : [nama_produk, harga, stok, id];

    await db.execute(query, params);
    res.json({ message: 'Produk berhasil diupdate' });
  } catch (err) {
    console.error('❌ Error update:', err);
    res.status(500).json({ error: 'Gagal update produk' });
  }
};

// ✅ AMBIL SEMUA PRODUK
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error ambil produk:', err);
    res.status(500).json({ error: 'Gagal ambil data produk' });
  }
};

// ✅ AMBIL PRODUK BY ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Error ambil produk by ID:', err);
    res.status(500).json({ error: 'Gagal ambil produk' });
  }
};

