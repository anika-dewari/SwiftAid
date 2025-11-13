-- Fix driver availability for SMS testing
-- This sets all drivers to 'available' status with GPS coordinates

-- Check current driver status
SELECT 
  dp.id as driver_profile_id,
  u.id as user_id,
  u.full_name,
  u.phone,
  dp.status,
  dp.current_latitude,
  dp.current_longitude
FROM driver_profiles dp
JOIN users u ON dp.user_id = u.id
ORDER BY dp.id;

-- Update all drivers to available status with Delhi coordinates
-- This allows them to receive emergency requests and SMS
UPDATE driver_profiles 
SET 
  status = 'available',
  current_latitude = 28.6139,   -- Delhi center latitude
  current_longitude = 77.2090   -- Delhi center longitude
WHERE status IS NULL OR status != 'available';

-- Verify the updates
SELECT 
  dp.id as driver_profile_id,
  u.id as user_id,
  u.full_name,
  u.phone,
  dp.status,
  dp.current_latitude,
  dp.current_longitude
FROM driver_profiles dp
JOIN users u ON dp.user_id = u.id
WHERE dp.status = 'available'
ORDER BY dp.id;

-- Count available drivers
SELECT COUNT(*) as available_drivers
FROM driver_profiles
WHERE status = 'available';
