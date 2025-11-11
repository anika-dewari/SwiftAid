# SwiftAid - Complete Authentication & Driver Management System

## 🚀 Features Implemented

### ✅ Authentication System
- **JWT-based authentication** with role-based access control
- **Three user roles**: User, Admin, and Driver
- **Secure password hashing** with bcrypt
- **Protected routes** with middleware
- **Login wall** on home page

### ✅ Driver Management
- **Driver registration** with vehicle details
- **Profile editing** for drivers
- **Real-time status updates** (Available, Busy, Offline)
- **Location tracking** capability
- **Driver statistics** (trips, rating, experience)

### ✅ User Dashboard
- **View all drivers** with real-time status
- **Filter available drivers**
- **Real-time updates** via Socket.IO
- **Driver details** (vehicle, rating, experience)

### ✅ Notification System
- **Real-time notifications** via Socket.IO
- **Driver notifications** for new emergency requests
- **User notifications** when driver accepts request
- **Notification history** and management

### ✅ Database Schema
- **Users table** with roles
- **Driver profiles** with complete details
- **Emergency requests** tracking
- **Notifications** system
- **Status history** for tracking

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your database credentials
# Required variables:
# - DB_USER
# - DB_HOST
# - DB_NAME
# - DB_PASSWORD
# - DB_PORT
# - JWT_SECRET

# Setup database (creates tables and sample data)
./setup-db.sh

# Or manually run the schema
psql -U your_user -d swiftaid_db -f schema.sql

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd swiftaid-next

# Install dependencies (already done)
npm install

# Start development server (already running)
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🧪 Testing Instructions

### Test Case 1: Driver Registration and Status Update

#### Step 1: Register as a Driver

1. Open `http://localhost:3000`
2. Click **"Sign Up"** button
3. Select **"Driver"** tab
4. Fill in the form:
   - **Full Name**: John Driver
   - **Phone**: +1234567890
   - **Email**: driver1@test.com
   - **Password**: password123
   - **License Number**: DL-123456789
   - **Vehicle Type**: Ambulance
   - **Vehicle Number**: AMB-001
   - **Vehicle Model**: Ford Transit 2023
   - **Years of Experience**: 5
5. Click **"Create Account"**
6. You'll be redirected to the **Driver Dashboard**

#### Step 2: Update Driver Status

1. In the Driver Dashboard, find the **"Current Status"** card
2. Click the dropdown (currently showing "offline")
3. Select **"Available"** from the dropdown
4. Status will update immediately
5. A success message will appear

#### Step 3: Edit Driver Profile

1. In the **"Profile Information"** card, click **"Edit Profile"**
2. Modify any field (e.g., change vehicle model to "Ford Transit 2024")
3. Click **"Save Changes"**
4. Profile will update and show success message

### Test Case 2: User Views Driver Status

#### Step 1: Register as a User

1. Open a new incognito/private browser window
2. Go to `http://localhost:3000`
3. Click **"Sign Up"**
4. Select **"User"** tab
5. Fill in the form:
   - **Full Name**: Jane User
   - **Phone**: +1234567891
   - **Email**: user1@test.com
   - **Password**: password123
6. Click **"Create Account"**
7. You'll be redirected to the **User Dashboard**

#### Step 2: View Available Drivers

1. In the User Dashboard, you'll see statistics:
   - **Available Drivers**: Should show "1" (the driver you created)
   - **Total Drivers**: Shows all registered drivers
2. Scroll to **"Available Drivers"** section
3. You should see a card showing:
   - Driver Name: John Driver
   - Vehicle: Ambulance - AMB-001
   - Phone number
   - Rating and trips
   - Green "Available" badge

#### Step 3: Test Real-Time Updates

1. Go back to the **Driver** browser window (or login as driver again)
2. Change status from **"Available"** to **"Busy"**
3. Go back to the **User** browser window
4. The driver's status should automatically update to "Busy" without refreshing
5. The "Available Drivers" count should decrease to "0"
6. The driver card will move from "Available Drivers" section

### Test Case 3: Create Another Driver and Verify

#### Step 1: Register Second Driver

1. Logout from driver account
2. Register another driver:
   - **Email**: driver2@test.com
   - **Vehicle Number**: AMB-002
   - (fill other details)
3. Set status to **"Available"**

#### Step 2: Verify User Can See Both

