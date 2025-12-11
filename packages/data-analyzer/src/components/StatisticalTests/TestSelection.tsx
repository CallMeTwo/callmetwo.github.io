import React, { FC } from 'react'

interface TestOptionProps {
  value: string
  label: string
  description: string
  requirements: string
  selected: boolean
  disabled: boolean
  onClick: () => void
}

const TestOption: FC<TestOptionProps> = ({
  label,
  description,
  requirements,
  selected,
  disabled,
  onClick
}) => {
  return (
    <button
      style={{
        ...styles.testOption,
        ...(selected ? styles.testOptionSelected : {}),
        ...(disabled ? styles.testOptionDisabled : {})
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <div style={styles.testLabel}>{label}</div>
      <div style={styles.testDescription}>{description}</div>
      <div style={styles.testRequirements}>{requirements}</div>
    </button>
  )
}

const styles = {
  testOption: {
    padding: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s'
  } as const,
  testOptionSelected: {
    borderColor: '#3498db',
    backgroundColor: '#f0f8ff'
  } as const,
  testOptionDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  } as const,
  testLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
  } as const,
  testDescription: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px'
  } as const,
  testRequirements: {
    fontSize: '11px',
    color: '#999',
    fontStyle: 'italic'
  } as const
}

export default TestOption
