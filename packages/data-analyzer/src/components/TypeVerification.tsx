import React, { FC, useState } from 'react'
import { VariableType } from '../types'

interface TypeVerificationProps {
  variables: VariableType[]
  onVariablesUpdate: (variables: VariableType[]) => void
  onContinue: () => void
  onBack: () => void
}

type VariableTypeOption = 'continuous' | 'categorical' | 'boolean' | 'datetime' | 'id'

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

      {/* Select all control */}
      <div style={styles.selectAllSection}>
        <label style={styles.selectAllLabel}>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAllChange}
            style={styles.checkbox}
          />
          <span>Include all variables in analysis</span>
        </label>
      </div>

      {/* Variables grid */}
      <div style={styles.variablesGrid}>
        {localVariables.map((variable, index) => (
          <VariableCard
            key={variable.name}
            variable={variable}
            onTypeChange={(newType) => handleTypeChange(index, newType)}
            onIncludeChange={() => handleIncludeChange(index)}
          />
        ))}
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

interface VariableCardProps {
  variable: VariableType
  onTypeChange: (newType: VariableTypeOption) => void
  onIncludeChange: () => void
}

const VariableCard: FC<VariableCardProps> = ({ variable, onTypeChange, onIncludeChange }) => {
  const typeIcon = getTypeIcon(variable.type)
  const typeColor = getTypeColor(variable.type)

  return (
    <div
      style={{
        ...styles.card,
        ...(variable.includeInAnalysis ? {} : styles.cardDisabled)
      }}
    >
      {/* Header */}
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>{typeIcon}</span>
          <span style={styles.variableName}>{variable.name}</span>
        </div>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={variable.includeInAnalysis}
            onChange={onIncludeChange}
            style={styles.checkbox}
          />
          <span style={styles.checkboxText}>Include</span>
        </label>
      </div>

      {/* Type selector */}
      <div style={styles.cardSection}>
        <label style={styles.label}>Variable Type</label>
        <select
          value={variable.type}
          onChange={(e) => onTypeChange(e.target.value as VariableTypeOption)}
          style={styles.select}
          disabled={!variable.includeInAnalysis}
        >
          <option value="continuous">📈 Continuous (numeric)</option>
          <option value="categorical">📊 Categorical (text)</option>
          <option value="boolean">✓ Boolean (yes/no)</option>
          <option value="datetime">📅 DateTime (dates)</option>
          <option value="id">🔑 ID (identifier)</option>
        </select>
        {variable.inferredType !== variable.type && (
          <p style={styles.infoText}>
            Auto-detected as: <strong>{variable.inferredType}</strong>
          </p>
        )}
      </div>

      {/* Statistics */}
      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Unique values:</span>
          <span style={styles.statValue}>{variable.uniqueCount}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Type:</span>
          <span style={{ ...styles.typeTag, backgroundColor: typeColor }}>
            {variable.type}
          </span>
        </div>
      </div>

      {/* Sample values */}
      <div style={styles.cardSection}>
        <label style={styles.label}>Sample Values</label>
        <div style={styles.sampleValues}>
          {variable.sampleValues.map((value, idx) => (
            <span key={idx} style={styles.sampleValue}>
              {String(value)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function getTypeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    continuous: '📈',
    categorical: '📊',
    boolean: '✓',
    datetime: '📅',
    id: '🔑'
  }
  return iconMap[type] || '❓'
}

function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    continuous: '#e3f2fd',
    categorical: '#f3e5f5',
    boolean: '#e8f5e9',
    datetime: '#fff3e0',
    id: '#fce4ec'
  }
  return colorMap[type] || '#f5f5f5'
}

const styles = {
  container: {
    padding: '30px 20px',
    maxWidth: '1200px',
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
  selectAllSection: {
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '30px'
  } as const,
  selectAllLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  } as const,
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  } as const,
  variablesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  } as const,
  card: {
    backgroundColor: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    transition: 'all 0.3s ease',
    cursor: 'default'
  } as const,
  cardDisabled: {
    backgroundColor: '#fafafa',
    borderColor: '#f0f0f0',
    opacity: 0.7
  } as const,
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f0f0'
  } as const,
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  } as const,
  variableName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  } as const,
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#666',
    whiteSpace: 'nowrap'
  } as const,
  checkboxText: {
    fontWeight: '500'
  } as const,
  cardSection: {
    marginBottom: '15px'
  } as const,
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: '8px',
    letterSpacing: '0.5px'
  } as const,
  select: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '13px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer'
  } as const,
  infoText: {
    margin: '8px 0 0 0',
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic'
  } as const,
  stats: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px'
  } as const,
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1
  } as const,
  statLabel: {
    fontSize: '11px',
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase'
  } as const,
  statValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333'
  } as const,
  typeTag: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#333',
    width: 'fit-content'
  } as const,
  sampleValues: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  } as const,
  sampleValue: {
    padding: '4px 10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    fontSize: '12px',
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
