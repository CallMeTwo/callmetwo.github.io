import React, { FC } from 'react'

interface DateFloorSelectorProps {
  selectedFloor: 'year' | 'month' | 'week' | 'day'
  onChange: (floor: 'year' | 'month' | 'week' | 'day') => void
}

/**
 * Component to select date floor unit for frequency distribution
 * Allows user to choose how to group dates: year, month, week, or day
 */
const DateFloorSelector: FC<DateFloorSelectorProps> = ({ selectedFloor, onChange }) => {
  const options: Array<{ value: 'year' | 'month' | 'week' | 'day'; label: string; description: string }> = [
    { value: 'year', label: 'Year', description: 'Group by year (Jan 1st)' },
    { value: 'month', label: 'Month', description: 'Group by month (1st day)' },
    { value: 'week', label: 'Week', description: 'Group by week (Monday)' },
    { value: 'day', label: 'Day', description: 'No grouping' }
  ]

  return (
    <div style={styles.container}>
      <label style={styles.label}>Date Floor Unit:</label>
      <div style={styles.optionsContainer}>
        {options.map(option => (
          <button
            key={option.value}
            style={{
              ...styles.button,
              ...(selectedFloor === option.value ? styles.buttonActive : styles.buttonInactive)
            }}
            onClick={() => onChange(option.value)}
            title={option.description}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px'
  } as const,
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
    display: 'block'
  } as const,
  optionsContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  } as const,
  button: {
    padding: '8px 16px',
    fontSize: '13px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s'
  } as const,
  buttonActive: {
    backgroundColor: '#3498db',
    color: 'white',
    borderColor: '#3498db',
    fontWeight: '600' as const
  } as const,
  buttonInactive: {
    backgroundColor: 'white',
    color: '#333',
    borderColor: '#ddd'
  } as const
}

export default DateFloorSelector
