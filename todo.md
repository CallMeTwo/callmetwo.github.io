# Phase 11: Multiple Linear Regression with R Script Integration

**Date**: 2025-12-11
**Status**: 🚀 Planning Phase
**Priority**: High - Significant statistical capability enhancement
**Complexity**: Large - Introduces R integration layer

---

## Overview

Implement Multiple Linear Regression (MLR) in Statistical Tests module using R scripts for computation. This phase introduces R-based statistical analysis to complement TypeScript-based calculations, enabling more sophisticated regression modeling.

**Key Advantage**: Leverage R's robust statistical libraries (lm, summary, confint) instead of implementing complex matrix calculations in TypeScript.

---

## Phase 11: Multiple Linear Regression with R Integration

### 11.1 Backend Setup: R Script Infrastructure

**File**: Create `packages/data-analyzer/src/server/regressionServer.ts` (or similar)

**Tasks**:
1. Create R script template file: `packages/data-analyzer/scripts/multipleRegression.R`
2. Implement R script execution layer in backend
3. Set up data serialization (CSV → R dataframe)
4. Parse R output (JSON/CSV) back to TypeScript

**R Script Structure** (`multipleRegression.R`):
```r
# Read arguments
args <- commandArgs(trailingOnly = TRUE)
data_file <- args[1]
outcome_var <- args[2]
predictor_vars <- args[3]  # comma-separated list

# Load data
data <- read.csv(data_file)

# Fit model
model <- lm(formula_string, data = data)

# Extract results
summary_stats <- summary(model)
coefficients <- coef(summary_stats)
conf_intervals <- confint(model, level = 0.95)
r_squared <- summary_stats$r.squared
adj_r_squared <- summary_stats$adj.r.squared
f_stat <- summary_stats$fstatistic[1]
f_pvalue <- pf(f_stat, summary_stats$fstatistic[2], summary_stats$fstatistic[3], lower.tail = FALSE)

# Output as JSON
results <- list(
  coefficients = coefficients,
  conf_intervals = conf_intervals,
  r_squared = r_squared,
  adj_r_squared = adj_r_squared,
  f_statistic = f_stat,
  f_pvalue = f_pvalue,
  residual_std_error = summary_stats$sigma,
  degrees_freedom = c(summary_stats$fstatistic[2], summary_stats$fstatistic[3])
)

cat(jsonlite::toJSON(results))
```

**Key Outputs from R**:
- Coefficients (Intercept + all predictors)
- 95% Confidence Intervals for each coefficient
- Standard Errors
- t-statistics
- p-values
- R-squared
- Adjusted R-squared
- F-statistic with p-value
- Residual standard error
- Model diagnostics (if needed)

### 11.2 UI: Multiple Linear Regression Test Option

**File**: `packages/data-analyzer/src/components/StatisticalTests.tsx`

**Changes**:
1. Add "📊 Multiple Regression" test option to test selection grid
2. Update variable selection UI:
   - Outcome Variable: dropdown (continuous only)
   - Predictor Variables: multi-select checkbox or drag-drop
     - Allow continuous variables directly
     - Allow categorical variables (R will auto-encode as dummy variables)
   - Show selected predictors with ability to add/remove

**Requirements**:
- Min 1 predictor, at least 3 data points per predictor + 1 for model
- Validation: n > k + 1 (n = sample size, k = number of predictors)
- Warn if multicollinearity risk (many predictors)

### 11.3 Data Preparation & R Integration

**Function**: `executeRegressionScript()`

**Location**: `packages/data-analyzer/src/utils/regressionExecutor.ts` (new)

**Implementation Steps**:
1. **Data Filtering**: Remove rows with missing values in selected variables
2. **CSV Export**: Write filtered data to temporary CSV file
3. **Script Execution**: Call R script with parameters:
   - data_file path
   - outcome_var name
   - predictor_vars as comma-separated list
4. **Result Parsing**: Parse JSON output from R
5. **Cleanup**: Delete temporary files

**Pseudocode**:
```typescript
async function executeMultipleRegression(
  data: DataRow[],
  outcomeVar: string,
  predictorVars: string[]
): Promise<RegressionResult> {
  // 1. Validate
  validateInputs(data, outcomeVar, predictorVars)

  // 2. Filter data (remove NaN/null/missing)
  const cleanedData = filterData(data, [outcomeVar, ...predictorVars])

  // 3. Export to CSV
  const csvPath = await exportToCSV(cleanedData)

  // 4. Execute R script
  const rOutput = await executeR(csvPath, outcomeVar, predictorVars)

  // 5. Parse results
  const results = parseROutput(rOutput)

  // 6. Cleanup
  deleteFile(csvPath)

  return results
}
```

### 11.4 Results Display Component

**File**: `packages/data-analyzer/src/components/StatisticalTests.tsx`

**New Component**: `MultipleRegressionResults`

**Display Structure**:

**1. Model Summary Box**
```
Model: outcome ~ predictor1 + predictor2 + ...
Observations: 150 | AIC: 123.45 | BIC: 145.67
```

