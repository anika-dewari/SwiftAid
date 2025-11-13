# SwiftAid - Installation Requirements

## 📋 System Requirements

### Operating Systems Supported:
- ✅ macOS (10.15 or later)
- ✅ Windows 10/11
- ✅ Linux (Ubuntu 20.04+ or equivalent)

---

## 🛠️ Prerequisites

### 1. Node.js & npm
**Version:** Node.js 18.x or later, npm 9.x or later

#### macOS Installation:
```bash
# Using Homebrew
brew install node

# Verify installation
node --version  # Should show v18.x or later
npm --version   # Should show 9.x or later
```

#### Windows Installation:
```powershell
# Download from nodejs.org
# https://nodejs.org/en/download/

# Or using Chocolatey
choco install nodejs-lts

# Verify installation
node --version
npm --version
```

#### Linux Installation:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

---

### 2. PostgreSQL Database
**Version:** PostgreSQL 14.x or later

#### macOS Installation:
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14

# Verify installation
psql --version
```

#### Windows Installation:
```powershell
# Download from postgresql.org
# https://www.postgresql.org/download/windows/

# Or using Chocolatey
choco install postgresql14

# Start PostgreSQL service
net start postgresql-x64-14
```

#### Linux Installation:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

---

### 3. Git
**Version:** Git 2.x or later

#### macOS Installation:
```bash
# Usually pre-installed, or use Homebrew
brew install git

# Verify
git --version
```

#### Windows Installation:
```powershell
# Download from git-scm.com
# https://git-scm.com/download/win

# Or using Chocolatey
choco install git

# Verify
git --version
```

#### Linux Installation:
```bash
# Ubuntu/Debian
sudo apt install git

# Verify
git --version
```

---

## 📦 Backend Dependencies

### Core Dependencies:
```json
{
  "bcryptjs": "^3.0.3",           // Password hashing
  "body-parser": "^2.2.0",        // Request body parsing
  "cors": "^2.8.5",               // Cross-Origin Resource Sharing
  "dotenv": "^16.4.1",            // Environment variables
  "express": "^4.21.2",           // Web framework
  "express-validator": "^7.3.0",  // Request validation
  "jsonwebtoken": "^9.0.2",       // JWT authentication
  "pg": "^8.16.3",                // PostgreSQL client
  "socket.io": "^4.8.1",          // WebSocket for real-time
  "twilio": "^5.10.5"             // SMS service
}
```

### Dev Dependencies:
```json
{
  "nodemon": "^3.1.10"            // Auto-restart server on changes
}
```

### Installation:
```bash
cd backend
npm install
```

---

## 🎨 Frontend Dependencies

### Core Dependencies:
```json
{
  "next": "15.0.1",                           // React framework
  "react": "^18.3.1",                         // React library
  "react-dom": "^18.3.1",                     // React DOM
  "socket.io-client": "^4.8.1",               // WebSocket client
  
  // UI Components (Radix UI)
  "@radix-ui/react-accordion": "^1.2.0",
  "@radix-ui/react-alert-dialog": "^1.1.1",
  "@radix-ui/react-avatar": "^1.1.0",
  "@radix-ui/react-checkbox": "^1.1.1",
  "@radix-ui/react-dialog": "^1.1.1",
  "@radix-ui/react-dropdown-menu": "^2.1.1",
  "@radix-ui/react-label": "^2.1.8",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-separator": "^1.1.0",
  "@radix-ui/react-slot": "^1.2.4",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-toast": "^1.2.1",
  "@radix-ui/react-tooltip": "^1.1.2",
  
  // Styling & Animation
  "tailwindcss": "^3.4.14",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "framer-motion": "^11.18.2",
  "next-themes": "^0.3.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  
  // Charts & Visualization
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  
  // Maps
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/google.maps": "^3.58.1",
  
  // Icons & UI
  "lucide-react": "^0.441.0",
  "sonner": "^2.0.7"
}
```

### Dev Dependencies:
```json
{
  "@types/leaflet": "^1.9.21",
  "@types/node": "^22.7.4",
  "@types/react": "^18.3.9",
  "@types/react-dom": "^18.3.0",
  "autoprefixer": "^10.4.20",
  "eslint": "^8.57.1",
  "eslint-config-next": "15.0.1",
  "postcss": "^8.4.47",
  "tailwindcss": "^3.4.14",
  "typescript": "^5.6.2"
}
```

### Installation:
```bash
cd swiftaid-next
npm install
```

---

## 🔑 Third-Party Services

### 1. Twilio SMS Service
**Required for:** SMS notifications to drivers

**Setup:**
1. Create account at: https://www.twilio.com/try-twilio
2. Get your credentials:
   - Account SID
   - Auth Token
   - Phone Number
3. Add to `.env` file (see Configuration below)

**Free Tier:**
- $15 trial credit
- 50 SMS per day
- Verified numbers only

**Recommended:** Upgrade for production (~$10-20)

---

## ⚙️ Configuration Files

### Backend Configuration (.env)
Create `backend/.env` file:

```bash
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=swiftaid_db
DB_PASSWORD=your_password
DB_PORT=5432

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Port
PORT=5001

