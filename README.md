# GarageHub - Vehicle Management System

A modern, beautiful web application for managing multiple vehicles within a family or group. Built with React, Vite, and TailwindCSS.

![GarageHub](https://img.shields.io/badge/GarageHub-Vehicle%20Management-3b82f6)

## ✨ Features

### 🔑 Virtual Key Rack
- Visual dashboard showing all vehicles with status indicators
- Real-time availability tracking (Available, In Use, Maintenance)
- Current driver identification
- Quick "Take Keys" / "Return Keys" actions
- Vehicle details including mileage and fuel level
- Add, edit, and delete vehicles

### 📅 Booking Calendar
- Interactive monthly calendar view
- Schedule vehicle reservations with date/time selection
- Conflict prevention with visual overlap detection
- Purpose tracking for each booking
- Upcoming bookings sidebar
- Color-coded by user for easy identification

### 🔧 Service Tracker
- Complete maintenance logbook
- Track service history (oil changes, tire rotations, brake inspections, etc.)
- Mileage-based service reminders
- Cost tracking for maintenance expenses
- Automatic next service due calculations
- Overdue service alerts
- Service type categorization with icons

### 📊 Usage Analytics
- Driver leaderboard showing who uses cars most
- Vehicle usage distribution charts
- Daily usage trends with area charts
- Total distance, trips, and time statistics
- Cost analysis for maintenance
- Time range filters (Week/Month/Year)

### 💬 Car Chat & Notes
- Per-vehicle messaging system
- Leave notes, requests, questions, or alerts
- Message type categorization
- Quick message templates
- Real-time message display
- Coordinated communication between drivers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Open in Browser
Navigate to `http://localhost:5173`

## 🎨 Design Features

- **Dark Theme**: Deep midnight blue gradient background
- **Glassmorphism**: Frosted glass effects throughout
- **Smooth Animations**: Slide, fade, and scale transitions
- **Ember Accent**: Warm orange accent color for CTAs
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Typography**: Outfit for headings, DM Sans for body

## 👥 Default Users

The app comes with 4 pre-configured team members:
- **James Wilson** - Admin (james@garagehub.com)
- **Sarah Miller** - Member
- **Mike Johnson** - Member
- **Emma Davis** - Member

Login with any demo email and any password to access the dashboard.

## 🚗 Sample Data

Includes 3 demo vehicles:
1. **Family SUV** - Toyota RAV4 2023 (Available)
2. **City Runner** - Honda Civic 2022 (In Use by Sarah)
3. **Weekend Cruiser** - BMW 3 Series 2021 (In Maintenance)

## 💾 Data Persistence

All data is automatically saved to `localStorage` using Zustand's persist middleware. Your cars, bookings, services, and messages will persist across browser sessions.

## 🛠 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **Recharts** - Analytics charts
- **date-fns** - Date utilities
- **Lucide React** - Icons

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column, collapsible nav)
- **Tablet**: 768px - 1024px (2 column layouts)
- **Desktop**: > 1024px (full 3-4 column layouts)

## 🔒 Future Enhancements

Based on research, potential improvements include:
- Real-time GPS vehicle tracking
- Push notifications for bookings and reminders
- Digital keyless access integration
- Fuel expense tracking
- Driver behavior monitoring
- Photo attachments for services/damage
- Export reports to PDF
- Multi-family/organization support
- Mobile app with React Native

## 📄 License

MIT License - feel free to use and modify for your needs!

---

Made with ❤️ for teams who share vehicles

