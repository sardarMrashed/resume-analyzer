import { useState } from 'react'
import axios from 'axios'

const MAX_PDF_SIZE = 5 * 1024 * 1024
const API_URL = import.meta.env.VITE_API_URL || 'https://resume-analyzer-1im8.onrender.com'

function App() {
  const [file, setFile] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    setError('')
    setFeedback('')

    if (!file) {
      setError('Please select a PDF resume first.')
      return
    }
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.')
      return
    }
    if (file.size > MAX_PDF_SIZE) {
      setError('Your PDF must be 5 MB or smaller.')
      return
    }

    const formData = new FormData()
    formData.append('resume', file)
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        timeout: 90000
      })
      setFeedback(response.data.feedback || 'The analysis returned no feedback.')
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('The analysis took too long. Please try again.')
      } else {
        setError(err.response?.data?.error || 'Unable to analyze this PDF right now. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#f0f2f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      padding: 'clamp(16px, 5vw, 40px)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        background: 'white',
        borderRadius: '16px',
        padding: 'clamp(20px, 5vw, 48px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
      }}>
        <h1 style={{ textAlign: 'center', color: '#1a1a2e', marginBottom: '8px' }}>
          🤖 AI Resume Analyzer
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px' }}>
          Upload your resume and get AI-powered feedback
        </p>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '13px', marginBottom: '28px' }}>
          Your PDF text is sent to an external AI provider (Groq) for analysis. Please do not upload confidential information.
        </p>

        <label style={{
          display: 'block',
          border: '2px dashed #4f46e5',
          borderRadius: '12px',
          padding: '48px',
          cursor: 'pointer',
          background: file ? '#f0f0ff' : 'white',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          <input
            type="file"
            accept=".pdf"
            onChange={e => { setFile(e.target.files?.[0] || null); setError(''); setFeedback('') }}
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: '48px' }}>📄</div>
          <div style={{ color: '#4f46e5', fontWeight: 'bold', marginTop: '10px' }}>
            {file ? `✅ ${file.name}` : 'Click to upload your resume PDF'}
          </div>
          <div style={{ color: '#999', fontSize: '14px', marginTop: '5px' }}>
            PDF files only, up to 5 MB
          </div>
        </label>

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#ccc' : '#4f46e5',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '10px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
          {loading ? '⏳ Analyzing...' : '🚀 Analyze Resume'}
        </button>

        {error && (
          <p role="alert" style={{ marginTop: '20px', color: '#b91c1c', textAlign: 'center', lineHeight: '1.5' }}>
            {error}
          </p>
        )}

        {feedback && (
          <div style={{
            marginTop: '32px',
            background: '#fafafa',
            border: '1px solid #e5e7eb',
            borderLeft: '4px solid #4f46e5',
            borderRadius: '12px',
            padding: '28px',
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#374151',
            whiteSpace: 'pre-wrap',
          }}>
            <strong>📋 Your Resume Feedback</strong>
            <div style={{ marginTop: '12px' }}>{feedback}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App