import React, { FC } from 'react'
import { ScoringSystem } from '../data/scoreDefinitions'

interface VariableFormProps {
  scoreSystem: ScoringSystem
  values: Record<string, number | boolean>
  onChange: (newValues: Record<string, number | boolean>) => void
}

const VariableForm: FC<VariableFormProps> = ({ scoreSystem, values, onChange }) => {
  const handleCheckboxChange = (variableId: string) => {
    onChange({
      ...values,
      [variableId]: !values[variableId]
    })
  }

  const handleSelectChange = (variableId: string, value: string) => {
    onChange({
      ...values,
      [variableId]: parseInt(value) || 0
    })
  }

  const handleReset = () => {
    const resetValues: Record<string, number | boolean> = {}
    scoreSystem.variables.forEach(variable => {
      resetValues[variable.id] = variable.type === 'checkbox' ? false : 0
    })
    onChange(resetValues)
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{scoreSystem.name}</h2>
      <p style={styles.description}>{scoreSystem.description}</p>

      <form style={styles.form}>
        {scoreSystem.variables.map((variable) => (
          <div key={variable.id} style={styles.variableGroup}>
            {variable.type === 'checkbox' && (
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={(values[variable.id] as boolean) || false}
                  onChange={() => handleCheckboxChange(variable.id)}
                  style={styles.checkbox}
                />
                <span style={styles.labelText}>{variable.label}</span>
              </label>
            )}

            {variable.type === 'select' && (
              <div>
                <label style={styles.selectLabel}>{variable.label}</label>
                <select
                  value={(values[variable.id] as number) || 0}
                  onChange={(e) => handleSelectChange(variable.id, e.target.value)}
                  style={styles.select}
                >
                  <option value={0}>-- Select --</option>
                  {variable.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {variable.description && (
              <p style={styles.description}>{variable.description}</p>
            )}
          </div>
        ))}
      </form>

      <button onClick={handleReset} style={styles.resetButton}>
        Reset Form
      </button>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  } as const,
  title: {
    color: '#333',
    marginTop: 0,
    marginBottom: '10px'
  } as const,
  description: {
    color: '#666',
    marginBottom: '20px',
    fontSize: '14px'
  } as const,
  form: {
    display: 'flex',
    flexDirection: 'column'
  } as const,
  variableGroup: {
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee'
  } as const,
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: '8px'
  } as const,
  checkbox: {
    marginRight: '10px',
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  } as const,
  labelText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333'
  } as const,
  selectLabel: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '8px'
  } as const,
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white'
  } as const,
  resetButton: {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    alignSelf: 'flex-start'
  } as const
}

export default VariableForm
