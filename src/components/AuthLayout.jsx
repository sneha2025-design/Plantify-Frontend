import Logo from './Logo'

export default function AuthLayout({ children, bgImage, variant }) {
  return (
    <div className="auth-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="auth-scrim" />
      <div className={`auth-content ${variant === 'register' ? 'auth-content--register' : ''}`}>
        <Logo />
        <div className="auth-card">{children}</div>
      </div>
    </div>
  )
}
