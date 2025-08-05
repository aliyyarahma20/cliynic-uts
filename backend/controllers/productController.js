const db = require('../db');
const s3 = require('../s3');

exports.uploadProduct = async (req, res) => {
  try {
    const { nama_produk, harga, stok } = req.body; // tambahkan stok
    const file = req.file;

    if (!nama_produk || !harga || !stok || !file) {
      return res.status(400).json({ error: 'Semua data wajib diisi' });
    }

    const s3Res = await s3.upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `produk/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise();

    await db.execute(
      'INSERT INTO products (nama_produk, harga, stok, foto_url) VALUES (?, ?, ?, ?)',
      [nama_produk, harga, stok, s3Res.Location]
    );

    res.json({ message: 'Produk berhasil diupload', foto_url: s3Res.Location });
  } catch (err) {
    console.error('❌ Error upload:', err);
    res.status(500).json({ error: 'Gagal upload produk' });
  }
};

// HAPUS PRODUK
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
      const s3Res = await s3.upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `produk/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      }).promise();
      fotoUrl = s3Res.Location;
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
    res.status(500).json({ error: 'Gagal update produk' });
  }
};



exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error ambil produk:', err);
    res.status(500).json({ error: 'Gagal ambil data produk' });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal ambil produk' });
  }
};
