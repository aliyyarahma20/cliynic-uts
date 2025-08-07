import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Package, Upload, LogOut, Menu, X } from 'lucide-react';
import '../styles/AdminNavbar.css'; // Import CSS AdminNavbar

function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const username = userData.username || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('user'); // hapus session user
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-container">
        <Link to="/admin/products" className="navbar-brand">
          <Heart className="nav-icon" size={20} />
          HealthStore
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-nav">
          <li>
            <Link to="/admin/products" className="nav-link">
              <Package className="nav-icon" size={18} />
              Kelola Produk
            </Link>
          </li>
          <li>
            <Link to="/upload" className="nav-link">
              <Upload className="nav-icon" size={18} />
              Upload Produk
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut className="nav-icon" size={18} />
              Logout
            </button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <ul className={`navbar-nav mobile ${isMobileMenuOpen ? 'show' : ''}`}>
          <li>
            <Link
              to="/admin/products"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Package className="nav-icon" size={18} />
              Kelola Produk
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Upload className="nav-icon" size={18} />
              Upload Produk
            </Link>
          </li>
          <li className="user-info">
            <div className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut className="nav-icon" size={18} />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNavbar;
