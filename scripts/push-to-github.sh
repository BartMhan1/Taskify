#!/bin/bash
set -e

REPO_URL="https://BartMhan1:${GITHUB_PAT}@github.com/BartMhan1/Taskify.git"

git config --global user.email "taskify-bot@replit.com"
git config --global user.name "Taskify Bot"

if git remote get-url github 2>/dev/null; then
  git remote set-url github "$REPO_URL"
else
  git remote add github "$REPO_URL"
fi

git push github main --force
echo "✅ Pushed to GitHub successfully!"
