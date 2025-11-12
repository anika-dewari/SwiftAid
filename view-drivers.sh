#!/bin/bash

# View Driver Details from SwiftAid Database

echo "========================================"
echo "DRIVER DETAILS - SwiftAid Database"
echo "========================================"
echo ""

PGPASSWORD='745406' psql -U postgres -d swiftaid_db << 'EOF'

\pset border 2
\pset format wrapped

SELECT 
    '=== DRIVER #' || dp.id || ' ===' as "Driver Info",
    '' as " "
FROM driver_profiles dp LIMIT 1;

\echo ''
\echo '📋 COMPLETE DRIVER INFORMATION:'
\echo '========================================'
\echo ''

SELECT 
    dp.id as "ID",
    u.full_name as "Name",
    u.email as "Email",
    u.phone as "Phone",
    dp.license_number as "License",
    dp.vehicle_type as "Vehicle Type",
    dp.vehicle_number as "Vehicle No.",
    dp.vehicle_model as "Model",
    dp.experience_years as "Exp(yrs)",
    dp.status as "Status",
    dp.rating as "Rating",
    dp.total_trips as "Trips",
    CASE 
        WHEN dp.is_verified THEN '✓ Yes'
        ELSE '✗ No'
    END as "Verified"
FROM driver_profiles dp
JOIN users u ON dp.user_id = u.id
ORDER BY dp.id;

\echo ''
\echo '📍 LOCATION DATA:'
\echo '========================================'
\echo ''

SELECT 
    dp.id as "ID",
    u.full_name as "Name",
    COALESCE(dp.current_latitude::text, 'Not set') as "Latitude",
    COALESCE(dp.current_longitude::text, 'Not set') as "Longitude"
FROM driver_profiles dp
JOIN users u ON dp.user_id = u.id
ORDER BY dp.id;

\echo ''
\echo '📝 ADDITIONAL INFO:'
\echo '========================================'
\echo ''

SELECT 
    dp.id as "ID",
    u.full_name as "Name",
    COALESCE(dp.bio, 'No bio') as "Bio",
    TO_CHAR(dp.created_at, 'YYYY-MM-DD HH24:MI') as "Joined Date",
    TO_CHAR(dp.updated_at, 'YYYY-MM-DD HH24:MI') as "Last Updated"
FROM driver_profiles dp
JOIN users u ON dp.user_id = u.id
ORDER BY dp.id;

EOF

echo ""
echo "========================================"
echo "Query Complete!"
echo "========================================"