1. Go to User dashboard
2. You should now see:
   - **Available Drivers**: Shows count based on available drivers
   - Both drivers listed in the **"All Drivers"** section
   - Color-coded status indicators (green dot for available, yellow for busy, red for offline)

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register     - Register new user (user/admin/driver)
POST /api/auth/login        - Login
GET  /api/auth/profile      - Get current user profile
GET  /api/auth/verify       - Verify JWT token
```

### Driver Endpoints
```
GET  /api/drivers/profile        - Get driver profile (driver only)
PUT  /api/drivers/profile        - Update driver profile (driver only)
PUT  /api/drivers/status         - Update driver status (driver only)
GET  /api/drivers/stats          - Get driver statistics (driver only)
GET  /api/drivers               - Get all drivers (public)
GET  /api/drivers/available     - Get available drivers (public)
GET  /api/drivers/:id           - Get driver by ID (public)
```

### Emergency Requests
```
POST /api/emergency-requests           - Create emergency request
GET  /api/emergency-requests           - Get all requests (with filters)
GET  /api/emergency-requests/pending   - Get pending requests (drivers)
POST /api/emergency-requests/:id/accept - Accept request (driver)
```

### Notifications
```
GET  /api/notifications              - Get user notifications
GET  /api/notifications/unread-count - Get unread count
PUT  /api/notifications/:id/read     - Mark as read
PUT  /api/notifications/read-all     - Mark all as read
DELETE /api/notifications/:id        - Delete notification
```

## 📊 Database Tables

### users
- id, email, password_hash, role, full_name, phone
- Stores all user accounts with their roles

### driver_profiles
- Complete driver information
- Vehicle details
- Current status (available/busy/offline)
- Location coordinates
- Rating and statistics

### emergency_requests
- Patient details
- Emergency type and severity
- Pickup location
- Assigned driver
- Status tracking

### notifications
- User-specific notifications
- Related emergency requests
- Read/unread status

## 🎯 Key Features to Test

1. **Login Wall**: Home page shows Sign Up/Login when not authenticated
2. **Role-based Redirect**: 
   - Drivers → `/driver/dashboard`
   - Users → `/user/dashboard`
   - Admin → `/admin/dashboard`
3. **Real-time Status**: Driver status updates appear instantly on user dashboard
4. **Profile Editing**: Drivers can update their vehicle and personal information
5. **Driver Discovery**: Users can see all drivers with filterable status
6. **Responsive Design**: Works on mobile, tablet, and desktop

## 🔐 Sample Credentials

After running `setup-db.sh` with sample data:

**Admin Account**
- Email: admin@swiftaid.com
- Password: admin123

**Test User**
- Email: user@test.com
- Password: password123

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `psql -U postgres -l`
- Verify .env file exists with correct credentials
- Check port 5000 is not in use

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify Socket.IO connection in browser dev tools

### Database connection errors
- Verify PostgreSQL credentials in .env
- Ensure database exists: `psql -U postgres -l | grep swiftaid`
- Check PostgreSQL is accepting connections

### Real-time updates not working
- Check Socket.IO connection in browser console
- Ensure both frontend and backend are running
- Clear browser cache and reload

## 📱 Testing Checklist

- [ ] Driver can register with vehicle details
- [ ] Driver can login and access driver dashboard
- [ ] Driver can update status (available/busy/offline)
- [ ] Driver can edit profile information
- [ ] User can register and login
- [ ] User can see list of all drivers
- [ ] User can see available drivers count
- [ ] User dashboard updates in real-time when driver changes status
- [ ] Login wall works on home page
- [ ] Different roles redirect to correct dashboards
- [ ] Driver statistics display correctly
- [ ] Profile changes persist after logout/login

## 🚀 Next Steps

1. **Implement emergency request flow**
   - User creates emergency request
   - Available drivers get notified
   - Driver accepts request
   - Status updates throughout journey

2. **Add map integration**
   - Show driver locations on map
   - Real-time tracking during emergency
   - Route optimization

3. **Enhanced notifications**
   - Push notifications
   - SMS alerts
   - Email notifications

4. **Admin dashboard**
   - Manage all users
   - Approve driver registrations
   - System analytics

## 📞 Support

For issues or questions, please check:
1. Console logs in browser (F12)
2. Backend terminal logs
3. Database connection status

---

Built with ❤️ by the SwiftAid Team
