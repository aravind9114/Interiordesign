# Cleanup Script - Remove Unnecessary Files
# Navigate to project directory first!

Write-Host "🧹 Cleaning up unnecessary files..." -ForegroundColor Yellow

# Remove old Next.js directories
Write-Host "Removing Next.js directories..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".next"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "node_modules"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "app"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "components"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "lib"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "types"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "public"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "hooks"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "utils"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "docs"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".husky"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".github"

# Remove Next.js config files
Write-Host "Removing Next.js config files..."
Remove-Item -Force -ErrorAction SilentlyContinue "package.json"
Remove-Item -Force -ErrorAction SilentlyContinue "package-lock.json"
Remove-Item -Force -ErrorAction SilentlyContinue "bun.lock"
Remove-Item -Force -ErrorAction SilentlyContinue "tsconfig.json"
Remove-Item -Force -ErrorAction SilentlyContinue "next.config.js"
Remove-Item -Force -ErrorAction SilentlyContinue "next-env.d.ts"
Remove-Item -Force -ErrorAction SilentlyContinue "postcss.config.js"
Remove-Item -Force -ErrorAction SilentlyContinue "tailwind.config.js"
Remove-Item -Force -ErrorAction SilentlyContinue "components.json"
Remove-Item -Force -ErrorAction SilentlyContinue "eslint.config.mjs"
Remove-Item -Force -ErrorAction SilentlyContinue ".prettierrc"
Remove-Item -Force -ErrorAction SilentlyContinue ".bunfig.toml"
Remove-Item -Force -ErrorAction SilentlyContinue ".nvmrc"
Remove-Item -Force -ErrorAction SilentlyContinue ".env.example"
Remove-Item -Force -ErrorAction SilentlyContinue "vercel.json"

# Remove old documentation
Write-Host "Removing old documentation..."
Remove-Item -Force -ErrorAction SilentlyContinue "CLAUDE.md"
Remove-Item -Force -ErrorAction SilentlyContinue "CODE_OF_CONDUCT.md"
Remove-Item -Force -ErrorAction SilentlyContinue "LICENSE"

# OPTIONAL: Remove git history (uncomment if you want to remove clone traces)
# Write-Host "Removing git history..."
# Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".git"
# Remove-Item -Force -ErrorAction SilentlyContinue ".gitignore"

Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Remaining structure:"
Write-Host "  backend/    - Your original FastAPI backend"
Write-Host "  frontend/   - Your original HTML/CSS/JS frontend"
Write-Host "  README.md   - Project documentation"
Write-Host "  QUICKSTART.md - Quick start guide"
Write-Host ""
Write-Host "Your project is now clean and contains only original code! 🎓" -ForegroundColor Green
