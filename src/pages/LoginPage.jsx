import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, Eye, EyeOff, ShieldCheck, Truck, Heart } from 'lucide-react';
import customerBgImg from '../assets/customer_bg.jpg';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(formData.emailOrMobile, formData.password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from === '/admin' ? '/' : from, { replace: true });
      }
    } else {
      setErrorMsg(res.message || 'Invalid email/mobile number or password');
    }
  };

  return (
    <div className="customer-login-container" style={{ backgroundImage: `url(${customerBgImg})` }}>
      {/* Left Branding Section (42%) */}
      <div className="customer-login-left">
        <div>
          {/* Logo & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <div style={{ background: '#16a34a', color: 'white', padding: '0.35rem', borderRadius: '50%', display: 'flex' }}>
              <Leaf size={18} />
            </div>
            <div>
              <div className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857', lineHeight: 1 }}>Plantify</div>
              <div style={{ fontSize: '0.68rem', color: '#15803d', fontWeight: 600, letterSpacing: '0.04em' }}>Grow Better. Live Better.</div>
            </div>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.2', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>
            Welcome Back<br />
            <span className="font-heading" style={{ color: '#047857', fontStyle: 'italic', fontWeight: 700 }}>To Your Green Space</span>
          </h1>
          
          <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.4', maxWidth: '480px', marginBottom: '0.9rem' }}>
            Sign in to manage your garden, track your orders, save your wishlist, and discover a greener lifestyle.
          </p>

          {/* Three Feature Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '480px' }}>
            <div className="customer-feature-item">
              <div className="customer-feature-icon" style={{ width: '32px', height: '32px' }}>
                <ShieldCheck size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0f172a' }}>Secure & Protected</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Your account is secured with 256-bit SSL encryption.</div>
              </div>
            </div>

            <div className="customer-feature-item">
              <div className="customer-feature-icon" style={{ width: '32px', height: '32px' }}>
                <Truck size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0f172a' }}>Smart Order Tracking</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Track deliveries and order history instantly.</div>
              </div>
            </div>

            <div className="customer-feature-item">
              <div className="customer-feature-icon" style={{ width: '32px', height: '32px' }}>
                <Heart size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0f172a' }}>Save Your Wishlist</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Save your favorite plants and receive restock alerts.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Section (58%) */}
      <div className="customer-login-right">
        <div className="customer-login-card animate-fade-in">
          
          {/* Top Circular Green Badge */}
          <div className="customer-card-badge" style={{ width: '42px', height: '42px', margin: '0 auto 0.5rem auto' }}>
            <Leaf size={20} />
          </div>

          {/* Heading & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
            <h2 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b', marginBottom: '0.15rem' }}>
              Welcome Back
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
              Sign in to manage your garden & order history
            </p>
          </div>

          {errorMsg && (
            <div style={{
              padding: '0.6rem 0.8rem',
              background: '#fef2f2',
              borderLeft: '4px solid #ef4444',
              color: '#991b1b',
              borderRadius: '6px',
              fontSize: '0.8rem',
              marginBottom: '0.8rem',
              fontWeight: 500
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Email Address or 10-Digit Mobile
              </label>
              <div className="customer-input-wrapper">
                <input
                  type="text"
                  required
                  name="login_email_or_mobile"
                  autoComplete="off"
                  placeholder="flora@plantify.com or 9876543210"
                  value={formData.emailOrMobile}
                  onChange={(e) => setFormData({ ...formData, emailOrMobile: e.target.value })}
                  style={{ padding: '0.55rem 0.75rem 0.55rem 2.2rem', fontSize: '0.85rem' }}
                />
                <Mail size={15} style={{ position: 'absolute', left: '0.75rem', color: '#94a3b8' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                  Forgot Password?
                </Link>
              </div>
              <div className="customer-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="login_password_no_autofill"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ padding: '0.55rem 0.75rem 0.55rem 2.2rem', fontSize: '0.85rem' }}
                />
                <Lock size={15} style={{ position: 'absolute', left: '0.75rem', color: '#94a3b8' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="customer-btn-gradient" style={{ marginTop: '0.2rem', padding: '0.65rem', fontSize: '0.88rem' }}>
              {loading ? 'Signing In...' : 'Sign In to Account'}
            </button>
          </form>


          <div style={{ height: '1px', background: '#e2e8f0', margin: '0.75rem 0 0.5rem 0' }} />

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
            Don't have an account? <Link to="/register" style={{ color: '#16a34a', fontWeight: 700 }}>Register Now</Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '0.4rem', fontSize: '0.75rem' }}>
            <Link to="/admin/login" style={{ color: '#94a3b8', textDecoration: 'underline' }}>
              Admin? Login here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
