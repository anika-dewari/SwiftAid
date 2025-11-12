# 📊 SwiftAid Database - Current Data

**Last Updated:** November 12, 2025  
**Database:** swiftaid_db  
**PostgreSQL Version:** 18.0

---

## 📋 Summary

- **Total Users:** 5
- **Regular Users:** 2
- **Drivers:** 3
- **Emergency Requests:** 0
- **Notifications:** 0
- **Status History:** 0

---

## 👥 Users Table (5 records)

| ID | Full Name    | Email                    | Role   | Phone          | Created At          |
|----|--------------|--------------------------|--------|----------------|---------------------|
| 1  | Test User    | user@test.com            | user   | 9876543210     | 2025-11-12 12:10:37 |
| 2  | Test Driver  | ankurawat8844@gmail.com  | driver | +917454061975  | 2025-11-12 12:16:58 |
| 3  | Test Driver  | testdriver@test.com      | driver | 1234567890     | 2025-11-12 12:18:34 |
| 4  | Test         | test@test.com            | user   | 1234567890     | 2025-11-12 12:18:52 |
| 5  | Driver Two   | driver2@test.com         | driver | 9876543210     | 2025-11-12 12:19:02 |

---

## 🚑 Driver Profiles Table (3 records)

| ID | User ID | Full Name    | License No. | Vehicle Type | Vehicle No. | Vehicle Model  | Status  | Experience |
|----|---------|--------------|-------------|--------------|-------------|----------------|---------|------------|
| 1  | 2       | Test Driver  | DL-1234     | Ambulance    | ABC-1234    | Ford Transit   | offline | 0 years    |
| 2  | 3       | Test Driver  | DL123456    | ambulance    | AB-1234     | 2024 Model     | offline | 5 years    |
| 3  | 5       | Driver Two   | DL999999    | ambulance    | XY-9999     | 2024 Ambulance | offline | 3 years    |

**Note:** All drivers are currently **offline**. They need to log in and change their status to "available" or "busy" to be visible to users.

---

## 🚨 Emergency Requests Table

**Status:** Empty (0 records)

No emergency requests have been created yet.

---

## 🔔 Notifications Table

**Status:** Empty (0 records)

No notifications have been sent yet.

---

## 📈 Driver Status History Table

**Status:** Empty (0 records)

No status changes have been recorded yet. This will populate when drivers change their status.

---

## 🏥 Other Tables

### Hospitals Table
Empty - No hospitals added yet

### Ambulances Table
Empty - No ambulances registered yet (separate from driver vehicles)

---

## 🔍 Key Observations

1. **✅ System is working** - Users and drivers have been registered successfully
2. **⚠️ All drivers are offline** - Drivers need to log in and update their status
3. **📝 No activity yet** - No emergency requests or status changes recorded
4. **🔐 Passwords are hashed** - User passwords are securely stored using bcrypt

---

## 🧪 Testing Recommendations

To fully test the system, you should:

1. **Login as a driver** (use any of the 3 driver emails)
2. **Update status to "Available"** - This will:
   - Update the `driver_profiles.status` field
   - Create a record in `driver_status_history`
   - Emit a Socket.IO event for real-time updates
3. **Login as a user** (in another browser/incognito)
4. **View available drivers** - Should see the driver(s) you made available
5. **Change driver status again** - User dashboard should update in real-time

---

## 📊 Database Schema (7 Tables Created)

✅ users  
✅ driver_profiles  
✅ driver_status_history  
✅ emergency_requests  
✅ notifications  
✅ hospitals  
✅ ambulances  

All tables have been created successfully with proper relationships and indexes.

---

## 🔗 Quick Database Commands

```bash
# View all users
psql -U postgres -d swiftaid_db -c "SELECT id, full_name, email, role FROM users;"

# View driver profiles with status
psql -U postgres -d swiftaid_db -c "SELECT u.full_name, dp.vehicle_number, dp.status FROM driver_profiles dp JOIN users u ON dp.user_id = u.id;"

# View status history
psql -U postgres -d swiftaid_db -c "SELECT * FROM driver_status_history ORDER BY changed_at DESC LIMIT 10;"

# Count records in all tables
psql -U postgres -d swiftaid_db -c "
SELECT 'users' as table, COUNT(*) FROM users
UNION ALL SELECT 'driver_profiles', COUNT(*) FROM driver_profiles
UNION ALL SELECT 'emergency_requests', COUNT(*) FROM emergency_requests
UNION ALL SELECT 'notifications', COUNT(*) FROM notifications;
"
```

---

**🎯 Next Steps:** Log in as a driver and update status to test the complete flow!
