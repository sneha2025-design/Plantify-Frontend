import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import { registerUser, loginWithGoogleToken } from '../services/authService'
import { signInWithGoogle } from '../services/googleAuth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.mobileNumber.trim()) e.mobileNumber = 'Mobile number is required'
    else if (!/^\+?[0-9]{7,15}$/.test(form.mobileNumber.trim())) e.mobileNumber = 'Enter a valid mobile number'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Use at least 8 characters'
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match'
    if (!agree) e.agree = 'You must accept the Terms & Conditions'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(evt) {
    evt.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      await registerUser(form)
      navigate('/login')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignup() {
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
    <AuthLayout bgImage="/images/bg-register.jpg" variant="register">
      <h2 className="card-title">Create Account</h2>
      <p className="card-subtitle">Join Plantify and bring more green to your life!</p>

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Full Name"
          icon="user"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          error={errors.fullName}
        />
        <FormField
          label="Email"
          icon="mail"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email}
        />
        <FormField
          label="Mobile Number"
          icon="phone"
          placeholder="Enter your mobile number"
          value={form.mobileNumber}
          onChange={(e) => update('mobileNumber', e.target.value)}
          error={errors.mobileNumber}
        />
        <FormField
          label="Password"
          icon="lock"
          isPassword
          placeholder="Create a password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
        />
        <FormField
          label="Confirm Password"
          icon="lock"
          isPassword
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
        />

        <label className="checkbox-label agree-row">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          I agree to the <a href="#" className="link-accent">Terms &amp; Conditions</a>
        </label>
        {errors.agree && <span className="form-error">{errors.agree}</span>}

        {serverError && <p className="form-server-error">{serverError}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </button>

        <div className="divider"><span>OR</span></div>

        <button type="button" className="btn-google" onClick={handleGoogleSignup} disabled={googleLoading}>
          <GoogleIcon /> {googleLoading ? 'Connecting…' : 'Sign up with Google'}
        </button>

        <p className="switch-text">
          Already have an account? <Link to="/login" className="link-accent">Login</Link>
        </p>
      </form>
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
