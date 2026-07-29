import { useState } from 'react'
import { requestOtp, verifyOtp, resetPassword } from '../services/authService'

// Multi-step: 1) enter email -> request OTP, 2) enter OTP -> verify,
// 3) enter new password -> reset. Same modal, same styling throughout.
export default function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRequestOtp(evt) {
    evt.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address')
      return
    }
    setError('')
    setLoading(true)
    try {
      await requestOtp(email)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(evt) {
    evt.preventDefault()
    if (!otp.trim()) {
      setError('Enter the code you received')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await verifyOtp(email, otp.trim())
      setResetToken(data.resetToken)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(evt) {
    evt.preventDefault()
    if (!password || password.length < 8) {
      setError('Use at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setLoading(true)
    try {
      await resetPassword({ token: resetToken, newPassword: password, confirmPassword })
      setStep(4)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        {step === 1 && (
          <>
            <h3 className="card-title" style={{ fontSize: 20 }}>Reset your password</h3>
            <p className="card-subtitle">Enter the email linked to your account and we'll send you a verification code.</p>
            <form onSubmit={handleRequestOtp}>
              <div className="form-field">
                <label className="form-label">Email</label>
                <div className={`form-input-wrap ${error ? 'has-error' : ''}`}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>
                {error && <span className="form-error">{error}</span>}
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending…' : 'Send verification code'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="card-title" style={{ fontSize: 20 }}>Enter verification code</h3>
            <p className="card-subtitle">
              We sent a 6-digit code to <strong>{email}</strong>. It's valid for 10 minutes.
              (No email server configured yet? Check the backend console for the code.)
            </p>
            <form onSubmit={handleVerifyOtp}>
              <div className="form-field">
                <label className="form-label">Verification code</label>
                <div className={`form-input-wrap ${error ? 'has-error' : ''}`}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="form-input"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                </div>
                {error && <span className="form-error">{error}</span>}
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Verifying…' : 'Verify code'}
              </button>
              <button
                type="button"
                className="link-accent link-as-button"
                style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: 14 }}
                onClick={() => setStep(1)}
              >
                Use a different email
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="card-title" style={{ fontSize: 20 }}>Set a new password</h3>
            <p className="card-subtitle">Choose a new password for your Plantify account.</p>
            <form onSubmit={handleResetPassword}>
              <div className="form-field">
                <label className="form-label">New Password</label>
                <div className={`form-input-wrap ${error ? 'has-error' : ''}`}>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Confirm Password</label>
                <div className={`form-input-wrap ${error ? 'has-error' : ''}`}>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {error && <span className="form-error">{error}</span>}
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </>
        )}

        {step === 4 && (
          <>
            <h3 className="card-title" style={{ fontSize: 20 }}>Password updated</h3>
            <p className="card-subtitle">You can now log in with your new password.</p>
            <button className="btn-primary" onClick={onClose}>Done</button>
          </>
        )}
      </div>
    </div>
  )
}
