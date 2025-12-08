import { useState } from 'react'

export default function App() {
  const [formData, setFormData] = useState({})
  const [result, setResult] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || value
    }))
  }

  const handleCalculate = (e) => {
    e.preventDefault()
    // Placeholder for calculation logic
    setResult({
      score: 75,
      interpretation: 'Results will be calculated based on input values'
    })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Clinical Model Calculator</h1>
      <p>Enter clinical variables to calculate model scores.</p>

      <form onSubmit={handleCalculate}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="var1" style={{ display: 'block', marginBottom: '5px' }}>
            Variable 1:
          </label>
          <input
            type="number"
            id="var1"
            name="var1"
            placeholder="Enter value"
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="var2" style={{ display: 'block', marginBottom: '5px' }}>
            Variable 2:
          </label>
          <input
            type="number"
            id="var2"
            name="var2"
            placeholder="Enter value"
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Calculate
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
          <h3>Result:</h3>
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Interpretation:</strong> {result.interpretation}</p>
        </div>
      )}
    </div>
  )
}
