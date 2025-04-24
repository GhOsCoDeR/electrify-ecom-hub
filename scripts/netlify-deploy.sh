#!/bin/bash

# Netlify deployment helper script

echo "🚀 Preparing for Netlify deployment..."

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Ensure we have a build
echo "Building project..."
npm run build

# Check if user is logged in to Netlify
if ! netlify status &> /dev/null; then
    echo "Please log in to Netlify:"
    netlify login
fi

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment process completed!" 