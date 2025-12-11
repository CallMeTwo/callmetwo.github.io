// Interfaces
export interface ThemeColors {
  // Primary colors
  primary: string
  secondary: string
  accent: string

  // Semantic colors
  success: string
  warning: string
  error: string
  info: string

  // UI colors
  background: string
  surface: string
  border: string
  text: {
    primary: string
    secondary: string
  }

  // Chart colors (palette)
  chart: string[]
}

// Light theme definition
export const lightTheme: ThemeColors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#e74c3c',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#c0392b',
  info: '#9b59b6',
  background: '#ffffff',
  surface: '#f8f9fa',
  border: '#e0e0e0',
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d'
  },
  chart: [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400'
  ]
}

// Dark theme definition
export const darkTheme: ThemeColors = {
  primary: '#5dade2',
  secondary: '#58d68d',
  accent: '#f85a47',
  success: '#52be80',
  warning: '#f8b739',
  error: '#e74c3c',
  info: '#bb8fce',
  background: '#1a1a1a',
  surface: '#2d2d2d',
  border: '#404040',
  text: {
    primary: '#ecf0f1',
    secondary: '#bdc3c7'
  },
  chart: [
    '#5dade2', '#58d68d', '#f85a47', '#f8b739', '#bb8fce',
    '#52be80', '#85c1e9', '#f8b88b', '#aed6f1', '#f5b041'
  ]
}
