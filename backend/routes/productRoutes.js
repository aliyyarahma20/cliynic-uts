const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const controller = require('../controllers/productController');

router.post('/products', upload.single('foto'), controller.uploadProduct);
router.get('/products', controller.getAllProducts);

router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const db = require('../db');
  try {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal hapus produk' });
  }
});

router.get('/products/:id', controller.getProductById);
router.put('/products/:id', upload.single('foto'), controller.updateProduct);



module.exports = router;
