import { useState, useEffect } from 'react'
import { 
  LayoutDashboard,
  Car, 
  Calendar, 
  Wrench, 
  BarChart3, 
  MessageSquare, 
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Menu,
  X,
  Loader2
} from 'lucide-react'
import { useAuth } from './contexts/AuthContext'
import { useStore } from './store/useStore'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Dashboard from './components/Dashboard'
import KeyRack from './components/KeyRack'
import BookingCalendar from './components/BookingCalendar'
import ServiceTracker from './components/ServiceTracker'
import Analytics from './components/Analytics'
import CarChat from './components/CarChat'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'service', label: 'Service', icon: Wrench },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
]

// Sidebar Component
function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const { user, signOut } = useAuth()
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = user?.user_metadata?.avatar_initials || displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const color = '#3b82f6'

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#111827] border-r border-white/5 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">GarageHub</h1>
                <p className="text-xs text-gray-500">Vehicle Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsOpen(false)
                  }}
                  className={`sidebar-item w-full ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{ backgroundColor: color + '20', color: color }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

// Header Component
function Header({ setIsSidebarOpen }) {
  const { user, signOut } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = user?.user_metadata?.avatar_initials || displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const color = '#3b82f6'

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="sticky top-0 z-30 bg-[#0c0f14]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search vehicles, bookings..."
              className="input w-full pl-10 pr-4 py-2 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="notification-dot" />
            </button>
            
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 card p-0 overflow-hidden z-20 animate-scaleIn">
                  <div className="p-4 border-b border-white/5">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                      <p className="text-sm text-white">Oil change due for Family SUV</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                    <div className="p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                      <p className="text-sm text-white">Sarah has booked City Runner</p>
                      <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                    </div>
                    <div className="p-4 hover:bg-white/5 transition-colors">
                      <p className="text-sm text-white">Weekend Cruiser back from service</p>
                      <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ backgroundColor: color + '20', color: color }}
              >
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-medium text-white">{displayName.split(' ')[0]}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 card p-2 z-20 animate-scaleIn">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <div className="my-1 h-px bg-white/5" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// Main App Layout
function AppLayout() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'vehicles':
        return <KeyRack />
      case 'bookings':
        return <BookingCalendar />
      case 'service':
        return <ServiceTracker />
      case 'analytics':
        return <Analytics />
      case 'messages':
        return <CarChat />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0f14]">
      <div className="bg-pattern fixed inset-0 pointer-events-none" />
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="lg:pl-64">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className="p-4 lg:p-6">
          <div className="animate-fadeIn">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

// Loading Screen
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
          </svg>
        </div>
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
        <p className="text-gray-400 mt-2">Loading...</p>
      </div>
    </div>
  )
}

// Configuration Error Screen
function ConfigErrorScreen() {
  return (
    <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Configuration Required</h1>
        <p className="text-gray-400 mb-6">
          Supabase environment variables are not configured. Please add the following to your Vercel project settings:
        </p>
        <div className="bg-[#1a1f2e] rounded-xl p-4 text-left mb-6">
          <code className="text-sm text-blue-400 block mb-2">VITE_SUPABASE_URL</code>
          <code className="text-sm text-blue-400 block">VITE_SUPABASE_ANON_KEY</code>
        </div>
        <p className="text-gray-500 text-sm">
          Go to Vercel Dashboard → Project Settings → Environment Variables
        </p>
      </div>
    </div>
  )
}

// Auth Wrapper
function App() {
  const { isAuthenticated, loading, configError } = useAuth()
  const [authMode, setAuthMode] = useState('login')

  if (configError) {
    return <ConfigErrorScreen />
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    if (authMode === 'login') {
      return <Login onSwitchToSignup={() => setAuthMode('signup')} />
    }
    return <Signup onSwitchToLogin={() => setAuthMode('login')} />
  }

  return <AppLayout />
}

export default App