# Environment
NODE_ENV=development

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

---

## 🗄️ Database Setup

### 1. Create Database:
```bash
# macOS/Linux
psql -U postgres
CREATE DATABASE swiftaid_db;
\q

# Windows
psql -U postgres
CREATE DATABASE swiftaid_db;
\q
```

### 2. Run Schema:
```bash
psql -U postgres -d swiftaid_db -f backend/schema.sql
```

### 3. Verify Tables:
```bash
psql -U postgres -d swiftaid_db
\dt
# Should show: users, driver_profiles, emergency_requests, hospitals, ambulances, notifications
```

---

## 🚀 Installation Steps

### macOS:

```bash
# 1. Clone repository
git clone https://github.com/anika-dewari/SwiftAid.git
cd SwiftAid

# 2. Install backend dependencies
cd backend
npm install
cp .env.example .env  # Edit with your values

# 3. Setup database
psql -U postgres -c "CREATE DATABASE swiftaid_db;"
psql -U postgres -d swiftaid_db -f schema.sql

# 4. Install frontend dependencies
cd ../swiftaid-next
npm install

# 5. Start services
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd swiftaid-next
npm run dev
```

### Windows:

```powershell
# 1. Clone repository
git clone https://github.com/anika-dewari/SwiftAid.git
cd SwiftAid

# 2. Install backend dependencies
cd backend
npm install
copy .env.example .env  # Edit with your values

# 3. Setup database
psql -U postgres -c "CREATE DATABASE swiftaid_db;"
psql -U postgres -d swiftaid_db -f schema.sql

# 4. Install frontend dependencies
cd ..\swiftaid-next
npm install

# 5. Start services
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd swiftaid-next
npm run dev
```

---

## ✅ Verification

### Check Backend:
```bash
curl http://localhost:5001/api/health
# Should return: {"status":"ok","message":"SwiftAid API is running"}
```

### Check Frontend:
```bash
# Open browser
http://localhost:3000
# Should show SwiftAid landing page
```

### Check Database:
```bash
psql -U postgres -d swiftaid_db -c "SELECT COUNT(*) FROM users;"
# Should return a count (0 if empty)
```

---

## 🐛 Common Issues

### Port Already in Use:

**macOS/Linux:**
```bash
# Find process using port 5001
lsof -i :5001
# Kill process
kill -9 <PID>

# Find process using port 3000
lsof -i :3000
kill -9 <PID>
```

**Windows:**
```powershell
# Find process using port 5001
netstat -ano | findstr :5001
# Kill process
taskkill /PID <PID> /F

# Find process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### PostgreSQL Connection Error:
```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Windows
sc query postgresql-x64-14
```

### Module Not Found:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 SMS Testing Notes

### Trial Account Limitations:
- 50 SMS per day
- Verified numbers only
- "Sent from Twilio trial" prefix
- Geographic restrictions may apply

### For Production:
- Upgrade Twilio account ($10-20 minimum)
- Get India-based phone number for better delivery
- Remove trial restrictions

---

## 🔗 Useful Links

- **Node.js:** https://nodejs.org/
- **PostgreSQL:** https://www.postgresql.org/
- **Twilio:** https://www.twilio.com/
- **Next.js Docs:** https://nextjs.org/docs
- **Express Docs:** https://expressjs.com/
- **Socket.IO Docs:** https://socket.io/docs/

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Support

For issues or questions:
- GitHub Issues: https://github.com/anika-dewari/SwiftAid/issues
- Documentation: See README.md and other docs in repository
