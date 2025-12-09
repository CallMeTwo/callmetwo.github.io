// Clinical Calculator App Configuration

export const APP_NAME = 'Clinical Calculator'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Calculate clinical risk scores and interpretations'

// Feature flags
export const FEATURES = {
  REAL_TIME_CALCULATION: true,
  EXPORT_RESULTS: false, // Coming soon
  SAVE_HISTORY: false, // Coming soon
}

// Default settings
export const DEFAULTS = {
  DEFAULT_SCORE_SYSTEM: 'wells',
}

// Error messages
export const MESSAGES = {
  ERROR_GENERIC: 'An error occurred. Please try again.',
  ERROR_INVALID_INPUT: 'Invalid input. Please check your values.',
  NO_SCORE_SELECTED: 'Please select a scoring system.',
}

// UI Constants
export const UI = {
  MAX_FORM_WIDTH: '900px',
  FORM_COLUMNS: {
    DESKTOP: 2,
    TABLET: 1,
    MOBILE: 1,
  },
}

export default {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  FEATURES,
  DEFAULTS,
  MESSAGES,
  UI,
}
