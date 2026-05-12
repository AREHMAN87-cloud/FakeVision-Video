import BackLink from '../components/BackLink'

export default function DetectedMedia() {
  // TODO: Replace with actual detection history from state/API
  const detections = []

  return (
    <div className="page">
      <div className="container">
        <BackLink />

        <h2 className="page-heading">Detected Media</h2>
        <p className="page-subtitle">
          All images and videos you've analyzed.
        </p>

        {detections.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="empty-state__title">No detections yet</p>
            <p className="empty-state__desc">Analyze an image or video to see it here.</p>
          </div>
        ) : (
          <div className="detection-list">
            {detections.map((item, idx) => (
              <div key={idx} className="detection-item">
                <div className="detection-item__thumb">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="detection-item__info">
                  <p className="detection-item__name">{item.name}</p>
                  <p className="detection-item__meta">{item.type} • {item.date}</p>
                </div>
                <span className={`detection-item__result detection-item__result--${item.result}`}>
                  {item.result === 'fake' ? 'Fake' : 'Real'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
