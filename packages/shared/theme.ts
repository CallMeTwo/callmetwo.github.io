// Centralized theme configuration for all applications

export const colors = {
  // Primary colors
  dark: '#2c3e50',
  primary: '#3498db',
  primaryDark: '#2980b9',

  // Text colors
  text: '#333',
  textMuted: '#666',
  textLight: '#ecf0f1',
  textSecondary: '#95a5a6',
  textSeparator: '#7f8c8d',

  // Background colors
  bg: '#f5f5f5',
  bgLight: '#f0f0f0',
  bgCard: 'white',
  bgHover: '#f8f9ff',

  // Border and shadows
  border: '#ddd',
  shadow: 'rgba(0,0,0,0.1)',
  shadowBlue: 'rgba(52, 152, 219, 0.2)',
} as const;

export const typography = {
  fontFamily: 'Arial, sans-serif',
  fontSize: {
    xs: '13px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
  },
  fontWeight: {
    normal: 400,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.6,
    relaxed: 1.8,
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '20px',
  xl: '30px',
  '2xl': '40px',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
} as const;

export const transitions = {
  fast: '0.2s',
  base: '0.3s',
  slow: '0.5s',
} as const;

export const zIndex = {
  base: 1,
  dropdown: 100,
  navbar: 1000,
  modal: 1000,
  tooltip: 1100,
} as const;

// Convenience export for all theme values
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  transitions,
  zIndex,
} as const;

export default theme;
