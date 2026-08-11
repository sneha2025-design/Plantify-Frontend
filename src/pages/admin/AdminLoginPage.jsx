import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import adminBgImg from '../../assets/admin_bg.jpg';

export const AdminLoginPage = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await loginAdmin(formData.emailOrMobile, formData.password);
    setLoading(false);

    if (res.success) {
      navigate('/admin', { replace: true });
    } else {
      setErrorMsg(res.message || 'Invalid email/mobile number or password');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        maxHeight: '100vh',
        maxWidth: '100vw',
        overflow: 'hidden',
        backgroundColor: '#040711',
        backgroundImage: `linear-gradient(to right, rgba(4, 7, 17, 0) 35%, #040711 65%), url(${adminBgImg})`,
        backgroundSize: 'auto 85%',
        backgroundPosition: '3vw center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 6vw',
        boxSizing: 'border-box'
      }}
    >
      {/* Right Side Form Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <div
          className="animate-fade-in"
          style={{
            width: '100%',
            background: 'rgba(11, 19, 34, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '1.6rem 2rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(30, 58, 95, 0.6)',
            border: '1px solid #1d3354',
            color: '#f8fafc'
          }}
        >
          {/* Security Lock Icon */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#0284c7',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
              boxShadow: '0 0 16px rgba(2, 132, 199, 0.5)'
            }}
          >
            <Lock size={20} />
          </div>

          {/* Title Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '0.25rem',
                letterSpacing: '0.01em'
              }}
            >
              Admin Portal
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Enter your credentials to access the dashboard
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '0.55rem 0.8rem',
                background: 'rgba(239, 68, 68, 0.15)',
                borderLeft: '4px solid #ef4444',
                color: '#fca5a5',
                borderRadius: '6px',
                fontSize: '0.82rem',
                marginBottom: '0.85rem',
                fontWeight: 500
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  required
                  name="admin_login_email"
                  autoComplete="off"
                  placeholder="admin@gmail.com"
                  value={formData.emailOrMobile}
                  onChange={(e) => setFormData({ ...formData, emailOrMobile: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.62rem 0.85rem 0.62rem 2.4rem',
                    fontSize: '0.86rem',
                    borderRadius: '8px',
                    border: '1px solid #1e293b',
                    background: '#080f1e',
                    color: '#f8fafc',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.75rem', color: '#0088cc' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="admin_login_password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.62rem 2.4rem 0.62rem 2.4rem',
                    fontSize: '0.86rem',
                    borderRadius: '8px',
                    border: '1px solid #1e293b',
                    background: '#080f1e',
                    color: '#f8fafc',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '0.75rem', color: '#0088cc' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.05rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#0088cc', width: '14px', height: '14px', borderRadius: '3px', cursor: 'pointer' }}
                />
                Remember me
              </label>
              <span style={{ color: '#0088cc', fontWeight: 600, cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>

            {/* Primary Cyan Blue Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.35rem',
                padding: '0.7rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #0088cc 0%, #0066a2 100%)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(0, 136, 204, 0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                opacity: loading ? 0.75 : 1
              }}
            >
              <Lock size={16} />
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem' }}>
            <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'underline' }}>
              Customer? Login here
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '0.85rem', fontSize: '0.78rem', color: '#475569', textAlign: 'center' }}>
          © 2025 Plantify Admin Panel. All rights reserved.
        </div>
      </div>
    </div>
  );
};
