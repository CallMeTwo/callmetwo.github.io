# Environment Configuration Guide

This guide explains how to configure environment variables for the Web Projects Hub applications.

## Overview

Each application uses environment variables (prefixed with `VITE_`) to configure behavior without modifying code. This allows different configurations for development, staging, and production environments.

## Files

- `.env.example` - Root-level environment template
- `packages/clinical-calculator/.env.example` - Clinical Calculator app template
- `packages/data-analyzer/.env.example` - Data Analyzer app template

## Setup

### 1. Create Local Environment Files

For each application, copy the `.env.example` file to `.env.local`:

```bash
# Root level
cp .env.example .env.local

# Clinical Calculator
cp packages/clinical-calculator/.env.example packages/clinical-calculator/.env.local

# Data Analyzer
cp packages/data-analyzer/.env.example packages/data-analyzer/.env.local
```

### 2. Update Variables

Edit each `.env.local` file with your specific configuration. **Never commit `.env.local` files** - they are in `.gitignore` for security.

### 3. Variables are loaded automatically

Vite automatically loads variables from `.env.local` when you run `npm run dev` or build.

## Environment Variables Reference

### Root Level (`.env.example`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment: development, staging, or production |
| `VITE_ANALYTICS_ENABLED` | `false` | Enable/disable analytics tracking |
| `VITE_ANALYTICS_ID` | - | Analytics tracking ID (e.g., Google Analytics) |
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Base URL for backend API calls |
| `VITE_API_TIMEOUT` | `30000` | API request timeout in milliseconds |
| `VITE_FEATURE_DARK_MODE` | `true` | Enable dark mode support |
| `VITE_FEATURE_EXPORT` | `false` | Enable data export features |
| `VITE_FEATURE_HISTORY` | `false` | Enable calculation history |
| `VITE_APP_VERSION` | `1.0.0` | Application version |
| `VITE_APP_ENVIRONMENT` | `development` | Current deployment environment |

### Clinical Calculator (`packages/clinical-calculator/.env.example`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_NAME` | `Clinical Calculator` | Application display name |
| `VITE_APP_VERSION` | `1.0.0` | Application version |
| `VITE_FEATURE_REAL_TIME_CALCULATION` | `true` | Calculate scores as user types |
| `VITE_FEATURE_EXPORT_RESULTS` | `false` | Allow exporting calculation results |
| `VITE_FEATURE_SAVE_HISTORY` | `false` | Save calculation history |
| `VITE_FEATURE_PRINT_RESULTS` | `false` | Allow printing results |
| `VITE_SHOW_MEDICAL_DISCLAIMER` | `true` | Display medical disclaimer |
| `VITE_DEFAULT_SCORE_SYSTEM` | `wells` | Default scoring system on load |
| `VITE_AVAILABLE_SCORES` | `wells,alvarado,child` | Comma-separated list of available scores |

### Data Analyzer (`packages/data-analyzer/.env.example`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_NAME` | `Data Analyzer` | Application display name |
| `VITE_FEATURE_DATA_VISUALIZATION` | `false` | Enable chart/graph features |
| `VITE_FEATURE_STATISTICAL_ANALYSIS` | `false` | Enable statistical analysis |
| `VITE_FEATURE_EXPORT_RESULTS` | `false` | Allow exporting analysis results |
| `VITE_FEATURE_IMPORT_CSV` | `false` | Allow CSV file uploads |
| `VITE_FEATURE_IMPORT_JSON` | `false` | Allow JSON file uploads |
| `VITE_MAX_DATA_POINTS` | `10000` | Maximum number of data points allowed |
| `VITE_DECIMAL_PLACES` | `2` | Decimal places for calculations |
| `VITE_CHART_THEME` | `light` | Chart theme: light or dark |
| `VITE_CHART_ANIMATION` | `true` | Enable chart animations |
| `VITE_SUPPORTED_FORMATS` | `csv,tsv,json,plain-text` | Supported data formats |

## Using Variables in Code

### React/JavaScript

Access variables using `import.meta.env`:

```javascript
// Check if feature is enabled
if (import.meta.env.VITE_FEATURE_EXPORT_RESULTS === 'true') {
  // Show export button
}

// Get configuration value
const maxPoints = parseInt(import.meta.env.VITE_MAX_DATA_POINTS || '10000')
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

### HTML

Variables can be used in HTML template:

```html
<div class="app-version">
  Version: %VITE_APP_VERSION%
</div>
```

## Common Configurations

### Development Setup

```env
# .env.local
NODE_ENV=development
VITE_ANALYTICS_ENABLED=false
VITE_API_BASE_URL=http://localhost:3000/api
VITE_FEATURE_EXPORT=false
```

### Production Setup

```env
# .env.production.local
NODE_ENV=production
VITE_ANALYTICS_ENABLED=true
VITE_ANALYTICS_ID=GA-XXXXXXXX
VITE_API_BASE_URL=https://api.example.com
VITE_FEATURE_EXPORT=true
```

### Feature Preview (Beta Testing)

```env
# .env.local
VITE_FEATURE_REAL_TIME_CALCULATION=true
VITE_FEATURE_EXPORT_RESULTS=true
VITE_FEATURE_SAVE_HISTORY=true
VITE_FEATURE_DATA_VISUALIZATION=true
```

## Deployment

### GitHub Pages

Since GitHub Pages is a static host, environment variables are baked into the build at deployment time:

```bash
# Build for production with specific variables
VITE_ANALYTICS_ENABLED=true npm run build
```

Or create a `.env.production.local` file before building:

```bash
npm run build  # Uses .env.production.local automatically
```

## Security Best Practices

⚠️ **Important**: Environment variables prefixed with `VITE_` are **exposed to the browser** (they're part of the built JavaScript). Never put secrets in these variables:

❌ **DON'T store here:**
- API keys
- Database credentials
- Authentication tokens
- Private keys

✅ **Safe to store here:**
- Feature flags
- API URLs (endpoints only, no credentials)
- Configuration settings
- Public analytics IDs

## Troubleshooting

### Variables not updating

If variables don't update after editing `.env.local`:

1. Restart the development server: `npm run dev`
2. Clear node modules cache: `rm -rf node_modules && npm install`
3. Clear Vite cache: `rm -rf node_modules/.vite`

### Variables showing as undefined

Make sure:
- Variable is prefixed with `VITE_`
- `.env.local` is in the correct directory (same as `package.json`)
- Variable name is spelled correctly
- Development server was restarted after creating/editing `.env.local`

## Next Steps

- [View Vite env docs](https://vitejs.dev/guide/env-and-mode.html)
- Check each application's `.env.example` for latest options
- Update this guide when adding new environment variables
