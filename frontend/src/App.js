import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import UploadPage from './pages/UploadPage';
import AdminProductPage from './pages/AdminProductPage';
import EditProductPage from './pages/EditProductPage';

function App() {
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/admin/products" element={<AdminProductPage />} />
        <Route path="/admin/edit/:id" element={<EditProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
