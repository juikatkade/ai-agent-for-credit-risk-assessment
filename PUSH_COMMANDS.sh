#!/bin/bash

# ============================================
# Push to New Repository: miniproject2B
# ============================================

echo "🚀 Pushing to miniproject2B repository"
echo ""

# Step 1: Stage all changes
echo "📦 Step 1: Staging all changes..."
git add -A
echo "✅ All changes staged"
echo ""

# Step 2: Commit
echo "💬 Step 2: Committing changes..."
git commit -m "feat: Complete AI loan underwriting system - LoanRiskAI

🎯 Major Features:
- Complete /analyze-loan-complete endpoint with 6-step pipeline
- Credit Bureau API integration for real-time credit data
- AI Risk Prediction using XGBoost
- SHAP explainability for transparent decisions
- Decision engine with configurable thresholds
- MongoDB storage with async operations
- React frontend with modern UI (LoanRiskAI branding)
- PDF report generation with detailed analysis
- Plaid banking integration
- KYC document verification
- User profile management

🐛 Bug Fixes:
- Fixed data mapping bug (employment_length vs loan_tenure)
- Added separate fields for employment length and loan tenure
- Removed all AI agent references from frontend
- Updated branding from LoanAgentAI to LoanRiskAI
- Removed 'Powered by' text from UI

🎨 Frontend Updates:
- New branding: LoanRiskAI
- Updated form with 7 fields including employment_length and loan_tenure
- Clean UI without agent terminology
- Improved user experience with helper text

🔧 Technical Stack:
- Backend: FastAPI, Python 3.9+, XGBoost, SHAP
- Database: MongoDB with Motor (async)
- Frontend: React 18, Vite, Tailwind CSS
- Integrations: Credit Bureau API, Plaid, KYC
- ML: XGBoost classifier with SHAP explainability

📊 Project Structure:
- Clean and organized codebase
- Separate startup scripts for backend/frontend
- Comprehensive documentation
- Production-ready configuration

✅ All features tested and working"

echo "✅ Changes committed"
echo ""

# Step 3: Remove old remote
echo "🔗 Step 3: Updating remote..."
git remote remove origin
echo "✅ Old remote removed"
echo ""

# Step 4: Add new remote
NEW_REPO="https://github.com/juikatkade/miniproject2B.git"
echo "📍 Adding new remote: $NEW_REPO"
git remote add origin $NEW_REPO
echo "✅ New remote added"
echo ""

# Step 5: Push to new repository
echo "🚀 Step 5: Pushing to GitHub..."
echo ""
echo "⚠️  IMPORTANT: Make sure you've created the repository on GitHub first!"
echo "   Go to: https://github.com/new"
echo "   Repository name: miniproject2B"
echo "   DO NOT initialize with README"
echo ""
read -p "Press Enter when ready to push..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "✅ SUCCESS! Code pushed to GitHub"
    echo "================================================"
    echo ""
    echo "🌐 View your repository:"
    echo "   https://github.com/juikatkade/miniproject2B"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Add repository description"
    echo "   2. Add topics: ai, machine-learning, fastapi, react, fintech"
    echo "   3. Update README with screenshots"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "If repository doesn't exist, create it first:"
    echo "   https://github.com/new"
    echo ""
    echo "Then run: git push -u origin main"
    echo ""
fi
