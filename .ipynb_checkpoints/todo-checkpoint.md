# Data Analyzer UI/UX Improvements - Comprehensive Refactor Plan

**Date**: 2025-12-10
**Scope**: Major improvements to Summary Statistics, Visualization, and Statistical Tests displays
**Priority**: High - Significant UX enhancement
**Estimated Complexity**: Large refactor touching 6+ components

---

## Overview

This document outlines a comprehensive UI/UX improvement plan for the Data Analyzer application, focusing on:
1. Making displays more compact and information-dense
2. Adding interactive tooltips and help icons for interpretations
3. Improving visual hierarchy and data presentation
4. Enhancing statistical test results with visualizations
5. Adding support for date variables
6. Implementing smart variable filtering in visualizations

---

## Phase 1: Summary Statistics Display Refactor

### 1.1 Compact Quartile & Range Display

**File**: `packages/data-analyzer/src/components/SummaryStatistics.tsx`
**Current State**: Quartiles, ranges displayed in separate rows
**Target State**: Merge into compact single-line displays

#### Changes:
```
Before:
- Median: 50.5
- Q1: 25.3
- Q3: 75.8
- Min: 0.1
- Max: 100.0

After:
- Median: 50.5
- Q1 - Q3: 25.3 - 75.8
- Min - Max: 0.1 - 100.0
```

**Implementation**:
- Create new `QuartileDisplay.tsx` component
- Update layout logic in `SummaryStatistics.tsx`
- Reduce vertical space by ~40%
- Add visual separator (dash) for clarity

**Tests**: Verify display with various data ranges

---

## Phase 2: Distribution Metrics Tooltip Enhancement

### 2.1 Compact Skewness & Kurtosis with Hover Tooltips

**File**: `packages/data-analyzer/src/components/SummaryStatistics.tsx`
**Current State**: Shows skewness and kurtosis with text interpretations
**Target State**: Show values only, interpretations on hover with question mark icon

#### Changes:
```
Before:
- Skewness: 0.35 (Moderate positive skew)
- Kurtosis: 2.8 (Slightly leptokurtic)

After:
- Skewness: 0.35 [?]
- Kurtosis: 2.8 [?]
```

Where `[?]` is a clickable/hoverable icon showing:
- Interpretation text
- What values mean
- Practical implications

**Implementation**:
- Create `TooltipIcon.tsx` component (reusable)
- Create `SkewnessKurtosisDisplay.tsx` sub-component
- Store interpretation text in constants
- Add CSS for tooltip positioning and styling
- Make icons keyboard-accessible (tabindex, aria-label)

**Interpretation Texts**:
- **Skewness**: "Values < -1: highly left-skewed | -1 to 1: fairly symmetric | > 1: highly right-skewed"
- **Kurtosis**: "Values < 0: lighter tails (platykurtic) | 3: normal tails | > 3: heavier tails (leptokurtic)"

---

## Phase 3: Normality Test Display Refactor

### 3.1 Hide Interpretation Card, Color-Code P-Value

**File**: `packages/data-analyzer/src/components/SummaryStatistics.tsx`
**Current State**: Shows p-value + large interpretation card (normal/non-normal)
**Target State**: Hide interpretation card, color p-value based on significance

#### Changes:
```
Before:
- Shapiro-Wilk p-value: 0.042
- [Large card: "Data is NOT normally distributed (p < 0.05)"]

After:
- Shapiro-Wilk p-value: 0.042 [RED - indicates p < 0.05]
- [? icon for interpretation tips]
```

**Implementation**:
- Remove interpretation card JSX
- Add CSS classes for p-value colors:
  - `p-value-significant` (red) when p < 0.05
  - `p-value-not-significant` (green) when p ≥ 0.05
- Add question mark icon with hover tooltip
- Tooltip shows: "p < 0.05: Data likely non-normal | p ≥ 0.05: Data could be normal"

---

## Phase 4: Categorical Variable Enhancements

### 4.1 Sortable Frequency Table Headers

**File**: `packages/data-analyzer/src/components/SummaryStatistics.tsx`
**Current State**: Static frequency table
**Target State**: Clickable column headers with sorting

