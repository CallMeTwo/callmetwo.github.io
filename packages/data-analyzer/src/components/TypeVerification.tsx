import React, { FC, useState } from 'react'
import { VariableType } from '../types'

interface TypeVerificationProps {
  variables: VariableType[]
  onVariablesUpdate: (variables: VariableType[]) => void
  onContinue: () => void
  onBack: () => void
}

type VariableTypeOption = 'continuous' | 'categorical' | 'datetime'

const TypeVerification: FC<TypeVerificationProps> = ({
  variables,
  onVariablesUpdate,
  onContinue,
  onBack
}) => {
  const [localVariables, setLocalVariables] = useState(variables)
  const [selectAll, setSelectAll] = useState(true)

  const handleTypeChange = (index: number, newType: VariableTypeOption) => {
    const updated = [...localVariables]
    updated[index].type = newType
    setLocalVariables(updated)
  }

  const handleIncludeChange = (index: number) => {
    const updated = [...localVariables]
    updated[index].includeInAnalysis = !updated[index].includeInAnalysis
    setLocalVariables(updated)

    // Update selectAll state
    const allIncluded = updated.every(v => v.includeInAnalysis)
    setSelectAll(allIncluded)
  }

  const handleSelectAllChange = () => {
    const newValue = !selectAll
    const updated = localVariables.map(v => ({
      ...v,
      includeInAnalysis: newValue
    }))
    setLocalVariables(updated)
    setSelectAll(newValue)
  }

  const handleContinue = () => {
    onVariablesUpdate(localVariables)
    onContinue()
  }

  const includedCount = localVariables.filter(v => v.includeInAnalysis).length

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Verify Variable Types</h2>
        <p style={styles.subtitle}>
          Review each variable and adjust its type if needed. {includedCount} of {localVariables.length} variables selected.
        </p>
      </div>

      {/* Variables table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                  style={styles.checkbox}
                  title="Include all"
                />
              </th>
              <th style={styles.headerCell}>Variable</th>
              <th style={styles.headerCell}>Type</th>
              <th style={styles.headerCell}>Unique</th>
              <th style={styles.headerCell}>Sample Values</th>
            </tr>
          </thead>
          <tbody>
            {localVariables.map((variable, index) => (
              <VariableRow
                key={variable.name}
                variable={variable}
                onTypeChange={(newType) => handleTypeChange(index, newType)}
                onIncludeChange={() => handleIncludeChange(index)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <button
          style={styles.continueButton}
          onClick={handleContinue}
          disabled={includedCount === 0}
        >
          Continue to Summary Statistics →
        </button>
      </div>
    </div>
  )
}

interface VariableRowProps {
  variable: VariableType
  onTypeChange: (newType: VariableTypeOption) => void
  onIncludeChange: () => void
}

const VariableRow: FC<VariableRowProps> = ({ variable, onTypeChange, onIncludeChange }) => {
  const typeIcon = getTypeIcon(variable.type)

  return (
    <tr
      style={{
        ...styles.bodyRow,
        ...(variable.includeInAnalysis ? {} : styles.rowDisabled)
      }}
    >
      {/* Include checkbox */}
      <td style={styles.bodyCell}>
        <input
          type="checkbox"
          checked={variable.includeInAnalysis}
          onChange={onIncludeChange}
          style={styles.checkbox}
        />
      </td>

      {/* Variable name */}
      <td style={styles.bodyCell}>
        <span style={styles.variableName}>{typeIcon} {variable.name}</span>
        {variable.inferredType !== variable.type && (
          <div style={styles.inferredText}>
            (auto: {variable.inferredType})
          </div>
        )}
      </td>

      {/* Type selector */}
      <td style={styles.bodyCell}>
        <select
          value={variable.type}
          onChange={(e) => onTypeChange(e.target.value as VariableTypeOption)}
          style={styles.select}
          disabled={!variable.includeInAnalysis}
        >
          <option value="continuous">📈 Continuous</option>
          <option value="categorical">📊 Categorical</option>
          <option value="datetime">📅 DateTime</option>
        </select>
      </td>

      {/* Unique count */}
      <td style={styles.bodyCell}>
        <span style={styles.uniqueCount}>{variable.uniqueCount}</span>
      </td>

      {/* Sample values */}
      <td style={styles.bodyCell}>
        <div style={styles.sampleValues}>
          {variable.sampleValues.map((value, idx) => (
            <span key={idx} style={styles.sampleValue}>
              {String(value)}
            </span>
          ))}
        </div>
      </td>
    </tr>
  )
}

function getTypeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    continuous: '📈',
    categorical: '📊',
    datetime: '📅'
  }
  return iconMap[type] || '❓'
}

function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    continuous: '#e3f2fd',
    categorical: '#f3e5f5',
    datetime: '#fff3e0'
  }
  return colorMap[type] || '#f5f5f5'
}

const styles = {
  container: {
    padding: '30px 20px',
    maxWidth: '1400px',
    margin: '0 auto'
  } as const,
  header: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #eee'
  } as const,
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333'
  } as const,
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6'
  } as const,
  tableWrapper: {
    overflowX: 'auto' as const,
    marginBottom: '30px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
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
    padding: '12px',
    textAlign: 'left' as const,
    color: 'white',
    fontWeight: '600',
    fontSize: '13px',
    borderBottom: '2px solid #1a252f'
  } as React.CSSProperties,
  bodyRow: {
    backgroundColor: 'white',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s'
  } as const,
  rowDisabled: {
    backgroundColor: '#fafafa',
    opacity: 0.6
  } as const,
  bodyCell: {
    padding: '12px',
    color: '#333',
    verticalAlign: 'middle'
  } as React.CSSProperties,
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  } as const,
  variableName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  } as const,
  inferredText: {
    fontSize: '11px',
    color: '#999',
    fontStyle: 'italic',
    marginTop: '2px'
  } as const,
  select: {
    width: '100%',
    minWidth: '150px',
    padding: '6px 8px',
    fontSize: '13px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer'
  } as const,
  uniqueCount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3498db'
  } as const,
  sampleValues: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  } as const,
  sampleValue: {
    padding: '3px 8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
    fontSize: '11px',
    color: '#333',
    fontFamily: 'monospace',
    border: '1px solid #e0e0e0'
  } as const,
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    paddingTop: '20px',
    borderTop: '2px solid #eee'
  } as const,
  backButton: {
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

export default TypeVerification
