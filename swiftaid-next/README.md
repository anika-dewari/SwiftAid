# SwiftAid - Modern Emergency Dispatch System

A modern, responsive emergency dispatch system built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. This project integrates the beautiful ScrollX UI design system to create an intuitive and efficient interface for emergency response management.

![SwiftAid Logo](https://img.shields.io/badge/SwiftAid-Emergency%20Dispatch-red?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## 🚀 Features

### Core Functionality
- **Real-time Dashboard** - Live monitoring of emergencies, ambulances, and hospitals
- **Emergency Portal** - Quick emergency request submission system
- **Fleet Management** - Ambulance tracking and dispatch coordination
- **Hospital Network** - Bed capacity monitoring and hospital management
- **Driver Management** - Staff scheduling and certification tracking
- **Analytics** - Response time analytics and performance metrics

### Technical Features
- **Modern UI/UX** - ScrollX UI design system with smooth animations
- **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Dark/Light Mode** - Theme switching capability
- **Real-time Updates** - Live data with WebSocket integration (planned)
- **Geolocation** - GPS-based ambulance and emergency tracking
- **Interactive Maps** - Leaflet.js integration for location visualization

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ScrollX UI components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Maps**: Leaflet.js + React-Leaflet
- **Charts**: Chart.js + React-Chart.js-2
- **UI Components**: Radix UI primitives
- **Theme**: next-themes

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/anika-dewari/SwiftAid.git
   cd SwiftAid/swiftaid-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or 
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Integration
To connect with the existing Node.js backend:

1. **Start the backend server**
   ```bash
   cd ../backend
   npm install
   npm start
   ```
   Backend will run on [http://localhost:5000](http://localhost:5000)

2. **Configure API endpoints**
   Update API calls in the frontend to point to `http://localhost:5000/api`

## 🏗️ Project Structure

```
swiftaid-next/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Emergency dashboard
│   │   ├── emergency/          # Emergency portal
│   │   ├── ambulances/         # Fleet management
│   │   ├── hospitals/          # Hospital network
│   │   ├── drivers/            # Driver management
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx     # Button variants
│   │   │   ├── card.tsx       # Card components
│   │   │   └── ...            # Other UI components
│   │   └── theme-provider.tsx # Theme management
│   └── lib/
│       └── utils.ts           # Utility functions
├── public/                     # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies
```

## 🎨 Design System

### Colors
```css
/* Primary Colors */
--swiftaid-primary: #2563EB    /* Blue */
--swiftaid-secondary: #7C3AED  /* Purple */
--swiftaid-accent: #EF4444     /* Red */

/* Emergency Status Colors */
--emergency-critical: #DC2626  /* Red */
--emergency-urgent: #EA580C    /* Orange */
--emergency-normal: #16A34A    /* Green */
```

### Typography
- **Primary Font**: Inter (variable weight)
- **Headings**: Bold weights (600-800)
- **Body Text**: Regular weight (400)
- **Code**: Mono font family

### Components
- **Buttons**: 5 variants (default, emergency, success, warning, outline)
- **Cards**: Glass morphism effect with backdrop blur
- **Animations**: Smooth transitions with Framer Motion
- **Status Indicators**: Color-coded badges for emergencies and ambulances

## 📱 Pages Overview

### 1. Homepage (`/`)
- Hero section with system overview
- Feature highlights
- Emergency access button
- Statistics display

### 2. Dashboard (`/dashboard`)
- Real-time emergency statistics
- Active emergency list
- Ambulance fleet status
- Quick action buttons

### 3. Emergency Portal (`/emergency`)
- Emergency request form
- Patient information collection
- Location services integration
- Priority level selection

### 4. Fleet Management (`/ambulances`)
- Ambulance location tracking
- Status management
- Driver assignments
- Equipment inventory

### 5. Hospital Network (`/hospitals`)
- Bed capacity monitoring
- Department availability
- Contact information
- Distance calculations

### 6. Driver Management (`/drivers`)
- Staff directory
- Certification tracking
- Shift scheduling
- Performance metrics

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## 🌟 Key Features Implementation

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Optimized touch targets for mobile devices

### Animation System
```typescript
// Example animation configuration
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};
```

### Theme System
- Light/Dark mode toggle
- CSS custom properties for theming
- System preference detection

### Emergency Status Management
```typescript
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "critical": return "bg-red-500";
    case "urgent": return "bg-orange-500";
    case "normal": return "bg-green-500";
    default: return "bg-gray-500";
  }
};
```

## 🔗 API Integration

### Endpoints Structure
```typescript
// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Emergency endpoints
POST /api/emergency-requests    // Create emergency request
GET  /api/emergency-requests    // Get all emergencies
GET  /api/ambulances           // Get ambulance data
GET  /api/hospitals            // Get hospital data
GET  /api/drivers              // Get driver data
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Anika Dewari** - Team Lead
- **Ayush Negi** - Developer
- **Ritika Bisht** - Developer

## 📞 Support

For support and questions:
- Email: anikadewari26@gmail.com
- GitHub Issues: [SwiftAid Issues](https://github.com/anika-dewari/SwiftAid/issues)

---

**Made with ❤️ by the SwiftAid Team**