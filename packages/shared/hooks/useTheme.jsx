import { useContext, createContext } from 'react'
import { theme } from '../theme.js'

// Create theme context (for future theme switching capability)
const ThemeContext = createContext(theme)

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to consume theme throughout the app
export const useTheme = () => {
  const contextTheme = useContext(ThemeContext)
  return contextTheme || theme
}

export default useTheme
