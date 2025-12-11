import React, { FC } from 'react'
import { ParsedData } from '../types'

interface DataPreviewProps {
  data: ParsedData
  onContinue: () => void
  onCancel: () => void
}

const DataPreview: FC<DataPreviewProps> = ({ data, onContinue, onCancel }) => {
  const previewRows = data.rows.slice(0, 5) // Show first 5 rows
  const lastRows = data.rowCount > 10 ? data.rows.slice(-5) : [] // Show last 5 rows if more than 10 total

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Data Preview</h2>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Rows:</span>
            <span style={styles.statValue}>{data.rowCount}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Columns:</span>
            <span style={styles.statValue}>{data.columnCount}</span>
          </div>
        </div>
      </div>

      {/* Column list */}
      <div style={styles.columnSection}>
        <h3 style={styles.sectionTitle}>Columns ({data.columnCount})</h3>
        <div style={styles.columnList}>
          {data.columns.map((col, idx) => (
            <div key={idx} style={styles.columnTag}>
              {col}
            </div>
          ))}
        </div>
      </div>

      {/* Data table preview */}
      <div style={styles.tableSection}>
        <h3 style={styles.sectionTitle}>Data Preview (First {Math.min(5, data.rowCount)} rows)</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.headerCell}>#</th>
                {data.columns.map((col, idx) => (
                  <th key={idx} style={styles.headerCell}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rowIdx) => (
                <tr key={rowIdx} style={rowIdx % 2 === 0 ? styles.bodyRow : styles.bodyRowAlt}>
                  <td style={styles.bodyCell}>{rowIdx + 1}</td>
                  {data.columns.map((col, colIdx) => (
                    <td key={colIdx} style={styles.bodyCell}>
                      {String(row[col] ?? 'N/A')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.rowCount > 5 && (
          <p style={styles.moreRows}>
            ... and {data.rowCount - 5} more rows
          </p>
        )}
      </div>

      {/* Last 5 rows preview */}
      {lastRows.length > 0 && (
        <div style={styles.tableSection}>
          <h3 style={styles.sectionTitle}>Data Preview (Last 5 rows)</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.headerCell}>#</th>
                  {data.columns.map((col, idx) => (
                    <th key={idx} style={styles.headerCell}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lastRows.map((row, rowIdx) => {
                  const actualRowNumber = data.rowCount - 5 + rowIdx + 1
                  return (
                    <tr key={rowIdx} style={rowIdx % 2 === 0 ? styles.bodyRow : styles.bodyRowAlt}>
                      <td style={styles.bodyCell}>{actualRowNumber}</td>
                      {data.columns.map((col, colIdx) => (
                        <td key={colIdx} style={styles.bodyCell}>
                          {String(row[col] ?? 'N/A')}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button style={styles.continueButton} onClick={onContinue}>
          Continue to Type Verification →
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '30px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px'
  } as const,
  header: {
    display: 'flex' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #eee'
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333'
  } as const,
  stats: {
    display: 'flex' as const,
    gap: '30px'
  },
  statItem: {
    display: 'flex' as const,
    alignItems: 'center',
    gap: '10px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600'
  } as const,
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3498db'
  } as const,
  columnSection: {
    marginBottom: '30px'
  } as const,
  sectionTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  } as const,
  columnList: {
    display: 'flex' as const,
    flexWrap: 'wrap',
    gap: '10px'
  },
  columnTag: {
    padding: '8px 14px',
    backgroundColor: '#e3f2fd',
    border: '1px solid #90caf9',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#1976d2'
  } as const,
  tableSection: {
    marginBottom: '30px'
  } as const,
  tableWrapper: {
    overflowX: 'auto' as const,
    marginBottom: '10px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  } as const,
  headerRow: {
    backgroundColor: '#2c3e50'
  } as const,
  headerCell: {
    padding: '12px 8px',
    textAlign: 'left' as const,
    color: 'white',
    fontWeight: '600',
    borderBottom: '2px solid #1a252f'
  } as React.CSSProperties,
  bodyRow: {
    backgroundColor: 'white'
  } as const,
  bodyRowAlt: {
    backgroundColor: '#f9f9f9'
  } as const,
  bodyCell: {
    padding: '10px 8px',
    borderBottom: '1px solid #eee',
    color: '#333'
  } as React.CSSProperties,
  moreRows: {
    margin: '15px 0 0 0',
    fontSize: '13px',
    color: '#999',
    fontStyle: 'italic'
  } as const,
  actions: {
    display: 'flex' as const,
    gap: '15px',
    justifyContent: 'flex-end',
    paddingTop: '20px',
    borderTop: '2px solid #eee'
  },
  cancelButton: {
    padding: '12px 24px',
    fontSize: '14px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  } as const,
  continueButton: {
    padding: '12px 24px',
    fontSize: '14px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  } as const
}

export default DataPreview
