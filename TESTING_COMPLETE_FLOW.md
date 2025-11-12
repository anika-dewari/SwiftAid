# SwiftAid - Complete Testing Flow Guide

## ✅ System Status
- **Backend**: http://localhost:5001 ✓ Running
- **Frontend**: http://localhost:3001 ✓ Running  
- **Database**: PostgreSQL (swiftaid_db) ✓ Connected

---

## 🧪 **Test Scenario: Driver Visibility & Emergency Request**

### **Step 1: Register a Driver with Full Details**

1. **Open**: http://localhost:3001
2. **Click**: "Sign Up" button
3. **Switch to**: "Driver" tab
4. **Fill in the form**:
   ```
   Full Name: John Driver
   Phone: +1234567890
   Email: john.driver@test.com
   Password: test123
   
   License Number: DL123456789
   Vehicle Type: ambulance (or select from dropdown)
   Vehicle Number: AMB-001
   Vehicle Model: Mercedes Sprinter 2024
   Experience Years: 5
   Bio: Experienced ambulance driver with 5 years
   ```
5. **Click**: "Register"
6. **Expected**: Redirected to Driver Dashboard at `/driver/dashboard`

---

### **Step 2: Update Driver Status to "Available"**

1. **On Driver Dashboard**, you should see:
   - Your profile details
   - Vehicle information
   - Status dropdown (currently "Offline")
   
2. **Change Status**:
   - Click the status dropdown
   - Select **"Available"**
   - A success notification should appear

3. **Verify Status Saved**:
   - Refresh the page
   - Status should still show "Available"
   - Database has been updated ✓

---

### **Step 3: Register as a User (Open Incognito/Private Window)**

1. **Open new Incognito/Private window**
2. **Go to**: http://localhost:3001
3. **Click**: "Sign Up"
4. **Stay on "User" tab**
5. **Fill in**:
   ```
   Full Name: Sarah User
   Phone: +9876543210
   Email: sarah.user@test.com
   Password: test123
   ```
6. **Click**: "Register"
7. **Expected**: Redirected to User Dashboard at `/user/dashboard`

---

### **Step 4: View Drivers as User**

On the User Dashboard, you should see:

1. **Statistics Section**:
   - Total Drivers: 1
   - Available: 1
   - Busy: 0
   - Offline: 0

2. **Driver Card** showing:
   - Name: John Driver
   - Status Badge: **"Available"** (green)
   - Phone: +1234567890
   - License: DL123456789
   - Vehicle Type: Ambulance
   - Vehicle Number: AMB-001
   - Vehicle Model: Mercedes Sprinter 2024
   - Experience: 5 years
   - Bio: Experienced ambulance driver...

3. **Request Emergency Button** on each available driver card

---

### **Step 5: Test Real-Time Status Updates**

1. **Keep User window open** (incognito)
2. **Switch back to Driver window** (normal browser)
3. **Change status** from "Available" to "Busy"
4. **Watch the User window** (no refresh needed!)
5. **Expected**: Driver status badge should instantly change to "Busy" (yellow/orange)

**This demonstrates real-time Socket.IO updates! 🎉**

---

### **Step 6: User Requests Emergency from Available Driver**

1. **In User window**, find an available driver
2. **Click**: "Request Emergency" button
3. **Fill emergency details**:
   - Emergency Type
   - Location
   - Description
4. **Click**: "Submit Request"

5. **Expected**:
   - User sees confirmation
   - Request saved to database
   - Driver receives notification (check Driver Dashboard)

---

### **Step 7: Driver Receives and Responds to Request**

1. **Switch to Driver window**
2. **Check Notifications** section
3. **Should see**: New emergency request notification
4. **Driver can**:
   - View request details
   - Accept request
   - Update status to "Busy" automatically
   - Navigate to location

---

## 🔄 **Real-Time Features to Test**

