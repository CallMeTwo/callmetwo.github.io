# 🌐 Web Projects Hub

A monorepo hosting multiple web applications on GitHub Pages, with automatic CI/CD validation through GitHub Actions.

**Live Site**: https://callmetwo.github.io

## 📱 Applications

### 📊 Data Analyzer
- **URL**: https://callmetwo.github.io/data-analyzer/
- **Description**: Data exploration, visualization, and analysis tools
- **Status**: Coming soon (placeholder)

### ⚕️ Clinical Calculator
- **URL**: https://callmetwo.github.io/clinical-calculator/
- **Description**: Multiple clinical scoring systems (Wells, Alvarado, Child-Pugh)
- **Status**: ✅ Live

## 🚀 Quick Start

### Installation
```bash
# Install dependencies for all projects
npm install
```

### Development
```bash
# Start dev servers for all apps
npm run dev

# Build all projects
npm run build

# Preview builds locally
npm run preview
```

### Deployment

#### Option 1: Automatic Deployment Script (Recommended)
```bash
# Build and copy all artifacts to deployment directories
./deploy.sh

# Review changes and push
git add . && git commit -m "Deploy: Update built applications" && git push
```

#### Option 2: Manual Deployment
```bash
# 1. Build all projects
npm run build

# 2. Copy built files to deployment directories
cp -r packages/clinical-calculator/dist/* clinical-calculator/
cp -r packages/data-analyzer/dist/* data-analyzer/

# 3. Commit and push
git add clinical-calculator/ data-analyzer/
git commit -m "Deploy: Update built applications"
git push
```

## 📁 Project Structure

```
callmetwo.github.io/
├── index.html                    # Landing page
├── .nojekyll                     # Disable Jekyll on GitHub Pages
├── clinical-calculator/          # Built Clinical Calculator app
├── data-analyzer/                # Built Data Analyzer app
├── packages/
│   ├── clinical-calculator/      # Clinical Calculator source
│   ├── data-analyzer/            # Data Analyzer source
│   └── shared/                   # Shared components & utilities
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions workflow
└── deploy.sh                     # Deployment helper script
```

## 🛠️ Technology Stack

- **React 18.3** - UI framework
- **Vite 5.0** - Build tool & dev server
- **npm Workspaces** - Monorepo management
- **GitHub Pages** - Hosting
- **GitHub Actions** - CI/CD validation

## 📝 Adding New Applications

1. Create a new folder in `packages/my-new-app/`
2. Set up a basic React + Vite app structure
3. Add `package.json` with scripts: `dev`, `build`, `preview`
4. Configure `vite.config.js` with correct `base` path (e.g., `/my-new-app/`)
5. Create `index.html` and `src/App.jsx`
6. Update root `index.html` to link to the new app
7. Build and deploy using deployment script

## 🔄 GitHub Actions Workflow

The workflow (`/.github/workflows/deploy.yml`):
- ✅ Triggers on push to main branch
- ✅ Installs dependencies
- ✅ Builds all projects (validates build works)
- ✅ Reports build status

**Note**: Artifacts are **not** automatically deployed. Deploy manually after reviewing changes.

## 📚 Documentation

See `claude.md` for detailed technical documentation including:
- Architecture overview
- Component descriptions
- Development workflow
- Troubleshooting guide

## 🤝 Navigation

All apps include a sticky navigation bar with:
- 🏠 Link to home page
- Breadcrumb trail showing current page
- Consistent styling across all pages

## ⚠️ Medical Disclaimer

Clinical scoring systems in this application are for **educational and reference purposes only**. They should not be used for actual clinical decision-making without proper medical professional consultation.

## 📄 License

This project is open source and available for educational use.

---

**Last Updated**: December 9, 2025
