#!/bin/bash

# SwiftAid PostgreSQL Setup for macOS

echo "========================================="
echo "SwiftAid Database Setup"
echo "========================================="
echo ""

# Add PostgreSQL to PATH
export PATH="/Library/PostgreSQL/18/bin:$PATH"

echo "PostgreSQL Version:"
psql --version
echo ""

echo "Attempting to create database..."
echo "You will be prompted for the PostgreSQL password"
echo "(This is the password you set during PostgreSQL installation)"
echo ""

# Try to create database
psql -U postgres -c "CREATE DATABASE swiftaid_db;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully!"
    echo ""
    echo "Now importing schema..."
    psql -U postgres -d swiftaid_db -f /Users/gewu/Documents/GitHub/SwiftAid/backend/schema.sql
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "========================================="
        echo "✅ Setup Complete!"
        echo "========================================="
        echo ""
        echo "Next steps:"
        echo "1. cd /Users/gewu/Documents/GitHub/SwiftAid/backend"
        echo "2. npm run dev"
        echo "3. Open http://localhost:3000 in your browser"
        echo ""
    else
        echo "❌ Failed to import schema"
    fi
else
    echo ""
    echo "========================================="
    echo "⚠️  Manual Setup Required"
    echo "========================================="
    echo ""
    echo "Please use one of these methods:"
    echo ""
    echo "Method 1: Using pgAdmin"
    echo "  1. Open pgAdmin from Applications"
    echo "  2. Create database 'swiftaid_db'"
    echo "  3. Import schema.sql"
    echo ""
    echo "Method 2: Command Line"
    echo "  1. Run: psql -U postgres"
    echo "  2. Enter password when prompted"
    echo "  3. Run: CREATE DATABASE swiftaid_db;"
    echo "  4. Run: \\c swiftaid_db"
    echo "  5. Import the schema file"
    echo ""
fi
