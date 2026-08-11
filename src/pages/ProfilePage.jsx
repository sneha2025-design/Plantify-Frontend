import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { User, KeyRound, Shield, CheckCircle } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (passData.newPassword !== passData.confirmPassword) {
      setMsg({ type: 'error', text: 'Confirm password does not match new password' });
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.changePassword(passData);
      if (res.success) {
        setMsg({ type: 'success', text: 'Password updated successfully!' });
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMsg({ type: 'error', text: res.message || 'Could not change password' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Error updating password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      <h1 className="font-heading" style={{ fontSize: '2.4rem', color: 'var(--color-emerald-950)', marginBottom: '2rem' }}>
        Account Settings & Profile
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Account Info */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', color: 'var(--color-emerald-950)', marginBottom: '1.5rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-light)' }} className="font-heading">
            <User size={20} style={{ color: 'var(--color-emerald-700)' }} /> Personal Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.95rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</div>
              <div style={{ fontWeight: 700, color: 'var(--color-emerald-950)' }}>{user?.fullName}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Username</div>
              <div style={{ fontWeight: 700, color: 'var(--color-emerald-950)' }}>@{user?.username}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</div>
              <div style={{ fontWeight: 700, color: 'var(--color-emerald-950)' }}>{user?.email}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Account Role</div>
              <div style={{ marginTop: '4px' }}>
                <span className="badge badge-emerald">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', color: 'var(--color-emerald-950)', marginBottom: '1.5rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-light)' }} className="font-heading">
            <KeyRound size={20} style={{ color: 'var(--color-emerald-700)' }} /> Security & Password
          </h3>

          {msg.text && (
            <div style={{
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.2rem',
              fontSize: '0.88rem',
              background: msg.type === 'success' ? 'var(--color-emerald-100)' : 'var(--color-rose-100)',
              color: msg.type === 'success' ? 'var(--color-emerald-900)' : 'var(--color-rose-600)'
            }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Current Password</label>
              <input
                type="password"
                required
                value={passData.currentPassword}
                onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>New Password</label>
              <input
                type="password"
                required
                value={passData.newPassword}
                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Confirm New Password</label>
              <input
                type="password"
                required
                value={passData.confirmPassword}
                onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.8rem' }}>
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
