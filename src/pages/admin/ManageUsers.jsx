import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { Users, Shield, Edit, X, CheckCircle2, AlertCircle, Key } from 'lucide-react';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [notification, setNotification] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    mobileNumber: '',
    password: '',
    role: 'CUSTOMER'
  });

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('error', err.message || 'Failed to load user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      fullName: user.fullName || '',
      mobileNumber: user.mobileNumber || '',
      password: '', // Leave empty unless admin wants to update password
      role: user.role || 'CUSTOMER'
    });
    setModalOpen(true);
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (window.confirm(`Are you sure you want to change role of user "${user.fullName || user.username}" to ${newRole}?`)) {
      try {
        const res = await adminApi.updateUserRole(user.userId, newRole);
        if (res.success) {
          showToast('success', `User "${user.username}" role updated to ${newRole}`);
          loadUsers();
        }
      } catch (err) {
        showToast('error', err.message || 'Failed to update user role');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });

    if (!formData.username.trim() || formData.username.trim().length < 3) {
      showToast('error', 'Username must be at least 3 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      showToast('error', 'Please enter a valid email address');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      showToast('error', 'New password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        password: formData.password ? formData.password : undefined,
        role: formData.role
      };

      const res = await adminApi.updateUser(selectedUser.userId, payload);
      if (res.success) {
        showToast('success', `Successfully updated user details for "${formData.username}"`);
        setModalOpen(false);
        loadUsers();
      } else {
        showToast('error', res.message || 'Failed to update user');
      }
    } catch (err) {
      showToast('error', err.message || 'Validation error updating user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1200px' }}>
      
      {/* Toast Notification Banner */}
      {notification.message && (
        <div style={{
          padding: '0.9rem 1.2rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          background: notification.type === 'success' ? '#d1fae5' : '#ffe4e6',
          color: notification.type === 'success' ? '#065f46' : '#9f1239',
          border: `1px solid ${notification.type === 'success' ? '#6ee7b7' : '#fca5a5'}`
        }}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 className="font-heading" style={{ fontSize: '2.2rem', color: '#047857' }}>User Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>View registered users, modify credentials, reset passwords, or assign administrative roles.</p>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading registered users...</div>
      ) : (
        <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.8rem' }}>Full Name</th>
                <th style={{ padding: '0.8rem' }}>Username</th>
                <th style={{ padding: '0.8rem' }}>Email Address</th>
                <th style={{ padding: '0.8rem' }}>Role</th>
                <th style={{ padding: '0.8rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.userId} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{u.fullName || '—'}</td>
                  <td style={{ padding: '0.8rem', color: 'var(--color-emerald-800)', fontWeight: 600 }}>@{u.username}</td>
                  <td style={{ padding: '0.8rem' }}>{u.email}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.75rem' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEditModal(u)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem', marginRight: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit size={14} /> Edit User
                    </button>
                    <button
                      onClick={() => handleRoleToggle(u)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}
                    >
                      Set to {u.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Modal */}
      {modalOpen && selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '2rem', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#047857' }}>
                Edit Account: @{selectedUser.username}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Username *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Account Role *</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', fontWeight: 700 }}
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div style={{ borderTop: '1px dashed #d1d5db', paddingTop: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Key size={14} /> Password Reset (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Enter new password to reset (or leave blank)"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Password will be securely re-hashed using BCrypt before storing.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ background: '#047857' }}>
                  {submitting ? 'Saving...' : 'Update Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
