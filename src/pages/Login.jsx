import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import ForgotPasswordModal from '../components/ForgotPasswordModal'
import { loginUser, loginWithGoogleToken } from '../services/authService'
import { signInWithGoogle } from '../services/googleAuth'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const e = {}
    if (!form.identifier.trim()) e.identifier = 'Email or mobile number is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(evt) {
    evt.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      await loginUser(form)
      navigate('/products')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid email/mobile number or password')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setServerError('')
    setGoogleLoading(true)
    try {
      const accessToken = await signInWithGoogle()
      await loginWithGoogleToken(accessToken)
      navigate('/products')
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Google sign-in failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <AuthLayout bgImage="/images/bg-login.jpg">
      <h2 className="card-title">Welcome Back!</h2>
      <p className="card-subtitle">Login to your account and continue your green journey</p>

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Email or Mobile Number"
          icon="mail"
          placeholder="Enter your email or mobile number"
          value={form.identifier}
          onChange={(e) => update('identifier', e.target.value)}
          error={errors.identifier}
        />
        <FormField
          label="Password"
          icon="lock"
          isPassword
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
        />

        <div className="form-row-between">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <button type="button" className="link-accent link-as-button" onClick={() => setShowForgotModal(true)}>
            Forgot Password?
          </button>
        </div>

        {serverError && <p className="form-server-error">{serverError}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>

        <div className="divider"><span>OR</span></div>

        <button type="button" className="btn-google" onClick={handleGoogleLogin} disabled={googleLoading}>
          <GoogleIcon /> {googleLoading ? 'Connecting…' : 'Login with Google'}
        </button>

        <p className="switch-text">
          Don't have an account? <Link to="/register" className="link-accent">Register</Link>
        </p>
      </form>

      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
    </AuthLayout>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4c-7.4 0-13.8 4.2-17.1 10.3z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5C29.6 35 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.1 39.8 15.9 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.5 5.5C41.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  )
}
