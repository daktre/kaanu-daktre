#!/bin/bash

echo "🌿 Syncing notes from Kaanu vault..."
rsync -av --delete \
  --exclude='.git/' \
  --exclude='.obsidian/' \
  --exclude='publish.css' \
  "/Users/prashanthns/Library/Mobile Documents/iCloud~md~obsidian/Documents/kaanu vault/" \
  ~/Sites/kaanu-daktre/content/

echo "📦 Staging changes..."
cd ~/Sites/kaanu-daktre
git add .

echo "💬 Committing..."
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
git commit -m "Publish kaanu – $TIMESTAMP"

echo "🚀 Pushing to GitHub..."
git push origin v4

echo "✅ Done! Site will update in ~2 minutes at kaanu.daktre.com"
