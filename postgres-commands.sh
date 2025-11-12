#!/bin/bash
# PostgreSQL Database Viewing Commands for SwiftAid

echo "==================================="
echo "PostgreSQL Database Commands"
echo "==================================="
echo ""

# Connect to database
echo "1. CONNECT TO DATABASE:"
echo "   psql -U postgres -d swiftaid_db"
echo ""

# Once connected, you can use these commands:
echo "2. INSIDE psql, USE THESE COMMANDS:"
echo ""
echo "   Basic Commands:"
echo "   \\l              - List all databases"
echo "   \\c swiftaid_db  - Connect to swiftaid_db"
echo "   \\dt             - List all tables"
echo "   \\d+ users       - Describe 'users' table structure"
echo "   \\q              - Quit psql"
echo ""

echo "   View Data:"
echo "   SELECT * FROM users;                    - All users"
echo "   SELECT * FROM driver_profiles;          - All driver profiles"
echo "   SELECT * FROM driver_status_history;    - Status changes"
echo "   SELECT * FROM emergency_requests;       - Emergency requests"
echo "   SELECT * FROM notifications;            - Notifications"
echo ""

echo "   Useful Queries:"
echo "   -- View drivers with their user info"
echo "   SELECT u.full_name, u.email, dp.vehicle_number, dp.status"
echo "   FROM driver_profiles dp"
echo "   JOIN users u ON dp.user_id = u.id;"
echo ""
echo "   -- Count records in each table"
echo "   SELECT 'users' as table, COUNT(*) FROM users"
echo "   UNION ALL SELECT 'drivers', COUNT(*) FROM driver_profiles"
echo "   UNION ALL SELECT 'requests', COUNT(*) FROM emergency_requests;"
echo ""
echo "   -- View recent status changes"
echo "   SELECT * FROM driver_status_history"
echo "   ORDER BY changed_at DESC LIMIT 10;"
echo ""

echo "==================================="
echo "Quick Access Commands (run from terminal):"
echo "==================================="
echo ""

# Quick view commands
echo "# View all users"
echo 'psql -U postgres -d swiftaid_db -c "SELECT id, full_name, email, role FROM users;"'
echo ""

echo "# View all drivers with status"
echo 'psql -U postgres -d swiftaid_db -c "SELECT u.full_name, dp.vehicle_number, dp.status, dp.license_number FROM driver_profiles dp JOIN users u ON dp.user_id = u.id;"'
echo ""

echo "# Count all records"
echo 'psql -U postgres -d swiftaid_db -c "SELECT '\''users'\'' as table, COUNT(*) FROM users UNION ALL SELECT '\''drivers'\'', COUNT(*) FROM driver_profiles;"'
echo ""

echo "# View database size"
echo 'psql -U postgres -d swiftaid_db -c "SELECT pg_size_pretty(pg_database_size('\''swiftaid_db'\''));"'
echo ""
