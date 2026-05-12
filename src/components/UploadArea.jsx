import { useRef, useState } from 'react'

export default function UploadArea({
  accept,
  title,
  subtitle,
  formats,
  onFileSelect
}) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    setSelectedFile(null)
    onFileSelect?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="upload-section">
      <div
        className={`upload-dropzone${dragOver ? ' drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={title}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
        />

        <div className="upload-dropzone__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0B1120" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <p className="upload-dropzone__title">{title}</p>
        <p className="upload-dropzone__subtitle">{subtitle}</p>
        <p className="upload-dropzone__formats">{formats}</p>

        {selectedFile && (
          <div className="upload-preview" onClick={(e) => e.stopPropagation()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="upload-preview__name">{selectedFile.name}</span>
            <span className="upload-preview__size">{formatFileSize(selectedFile.size)}</span>
            <button className="upload-preview__remove" onClick={handleRemove} title="Remove file">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
