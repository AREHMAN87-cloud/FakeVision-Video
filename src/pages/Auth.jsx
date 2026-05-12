import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulated authentication
    navigate('/')
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side: Info */}
        <div className="auth-info">
          <div className="badge-defense">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 11 12 14 22 4" />
            </svg>
            Deepfake Defense
          </div>
          
          <h1 className="auth-title">Fake Vision</h1>
          
          <p className="auth-subtitle">
            See through synthetic media. Detect AI-generated images and videos with confidence.
          </p>
          
          <div className="auth-features">
            <div className="auth-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Image & video deepfake analysis
            </div>
            <div className="auth-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Confidence-scored verdicts
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              {isLogin ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              )}
            </div>
            <div className="auth-header-text">
              <h2>{isLogin ? 'Sign in' : 'Create account'}</h2>
              <p>{isLogin ? 'Access your detection dashboard' : 'Start detecting deepfakes in seconds'}</p>
            </div>
          </div>

          <div className="auth-tabs">
            <button 
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Sign in
            </button>
            <button 
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Display name</label>
                <input 
                  id="name"
                  type="text" 
                  className="auth-input" 
                  placeholder="Your name" 
                  required 
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                className="auth-input" 
                placeholder="you@example.com" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                className="auth-input" 
                placeholder="••••••••" 
                required 
              />
            </div>

            <button type="submit" className="btn-auth">
              {isLogin ? 'Enter Fake Vision' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
