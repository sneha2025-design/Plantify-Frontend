import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Instagram, Facebook, Youtube } from 'lucide-react';

export const Footer = () => {
  const location = useLocation();
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Do NOT render footer on login pages
  if (location.pathname === '/login' || location.pathname === '/admin/login') {
    return null;
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSubscribed(true);
      setEmailSub('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer style={{ background: '#022c22', color: '#e2e8f0', paddingTop: '3.5rem', paddingBottom: '2rem', marginTop: '4rem' }}>
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Newsletter Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              <Leaf size={18} style={{ color: '#34d399' }} /> Stay Updated
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.5' }}>
              Get plant care tips, exclusive offers & more!
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                style={{
                  padding: '0.65rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: '#ffffff',
                  color: '#111827',
                  fontSize: '0.82rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
              <button type="submit" style={{ background: '#047857', color: 'white', border: '1px solid #059669', borderRadius: '6px', padding: '0.65rem 1rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                {subscribed ? 'Done!' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.82rem', color: '#94a3b8' }}>
              <Link to="/shop">About Us</Link>
              <Link to="/shop">Contact Us</Link>
              <Link to="/shop">FAQs</Link>
              <Link to="/shop">Shipping Policy</Link>
              <Link to="/shop">Return Policy</Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>Customer Service</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.82rem', color: '#94a3b8' }}>
              <Link to="/orders">My Orders</Link>
              <Link to="/orders">Track Order</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/shop">Help Center</Link>
              <Link to="/shop">Terms & Conditions</Link>
            </div>
          </div>

          {/* Follow Us & We Accept */}
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.8rem' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.45rem', borderRadius: '50%', display: 'flex', color: 'white' }}><Instagram size={15} /></span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.45rem', borderRadius: '50%', display: 'flex', color: 'white' }}><Facebook size={15} /></span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.45rem', borderRadius: '50%', display: 'flex', color: 'white' }}><Youtube size={15} /></span>
            </div>

            <h4 style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.8rem' }}>We Accept</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ background: '#ffffff', color: '#1e293b', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.7rem' }}>VISA</span>
              <span style={{ background: '#ffffff', color: '#1e293b', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.7rem' }}>Mastercard</span>
              <span style={{ background: '#047857', color: '#ffffff', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.7rem' }}>UPI</span>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          © {new Date().getFullYear()} Plantify. All rights reserved. <Leaf size={12} style={{ color: '#34d399' }} />
        </div>

      </div>
    </footer>
  );
};
