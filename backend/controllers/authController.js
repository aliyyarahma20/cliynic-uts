const db = require('../db');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    await db.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, role || 'user']
    );
    res.json({ message: '✅ Registrasi berhasil' });
  } catch (err) {
    console.error('❌ Error register:', err);
    res.status(500).json({ error: 'Gagal registrasi' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }
    const user = rows[0];
    res.json({ message: '✅ Login berhasil', role: user.role });
  } catch (err) {
    console.error('❌ Error login:', err);
    res.status(500).json({ error: 'Gagal login' });
  }
};
