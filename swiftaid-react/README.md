# SwiftAid - Emergency Dispatch System

A modern, responsive React application for emergency dispatch management built with React 18 and modern UI components.

## 🚀 Features

- **Dashboard**: Real-time statistics and emergency overview
- **Emergency Portal**: Submit emergency requests with detailed forms
- **Ambulance Management**: Fleet tracking and dispatch system
- **Hospital Management**: Bed capacity and availability monitoring
- **Driver Management**: Staff directory and certification tracking
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with consistent theme
- **Mock Data**: Pre-populated with realistic sample data

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, consistent icons
- **CSS3** - Modern styling with Grid and Flexbox
- **Chart.js** - Data visualization (ready for integration)
- **Leaflet** - Interactive maps (ready for integration)

## 📦 Installation

1. **Navigate to the React app directory:**
   ```bash
   cd swiftaid-react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### Navigation
- Use the top navigation bar to switch between different modules
- On mobile devices, tap the menu button to access navigation
- All pages are fully responsive and touch-friendly

### Dashboard
- View real-time statistics for ambulances, emergencies, hospitals, and beds
- Quick action cards provide direct access to each management module
- Recent activity feeds show latest emergencies and ambulance status

### Emergency Portal
- Complete form for submitting emergency requests
- GPS location support for accurate positioning
- Priority levels and detailed patient information
- Real-time form validation and submission feedback

### Ambulance Management
- View all ambulances with status, location, and driver information
- Add, edit, and delete ambulance records
- Real-time fuel levels and maintenance tracking
- Filter by status and availability

### Hospital Management
- Monitor bed capacity and availability across all hospitals
- Specialty departments and services tracking
- Occupancy rates with visual indicators
- Hospital contact information and ratings

### Driver Management
- Complete driver profiles with certifications and licenses
- License expiry warnings and alerts
- Shift scheduling and ambulance assignments
- Emergency contact information
- Certification tracking (EMT levels, CPR, etc.)

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+): Full feature set with multi-column layouts
- **Tablet** (768px - 1199px): Adapted layouts with touch-friendly controls
- **Mobile** (320px - 767px): Single-column layout with collapsible navigation

## 🎨 Design System

### Colors
- **Primary**: Blue (#1e40af) - Navigation, primary actions
- **Secondary**: Gray (#64748b) - Secondary actions, text
- **Success**: Green (#059669) - Available status, success states
- **Warning**: Yellow (#d97706) - Busy status, warnings  
- **Danger**: Red (#dc2626) - Critical status, errors

### Typography
- **Font Family**: Inter - Modern, readable font
- **Headings**: Bold weights for hierarchy
- **Body Text**: Regular weight for readability

### Components
- **Cards**: White background with subtle shadows
- **Buttons**: Rounded corners with hover effects
- **Forms**: Consistent input styling with focus states
- **Status Badges**: Color-coded for quick recognition

## 📊 Mock Data

The application includes comprehensive mock data:

### Ambulances (5 units)
- Various status levels (available, busy, maintenance)
- Driver assignments and equipment types
- Fuel levels and maintenance records
- GPS coordinates for mapping

### Hospitals (5 facilities)
- Bed capacity and availability data
- Specialty departments and services
- Contact information and ratings
- Emergency bed allocations

### Drivers (5 staff members)
- Complete profiles with certifications
- License information and expiry dates
- Emergency contacts and shift schedules
- Ambulance assignments

### Emergencies (3 active)
- Different emergency types and priorities
- Location data and reporter information
- Dispatch status and timestamps
- Patient condition details

## 🔧 Development

### Project Structure
```
swiftaid-react/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   └── Layout.js          # Main layout with navigation
│   ├── data/
│   │   └── mockData.js        # Sample data for all modules
│   ├── pages/
│   │   ├── Dashboard.js       # Main dashboard
│   │   ├── EmergencyPortal.js # Emergency submission
│   │   ├── AmbulanceManagement.js
│   │   ├── HospitalManagement.js
│   │   └── DriverManagement.js
│   ├── App.js                 # Main app component
│   ├── index.js              # App entry point
│   └── index.css             # Global styles
├── package.json
└── README.md
```

### Adding New Features
1. **New Pages**: Add to `src/pages/` and update routing in `App.js`
2. **New Components**: Add to `src/components/` for reusable UI elements
3. **New Data**: Extend `src/data/mockData.js` with additional sample data
4. **Styling**: Use existing CSS classes or extend `src/index.css`

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## 🚀 Production Build

To create a production build:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your web server or hosting platform

## 🌟 Future Enhancements

### Backend Integration
- Connect to REST API endpoints
- Real-time data updates via WebSocket
- User authentication and authorization
- Data persistence and synchronization

### Advanced Features
- Interactive maps with real-time tracking
- Push notifications for emergencies
- Advanced analytics and reporting
- Multi-language support
- Dark mode theme option

### Performance Optimizations
- Code splitting and lazy loading
- Service worker for offline support
- Progressive Web App (PWA) features
- Performance monitoring and analytics

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

This is a demo application. For production use, consider:
1. Adding comprehensive testing
2. Implementing proper error handling
3. Adding accessibility improvements
4. Integrating with real backend services
5. Adding security measures

---

**SwiftAid** - Modern Emergency Dispatch System  
Built with ❤️ using React