import React, { useState, useRef } from 'react'

export default function FileUpload({ onFileUploaded }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setError('Please upload a PDF, DOCX, or TXT file.')
      return
    }
    setError('')
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onFileUploaded(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div style={styles.wrap}>
      <div
        style={{ ...styles.zone, ...(dragging ? styles.zoneDrag : {}) }}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {loading ? (
          <div style={styles.spinnerWrap}>
            <div style={styles.spinner} />
            <p style={styles.hint}>Extracting text…</p>
          </div>
        ) : (
          <>
            <div style={styles.icon}>📄</div>
            <p style={styles.label}>Drop your file here, or <span style={styles.browse}>browse</span></p>
            <p style={styles.hint}>PDF · DOCX · TXT — up to 16 MB</p>
          </>
        )}
      </div>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  )
}

const styles = {
  wrap: { width: '100%' },
  zone: {
    border: '2px dashed var(--border)',
    borderRadius: 'var(--radius)',
    padding: '3rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    background: 'var(--surface)',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-sm)',
  },
  zoneDrag: {
    borderColor: 'var(--accent)',
    background: 'var(--accent-light)',
    boxShadow: 'var(--shadow-md)',
  },
  icon: { fontSize: '2.5rem', marginBottom: '1rem' },
  label: { fontSize: '1rem', color: 'var(--text)', marginBottom: '0.4rem' },
  browse: { color: 'var(--accent)', fontWeight: 500 },
  hint: { fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' },
  spinnerWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  spinner: {
    width: 32, height: 32,
    border: '3px solid var(--accent-light)',
    borderTop: '3px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  error: { marginTop: '0.8rem', color: 'var(--error)', fontSize: '0.85rem' },
}