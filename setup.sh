#!/bin/bash
set -e

# 1. Initialize Next.js project
# Using flags to match requirements: TypeScript, Tailwind, ESLint, App Router, Src Directory
echo "Initializing Next.js project..."
# Install to a temporary directory first to avoid "non-empty directory" error
npx -y create-next-app@latest temp_app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm \
  --no-git \
  --yes

# Move files to current directory
echo "Moving files..."
mv temp_app/* .
mv temp_app/.* . 2>/dev/null || true
rmdir temp_app

# 2. Install dependencies
echo "Installing dependencies..."
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image lucide-react clsx tailwind-merge

# 3. Create directory structure
echo "Creating directory structure..."
mkdir -p src/app/\(dashboard\)
mkdir -p src/app/\(editor\)
mkdir -p src/app/\(marketing\)
mkdir -p src/components/editor
mkdir -p src/components/epub-engine
mkdir -p src/components/ui
mkdir -p src/lib/supabase
mkdir -p src/lib/utils
mkdir -p src/lib/ai

echo "Setup complete!"
