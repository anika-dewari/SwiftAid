# 🔐 SwiftAid Test Login Credentials

## ✅ **ALL PASSWORDS VERIFIED & WORKING!** (Updated: Nov 13, 2025)

All passwords for test accounts: **`password123`** or **`test123`**

---

## 👤 Regular Users

### User 1 (Recommended for Testing) ⭐
```
Email: user@test.com
Password: password123
Role: User
Status: ✅ VERIFIED WORKING
```
**Use this to:** Request emergency services, view available drivers, test notification modal

### User 2
```
Email: test@test.com
Password: password123
Role: User
Status: ✅ VERIFIED WORKING
```

### User 3
```
Email: testuser@test.com
Password: password123
Role: User
Status: ✅ VERIFIED WORKING
```

---

## 🚗 Driver Accounts

### Driver 1 (Main Test Account) ⭐
```
Email: driver@test.com
Password: password123
Role: Driver
License: DL-123456
Vehicle: Ambulance AMB-001
Status: ✅ VERIFIED WORKING
```
**✨ Perfect for testing!** Use this to test the new notification modal with liquid glass effect.

### Driver 2
```
Email: testdriver@test.com
Password: password123
Role: Driver
License: DL123456
Vehicle: ambulance AB-1234
Experience: 5 years
Status: ✅ VERIFIED WORKING
```

### Driver 3
```
Email: ankurawat8844@gmail.com
Password: password123
Role: Driver
License: DL-1234
Vehicle: Ambulance ABC-1234
Experience: 0 years
Status: ✅ VERIFIED WORKING
```

### Driver 4
```
Email: driver2@test.com
Password: test123
Role: Driver
License: DL999999
Vehicle: ambulance XY-9999
Experience: 3 years
Status: ✅ VERIFIED WORKING
```

### Driver 5
```
Email: newdriver@test.com
Password: password123
Role: Driver
Status: ✅ VERIFIED WORKING
```

---

## 🎯 Testing Scenarios

### Scenario 1: View Driver Dashboard with Notifications
1. **Login as Driver 1:**
   - Go to: `http://localhost:3000`
   - Email: `driver@test.com`
   - Password: `password123`
2. **See the beautiful new dashboard** with liquid glass notification modal!
3. **Click "Notifications" button** to see the glassmorphism popup
4. **Change status** to "Available"

### Scenario 2: User Requests Emergency
1. **Open incognito/private window**
2. **Login as User:**
   - Go to: `http://localhost:3000`
   - Email: `user@test.com`
   - Password: `password123`
3. **View available drivers**
4. **Create emergency request**

### Scenario 3: Real-Time Updates
1. **Keep both windows open** (driver + user)
2. **Change driver status** → User dashboard updates instantly! ⚡
3. **Watch Socket.IO in action** 🔌

---

## 🆕 Create New Accounts

If you want to test registration:

### New Driver Template:
```
Name: Your Name
Email: yourname@test.com
Password: password123
License Number: DL-YOUR-NUMBER
Vehicle Type: Ambulance
Vehicle Number: AMB-YOUR-NUMBER
Phone: 1234567890
```

### New User Template:
```
Name: Your Name
Email: yourname@test.com
Password: password123
Phone: 9876543210
```

---

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **Driver Dashboard:** http://localhost:3000/driver/dashboard
- **User Dashboard:** http://localhost:3000/user/dashboard
- **Registration:** http://localhost:3000/register

---

## 🎨 What to Test in Driver Dashboard

✨ **New Features:**
- **Liquid Glass Notification Modal** - Click the bell icon!
- **Animated Badge** - Pulsing red notification count
- **Glassmorphism Effects** - Beautiful blur backgrounds
- **Gradient Accents** - Green → Blue → Purple
- **Smooth Animations** - Fade, slide, scale effects
- **Status Selector** - Change between Available/Busy/Offline
- **Profile Editing** - Edit and save driver details
- **Dark Mode Toggle** - Switch themes
- **Real-time Stats** - Completed/Active trips

---

## 🔧 Troubleshooting

### Can't Login?
- Make sure backend is running on port 5001
- Make sure frontend is running on port 3000
- Check browser console for errors

### No Notifications Showing?
- Notifications are fetched from backend
- Backend endpoint: `/api/notifications?unreadOnly=true`
- Modal shows empty state when no notifications

### Dashboard Not Loading?
- Refresh the page (Ctrl+R / Cmd+R)
- Check that you're using correct credentials
- Verify JWT token in localStorage

---

## 💡 Pro Tips

1. **Use Chrome DevTools** to inspect the beautiful glassmorphism CSS
2. **Open Console** to see all the debug logs (🔄 📡 ✅ emojis!)
3. **Test in multiple browsers** to see cross-browser compatibility
4. **Try dark mode** - The liquid glass effect looks amazing!
5. **Hover over cards** - Enjoy the smooth CSS transitions

---

## 📝 Notes

- All passwords are securely hashed with bcrypt
- JWT tokens expire after 24 hours
- Socket.IO enables real-time updates
- Driver profiles are automatically created on first login
- Default stats start at 0 (completed trips, active trips, etc.)

---

**Last Updated:** November 13, 2025
**Status:** ✅ All systems operational!
