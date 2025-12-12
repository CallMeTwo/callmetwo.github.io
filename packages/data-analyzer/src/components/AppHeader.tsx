import { FC } from 'react'
import { Navbar } from 'shared'
import { useTheme } from '../contexts/ThemeContext'

interface AppHeaderProps {
  onThemeToggle?: () => void
}

const AppHeader: FC<AppHeaderProps> = ({ onThemeToggle }) => {
  const { theme, toggleTheme, colors } = useTheme()

  const handleToggleTheme = () => {
    toggleTheme()
    onThemeToggle?.()
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Navbar breadcrumbs={[{ label: 'Data Analyzer' }]} />
        <button
          onClick={handleToggleTheme}
          style={{
            position: 'absolute',
            top: '12px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            color: '#ecf0f1',
            zIndex: 1001
          }}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(52, 152, 219, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <header style={{
        textAlign: 'center',
        padding: '40px 20px 30px',
        borderBottom: `2px solid ${colors.border}`,
        backgroundColor: colors.background
      }}>
        <h1 style={{
          margin: '0 0 10px 0',
          fontSize: '32px',
          fontWeight: 'bold',
          color: colors.text.primary
        }}>
          📊 Data Analyzer
        </h1>
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: colors.text.secondary
        }}>
          Upload or paste your data to analyze and visualize it
        </p>
      </header>
    </>
  )
}

export default AppHeader
