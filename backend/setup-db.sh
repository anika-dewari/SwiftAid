#!/bin/bash

# SwiftAid Database Setup Script

echo "========================================="
echo "SwiftAid Database Setup"
echo "========================================="

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ PostgreSQL found"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded"
else
    echo "⚠️  No .env file found. Please create one from .env.example"
    echo "Continuing with default values..."
    DB_USER=${DB_USER:-postgres}
    DB_HOST=${DB_HOST:-localhost}
    DB_NAME=${DB_NAME:-swiftaid_db}
    DB_PORT=${DB_PORT:-5432}
fi

echo ""
echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Create database if it doesn't exist
echo "📦 Creating database if it doesn't exist..."
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "ℹ️  Database might already exist, continuing..."
fi

# Run schema
echo ""
echo "📋 Running database schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema applied successfully"
else
    echo "❌ Failed to apply schema"
    exit 1
fi

# Insert sample data (optional)
echo ""
read -p "Do you want to insert sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Inserting sample data..."
    
    # Insert sample admin user (password: admin123)
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
-- Sample Admin User
INSERT INTO users (email, password_hash, role, full_name, phone) 
VALUES ('admin@swiftaid.com', '\$2a\$10\$YQ6Z2xZ0xZ0xZ0xZ0xZ0xeuKj7K7YQ6Z2xZ0xZ0xZ0xZ0xZ0xe', 'admin', 'Admin User', '+1234567890')
ON CONFLICT (email) DO NOTHING;

-- Sample User
INSERT INTO users (email, password_hash, role, full_name, phone) 
VALUES ('user@test.com', '\$2a\$10\$YQ6Z2xZ0xZ0xZ0xZ0xZ0xeuKj7K7YQ6Z2xZ0xZ0xZ0xZ0xZ0xe', 'user', 'Test User', '+1234567891')
ON CONFLICT (email) DO NOTHING;

-- Sample Hospitals
INSERT INTO hospitals (name, address, latitude, longitude, phone, available_beds, emergency_available) VALUES
('City General Hospital', '123 Medical Center Dr', 40.7128, -74.0060, '+1234567892', 50, true),
('St. Mary Medical Center', '456 Health Ave', 40.7300, -74.0200, '+1234567893', 30, true),
('Emergency Care Hospital', '789 Emergency Blvd', 40.7500, -74.0100, '+1234567894', 40, true)
ON CONFLICT DO NOTHING;

EOF
    
    echo "✅ Sample data inserted"
    echo ""
    echo "Sample credentials:"
    echo "  Admin: admin@swiftaid.com / admin123"
    echo "  User: user@test.com / password123"
fi

echo ""
echo "========================================="
echo "✅ Database setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and configure your settings"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo ""
