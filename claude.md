# Web Projects Hub - Documentation

## Overview
Monorepo project hosted on GitHub Pages serving multiple web applications. TypeScript + React + Vite stack with npm workspaces.

**Live Site:** https://callmetwo.github.io/

## Repository Structure
```
callmetwo.github.io/
├── index.html                    # Landing page
├── .nojekyll                     # Disables Jekyll processing
├── data-analyzer/                # Built files for GitHub Pages
├── clinical-calculator/          # Built files for GitHub Pages
└── packages/
    ├── data-analyzer/            # Source code
    ├── clinical-calculator/      # Source code
    └── shared/                   # Shared utilities
```

**Key Concept:**
- `/packages/*/` = Source code (TypeScript/React)
- Root `/data-analyzer/` and `/clinical-calculator/` = Deployment (built JavaScript)
- Build workflow: `npm run build` → `cp packages/*/dist/* <root-dir>/` → commit & push

## Applications

### 1. Data Analyzer ⭐ COMPLETE
**URL:** https://callmetwo.github.io/data-analyzer/
**Purpose:** Full-featured statistical analysis and visualization tool

#### Tech Stack
- React 18.3 + TypeScript (strict mode)
- Vite 5.0 (build tool)
- Recharts 2.10 (data visualization)
- simple-statistics 7.8 (statistical calculations)
- xlsx + papaparse (file parsing)

#### Complete Workflow (6 Steps)
1. **File Upload** - CSV, Excel (.xlsx, .xls) with drag-and-drop
2. **Data Preview** - Display first 5 rows, column list, row/column counts
3. **Type Verification** - Auto-detect and manually adjust variable types (continuous, categorical, boolean, datetime, id)
4. **Summary Statistics** - Descriptive stats, distribution metrics, normality tests
5. **Visualization** - Interactive charts (histogram, box plot, bar chart, scatter plot)
6. **Statistical Tests** - t-test, chi-square, ANOVA, linear regression

#### Key Features

**Data Import (`src/utils/fileParser.ts`):**
- Supports CSV (papaparse), Excel (xlsx library)
- Auto type inference: continuous (>10 unique numeric), categorical (string/limited unique), boolean, datetime, id
- Handles missing values, validates file size (10MB limit)
- Filters empty rows

**Summary Statistics (`src/utils/statistics.ts`, `src/components/SummaryStatistics.tsx`):**
- **Continuous variables:** mean, median, SD, min, max, Q1, Q3, IQR, skewness, kurtosis
- **Normality test:** Shapiro-Wilk with p-values and interpretations
- **Categorical variables:** frequency tables, mode, unique counts, percentages
- **Missing data tracking:** Shows count and percentage of missing values

**Visualizations (`src/utils/visualization.ts`, `src/components/Visualization.tsx`):**
- **Histogram:** 15-bin distribution for continuous variables
- **Box Plot:** Five-number summary with outlier detection (1.5×IQR rule)
- **Bar Chart:** Top 15 categories with color-coded bars
- **Scatter Plot:** X-Y relationship with optional categorical grouping
- Smart chart type selection based on variable types
- Responsive design with tooltips and legends

**Statistical Tests (`src/utils/statisticalTests.ts`, `src/components/StatisticalTests.tsx`):**
- **Independent t-test:** Compare means between 2 groups, Cohen's d effect size, 95% CI
- **Chi-square test:** Association between categorical variables, Cramér's V effect size
- **One-way ANOVA:** Compare means across 3+ groups, eta-squared (η²) effect size
- **Linear regression:** Continuous Y by continuous X, R², adjusted R², coefficient p-values
- Complete statistical implementations (t-distribution, chi-square distribution, F-distribution, beta/gamma functions)
- Plain-language interpretations with significance indicators (p < 0.05 highlighted)

#### Component Architecture
```
App.tsx                    # Main workflow coordinator
├── FileUpload.tsx         # Drag-drop file input
├── DataPreview.tsx        # Data table display
├── TypeVerification.tsx   # Variable type editor
├── SummaryStatistics.tsx  # Descriptive stats display
├── Visualization.tsx      # Chart selector + Recharts integration
└── StatisticalTests.tsx   # Test selector + results display
```

#### Build Stats
- **Modules:** 848
- **Bundle size:** 957 kB (gzipped: 292 kB)
- **Components:** 6 main + multiple sub-components
- **Utilities:** 4 files (fileParser, statistics, statisticalTests, visualization)

---

### 2. Clinical Calculator
**URL:** https://callmetwo.github.io/clinical-calculator/
**Purpose:** Clinical model calculations (placeholder implementation)
**Tech Stack:** React + Vite
**Status:** Basic structure in place, ready for feature development

---

### 3. Shared Package
**Purpose:** Reusable utilities across apps
**Exports:**
- `Navbar` component with breadcrumbs
- `formatNumber()` - Locale-aware number formatting
- `calculateStats()` - Mean, median, min, max calculations

## Development Workflow

### Local Development
```bash
npm install              # Install all workspace dependencies
npm run dev              # Start all dev servers
npm run build            # Build all projects
npm run preview          # Preview production builds
npm run test:run         # Run tests (Vitest)
```

