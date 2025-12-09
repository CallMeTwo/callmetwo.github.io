# Web Projects Hub - Documentation

## Overview
This is a monorepo project hosted on GitHub Pages that serves multiple web applications from a single repository. The landing page provides navigation to different applications, with automatic CI/CD deployment via GitHub Actions.

## Architecture

### Repository Structure
```
callmetwo.github.io/
├── index.html                    # Landing page (served at root)
├── .nojekyll                     # Disables Jekyll processing
├── package.json                  # Root workspace config (npm workspaces)
├── package-lock.json             # Dependency lock file (required for CI/CD)
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions CI/CD workflow
├── packages/
│   ├── data-analyzer/            # Data analysis & visualization app
│   ├── clinical-calculator/      # Clinical model calculator app
│   └── shared/                   # Shared utilities and components
└── README.md
```

## Applications

### 1. Data Analyzer (`packages/data-analyzer/`)
- **Purpose:** Data exploration, visualization, and analysis
- **Tech Stack:** React + Vite
- **URL:** `callmetwo.github.io/data-analyzer/`
- **Features (Placeholder):**
  - Input data (comma-separated or line-by-line)
  - Data visualization with Recharts
  - Statistical analysis with simple-statistics
  - Export results
- **Key Files:**
  - `src/App.jsx` - Main app component
  - `src/main.jsx` - React entry point
  - `vite.config.js` - Build configuration
  - `index.html` - HTML template

### 2. Clinical Calculator (`packages/clinical-calculator/`)
- **Purpose:** Clinical model calculations based on user input
- **Tech Stack:** React + Vite
- **URL:** `callmetwo.github.io/clinical-calculator/`
- **Features (Placeholder):**
  - Form inputs for clinical variables
  - Calculate model scores
  - Display results and interpretations
- **Key Files:**
  - `src/App.jsx` - Main app component
  - `src/main.jsx` - React entry point
  - `vite.config.js` - Build configuration
  - `index.html` - HTML template

### 3. Shared Utilities (`packages/shared/`)
- **Purpose:** Reusable utilities and components across apps
- **Exports:**
  - `formatNumber()` - Format numbers with locale awareness
  - `calculateStats()` - Calculate mean, median, min, max
- **Used by:** Both data-analyzer and clinical-calculator

## Landing Page

### index.html (Root Level)
- **Purpose:** Entry point for the website
- **Design:** Purple gradient background with white card layout
- **Features:**
  - Displays "Web Projects Hub" heading
  - Two project cards:
    - 📊 Data Analyzer - links to `/data-analyzer/`
    - ⚕️ Clinical Calculator - links to `/clinical-calculator/`
  - Responsive design (2 columns on desktop, 1 on mobile)
  - Hover effects on cards

### .nojekyll File
- **Purpose:** Disables Jekyll processing on GitHub Pages
- **Why Needed:** Without this, GitHub Pages would try to render markdown files as HTML, breaking our static site

## GitHub Actions CI/CD Workflow

### File: `.github/workflows/deploy.yml`

#### Trigger
- Runs on every push to `main` branch

#### Steps

1. **Checkout Code**
   - Uses `actions/checkout@v4` to get the latest code

2. **Setup Node.js**
   - Installs Node.js v20
   - Enables npm caching for faster builds

3. **Install Dependencies**
   - Runs `npm install`
   - Installs dependencies for all workspaces

4. **Build All Projects**
   - Runs `npm run build`
   - Builds data-analyzer with Vite
   - Builds clinical-calculator with Vite
   - Runs no-op for shared package

5. **Prepare Deployment Files**
   - Copies built dist files to organized structure:
     - `data-analyzer/` folder with data-analyzer build
     - `clinical-calculator/` folder with clinical-calculator build
   - Keeps `index.html` and `.nojekyll` at root

6. **Upload Artifact**
   - Uses `actions/upload-artifact@v4`
   - Packages all files for deployment

7. **Deploy to GitHub Pages**
   - Uses `actions/deploy-pages@v4`
   - Official GitHub action with proper permissions
   - Requires environment: `github-pages`

#### Environment Configuration
```yaml
environment:
  name: github-pages
  url: ${{ steps.deployment.outputs.page_url }}
```
- Authorizes deployment to GitHub Pages
- Provides deployment URL output

#### Permissions Required
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```
- `pages: write` - Deploy to GitHub Pages
- `id-token: write` - OIDC authentication
- `contents: read` - Read repository code

## Development Workflow

### Local Development
```bash
# Install all dependencies
npm install

# Start dev servers for all apps
npm run dev

# Build all projects
npm run build

# Preview builds
npm run preview
```

### npm Workspaces
- Root `package.json` defines workspaces: `packages/*`
- Each workspace has its own `package.json`, `node_modules` install
- `npm run <script> --workspaces` runs script in all workspaces

### Adding New Projects
1. Create new folder in `packages/my-new-app/`
2. Create `package.json` with `dev`, `build`, `preview` scripts
3. Create `vite.config.js` with proper `base` path (e.g., `/my-new-app/`)
4. Create `index.html` and `src/` directory
5. Update `.github/workflows/deploy.yml` to copy the new app's dist folder
6. Update root `index.html` landing page with link to new app

## Key Technologies

- **React 18.3** - UI framework
- **Vite 5.0** - Fast build tool and dev server
- **npm Workspaces** - Monorepo management
- **Recharts 2.10** - Data visualization
- **simple-statistics 7.8** - Statistical calculations
- **GitHub Actions** - CI/CD automation
- **GitHub Pages** - Free hosting

## Important Notes

### Lock File (`package-lock.json`)
- **Critical for CI/CD:** GitHub Actions uses this for reproducible builds
- Must be committed to repository
- Do NOT add to `.gitignore`

### Vite Configuration
- Each app has `vite.config.js` with `base` path (e.g., `/data-analyzer/`)
- This ensures assets load from correct URL on GitHub Pages

### Build Output
- Each app builds to its own `dist/` folder
- Workflow copies these to root-level folders for serving
- Root `index.html` is the entry point

### Deployment
- Builds happen automatically on every push to main
- No manual deployment needed
- GitHub Pages serves from artifacts uploaded by workflow
- Site updates within 1-2 minutes of push

## Troubleshooting

### Build Fails
1. Check GitHub Actions workflow logs
2. Verify all workspaces have `dev`, `build`, `preview` scripts
3. Ensure `package-lock.json` is committed

### Page Not Updating
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check GitHub Actions tab for successful deployment
3. Verify `.nojekyll` file exists in root

### Links Not Working
- Verify `vite.config.js` has correct `base` path
- Ensure workflow copies dist to correct folder names
- Check landing page `index.html` has correct URLs

## Future Enhancements

- Add authentication for clinical calculator
- Implement data persistence with localStorage or backend
- Add more chart types and analysis options
- Create shared component library
- Add testing (Jest, React Testing Library)
- Set up environment variables for configuration
- Add API integration for backend services