#### Changes:
- Column headers: "Category", "Frequency", "Percentage"
- Add hover state: cursor changes to pointer, slight background highlight
- Add tooltip on header: "Click to sort by this column"
- Implement sort states: ASC, DESC, NONE
- Sort icon (↑/↓) appears next to active column

#### Implementation:
- Create `SortableFrequencyTable.tsx` component
- Track sort state: `{column: 'category' | 'frequency' | 'percentage', direction: 'asc' | 'desc'}`
- Add click handlers to headers
- Re-sort data on each click (toggle direction)
- Add visual indicators (arrows/icons)

**Sorting Logic**:
- Category: Alphabetical or by frequency (toggle)
- Frequency: Numerical ascending/descending
- Percentage: Numerical ascending/descending

---

## Phase 5: Date Variable Support

### 5.1 Date Variable Type Detection & Statistics

**File**: `packages/data-analyzer/src/utils/fileParser.ts`
**Current State**: No date variable handling
**Target State**: Detect and analyze date variables

#### Type Detection:
- In `inferColumnType()`, add date detection:
  - Check for ISO format (YYYY-MM-DD)
  - Check for common date patterns (MM/DD/YYYY, DD/MM/YYYY, etc.)
  - Return type `'datetime'` if detected

#### Summary Statistics for Date Variables:
```
Display:
- Min: [earliest date]
- Max: [latest date]
- Mode: [most frequent date]
- Missing: [count and %]
```

### 5.2 Date Frequency Distribution with Floor Options

**File**: `packages/data-analyzer/src/components/Visualization.tsx`
**Current State**: No histogram for date variables
**Target State**: Histogram with configurable floor unit

#### Floor Unit Choices:
1. **Year**: Reduce date to Jan 1 of that year
   - Example: 2023-06-15 → 2023-01-01
2. **Month**: Reduce date to first day of that month
   - Example: 2023-06-15 → 2023-06-01
3. **Week**: Reduce date to Monday of that week
   - Example: 2023-06-15 → 2023-06-12
4. **Day**: No floor (each date is separate)
   - Example: 2023-06-15 → 2023-06-15

#### Implementation:
- Create `DateFloorSelector.tsx` component
- Implement `floorDate()` utility function:
  ```typescript
  function floorDate(date: Date, unit: 'year' | 'month' | 'week' | 'day'): Date
  ```
- Create frequency table from floored dates
- Display as histogram or bar chart
- Update as user changes floor unit in real-time

---

## Phase 6: Visualization Step Refactor

### 6.1 Show All Chart Types, Smart Variable Filtering

**File**: `packages/data-analyzer/src/components/Visualization.tsx`
**Current State**: Dropdown to select chart type, then variable selection
**Target State**: Display all chart type options, filter variables after selection

#### Changes:
1. **Initial Display**: Show 4 chart type buttons/cards:
   - 📊 Bar Chart
   - 📈 Histogram
   - 📦 Box Plot
   - 📍 Scatter Plot

2. **After Selection**: Variable dropdowns update to show only compatible variables:
   - **Bar Chart**: X = Categorical, Y = Numeric (optional)
   - **Histogram**: X = Numeric only
   - **Box Plot**: X = Categorical (optional), Y = Numeric
   - **Scatter Plot**: X = Numeric, Y = Numeric, Group (optional) = Categorical

#### Implementation:
- Create `ChartTypeSelector.tsx` component (grid/button layout)
- Update `Visualization.tsx` logic:
  - Store selected chart type in state
  - Filter variables based on chart type
  - Only populate dropdowns with compatible columns
  - Update chart on selection change

#### Chart Compatibility Matrix:
```
              Bar    Histogram  BoxPlot  Scatter
Numeric         X       X         X        X
Categorical     X       -         X        -
DateTime        X       X         X        X
Boolean         X       -         -        -
ID              -       -         -        -
```

---

## Phase 7: Statistical Tests - t-Test Enhancements

### 7.1 t-Test Display Restructuring

**File**: `packages/data-analyzer/src/components/StatisticalTests.tsx`
**Current State**: Displays results in various orders, limited visualization
**Target State**: Standardized layout with visualization and rearranged keys

