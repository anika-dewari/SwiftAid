# SwiftAid - Role-Based Dashboard Architecture

## Fixed Architecture (Current Implementation)

### Role-Specific Routes and Features

#### 1. **Regular Users** (role: 'user')
- **Login Redirect:** `/user/dashboard`
- **Access Level:** Limited - can only view and request services
- **Features:**
  - View available drivers with real-time status
  - Request emergency ambulance service
  - Track their own emergency requests
  - View driver details (name, location, rating, vehicle info)
  - Real-time notifications when drivers accept requests

**Route:** `/user/dashboard`
**Protected:** Yes - redirects to login if not authenticated

---

#### 2. **Ambulance Drivers** (role: 'driver')
- **Login Redirect:** `/driver/dashboard`
- **Access Level:** Self-management - can manage their own profile and status
- **Features:**
  - Update their availability status (available/busy/offline)
  - Edit profile information (bio, experience, vehicle details)
  - View assigned emergency requests
  - See their own statistics (trips, rating, earnings)
  - Real-time notifications for new requests
  - Accept/decline emergency assignments

**Route:** `/driver/dashboard`
**Protected:** Yes - redirects to login if not authenticated, checks role=driver

---

#### 3. **System Administrators** (role: 'admin')
- **Login Redirect:** `/dashboard` (main admin dashboard)
- **Access Level:** Full system management
- **Features:**
  - View all emergency requests and statistics
  - Manage ambulances fleet at `/ambulances`
  - Manage all drivers at `/drivers`
  - Manage hospital network at `/hospitals`
  - System-wide analytics and reporting
  - Monitor real-time operations
  - Dispatch coordination

**Routes:**
- `/dashboard` - Admin overview with stats
- `/ambulances` - Fleet management
- `/drivers` - Driver management (view all drivers, assign vehicles, review certifications)
- `/hospitals` - Hospital network management

**Protected:** Yes - should only be accessible to admin role

---

## Current Issues Fixed

### ✅ Fixed: Login Redirect
**Problem:** Regular users were being redirected to `/dashboard` which contains admin features

**Solution:** Updated `/src/app/auth/login/page.tsx` to redirect:
- Drivers → `/driver/dashboard`
- Admins → `/dashboard`
- Users → `/user/dashboard`

### ⚠️ Remaining Issue: Route Protection
**Problem:** Admin routes (`/dashboard`, `/ambulances`, `/drivers`, `/hospitals`) are still accessible if a user manually types the URL

**Recommended Solution:** Add role checking to each admin page:
```tsx
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role !== 'admin') {
    router.push('/user/dashboard');
  }
}, []);
```

---

## Database Roles

Current users in database:
- **User accounts (role='user'):** IDs 1, 4
- **Driver accounts (role='driver'):** IDs 2, 3, 5, 6, 7

Test credentials:
- **User:** user1@test.com / test123
- **Driver:** driver2@test.com / test123

---

## Next Steps to Complete Protection

1. **Add role checking to admin pages:**
   - `/src/app/dashboard/page.tsx`
   - `/src/app/ambulances/page.tsx`
   - `/src/app/drivers/page.tsx`
   - `/src/app/hospitals/page.tsx`

2. **Update driver dashboard** to verify role='driver'

3. **Test all three user flows:**
   - Login as user → should see only user dashboard
   - Login as driver → should see only driver dashboard
   - Login as admin → should see full admin dashboard + management pages

---

## API Endpoints by Role

### Public (No Auth)
- `POST /api/auth/register` - Register new user/driver
- `POST /api/auth/login` - Login

### User Endpoints
- `GET /api/drivers` - View all drivers
- `GET /api/drivers/available` - View available drivers
- `POST /api/emergency-requests` - Create emergency request
- `GET /api/emergency-requests/user/:userId` - View own requests

### Driver Endpoints
- `GET /api/drivers/:id` - View own profile
- `PUT /api/drivers/:id` - Update own profile
- `PUT /api/drivers/:id/status` - Update own status
- `GET /api/emergency-requests/driver/:driverId` - View assigned requests
- `PUT /api/emergency-requests/:id/accept` - Accept request

### Admin Endpoints (Need Protection)
- `GET /api/drivers` - View all drivers
- `PUT /api/drivers/:id/verify` - Verify driver
- `DELETE /api/drivers/:id` - Delete driver
- All ambulance and hospital endpoints
- System-wide statistics

---

## Real-Time Features (Socket.IO)

### Events by Role

**Users receive:**
- `request-accepted` - When driver accepts their request
- `driver-arrived` - When driver arrives at location
- `driver-status-changed` - When any driver updates status

**Drivers receive:**
- `new-emergency-request` - New request in their area
- `request-cancelled` - User cancelled request

**Admins receive:**
- All events system-wide
- `emergency-alert` - Critical emergencies
- `ambulance-offline` - Vehicle issues

---

## Summary

✅ **Fixed:** Login now redirects to proper role-based dashboards
✅ **Working:** User dashboard shows only driver availability
✅ **Working:** Driver dashboard allows self-management
⚠️ **TODO:** Add route protection to prevent manual URL access to admin pages
⚠️ **TODO:** Test complete flow with all three user types
