import { useState } from 'react'
import axios from 'axios'

function App() {
  const [file, setFile] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return alert('Please select a file!')
    const formData = new FormData()
    formData.append('resume', file)
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3001/analyze', formData)
      setFeedback(response.data.feedback)
    } catch (error) {
      alert(error.response?.data?.error || error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#f0f2f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      padding: '40px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
      }}>
        <h1 style={{ textAlign: 'center', color: '#1a1a2e', marginBottom: '8px' }}>
          🤖 AI Resume Analyzer
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px' }}>
          Upload your resume and get instant AI feedback
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
            onChange={e => setFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: '48px' }}>📄</div>
          <div style={{ color: '#4f46e5', fontWeight: 'bold', marginTop: '10px' }}>
            {file ? `✅ ${file.name}` : 'Click to upload your resume PDF'}
          </div>
          <div style={{ color: '#999', fontSize: '14px', marginTop: '5px' }}>
            PDF files only
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