#### Key Order (New):
1. Mean Difference (diff between groups)
2. 95% CI (of mean difference)
3. Effect Size (Cohen's d)
4. t-statistic
5. Degrees of Freedom
6. p-value

#### Implementation:
- Create `TTestResults.tsx` sub-component
- Rearrange display to match key order above
- Fix NaN handling: gracefully display "N/A" or skip if computation fails

### 7.2 t-Test Visualization with User Choices

**Location**: Below statistical results
**User Options**: Radio buttons to toggle between:

1. **Side-by-Side Boxplot**
   - Two boxplots: one for each group
   - X-axis: Group names
   - Y-axis: Variable values
   - Interactive tooltips showing quartiles

2. **Mean ± 95% CI Plot**
   - Point-and-error-bar plot
   - X-axis: Group names
   - Y-axis: Mean value
   - Error bars represent 95% confidence interval
   - Show exact values on hover

3. **Histogram with Group Fill Colors**
   - Overlaid histograms for both groups
   - Different colors for each group
   - Semi-transparent for visibility
   - Legend showing group names

#### Implementation:
- Create `TTestPlot.tsx` component
- State: `{plotType: 'boxplot' | 'meanCI' | 'histogram'}`
- Implement each plot type as sub-component
- Use Recharts for rendering
- Add computed values for error bar endpoints

---

## Phase 8: Statistical Tests - Chi-Square Enhancements

### 8.1 Chi-Square Results Restructuring

**File**: `packages/data-analyzer/src/components/StatisticalTests.tsx`
**Current State**: Basic chi-square results
**Target State**: Include Odds Ratio and rearranged keys

#### New Calculation: Odds Ratio (2x2 tables only)
```
For 2x2 contingency table:
       Yes    No
A      a      b
B      c      d

Odds Ratio = (a × d) / (b × c)
95% CI of OR: exp(ln(OR) ± 1.96 × SE(ln(OR)))
where SE(ln(OR)) = sqrt(1/a + 1/b + 1/c + 1/d)
```

#### Key Order (New):
1. Odds Ratio (if 2x2 table)
2. 95% CI of OR
3. Effect Size (Cramér's V)
4. Chi-square statistic
5. Degrees of Freedom
6. p-value

#### Implementation:
- Add `calculateOddsRatio()` function to `statisticalTests.ts`
- Create `ChiSquareResults.tsx` sub-component
- Only show OR fields if table is 2x2
- For larger tables, omit OR and show standard results

### 8.2 Chi-Square Visualization with Plot Choices

**Location**: Below statistical results
**User Options**: Radio buttons for:

1. **Stacked Bar Chart (Count)**
   - Stack bars by second variable
   - Height = count
   - Grouped by first variable

2. **Clustered Bar Chart (Count)**
   - Side-by-side bars
   - Height = count
   - Different colors for each category

3. **Stacked Bar Chart (Percentage)**
   - Stack bars showing percentage within each group
   - Normalized to 100%
   - Shows proportional differences

4. **Clustered Bar Chart (Percentage)**
   - Side-by-side bars
   - Height = percentage
   - Shows proportions with frequency labels

#### Implementation:
- Create `ChiSquarePlot.tsx` component
- State: `{plotType: 'stackedCount' | 'clusteredCount' | 'stackedPercent' | 'clusteredPercent'}`
- Implement data transformation for percentages
- Use Recharts BarChart component
- Add value labels on hover/click

---

## Phase 9: Statistical Tests - ANOVA Enhancements

### 9.1 ANOVA Results Restructuring

**File**: `packages/data-analyzer/src/components/StatisticalTests.tsx`
**Current State**: Basic ANOVA results
**Target State**: Group means displayed first, pairwise comparisons included

#### Display Structure (New):
1. **Group Means Section** (at top)
   - Table showing: Group, N, Mean, SD, Min, Max

2. **ANOVA Test Results**
   - Effect Size (Eta-squared: η²)
   - df (between groups)
   - df (within groups)
   - F-statistic
   - p-value

3. **Post-hoc Pairwise Tests** (new)
   - Table of all pairwise comparisons
   - Bonferroni correction applied
   - Columns: Group 1, Group 2, Mean Diff, 95% CI, Adjusted p-value
   - Significant comparisons highlighted

#### Implementation:
- Create `AnovaResults.tsx` sub-component
- Move group summary to top as `GroupMeansTable.tsx`
- Implement Bonferroni-corrected pairwise t-tests:
  ```
  Number of comparisons = k(k-1)/2  (k = number of groups)
  Bonferroni-corrected α = 0.05 / number of comparisons
  Apply this α to each pairwise comparison
  ```
- Highlight significant comparisons (p < corrected α)

### 9.2 ANOVA Visualization

**Location**: Below test results
**User Options**: Radio buttons for:

1. **Side-by-Side Boxplot**
   - One boxplot per group
   - X-axis: Group names
   - Y-axis: Variable values

2. **Mean ± 95% CI Plot**
   - Point-and-error-bar plot
   - X-axis: Group names
   - Y-axis: Mean
   - Error bars: 95% CI for each group

#### Implementation:
- Create `AnovaPlot.tsx` component
- Similar structure to TTestPlot
- Calculate group-level confidence intervals
- Add interactive tooltips

---

## Phase 10: Statistical Tests - Linear Regression Enhancements

### 10.1 Regression Coefficient Table with Confidence Intervals

**File**: `packages/data-analyzer/src/components/StatisticalTests.tsx`
**Current State**: Basic regression results
**Target State**: Comprehensive coefficient table with CIs

#### Display Structure (New):

**1. Coefficient Table**
Columns: Variable, Coefficient, Std. Error, 95% CI, p-value

Rows:
- (Intercept): intercept value, SE, CI, p-value
- [Predictor]: slope value, SE, CI, p-value

Example:
```
Variable        | Coef      | Std.Error | 95% CI              | p-value
(Intercept)     | 2.5       | 0.15      | [2.21, 2.79]       | < 0.001
Age             | 0.08      | 0.01      | [0.06, 0.10]       | < 0.001
```

#### 95% CI Calculation for Coefficients:
```
CI = coefficient ± (t_critical × std.error)
where t_critical = t(df=n-2, α=0.025)
```

**2. Regression Statistics Section**
- R-squared
- Adjusted R-squared
- F-statistic (overall model)
- p-value (overall model)

**3. Model Interpretation** (text)
"The model explains X% of variance (R²=...). For every unit increase in [predictor], [outcome] increases by [coefficient] (95% CI: [..., ...], p < 0.05)."

#### Implementation:
- Create `RegressionResults.tsx` sub-component
- Add `calculateRegressionCI()` function:
  ```typescript
  function calculateRegressionCI(
    coefficient: number,
    stdError: number,
    df: number,
    alpha: number = 0.05
  ): [number, number]
  ```
- Create `CoefficientTable.tsx` component
- Create `RegressionStats.tsx` component
- Generate interpretation text based on results
- Highlight significant coefficients (p < 0.05)

### 10.2 Regression Visualization - Scatter Plot with Fitted Line

**Location**: Above coefficient results
**Display**:
- Scatter plot: X = predictor, Y = outcome
- Overlaid linear regression line (fitted line)
- Interactive tooltips showing actual vs. predicted values
- Optional: confidence interval band around fitted line (95% prediction interval)

#### Implementation:
- Create `RegressionPlot.tsx` component
- Use Recharts ScatterChart with Line
- Calculate prediction interval:
  ```
  SE_pred = SE × sqrt(1 + 1/n + (x-x_mean)²/Σ(x-x_mean)²)
  PI = predicted_y ± (t_critical × SE_pred)
  ```
- Add ComposedChart to show both scatter and line
- Highlight fitted line with different color/style

---

## Phase 11: Shared Components & Utilities

### 11.1 New Reusable Components

Create these in `packages/data-analyzer/src/components/`:

1. **TooltipIcon.tsx**
   - Props: `{text: string, placement?: 'top' | 'right' | 'bottom' | 'left'}`
   - Renders a "?" icon with hover tooltip
   - Keyboard accessible

2. **QuartileDisplay.tsx**
   - Props: `{q1: number, median: number, q3: number, min: number, max: number}`
   - Renders compact quartile display

3. **SortableHeader.tsx**
   - Props: `{label: string, sortKey: string, onSort: (key) => void, active?: boolean, direction?: 'asc' | 'desc'}`
   - Clickable header with sort indicators

4. **ChartTypeSelector.tsx**
   - Props: `{onSelect: (type) => void, selected?: string}`
   - Displays 4 chart type buttons

### 11.2 Utility Function Enhancements

Update `packages/data-analyzer/src/utils/`:

1. **statisticalTests.ts**
   - Add `calculateOddsRatio()`
   - Add `calculateRegressionCI()`
   - Add `calculateBonferroniPvalue()`
   - Add `floorDate()`

2. **statistics.ts**
   - Add date-specific statistics functions
   - Add `calculateGroupStats()` for ANOVA

---

## Phase 12: Testing & Quality Assurance

### 12.1 Unit Tests
- Test all new utility functions
- Test tooltip positioning and accessibility
- Test sorting logic in frequency tables
- Test date floor calculations
- Test chart compatibility matrix

### 12.2 Integration Tests
- Test complete workflow for each variable type
- Test statistical test result accuracy
- Test visualization rendering with various data

### 12.3 Manual Testing Checklist
- [ ] Summary statistics display is compact and readable
- [ ] All tooltip icons work on hover/click
- [ ] Frequency table sorting works correctly
- [ ] Date variables display min/max/mode correctly
- [ ] Date floor unit selector updates histogram in real-time
- [ ] Visualization chart type selector filters variables correctly
- [ ] t-Test shows plots and displays results in correct order
- [ ] Chi-square shows odds ratio for 2x2 tables
- [ ] ANOVA shows group means and pairwise comparisons
- [ ] Regression shows coefficient table with CIs and scatter plot
- [ ] All responsive behavior works on mobile
- [ ] Color coding for p-values is clear and accessible
- [ ] No TypeScript errors or console warnings

---

## Implementation Order (Recommended)

### Priority 1 (Core Enhancements):
1. Summary statistics compact display (quartiles, range)
2. Tooltip icons for skewness/kurtosis and normality tests
3. Color-coded p-values
4. Sortable frequency tables

### Priority 2 (Visualization):
5. Chart type selector with variable filtering
6. Date variable support
7. Date floor unit selector

### Priority 3 (Statistical Tests):
8. t-Test with plots and rearranged keys
9. Chi-square with odds ratio and plots
10. ANOVA with pairwise comparisons
11. Regression with coefficient table and scatter plot

### Priority 4 (Polish):
12. Component extraction and reusability
13. Testing and QA
14. Deployment and documentation

---

## File Modifications Summary

### New Files (Components):
- `TooltipIcon.tsx`
- `QuartileDisplay.tsx`
- `SkewnessKurtosisDisplay.tsx`
- `SortableFrequencyTable.tsx`
- `DateFloorSelector.tsx`
- `ChartTypeSelector.tsx`
- `TTestResults.tsx`
- `TTestPlot.tsx`
- `ChiSquarePlot.tsx`
- `AnovaResults.tsx`
- `AnovaPlot.tsx`
- `RegressionResults.tsx`
- `RegressionPlot.tsx`

### Modified Files:
- `SummaryStatistics.tsx` (significant refactor)
- `Visualization.tsx` (refactor chart selection)
- `StatisticalTests.tsx` (refactor all test displays)
- `fileParser.ts` (add date detection)
- `statistics.ts` (add date and group stats functions)
- `statisticalTests.ts` (add new calculation functions)
- `types/index.ts` (may need new types)

---

## Estimated Timeline

- **Priority 1**: 2-3 days (core UI improvements)
- **Priority 2**: 2 days (visualization + date support)
- **Priority 3**: 4-5 days (statistical test enhancements)
- **Priority 4**: 1-2 days (testing + deployment)

**Total**: ~9-13 days of development

---

## Notes

- Keep accessibility in mind (keyboard navigation, ARIA labels)
- Test with various data types and edge cases
- Ensure responsive design works on mobile
- Maintain color accessibility (colorblind-friendly palettes)
- Document all new components and functions
- Consider performance with large datasets
