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
    
    # Set production environment variables
    sed -i 's/APP_ENV=local/APP_ENV=production/' .env
    sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env
    
    # Generate application key if not set
    if [ -z "$(grep '^APP_KEY=' .env)" ] || [ "$(grep '^APP_KEY=' .env | cut -d'=' -f2)" == "" ]; then
        php artisan key:generate
    fi
    
    # Cache configuration
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    
    # Run migrations if needed
    if [ "$RUN_MIGRATIONS" = "true" ]; then
        php artisan migrate --force
    fi
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