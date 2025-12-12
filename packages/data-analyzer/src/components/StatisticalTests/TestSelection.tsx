import React, { FC } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

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
  const { colors } = useTheme()
  return (
    <button
      style={{
        ...styles.testOption,
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.background,
        color: colors.text.primary,
        ...(selected ? {
          borderColor: colors.primary,
          backgroundColor: colors.primary + '20'
        } : {}),
        ...(disabled ? styles.testOptionDisabled : {})
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <div style={{
        ...styles.testLabel,
        color: colors.text.primary
      }}>{label}</div>
      <div style={{
        ...styles.testDescription,
        color: colors.text.secondary
      }}>{description}</div>
      <div style={{
        ...styles.testRequirements,
        color: colors.text.secondary
      }}>{requirements}</div>
    </button>
  )
}

const styles = {
  testOption: {
    padding: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s'
  } as const,
  testOptionDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  } as const,
  testLabel: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px'
  } as const,
  testDescription: {
    fontSize: '13px',
    marginBottom: '8px'
  } as const,
  testRequirements: {
    fontSize: '11px',
    fontStyle: 'italic'
  } as const
}

export default TestOption
