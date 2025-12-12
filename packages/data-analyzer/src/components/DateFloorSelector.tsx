import React, { FC } from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface DateFloorSelectorProps {
  selectedFloor: 'year' | 'month' | 'week' | 'day'
  onChange: (floor: 'year' | 'month' | 'week' | 'day') => void
}

/**
 * Component to select date floor unit for frequency distribution
 * Allows user to choose how to group dates: year, month, week, or day
 */
const DateFloorSelector: FC<DateFloorSelectorProps> = ({ selectedFloor, onChange }) => {
  const { colors } = useTheme()
  const options: Array<{ value: 'year' | 'month' | 'week' | 'day'; label: string; description: string }> = [
    { value: 'year', label: 'Year', description: 'Group by year (Jan 1st)' },
    { value: 'month', label: 'Month', description: 'Group by month (1st day)' },
    { value: 'week', label: 'Week', description: 'Group by week (Monday)' },
    { value: 'day', label: 'Day', description: 'No grouping' }
  ]

  return (
    <div style={{
      ...styles.container,
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`
    }}>
      <label style={{
        ...styles.label,
        color: colors.text.secondary
      }}>Date Floor Unit:</label>
      <div style={styles.optionsContainer}>
        {options.map(option => (
          <button
            key={option.value}
            style={{
              ...styles.button,
              border: `1px solid ${colors.border}`,
              ...(selectedFloor === option.value ? {
                backgroundColor: colors.primary,
                color: 'white',
                borderColor: colors.primary,
                fontWeight: '600' as const
              } : {
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border
              })
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
    borderRadius: '6px'
  } as const,
  label: {
    fontSize: '13px',
    fontWeight: '600',
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
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s'
  } as const
}

export default DateFloorSelector
