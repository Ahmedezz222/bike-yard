#!/bin/bash

# Exit on error
set -e

echo "Starting build process..."

# Install Node.js dependencies first
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

# Handle Laravel backend if it exists
if [ -d "backend" ]; then
    echo "Setting up Laravel backend..."
    cd backend

    # Install Composer if not present
    if ! command -v composer &> /dev/null; then
        echo "Installing Composer..."
        curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
    fi

    # Install PHP dependencies
    if [ -f "composer.json" ]; then
        composer install --no-dev --optimize-autoloader
    else
        echo "Warning: composer.json not found in backend directory"
    fi

    # Generate Laravel environment file if needed
    if [ -f ".env.example" ]; then
        if [ ! -f ".env" ]; then
            cp .env.example .env
        fi
        
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
        echo "Warning: .env.example not found in backend directory"
    fi

    cd ..
else
    echo "Warning: backend directory not found, skipping Laravel setup"
fi

echo "Build process completed successfully!" 