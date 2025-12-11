import React, { createContext, useContext, useState, FC, ReactNode } from 'react'
import { ThemeColors, lightTheme, darkTheme } from '../utils/theme'

interface ThemeContextType {
  theme: 'light' | 'dark'
  colors: ThemeColors
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Load theme from localStorage or default to 'light'
    try {
      const savedTheme = localStorage.getItem('theme')
      return (savedTheme as 'light' | 'dark') || 'light'
    } catch (error) {
      // If localStorage is not available, default to 'light'
      return 'light'
    }
  })

  const colors = theme === 'light' ? lightTheme : darkTheme

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem('theme', newTheme)
      } catch (error) {
        // Silently fail if localStorage is not available
        console.warn('Unable to save theme preference:', error)
      }
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
