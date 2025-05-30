#!/bin/bash

# Exit on error
set -e

echo "Starting build process..."

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "Error: backend directory not found"
    exit 1
fi

# Install PHP dependencies
echo "Installing PHP dependencies..."
cd backend
if [ -f "composer.json" ]; then
    composer install --no-dev --optimize-autoloader
else
    echo "Error: composer.json not found"
    exit 1
fi

# Generate Laravel environment file
echo "Setting up Laravel environment..."
if [ -f ".env.example" ]; then
    cp .env.example .env
    php artisan key:generate
    php artisan config:cache
    php artisan route:cache
else
    echo "Error: .env.example not found"
    exit 1
fi

# Return to root directory
cd ..

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
if [ -f "package.json" ]; then
    npm install
else
    echo "Error: package.json not found"
    exit 1
fi

# Build Next.js application
echo "Building Next.js application..."
npm run build

echo "Build process completed successfully!" 