### **Feature 1: Status Updates**
- ✓ Driver changes status → User sees it instantly
- ✓ No page refresh needed
- ✓ Socket.IO connection working

### **Feature 2: Driver Availability**
- ✓ Available drivers show green badge
- ✓ Busy drivers show yellow/orange badge  
- ✓ Offline drivers show gray badge
- ✓ Filter drivers by status

### **Feature 3: Emergency Requests**
- ✓ User can request from available drivers
- ✓ Driver gets notified in real-time
- ✓ Request details stored in database
- ✓ Driver can accept/reject

---

## 🗄️ **Database Verification**

Check data was saved correctly:

```bash
# Connect to database
psql -U postgres -d swiftaid_db

# Check users
SELECT id, email, role, full_name FROM users;

# Check driver profiles
SELECT dp.*, u.full_name 
FROM driver_profiles dp 
JOIN users u ON dp.user_id = u.id;

# Check status history
SELECT * FROM driver_status_history ORDER BY changed_at DESC LIMIT 5;

# Check notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;

# Check emergency requests
SELECT * FROM emergency_requests ORDER BY created_at DESC;
```

---

## 📊 **Expected Database State**

After complete testing:

### **users table**:
```
id | email                    | role   | full_name    
---+--------------------------+--------+-------------
1  | john.driver@test.com     | driver | John Driver
2  | sarah.user@test.com      | user   | Sarah User
```

### **driver_profiles table**:
```
user_id | license_number | vehicle_type | vehicle_number | status
--------+----------------+--------------+----------------+-----------
1       | DL123456789    | ambulance    | AMB-001        | available
```

### **driver_status_history table**:
```
driver_id | old_status | new_status | changed_at
----------+------------+------------+-------------------------
1         | offline    | available  | 2025-11-12 10:30:00
1         | available  | busy       | 2025-11-12 10:35:00
```

---

## 🎯 **Success Criteria**

✅ **Driver Registration**: Complete with all vehicle details
✅ **Driver Dashboard**: Shows profile, can edit, can change status  
✅ **User Registration**: Simple user account creation
✅ **User Dashboard**: Displays all drivers with real-time status
✅ **Real-Time Updates**: Status changes visible instantly via Socket.IO
✅ **Database Persistence**: All data saved and retrievable
✅ **Emergency Requests**: Users can request, drivers receive notifications
✅ **Role-Based Access**: Driver vs User dashboards work correctly

---

## 🐛 **Troubleshooting**

### **Issue: Loading screen after registration**
- **Fixed**: Now redirects correctly to role-specific dashboards
- Driver → `/driver/dashboard`
- User → `/user/dashboard`

### **Issue: Can't see drivers**
- Check driver status is "available" not "offline"
- Refresh user dashboard
- Check browser console for errors

### **Issue: No real-time updates**
- Check Socket.IO connection in browser console
- Backend should show "New Socket.IO connection"
- Try changing status again

### **Issue: Database errors**
- Verify PostgreSQL is running
- Check `.env` password is correct
- Ensure schema.sql was imported

---

## 🚀 **Quick Test Commands**

```bash
# Check backend is running
curl http://localhost:5001/api/health

# Check frontend is running
curl http://localhost:3001

# Register test driver via API
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testdriver@test.com",
    "password": "test123",
    "full_name": "Test Driver",
    "phone": "1234567890",
    "role": "driver",
    "driverDetails": {
      "license_number": "DL999999",
      "vehicle_type": "ambulance",
      "vehicle_number": "TEST-001",
      "vehicle_model": "Test Model",
      "experience_years": 3
    }
  }'

# Check database connection
psql -U postgres -d swiftaid_db -c "SELECT COUNT(*) FROM users;"
```

---

## ✨ **Next Steps After Testing**

Once basic flow works:
1. Add emergency request history
2. Add driver location tracking
3. Add route optimization
4. Add payment integration
5. Add ratings system
6. Add admin dashboard for monitoring

---

**Happy Testing! 🎉**
