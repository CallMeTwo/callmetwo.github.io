#!/bin/bash

# Deployment script for Web Projects Hub
# This script builds all projects and copies them to the deployment directories

set -e  # Exit on error

echo "🚀 Starting deployment..."
echo ""

# Step 1: Build all projects
echo "📦 Building all projects..."
npm run build

echo ""
echo "✅ Build completed successfully"
echo ""

# Step 2: Copy built files to deployment directories
echo "📂 Copying build artifacts to deployment directories..."
cp -r packages/clinical-calculator/dist/* clinical-calculator/
cp -r packages/data-analyzer/dist/* data-analyzer/

echo "✅ Build artifacts copied"
echo ""

# Step 3: Show status
echo "📊 Current changes:"
git status

echo ""
echo "✨ Deployment ready!"
echo ""
echo "Next steps:"
echo "  1. Review changes: git status"
echo "  2. Commit changes: git add . && git commit -m 'Deploy: Update built applications'"
echo "  3. Push to GitHub: git push"
echo ""
echo "Or run all at once:"
echo "  git add . && git commit -m 'Deploy: Update built applications' && git push"
