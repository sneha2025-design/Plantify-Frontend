import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, User, Sun, Moon, LogOut, LayoutDashboard, Leaf, Search, ChevronDown, Package, ArrowLeft, Heart, Truck } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart, setIsDrawerOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/' || location.pathname === '';
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const currentPath = location.pathname;
    const authRoutes = ['/login', '/register', '/forgot-password'];
    
    if (!authRoutes.includes(currentPath)) {
      try {
        const stack = JSON.parse(sessionStorage.getItem('plantify_nav_stack') || '[]');
        if (stack[stack.length - 1] !== currentPath) {
          stack.push(currentPath);
          if (stack.length > 15) stack.shift();
          sessionStorage.setItem('plantify_nav_stack', JSON.stringify(stack));
        }
      } catch (err) {
        console.error('Error recording navigation history:', err);
      }
    }
  }, [location.pathname]);

  const handleBackClick = () => {
    try {
      const stack = JSON.parse(sessionStorage.getItem('plantify_nav_stack') || '[]');
      stack.pop();
      let targetPath = stack.pop();
      sessionStorage.setItem('plantify_nav_stack', JSON.stringify(stack));

      if (targetPath && targetPath !== location.pathname) {
        navigate(targetPath);
      } else {
        navigate(isAdminPage ? '/admin' : '/');
      }
    } catch (err) {
      navigate(isAdminPage ? '/admin' : '/');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="glass-card" style={{ position: 'sticky', top: 0, zIndex: 50, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', background: 'var(--bg-surface)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '1rem' }}>
        
        {/* Left Side: Smart Back Button + Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexShrink: 0 }}>
          {!isHomePage && (
            <button
              onClick={handleBackClick}
              title="Go to Previous Page"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.45rem',
                borderRadius: '50%',
                background: 'var(--bg-primary)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-light)'
              }}
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <Link to={isAdminPage ? "/admin" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem', fontWeight: 800, color: '#047857' }}>
            <div style={{ background: '#047857', color: 'white', padding: '0.35rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={18} />
            </div>
            <span className="font-heading" style={{ color: '#047857', fontWeight: 800 }}>Plantify</span>
          </Link>
        </div>

        {/* Centered Search Bar or Admin Title */}
        {!isAdminPage ? (
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 450px', maxWidth: '460px', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search plants, pots, seeds, tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px 0 0 6px',
                  border: '1px solid #d1d5db',
                  borderRight: 'none',
                  background: '#ffffff',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  height: '38px'
                }}
              />
              <button
                type="submit"
                style={{
                  height: '38px',
                  width: '42px',
                  background: '#047857',
                  color: 'white',
                  borderRadius: '0 6px 6px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Search size={16} />
              </button>
            </div>
          </form>
        ) : (
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '0.35rem 0.85rem', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
            Admin Management Portal
          </div>
        )}

        {/* Right Side Actions & Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexShrink: 0, fontSize: '0.88rem' }}>
          {isAdminPage ? (
            <>
              <Link to="/admin" style={{ fontWeight: 600, color: location.pathname === '/admin' ? '#047857' : 'var(--text-main)' }}>Dashboard</Link>
              <Link to="/admin/products" style={{ fontWeight: 600, color: location.pathname === '/admin/products' ? '#047857' : 'var(--text-main)' }}>Products</Link>
              <Link to="/admin/users" style={{ fontWeight: 600, color: location.pathname === '/admin/users' ? '#047857' : 'var(--text-main)' }}>Users</Link>
              <Link to="/admin/orders" style={{ fontWeight: 600, color: location.pathname === '/admin/orders' ? '#047857' : 'var(--text-main)' }}>Orders</Link>
            </>
          ) : (
            <>
              <Link to="/shop" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Shop</Link>
              <Link to="/orders" style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={15} /> Track Order
              </Link>
              <Link to="/wishlist" style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Heart size={15} /> Wishlist
              </Link>
            </>
          )}
          
          {/* Dark / Light Mode Toggle */}
          <button onClick={toggleTheme} title="Toggle Theme" style={{ padding: '0.4rem', color: 'var(--text-main)', display: 'flex' }}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Cart Icon with Count Badge (Hidden on Admin pages) */}
          {!isAdminPage && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              style={{ position: 'relative', padding: '0.4rem', color: 'var(--text-main)', display: 'flex' }}
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cart.totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  background: '#047857',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cart.totalItems}
                </span>
              )}
            </button>
          )}

          {/* User Avatar + Dropdown (Matching Image 1: Sneha v) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.2rem 0.4rem',
                borderRadius: '9999px',
                color: 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.88rem'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#111827', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} />
              </div>
              <span>{isAuthenticated ? (user?.fullName ? user.fullName.split(' ')[0] : (user?.username || 'Account')) : 'Account'}</span>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {dropdownOpen && (
              <div
                className="glass-card animate-fade-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: '180px',
                  padding: '0.4rem 0',
                  zIndex: 60,
                  background: 'var(--bg-surface)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      <User size={15} /> Profile Settings
                    </Link>
                    <Link to="/orders" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      <Package size={15} /> Order History
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#047857', fontWeight: 700 }}>
                        <LayoutDashboard size={15} /> Admin Panel
                      </Link>
                    )}
                    <div style={{ height: '1px', background: 'var(--border-light)', margin: '0.3rem 0' }} />
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--color-rose-600)', width: '100%', textAlign: 'left' }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#047857', fontWeight: 700 }}>
                      Register Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};
