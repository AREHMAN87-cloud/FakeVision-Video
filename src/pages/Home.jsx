import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const features = [
  {
    id: 'image',
    title: 'Image Model',
    desc: 'Detect AI-generated or manipulated images.',
    path: '/image-detection',
    iconClass: 'feature-card__icon--image',
    blob: 'var(--gradient-blob-1)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: 'video',
    title: 'Video Model',
    desc: 'Frame-by-frame deepfake video analysis.',
    path: '/video-detection',
    iconClass: 'feature-card__icon--video',
    blob: 'var(--gradient-blob-2)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="16" height="16" rx="2" />
        <path d="M22 4L18 8V16L22 20V4Z" />
      </svg>
    ),
  },
  {
    id: 'detected',
    title: 'Detected Media',
    desc: 'Browse history of past detections.',
    path: '/detected-media',
    iconClass: 'feature-card__icon--detected',
    blob: 'var(--gradient-blob-3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  {
    id: 'settings',
    title: 'Settings',
    desc: 'Manage models, thresholds, and account.',
    path: '/settings',
    iconClass: 'feature-card__icon--settings',
    blob: 'var(--gradient-blob-4)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="container">
        <Header />

        <section style={{ marginTop: '24px' }}>
          <h2 className="page-heading">What would you like to detect?</h2>
          <p className="page-subtitle">
            Pick a model to start. Image detection is live — video and history coming soon.
          </p>
        </section>

        <div className="cards-grid">
          {features.map((f) => (
            <div
              key={f.id}
              className="feature-card"
              onClick={() => navigate(f.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(f.path)}
              id={`card-${f.id}`}
            >
              <div
                className="feature-card__blob"
                style={{ background: f.blob }}
              />
              <div className={`feature-card__icon ${f.iconClass}`}>
                {f.icon}
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
