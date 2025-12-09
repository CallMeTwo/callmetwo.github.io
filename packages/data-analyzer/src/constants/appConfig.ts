// Data Analyzer App Configuration

export const APP_NAME = 'Data Analyzer'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Upload or paste your data to analyze and visualize it'

// Feature flags
export const FEATURES = {
  DATA_VISUALIZATION: false, // Coming soon
  STATISTICAL_ANALYSIS: false, // Coming soon
  EXPORT_RESULTS: false, // Coming soon
  IMPORT_CSV: false, // Coming soon
} as const

// Default settings
export const DEFAULTS = {
  MAX_DATA_POINTS: 10000,
  DECIMAL_PLACES: 2,
} as const

// Error messages
export const MESSAGES = {
  ERROR_GENERIC: 'An error occurred. Please try again.',
  ERROR_INVALID_DATA: 'Invalid data format. Please check your input.',
  ERROR_EMPTY_DATA: 'Please enter some data to analyze.',
  ERROR_TOO_MUCH_DATA: `Maximum ${DEFAULTS.MAX_DATA_POINTS} data points allowed.`,
} as const

// UI Constants
export const UI = {
  MAX_FORM_WIDTH: '900px',
  TEXTAREA_HEIGHT: '200px',
  TEXTAREA_PLACEHOLDER: 'Example: 10, 20, 30, 40, 50\nor\n10\n20\n30\n40\n50',
} as const

// Data parsing
export const DATA_FORMATS = {
  COMMA_SEPARATED: 'csv',
  LINE_SEPARATED: 'tsv',
  SPACE_SEPARATED: 'space',
} as const

export default {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  FEATURES,
  DEFAULTS,
  MESSAGES,
  UI,
  DATA_FORMATS,
}
