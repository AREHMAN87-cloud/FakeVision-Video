import { useState } from 'react'
import BackLink from '../components/BackLink'

export default function Settings() {
  const [displayName, setDisplayName] = useState('ABDUR REHMAN')
  const email = 'compeng123456789@gmail.com'

  const handleSave = () => {
    // TODO: Connect to API to save settings
    alert('Settings saved!')
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all detection history? This action cannot be undone.')) {
      // TODO: Clear history via API
      alert('History cleared!')
    }
  }

  const handleSignOut = () => {
    // TODO: Implement sign out
    alert('Signed out!')
  }

  return (
    <div className="page">
      <div className="container">
        <BackLink />

        <h2 className="page-heading">Settings</h2>
        <p className="page-subtitle">
          Manage your account and application preferences.
        </p>

        <div className="settings-section">
          {/* Account Card */}
          <div className="settings-card">
            <h3 className="settings-card__title">Account</h3>

            <label className="settings-label">Email</label>
            <p className="settings-value">{email}</p>

            <label className="settings-label" htmlFor="display-name">Display name</label>
            <input
              id="display-name"
              className="settings-input"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <button className="btn-save" onClick={handleSave} id="btn-save-settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save changes
            </button>
          </div>

          {/* Danger Zone Card */}
          <div className="settings-card settings-card--danger">
            <h3 className="settings-card__title settings-card__title--danger">Danger zone</h3>
            <div className="danger-actions">
              <button className="btn-danger" onClick={handleClearHistory} id="btn-clear-history">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Clear all history
              </button>
              <button className="btn-secondary" onClick={handleSignOut} id="btn-settings-signout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