### Build & Deploy
```bash
# 1. Build source to packages/*/dist/
npm run build -w data-analyzer

# 2. Copy to deployment directory
rm -rf data-analyzer/* && cp -r packages/data-analyzer/dist/* data-analyzer/

# 3. Commit and push
git add data-analyzer/
git commit -m "Deploy: Update Data Analyzer"
git push

# 4. GitHub Pages serves updated files within ~30 seconds
```

### npm Workspaces
- Root `package.json` defines workspaces: `packages/*`
- Each workspace has independent `package.json`, dependencies
- Shared dependencies hoisted to root `node_modules/`
- Run workspace command: `npm run <script> -w <workspace-name>`

### Adding New Projects
1. Create `packages/my-app/` with `package.json`, `vite.config.js`, `src/`
2. Set Vite `base: '/my-app/'` for correct GitHub Pages paths
3. Update root `index.html` landing page with link
4. Create root `/my-app/` directory for deployment files
5. Add to build workflow

## Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.0 | Build tool, dev server |
| Recharts | 2.10 | Data visualization |
| simple-statistics | 7.8 | Statistical calculations |
| xlsx | 0.18.5 | Excel file parsing |
| papaparse | 5.5.3 | CSV parsing |
| Vitest | 1.x | Testing framework |

## Configuration Files

### Vite Config (Example: `packages/data-analyzer/vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/data-analyzer/',  // Required for GitHub Pages subdirectory
  resolve: {
    alias: {
      shared: fileURLToPath(new URL('../shared', import.meta.url))
    }
  }
})
```

### TypeScript Config
- Root `tsconfig.json` with shared settings
- Workspace configs extend root with specific `include`/`exclude`
- Strict mode enabled for type safety

### GitHub Actions (`.github/workflows/deploy.yml`)
**Note:** Current workflow builds but does NOT auto-deploy. Manual deployment required.

**Workflow steps:**
1. Install dependencies
2. Run tests
3. Build all projects
4. **Manual step:** Copy built files to root directories and push

## Troubleshooting

### Build Issues
**Problem:** Changes not reflected in production build
**Solution:**
1. Check for duplicate files (`.jsx` and `.tsx` with same name)
2. Clear caches: `rm -rf packages/*/dist/ packages/*/.vite packages/*/node_modules/.vite`
3. Fresh install: `npm install --force`
4. Verify source files exist and are valid TypeScript

### Deployment Issues
**Problem:** GitHub Pages showing old version
**Solution:**
1. Verify built files copied to root directories (`/data-analyzer/`, `/clinical-calculator/`)
2. Check git: `git ls-files | grep "^data-analyzer/"` (should show built files)
3. Hard refresh browser: Ctrl+Shift+R (CDN caching ~30 seconds)
4. Verify `.nojekyll` file exists in root

### Module Resolution
**Problem:** TypeScript can't find modules
**Solution:**
1. Check `tsconfig.json` has correct `include` paths
2. Verify `vite.config.js` has correct alias configuration
3. Ensure `shared` package exports are correct
4. Restart TypeScript server in IDE

## Project History

### Resolved Issues
**Module Resolution Conflict (2025-12-10):**
- Two App files existed: `App.jsx` (old) and `App.tsx` (new)
- Vite imported `.jsx` instead of `.tsx`
- **Fix:** Delete old `.jsx` files after TypeScript migration

### Migration Notes
- Migrated from JavaScript to TypeScript (all packages)
- Changed from `.jsx` to `.tsx` file extensions
- Added strict type checking
- All 35 tests passing after migration

## Future Enhancements

### Data Analyzer
- [ ] Export results to PDF/CSV
- [ ] Multiple regression (multiple predictors)
- [ ] Paired t-test
- [ ] Non-parametric tests (Mann-Whitney, Kruskal-Wallis)
- [ ] More chart types (heatmap, violin plot)
- [ ] Data filtering and transformation UI
- [ ] Save/load analysis sessions
- [ ] Correlation matrix visualization

### Clinical Calculator
- [ ] Implement actual clinical models
- [ ] Form validation
- [ ] Result interpretation guidelines
- [ ] Reference ranges
- [ ] Print/export functionality

### Infrastructure
- [ ] Automated deployment (fix GitHub Actions)
- [ ] E2E testing with Playwright
- [ ] Performance optimization (code splitting)
- [ ] PWA support (offline mode)
- [ ] Dark mode
- [ ] Multi-language support

## Notes for Developers

1. **Always use TypeScript** - No `.jsx` files, use `.tsx`
2. **Clear caches when stuck** - Vite caches aggressively
3. **Test locally before deploying** - `npm run preview`
4. **Check bundle size** - Currently ~1MB (consider code splitting)
5. **Use shared components** - Don't duplicate code across apps
6. **Follow naming conventions** - PascalCase for components, camelCase for utilities
7. **Document complex logic** - Especially statistical calculations
8. **Type everything** - Avoid `any`, use proper interfaces

## Quick Reference

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Start dev | `npm run dev` |
| Build all | `npm run build` |
| Build one | `npm run build -w data-analyzer` |
| Test | `npm run test:run` |
| Deploy | Build → Copy to root → Commit → Push |
| Add dependency | `npm install <pkg> -w <workspace>` |

**Repository:** https://github.com/CallMeTwo/callmetwo.github.io
**Live Site:** https://callmetwo.github.io/
