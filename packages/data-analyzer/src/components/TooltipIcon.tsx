import React, { FC, useState } from 'react'

interface TooltipIconProps {
  text: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  width?: number
}

/**
 * Reusable tooltip icon component
 * Displays a "?" icon that shows helpful information on hover
 */
const TooltipIcon: FC<TooltipIconProps> = ({
  text,
  placement = 'top',
  width = 200
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const getTooltipPosition = () => {
    switch (placement) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px'
        }
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px'
        }
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px'
        }
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px'
        }
      default:
        return {}
    }
  }

  return (
    <div style={styles.container}>
      <span
        style={styles.icon}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        role="button"
        tabIndex={0}
        aria-label="Information"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsVisible(!isVisible)
          }
        }}
      >
        ?
      </span>

      {isVisible && (
        <div
          style={{
            ...styles.tooltip,
            ...getTooltipPosition(),
            width: `${width}px`
          }}
        >
          {text}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    position: 'relative' as const,
    display: 'inline-block'
  },
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    userSelect: 'none',
    marginLeft: '6px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  } as const,
  tooltip: {
    position: 'absolute' as const,
    backgroundColor: '#333',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '1.4',
    zIndex: 1000,
    whiteSpace: 'normal' as const,
    textAlign: 'left' as const,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    wordWrap: 'break-word' as const
  } as const
}

export default TooltipIcon
