const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);      // Login & Register routes
app.use('/api', productRoutes);   // Produk routes

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
