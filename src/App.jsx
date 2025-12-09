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
  Loader2,
  Users,
  Sparkles
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
import Social from './components/Social'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'service', label: 'Service', icon: Wrench },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'social', label: 'Social', icon: Users },
]

// Sidebar Component
function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const { user, signOut } = useAuth()
  const { profile } = useStore()
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = profile?.avatar_initials || user?.user_metadata?.avatar_initials || displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const color = profile?.color || '#00e5c9'

  const handleSignOut = async () => {
    useStore.getState().clearData()
    await signOut()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-void-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-void-900/95 backdrop-blur-xl border-r border-white/5 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl gradient-neon flex items-center justify-center shadow-neon">
                <svg className="w-6 h-6 text-void-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Garage<span className="text-neon-400">Hub</span></h1>
                <p className="text-xs text-void-400 font-medium">Vehicle Management</p>
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
                  {item.id === 'social' && (
                    <Sparkles className="w-4 h-4 text-neon-400 ml-auto" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-void-800/50">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: color + '30', color: color }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                <p className="text-xs text-void-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-void-400 hover:text-coral-400 hover:bg-coral-500/10 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign out</span>
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
  const { profile, pendingConnections } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = profile?.avatar_initials || user?.user_metadata?.avatar_initials || displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const color = profile?.color || '#00e5c9'

  const handleSignOut = async () => {
    useStore.getState().clearData()
    await signOut()
  }

  const hasNotifications = pendingConnections?.length > 0

  return (
    <header className="sticky top-0 z-30 bg-void-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl hover:bg-void-800 transition-colors"
        >
          <Menu className="w-6 h-6 text-void-300" />
        </button>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md ml-4 lg:ml-0">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-void-500" />
            <input
              type="text"
              placeholder="Search vehicles, bookings..."
              className="input w-full pl-11 pr-4 py-2.5 rounded-xl text-sm bg-void-800/50"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-void-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-void-300" />
              {hasNotifications && <span className="notification-dot" />}
            </button>
            
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 card p-0 overflow-hidden z-20 animate-scale-in">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {hasNotifications && (
                      <span className="px-2 py-0.5 rounded-full bg-coral-500/20 text-coral-400 text-xs font-medium">
                        {pendingConnections.length}
                      </span>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {pendingConnections?.length > 0 ? (
                      pendingConnections.map((conn) => (
                        <div key={conn.id} className="p-4 hover:bg-void-800/50 transition-colors border-b border-white/5">
                          <p className="text-sm text-white">
                            <span className="font-medium text-neon-400">{conn.user?.full_name || 'Someone'}</span> wants to connect
                          </p>
                          <p className="text-xs text-void-400 mt-1">Pending connection request</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-void-600 mx-auto mb-2" />
                        <p className="text-sm text-void-400">No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-void-800 transition-colors"
            >
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: color + '30', color: color }}
              >
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-medium text-white">{displayName.split(' ')[0]}</span>
              <ChevronDown className={`w-4 h-4 text-void-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 card p-2 z-20 animate-scale-in">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-void-300 hover:text-white hover:bg-void-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                  <div className="my-2 h-px bg-white/5" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-coral-400 hover:bg-coral-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign out</span>
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
  const { user } = useAuth()
  const { initializeData, setCurrentUser, loading } = useStore()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Initialize data when user logs in
  useEffect(() => {
    if (user?.id) {
      setCurrentUser(user)
      initializeData(user.id)
    }
  }, [user?.id, initializeData, setCurrentUser])

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
      case 'social':
        return <Social />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-void-950">
      <div className="bg-pattern fixed inset-0 pointer-events-none" />
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="lg:pl-72">
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
    <div className="min-h-screen bg-void-950 flex items-center justify-center">
      <div className="bg-pattern fixed inset-0 pointer-events-none" />
      <div className="text-center relative z-10">
        <div className="w-20 h-20 rounded-2xl gradient-neon flex items-center justify-center mx-auto mb-6 shadow-neon animate-float">
          <svg className="w-12 h-12 text-void-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
          </svg>
        </div>
        <Loader2 className="w-8 h-8 text-neon-400 animate-spin mx-auto" />
        <p className="text-void-300 mt-4 font-medium">Loading GarageHub...</p>
      </div>
    </div>
  )
}

// Configuration Error Screen
function ConfigErrorScreen() {
  return (
    <div className="min-h-screen bg-void-950 flex items-center justify-center p-4">
      <div className="bg-pattern fixed inset-0 pointer-events-none" />
      <div className="text-center max-w-md relative z-10">
        <div className="w-20 h-20 rounded-2xl gradient-coral flex items-center justify-center mx-auto mb-6 shadow-coral">
          <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Configuration Required</h1>
        <p className="text-void-300 mb-8">
          Supabase environment variables are not configured. Please add the following to your project settings:
        </p>
        <div className="card p-5 text-left mb-8">
          <code className="text-sm text-neon-400 font-mono block mb-2">VITE_SUPABASE_URL</code>
          <code className="text-sm text-neon-400 font-mono block">VITE_SUPABASE_ANON_KEY</code>
        </div>
        <p className="text-void-500 text-sm">
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
