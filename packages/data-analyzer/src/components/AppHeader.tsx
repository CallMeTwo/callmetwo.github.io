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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div>
          <Navbar breadcrumbs={[{ label: 'Data Analyzer' }]} />
        </div>
        <button
          onClick={handleToggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            color: colors.text.primary
          }}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
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
