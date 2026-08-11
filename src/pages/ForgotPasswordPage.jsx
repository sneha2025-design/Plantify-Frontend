import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { KeyRound, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email/Mobile, 2: OTP, 3: Reset Pass, 4: Success
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [otp, setOtp] = useState('123456'); // Pre-fill mock OTP for easy testing
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(emailOrMobile);
      if (res.success) {
        setStep(2);
      } else {
        setErrorMsg(res.message || 'Failed to send OTP');
      }
    } catch (err) {
      setErrorMsg(err.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(emailOrMobile, otp);
      if (res.success) {
        setStep(3);
      } else {
        setErrorMsg('Invalid or expired OTP');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Confirm password does not match new password');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword({
        emailOrMobile,
        otp,
        newPassword,
        confirmPassword
      });
      if (res.success) {
        setStep(4);
      } else {
        setErrorMsg(res.message || 'Password reset failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--color-emerald-700)', color: 'white', padding: '0.6rem', borderRadius: '12px', marginBottom: '1rem' }}>
            <KeyRound size={28} />
          </div>
          <h2 className="font-heading" style={{ fontSize: '2rem', color: 'var(--color-emerald-950)', marginBottom: '0.4rem' }}>
            Password Reset
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {step === 1 && 'Enter your registered email or mobile to receive an OTP'}
            {step === 2 && 'Enter the 6-digit verification code sent to you'}
            {step === 3 && 'Create a strong new password for your account'}
            {step === 4 && 'Your password has been successfully updated'}
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.8rem 1rem', background: 'var(--color-rose-100)', color: 'var(--color-rose-600)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
            {errorMsg}
          </div>
        )}

        {/* Step 1 Form */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Email Address or Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="flora@plantify.com or 9876543210"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.8rem 0.7rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
              {loading ? 'Generating OTP...' : 'Send OTP Code'}
            </button>
          </form>
        )}

        {/* Step 2 Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Enter 6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', textAlign: 'center', letterSpacing: '0.5rem', fontWeight: 800, fontSize: '1.2rem' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.4rem', textAlign: 'center' }}>Demo OTP Code: <strong>123456</strong></span>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
              {loading ? 'Verifying...' : 'Verify OTP Code'}
            </button>
          </form>
        )}

        {/* Step 3 Form */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
              {loading ? 'Resetting Password...' : 'Save New Password'}
            </button>
          </form>
        )}

        {/* Step 4 Success */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle2 size={56} style={{ color: 'var(--color-emerald-600)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>All active user sessions have been invalidated for security. You can now log in with your new password.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
              Go to Sign In
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Remembered your password? <Link to="/login" style={{ color: 'var(--color-emerald-700)', fontWeight: 700 }}>Back to Sign In</Link>
        </div>

      </div>
    </div>
  );
};
