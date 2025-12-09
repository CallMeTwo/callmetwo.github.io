# Testing Guide

This guide explains how to write and run tests in the Web Projects Hub monorepo.

## Overview

We use **Vitest** for fast unit and component testing with **React Testing Library** for component testing.

## Running Tests

### Development Mode (watch)
```bash
npm test
```
Watch for file changes and re-run tests automatically.

### Single Run
```bash
npm run test:run
```
Run tests once (useful for CI/CD).

### UI Dashboard
```bash
npm run test:ui
```
Open interactive dashboard at `http://localhost:51204/__vitest__/`

### Coverage Report
```bash
npm run test:coverage
```
Generate coverage reports in HTML and LCOV format.

## Test Structure

Tests are organized in `__tests__` directories near the code they test:

```
packages/shared/
├── Navbar.jsx
├── index.js
├── __tests__/
│   ├── Navbar.test.jsx
│   └── utilities.test.js

packages/clinical-calculator/src/
├── utils/
│   └── scoring.js
├── __tests__/
│   └── scoring.test.js
└── components/
    ├── ScoreSelector.jsx
    └── __tests__/
        └── ScoreSelector.test.jsx
```

## Writing Tests

### Basic Test Structure

```javascript
import { describe, it, expect } from 'vitest'
import { myFunction } from '../index.js'

describe('My Feature', () => {
  it('should do something', () => {
    const result = myFunction(input)
    expect(result).toBe(expectedValue)
  })
})
```

### Utilities Testing

Test pure functions with input/output assertions:

```javascript
// scoring.test.js
import { calculateScore } from '../utils/scoring.js'

describe('calculateScore', () => {
  it('should calculate Wells score correctly', () => {
    const values = {
      dvt_signs: true,
      pe_likely: false,
      // ... other values
    }
    const { score, interpretation } = calculateScore('wells', values)

    expect(score).toBe(2)
    expect(interpretation.category).toBe('Low Risk')
  })
})
```

### Component Testing

Use React Testing Library to test components:

```javascript
// Navbar.test.jsx
import { render, screen } from '@testing-library/react'
import Navbar from '../Navbar.jsx'

describe('Navbar Component', () => {
  it('should render home link', () => {
    render(<Navbar breadcrumbs={[]} />)

    const homeLink = screen.getByText(/🏠 Home/)
    expect(homeLink).toBeInTheDocument()
  })

  it('should render breadcrumb items', () => {
    const breadcrumbs = [
      { label: 'Dashboard' },
      { label: 'Settings' }
    ]
    render(<Navbar breadcrumbs={breadcrumbs} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
```

## Common Assertions

### Value Testing
```javascript
expect(value).toBe(expectedValue)           // Strict equality
expect(value).toEqual(expectedObject)       // Deep equality
expect(value).toStrictEqual(expectedValue)  // Strictest equality
```

### Type Testing
```javascript
expect(value).toBeDefined()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeTruthy()
expect(value).toBeFalsy()
```

### String Testing
```javascript
expect(text).toContain('substring')
expect(text).toMatch(/regex/)
expect(text).toHaveLength(5)
```

### Array/Object Testing
```javascript
expect(array).toContain(item)
expect(array).toHaveLength(3)
expect(object).toHaveProperty('key')
expect(object).toHaveProperty('key', value)
```

### DOM Testing
```javascript
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toHaveAttribute('href', '/path')
expect(element).toHaveClass('active')
expect(input).toHaveValue('text')
```

## Testing Patterns

### Testing Conditional Logic
```javascript
describe('Feature Flag Tests', () => {
  it('should show export button when feature enabled', () => {
    // Test with feature enabled
    const { container } = render(<App featureExportEnabled={true} />)
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('should hide export button when feature disabled', () => {
    // Test with feature disabled
    const { container } = render(<App featureExportEnabled={false} />)
    expect(screen.queryByText('Export')).not.toBeInTheDocument()
  })
})
```

### Testing Error Handling
```javascript
describe('Error Handling', () => {
  it('should handle invalid input gracefully', () => {
    const result = validateScoreForm('invalid', {})

    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(1)
  })
})
```

### Testing Edge Cases
```javascript
describe('Edge Cases', () => {
  it('should handle empty data', () => {
    const stats = calculateStats([])
    expect(stats).toBeNull()
  })

  it('should handle null input', () => {
    const stats = calculateStats(null)
    expect(stats).toBeNull()
  })

  it('should handle single value', () => {
    const stats = calculateStats([42])
    expect(stats.mean).toBe(42)
    expect(stats.min).toBe(42)
    expect(stats.max).toBe(42)
  })
})
```

## Current Test Coverage

### Shared Package
- ✅ Utilities (formatNumber, calculateStats) - 12 tests
- ✅ Navbar Component - 7 tests

### Clinical Calculator
- ✅ Scoring Utilities (calculateScore, getScoreSystem, etc.) - 16 tests

### Data Analyzer
- 📝 Tests pending

### Total: 35 tests passing ✅

## Adding Tests

### For a New Utility Function

1. Create `__tests__/myFunction.test.js` next to the function
2. Import the function and Vitest utilities
3. Write describe blocks for each function
4. Write `it()` blocks for each behavior

Example:
```javascript
// src/__tests__/myUtils.test.js
import { describe, it, expect } from 'vitest'
import { myFunction } from '../utils/myUtils'

describe('myFunction', () => {
  it('should handle basic input', () => {
    expect(myFunction(input)).toBe(expected)
  })

  it('should handle edge cases', () => {
    expect(myFunction(null)).toBeNull()
  })
})
```

### For a New Component

1. Create `__tests__/MyComponent.test.jsx` in the components directory
2. Import render, screen from @testing-library/react
3. Test user interactions and UI behavior

Example:
```javascript
// src/components/__tests__/MyComponent.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '../MyComponent.jsx'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interaction', () => {
    render(<MyComponent />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByText('Updated')).toBeInTheDocument()
  })
})
```

## Debugging Tests

### Print Values
```javascript
import { describe, it, expect, debug } from 'vitest'

it('should do something', () => {
  const result = myFunction(input)
  console.log(result) // Print to console
  expect(result).toBe(expected)
})
```

### Debug DOM
```javascript
import { render, screen, debug } from '@testing-library/react'

it('should render correctly', () => {
  const { debug } = render(<MyComponent />)
  debug() // Print DOM to console
})
```

### Run Single Test
```bash
npm test -- --reporter=verbose scoring.test
```

### Run Specific Describe Block
```bash
npm test -- -t "calculateScore"
```

## Best Practices

✅ **DO:**
- Write tests for utility functions (pure functions)
- Test component behavior, not implementation details
- Test error cases and edge cases
- Use descriptive test names
- Keep tests focused and isolated
- Use semantic queries (getByRole, getByLabelText)

❌ **DON'T:**
- Test implementation details (internal state)
- Write tests that depend on each other
- Use overly broad assertions
- Ignore test failures
- Write tests after the code is shipped
- Test private functions (export them if they need tests)

## CI/CD Integration

Tests run automatically in GitHub Actions on every push:

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
