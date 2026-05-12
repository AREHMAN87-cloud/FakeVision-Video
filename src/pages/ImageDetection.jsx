import { useState } from 'react'
import BackLink from '../components/BackLink'
import UploadArea from '../components/UploadArea'

export default function ImageDetection() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!file) return
    
    setAnalyzing(true)
    setError(null)
    setResult(null)
    try {
      const formData = new FormData()
      // The API expects 'video' as the key even for image analysis
      formData.append('video', file)
      
      const response = await fetch('http://18.209.108.110:5000/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = `Server responded with ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (e) {
          // Fallback to status text if JSON parsing fails
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      if (data.success) {
        setResult(data)
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (err) {
      console.error('Analysis Error:', err)
      setError(err.message || 'Failed to connect to detection server')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="page">
      <div className="container">
        <BackLink />

        <h2 className="page-heading">Image Detection</h2>
        <p className="page-subtitle">
          Upload an image (png, jpg, webp) to check whether it's AI-generated.
        </p>

        {!analyzing && !result && (
          <>
            <UploadArea
              accept="image/png, image/jpeg, image/webp"
              title="Drag & drop an image"
              subtitle="or click to browse from your computer"
              formats="PNG, JPG, WEBP up to 20MB"
              onFileSelect={setFile}
            />

            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              className="btn-analyze"
              onClick={handleAnalyze}
              disabled={!file}
              id="btn-analyze-image"
            >
              Analyze Image
            </button>
          </>
        )}

        {analyzing && (
          <div className="analysis-overlay">
            <div className="scanner-container">
              <div className="scanner-line"></div>
              <svg className="pulsating-brain" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.16z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.16z" />
              </svg>
            </div>
            <h3 className="analysis-status">Deep Analysis in Progress...</h3>
            <p className="analysis-eta">Analyzing pixels and metadata for AI patterns.</p>
          </div>
        )}

        {result && (
          <div className="result-container">
            <div className="result-card">
              <div className="result-header">
                <div className={`result-badge result-badge--${result.prediction.toLowerCase()}`}>
                  {result.prediction === 'FAKE' ? (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Deepfake Detected
                    </>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Likely Authentic
                    </>
                  )}
                </div>
              </div>

              <div className="confidence-section">
                <div className="confidence-label">
                  <span>Confidence Level</span>
                  <span className="confidence-value">{result.confidence.toFixed(1)}%</span>
                </div>
                <div className="confidence-bar-bg">
                  <div 
                    className={`confidence-bar-fill confidence-bar-fill--${result.prediction.toLowerCase()}`}
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>

              <div className="result-actions">
                <button className="btn-reset" onClick={handleReset}>
                  Analyze Another Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

