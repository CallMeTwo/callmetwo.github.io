import React, { FC } from 'react'
import { ParsedData } from '../types'
import { useTheme } from '../contexts/ThemeContext'

interface DataPreviewProps {
  data: ParsedData
  onContinue: () => void
  onCancel: () => void
}

const DataPreview: FC<DataPreviewProps> = ({ data, onContinue, onCancel }) => {
  const { colors } = useTheme()
  const previewRows = data.rows.slice(0, 5) // Show first 5 rows
  const lastRows = data.rowCount > 10 ? data.rows.slice(-5) : [] // Show last 5 rows if more than 10 total

  return (
    <div style={{
      ...styles.container,
      backgroundColor: colors.background
    }}>
      <div style={{
        ...styles.header,
        borderBottom: `2px solid ${colors.border}`
      }}>
        <h2 style={{
          ...styles.title,
          color: colors.text.primary
        }}>Data Preview</h2>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={{
              ...styles.statLabel,
              color: colors.text.secondary
            }}>Rows:</span>
            <span style={{
              ...styles.statValue,
              color: colors.primary
            }}>{data.rowCount}</span>
          </div>
          <div style={styles.statItem}>
            <span style={{
              ...styles.statLabel,
              color: colors.text.secondary
            }}>Columns:</span>
            <span style={{
              ...styles.statValue,
              color: colors.primary
            }}>{data.columnCount}</span>
          </div>
        </div>
      </div>

      {/* Column list */}
      <div style={styles.columnSection}>
        <h3 style={{
          ...styles.sectionTitle,
          color: colors.text.primary
        }}>Columns ({data.columnCount})</h3>
        <div style={styles.columnList}>
          {data.columns.map((col, idx) => (
            <div key={idx} style={{
              ...styles.columnTag,
              backgroundColor: colors.primary + '20',
              border: `1px solid ${colors.primary}`,
              color: colors.primary
            }}>
              {col}
            </div>
          ))}
        </div>
      </div>

      {/* Data table preview */}
      <div style={styles.tableSection}>
        <h3 style={{
          ...styles.sectionTitle,
          color: colors.text.primary
        }}>Data Preview (First {Math.min(5, data.rowCount)} rows)</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={{
                ...styles.headerRow,
                backgroundColor: colors.primary
              }}>
                <th style={{
                  ...styles.headerCell,
                  borderBottom: `2px solid ${colors.border}`
                }}>#</th>
                {data.columns.map((col, idx) => (
                  <th key={idx} style={{
                    ...styles.headerCell,
                    borderBottom: `2px solid ${colors.border}`
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rowIdx) => (
                <tr key={rowIdx} style={rowIdx % 2 === 0 ? {
                  backgroundColor: colors.background
                } : {
                  backgroundColor: colors.surface
                }}>
                  <td style={{
                    ...styles.bodyCell,
                    borderBottom: `1px solid ${colors.border}`,
                    color: colors.text.primary
                  }}>{rowIdx + 1}</td>
                  {data.columns.map((col, colIdx) => (
                    <td key={colIdx} style={{
                      ...styles.bodyCell,
                      borderBottom: `1px solid ${colors.border}`,
                      color: colors.text.primary
                    }}>
                      {String(row[col] ?? 'N/A')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.rowCount > 5 && (
          <p style={{
            ...styles.moreRows,
            color: colors.text.secondary
          }}>
            ... and {data.rowCount - 5} more rows
          </p>
        )}
      </div>

      {/* Last 5 rows preview */}
      {lastRows.length > 0 && (
        <div style={styles.tableSection}>
          <h3 style={{
            ...styles.sectionTitle,
            color: colors.text.primary
          }}>Data Preview (Last 5 rows)</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={{
                  ...styles.headerRow,
                  backgroundColor: colors.primary
                }}>
                  <th style={{
                    ...styles.headerCell,
                    borderBottom: `2px solid ${colors.border}`
                  }}>#</th>
                  {data.columns.map((col, idx) => (
                    <th key={idx} style={{
                      ...styles.headerCell,
                      borderBottom: `2px solid ${colors.border}`
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lastRows.map((row, rowIdx) => {
                  const actualRowNumber = data.rowCount - 5 + rowIdx + 1
                  return (
                    <tr key={rowIdx} style={rowIdx % 2 === 0 ? {
                      backgroundColor: colors.background
                    } : {
                      backgroundColor: colors.surface
                    }}>
                      <td style={{
                        ...styles.bodyCell,
                        borderBottom: `1px solid ${colors.border}`,
                        color: colors.text.primary
                      }}>{actualRowNumber}</td>
                      {data.columns.map((col, colIdx) => (
                        <td key={colIdx} style={{
                          ...styles.bodyCell,
                          borderBottom: `1px solid ${colors.border}`,
                          color: colors.text.primary
                        }}>
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
      <div style={{
        ...styles.actions,
        borderTop: `2px solid ${colors.border}`
      }}>
        <button style={{
          ...styles.cancelButton,
          backgroundColor: colors.surface,
          color: colors.text.primary,
          border: `1px solid ${colors.border}`
        }} onClick={onCancel}>
          Cancel
        </button>
        <button style={{
          ...styles.continueButton,
          backgroundColor: colors.primary
        }} onClick={onContinue}>
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
    borderRadius: '8px'
  } as const,
  header: {
    display: 'flex' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold'
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
    fontWeight: '600'
  } as const,
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold'
  } as const,
  columnSection: {
    marginBottom: '30px'
  } as const,
  sectionTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '600'
  } as const,
  columnList: {
    display: 'flex' as const,
    flexWrap: 'wrap',
    gap: '10px'
  },
  columnTag: {
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500'
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
  } as const,
  headerCell: {
    padding: '12px 8px',
    textAlign: 'left' as const,
    color: 'white',
    fontWeight: '600'
  } as React.CSSProperties,
  bodyCell: {
    padding: '10px 8px'
  } as React.CSSProperties,
  moreRows: {
    margin: '15px 0 0 0',
    fontSize: '13px',
    fontStyle: 'italic'
  } as const,
  actions: {
    display: 'flex' as const,
    gap: '15px',
    justifyContent: 'flex-end',
    paddingTop: '20px'
  },
  cancelButton: {
    padding: '12px 24px',
    fontSize: '14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  } as const,
  continueButton: {
    padding: '12px 24px',
    fontSize: '14px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  } as const
}

export default DataPreview
