import { useState } from 'react'
import Navbar from './components/Navbar'

export default function App() {
  const [data, setData] = useState('')

  const handleInputChange = (e) => {
    setData(e.target.value)
  }

  return (
    <div style={styles.appContainer}>
      <Navbar breadcrumbs={[{ label: 'Data Analyzer' }]} />

      <header style={styles.header}>
        <h1 style={styles.mainTitle}>📊 Data Analyzer</h1>
        <p style={styles.subtitle}>Upload or paste your data to analyze and visualize it</p>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.inputSection}>
          <h2 style={styles.sectionTitle}>Enter Your Data</h2>
          <p style={styles.sectionDescription}>
            Paste your data (comma-separated or one value per line)
          </p>

          <textarea
            placeholder="Example: 10, 20, 30, 40, 50&#10;or&#10;10&#10;20&#10;30&#10;40&#10;50"
            value={data}
            onChange={handleInputChange}
            style={styles.textarea}
          />

          <button style={styles.analyzeButton}>
            Analyze Data
          </button>
        </div>

        <div style={styles.featuresSection}>
          <h3 style={styles.featuresTitle}>Features Coming Soon:</h3>
          <ul style={styles.featuresList}>
            <li>Data exploration and summary statistics</li>
            <li>Data visualization (charts, graphs)</li>
            <li>Statistical analysis</li>
            <li>Export results</li>
          </ul>
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Data analysis tools for educational and analytical purposes
        </p>
      </footer>
    </div>
  )
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center'
  },
  mainTitle: {
    margin: '0 0 10px 0',
    fontSize: '32px',
    fontWeight: 'bold'
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9
  },
  mainContent: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
    flex: 1
  },
  inputSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    color: '#333',
    marginTop: 0,
    marginBottom: '10px',
    fontSize: '20px'
  },
  sectionDescription: {
    color: '#666',
    marginBottom: '15px',
    fontSize: '14px'
  },
  textarea: {
    width: '100%',
    height: '200px',
    padding: '12px',
    fontSize: '14px',
    fontFamily: 'monospace',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    marginBottom: '15px',
    resize: 'vertical'
  },
  analyzeButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  },
  featuresSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  featuresTitle: {
    color: '#333',
    marginTop: 0,
    marginBottom: '15px',
    fontSize: '18px'
  },
  featuresList: {
    color: '#666',
    lineHeight: '1.8',
    marginBottom: 0
  },
  footer: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    textAlign: 'center',
    marginTop: 'auto',
    borderTop: '1px solid #ddd'
  },
  footerText: {
    margin: 0,
    fontSize: '13px',
    color: '#666'
  }
}
