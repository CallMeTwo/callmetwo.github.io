import { useContext, createContext, FC, ReactNode } from 'react'
import { theme } from '../theme'

type Theme = typeof theme

// Create theme context (for future theme switching capability)
const ThemeContext = createContext<Theme>(theme)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to consume theme throughout the app
export const useTheme = (): Theme => {
  const contextTheme = useContext(ThemeContext)
  return contextTheme || theme
}

export default useTheme
