import { useState } from 'react'

const ICONS = {
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6.2 6.2l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
}

const EYE = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EYE_OFF = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.9 17.9A10.4 10.4 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 4.2-5.2M9.9 4.2A10.6 10.6 0 0 1 12 4c7 0 11 8 11 8a18.6 18.6 0 0 1-2.2 3.2M14.1 14.1a3 3 0 1 1-4.2-4.2" />
    <path d="M1 1l22 22" />
  </svg>
)

export default function FormField({
  label,
  icon,
  type = 'text',
  isPassword = false,
  error,
  ...inputProps
}) {
  const [visible, setVisible] = useState(false)
  const resolvedType = isPassword ? (visible ? 'text' : 'password') : type

  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div className={`form-input-wrap ${error ? 'has-error' : ''}`}>
        <span className="form-icon">{ICONS[icon]}</span>
        <input type={resolvedType} className="form-input" {...inputProps} />
        {isPassword && (
          <button
            type="button"
            className="form-eye"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? EYE_OFF : EYE}
          </button>
        )}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}
