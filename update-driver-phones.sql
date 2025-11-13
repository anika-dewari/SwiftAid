-- Update all driver phone numbers to +917454061975 for SMS testing

-- First, let's see current driver phone numbers
SELECT u.id, u.full_name, u.email, u.phone, dp.id as driver_profile_id
FROM users u
JOIN driver_profiles dp ON u.id = dp.user_id
ORDER BY u.id;

-- Update all driver phone numbers to the test number
UPDATE users
SET phone = '+917454061975'
WHERE id IN (
  SELECT user_id 
  FROM driver_profiles
);

-- Verify the update
SELECT u.id, u.full_name, u.email, u.phone, dp.id as driver_profile_id
FROM users u
JOIN driver_profiles dp ON u.id = dp.user_id
ORDER BY u.id;

-- Show count of updated drivers
SELECT COUNT(*) as total_drivers_updated
FROM users u
JOIN driver_profiles dp ON u.id = dp.user_id
WHERE u.phone = '+917454061975';
