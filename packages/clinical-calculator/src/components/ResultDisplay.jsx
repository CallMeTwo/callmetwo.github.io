import React from 'react'

export default function ResultDisplay({ score, interpretation }) {
  if (score === null || !interpretation) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyText}>Fill in the form to calculate the score</p>
      </div>
    )
  }

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: interpretation.color + '20',
        borderLeft: `5px solid ${interpretation.color}`
      }}
    >
      <div style={styles.scoreBox}>
        <h3 style={styles.scoreLabel}>Score</h3>
        <div style={styles.scoreValue}>{score.toFixed(1)}</div>
      </div>

      <div style={styles.resultSection}>
        <h3 style={styles.categoryLabel}>Risk Category</h3>
        <div
          style={{
            ...styles.category,
            backgroundColor: interpretation.color,
            color: 'white'
          }}
        >
          {interpretation.category}
        </div>
      </div>

      <div style={styles.resultSection}>
        <h3 style={styles.recommendationLabel}>Recommendation</h3>
        <p style={styles.recommendation}>{interpretation.recommendation}</p>
      </div>

      <div style={styles.disclaimerBox}>
        <p style={styles.disclaimer}>
          ⚠️ <strong>Medical Disclaimer:</strong> This calculator is for educational
          purposes only. It should not be used as a substitute for professional medical
          advice, diagnosis, or treatment. Always consult with a qualified healthcare
          provider.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px'
  },
  emptyContainer: {
    padding: '30px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginTop: '20px'
  },
  emptyText: {
    color: '#999',
    fontSize: '14px'
  },
  scoreBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  scoreLabel: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  },
  scoreValue: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#333',
    minWidth: '100px',
    textAlign: 'right'
  },
  resultSection: {
    marginBottom: '20px'
  },
  categoryLabel: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  category: {
    padding: '12px 16px',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  recommendationLabel: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  recommendation: {
    margin: 0,
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.6'
  },
  disclaimerBox: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '4px'
  },
  disclaimer: {
    margin: 0,
    fontSize: '13px',
    color: '#856404',
    lineHeight: '1.6'
  }
}
