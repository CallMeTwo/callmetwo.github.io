import { useState } from 'react'

export default function App() {
  const [data, setData] = useState('')

  const handleInputChange = (e) => {
    setData(e.target.value)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Data Analyzer</h1>
      <p>Upload or paste your data to analyze and visualize it.</p>

      <textarea
        placeholder="Enter your data (comma-separated or one per line)"
        value={data}
        onChange={handleInputChange}
        style={{
          width: '100%',
          height: '200px',
          padding: '10px',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}
      />

      <button style={{
        marginTop: '10px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer'
      }}>
        Analyze Data
      </button>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Features coming soon:</h3>
        <ul>
          <li>Data exploration and summary statistics</li>
          <li>Data visualization (charts, graphs)</li>
          <li>Statistical analysis</li>
          <li>Export results</li>
        </ul>
      </div>
    </div>
  )
}
