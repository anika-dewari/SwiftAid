# 🚑 DRIVER DETAILS - SwiftAid Database

**Total Drivers:** 5  
**Database:** swiftaid_db  
**Last Updated:** November 12, 2025

---

## 📋 DRIVER #1: Test Driver
| Field | Value |
|-------|-------|
| **ID** | 1 |
| **Name** | Test Driver |
| **Email** | ankurawat8844@gmail.com |
| **Phone** | +917454061975 |
| **License Number** | DL-1234 |
| **Vehicle Type** | Ambulance |
| **Vehicle Number** | ABC-1234 |
| **Vehicle Model** | Ford Transit |
| **Experience** | 0 years |
| **Status** | 🔴 offline |
| **Rating** | ⭐ 5.00 |
| **Total Trips** | 0 |
| **Verified** | ✗ No |

---

## 📋 DRIVER #2: Test Driver
| Field | Value |
|-------|-------|
| **ID** | 2 |
| **Name** | Test Driver |
| **Email** | testdriver@test.com |
| **Phone** | 1234567890 |
| **License Number** | DL123456 |
| **Vehicle Type** | ambulance |
| **Vehicle Number** | AB-1234 |
| **Vehicle Model** | 2024 Model |
| **Experience** | 5 years |
| **Status** | 🔴 offline |
| **Rating** | ⭐ 5.00 |
| **Total Trips** | 0 |
| **Verified** | ✗ No |

---

## 📋 DRIVER #3: Driver Two
| Field | Value |
|-------|-------|
| **ID** | 3 |
| **Name** | Driver Two |
| **Email** | driver2@test.com |
| **Phone** | 9876543210 |
| **License Number** | DL999999 |
| **Vehicle Type** | ambulance |
| **Vehicle Number** | XY-9999 |
| **Vehicle Model** | 2024 Ambulance |
| **Experience** | 3 years |
| **Status** | 🔴 offline |
| **Rating** | ⭐ 5.00 |
| **Total Trips** | 0 |
| **Verified** | ✗ No |

---

## 📋 DRIVER #4: New Test Driver
| Field | Value |
|-------|-------|
| **ID** | 4 |
| **Name** | New Test Driver |
| **Email** | newdriver@test.com |
| **Phone** | 5555555555 |
| **License Number** | DL-NEW-001 |
| **Vehicle Type** | Ambulance |
| **Vehicle Number** | TEST-001 |
| **Vehicle Model** | 2025 Model |
| **Experience** | 2 years |
| **Status** | 🔴 offline |
| **Rating** | ⭐ 5.00 |
| **Total Trips** | 0 |
| **Verified** | ✗ No |

---

## 📋 DRIVER #5: Ankush Rawat
| Field | Value |
|-------|-------|
| **ID** | 5 |
| **Name** | Ankush Rawat |
| **Email** | ankurawat44@gmail.com |
| **Phone** | +917454061975 |
| **License Number** | Dl-1234 |
| **Vehicle Type** | Ambulance |
| **Vehicle Number** | ABC-12348 |
| **Vehicle Model** | Ford |
| **Experience** | 6 years |
| **Status** | 🔴 offline |
| **Rating** | ⭐ 5.00 |
| **Total Trips** | 0 |
| **Verified** | ✗ No |

---

## 📊 Summary Statistics

| Metric | Value |
|--------|-------|
| Total Drivers | 5 |
| Available Drivers | 0 |
| Busy Drivers | 0 |
| Offline Drivers | 5 |
| Average Rating | 5.00 |
| Total Trips (All Drivers) | 0 |
| Verified Drivers | 0 |

---

## 🔍 Key Observations

1. ✅ **All drivers registered successfully**
2. ⚠️ **All drivers are currently OFFLINE**
3. 📝 **No trips completed yet** - This is a fresh system
4. ⭐ **All drivers have perfect 5.00 rating** (default)
5. ✗ **No drivers are verified yet**
6. 📍 **No location data set** - Drivers haven't updated their locations

---

## 🎯 To Make Drivers Available:

1. **Login as any driver** (e.g., driver2@test.com / test123)
2. **Go to Driver Dashboard**
3. **Change status** from "offline" to "available"
4. **The status will be saved** in the database
5. **Users can then see** available drivers in real-time!

---

## 🗄️ Database Access:

**To view in pgAdmin:**
- Server: PostgreSQL 18
- Database: swiftaid_db
- Table: driver_profiles (joined with users)

**Command Line:**
```bash
psql -U postgres -d swiftaid_db
SELECT * FROM driver_profiles dp JOIN users u ON dp.user_id = u.id;
```

---

**Generated:** November 12, 2025  
**System:** SwiftAid Emergency Dispatch System