**2. Coefficients Table**
```
| Variable      | Coefficient | Std. Error | t-statistic | 95% CI          | p-value |
|---------------|-------------|-----------|------------|-----------------|---------|
| (Intercept)   | 2.34        | 0.15      | 15.60      | [2.05, 2.63]    | <.001   |
| Age           | 0.082       | 0.012     | 6.83       | [0.058, 0.106]  | <.001   |
| Income        | 0.000234    | 0.000089  | 2.63       | [0.000058, 0.41]| 0.009   |
| Region_North  | 1.23        | 0.45      | 2.73       | [0.35, 2.11]    | 0.007   |
| Region_South  | -0.89       | 0.42      | -2.12      | [-1.71, -0.07]  | 0.034   |
```

**3. Model Statistics**
```
R²: 0.654  |  Adjusted R²: 0.648  |  F-statistic: 128.45  (p < 0.001)
Residual Std. Error: 2.34 on 145 degrees of freedom
```

**4. Model Interpretation**
```
This model explains 65.4% of variance in [outcome]. Significant predictors:
- Age (p < 0.001): 0.082 increase per year
- Income (p = 0.009): 0.000234 increase per unit
- Region_North (p = 0.007): 1.23 higher in North vs reference
```

**5. Diagnostics (Optional Tab)**
```
- Residuals plot (predicted vs actual)
- Q-Q plot (normality check)
- Scale-Location plot (homoscedasticity check)
- Residuals vs Leverage plot (influential points)
```

### 11.5 Data Types & Interfaces

**File**: `packages/data-analyzer/src/utils/statisticalTests.ts`

**New Interfaces**:
```typescript
export interface MultipleRegressionInput {
  outcomeVariable: string
  predictorVariables: string[]  // Can be continuous or categorical
}

export interface MultipleRegressionCoefficient {
  variable: string
  coefficient: number
  standardError: number
  tStatistic: number
  pValue: number
  ciLower: number
  ciUpper: number
}

export interface MultipleRegressionResult {
  testType: 'Multiple Linear Regression'
  formula: string  // e.g., "outcome ~ pred1 + pred2"
  n: number  // sample size
  k: number  // number of predictors (excluding intercept)
  coefficients: MultipleRegressionCoefficient[]
  rSquared: number
  adjustedRSquared: number
  fStatistic: number
  fPValue: number
  residualStdError: number
  degreesOfFreedom: [number, number]  // [model df, residual df]
  interpretation: string
  diagnostics?: {
    residuals: number[]
    fitted: number[]
    leverage: number[]
  }
}
```

### 11.6 Validation & Error Handling

**Validations**:
1. ✅ Outcome is continuous variable
2. ✅ At least 1 predictor selected
3. ✅ Sample size > number of predictors + 1
4. ✅ No missing values in selected variables
5. ✅ R is installed and accessible
6. ✅ JSON parsing from R output

**Error Scenarios**:
- R script not found → Show helpful message with installation instructions
- R not installed → Graceful fallback or redirect
- Invalid formula → Suggest removing problematic variables
- Singular matrix → Too many predictors, remove collinear ones
- Missing values → Show count of rows removed due to missing data

### 11.7 Implementation Phases

**Phase 11.1**: R Script Infrastructure
- [ ] Create R script file
- [ ] Set up R execution layer
- [ ] Test R script locally
- [ ] Implement CSV export/import

**Phase 11.2**: UI Components
- [ ] Add test option to selection grid
- [ ] Create multi-select predictor UI
- [ ] Implement input validation
- [ ] Add loading state during R execution

**Phase 11.3**: Results Display
- [ ] Create MultipleRegressionResults component
- [ ] Create coefficient table with formatting
- [ ] Add model statistics display
- [ ] Add interpretation text generation

**Phase 11.4**: Testing & Refinement
- [ ] Test with sample datasets
- [ ] Verify R script outputs
- [ ] Test edge cases (singular matrix, multicollinearity)
- [ ] Performance testing with large datasets

**Phase 11.5**: Deployment
- [ ] Build and test
- [ ] Deploy to GitHub Pages
- [ ] Document R dependency requirement

---

## Technical Considerations

### R Dependency
- Users need R installed locally (for desktop version)
- OR: Use cloud R service (RStudio Cloud, etc.)
- OR: Use Rscript execution through Node.js child_process

### Platform Support
- Windows: Rscript.exe
- Mac/Linux: Rscript command
- Path handling for cross-platform compatibility

### Performance
- R script execution overhead (~1-2 seconds per run)
- Consider caching for repeated runs
- Timeout handling for long computations

### Security
- Validate variable names to prevent R injection
- Sanitize formula construction
- Limit R script execution resources

### Data Limitations
- Large datasets (>100k rows): Consider subsampling or warnings
- Wide data (many predictors): Warn about overfitting/multicollinearity
- Categorical variables: Auto-encode as dummy variables in R

---

## Success Criteria

- ✅ MLR test option appears in test selection grid
- ✅ Multi-variable selection UI works smoothly
- ✅ R script executes and returns valid results
- ✅ Coefficients table displays correctly with 95% CIs
- ✅ R² and F-statistic shown with proper interpretation
- ✅ Error handling for missing R installation
- ✅ Works with both continuous and categorical predictors
- ✅ Handles edge cases (multicollinearity warnings, etc.)

---

## Next Steps After Phase 11

1. **Phase 12**: Logistic Regression (binary outcome)
2. **Phase 13**: Polynomial Regression (non-linear relationships)
3. **Phase 14**: Interaction terms (predictor1 × predictor2)
4. **Phase 15**: Model comparison (ANOVA for nested models)
