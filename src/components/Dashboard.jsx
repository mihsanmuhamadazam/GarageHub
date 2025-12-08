import { useMemo } from 'react'
import { 
  Car, 
  Calendar, 
  Wrench, 
  TrendingUp, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Fuel,
  Route,
  Activity
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { format, subDays, eachDayOfInterval, parseISO, isSameMonth } from 'date-fns'
import { useStore } from '../store/useStore'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

// Metric Card Component
function MetricCard({ title, value, change, changeType, icon: Icon, color, delay }) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-emerald-500/10 text-emerald-400',
    yellow: 'bg-amber-500/10 text-amber-400',
    purple: 'bg-purple-500/10 text-purple-400',
  }

  return (
    <div 
      className="card p-6 animate-slideUp opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${changeType === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {change}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  )
}

// Vehicle Status Card
function VehicleCard({ car, users }) {
  const statusStyles = {
    'available': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    'in-use': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400' },
    'maintenance': { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  }

  const style = statusStyles[car.status]
  const driver = car.currentDriver ? users.find(u => u.name === car.currentDriver) : null

  return (
    <div className="card p-5 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: car.color + '20' }}
          >
            <Car className="w-7 h-7" style={{ color: car.color }} />
          </div>
          <div>
            <h4 className="font-semibold text-white">{car.name}</h4>
            <p className="text-sm text-gray-400">{car.make} {car.model}</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg ${style.bg} border ${style.border}`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${style.dot} animate-pulse-subtle`} />
            <span className={`text-xs font-medium ${style.text} capitalize`}>{car.status.replace('-', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Mileage</p>
          <p className="text-sm font-semibold text-white">{car.mileage.toLocaleString()} km</p>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Fuel Level</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${car.fuelLevel > 50 ? 'bg-emerald-500' : car.fuelLevel > 25 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${car.fuelLevel}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{car.fuelLevel}%</span>
          </div>
        </div>
      </div>

      {driver && (
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ backgroundColor: driver.color + '30', color: driver.color }}
          >
            {driver.avatar}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{driver.name}</p>
            <p className="text-xs text-gray-500">Current driver</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Recent Activity Item
function ActivityItem({ activity, users, cars }) {
  const user = users.find(u => u.id === activity.userId)
  const car = cars.find(c => c.id === activity.carId)
  
  return (
    <div className="flex items-center gap-4 py-3">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
        style={{ backgroundColor: user?.color + '20', color: user?.color }}
      >
        {user?.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white">
          <span className="font-medium">{user?.name}</span>
          <span className="text-gray-400"> drove </span>
          <span className="font-medium">{car?.name}</span>
        </p>
        <p className="text-xs text-gray-500">{activity.distance} km · {activity.duration} min</p>
      </div>
      <p className="text-xs text-gray-500 shrink-0">{activity.date}</p>
    </div>
  )
}

// Upcoming Service Item
function ServiceItem({ service, cars }) {
  const car = cars.find(c => c.id === service.carId)
  const isOverdue = service.nextDue && car && car.mileage >= service.nextDue
  
  return (
    <div className={`p-4 rounded-xl ${isOverdue ? 'bg-red-500/10 border border-red-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-white">{service.type}</p>
          <p className="text-sm text-gray-400">{car?.name}</p>
        </div>
        {isOverdue ? (
          <AlertTriangle className="w-5 h-5 text-red-400" />
        ) : (
          <Clock className="w-5 h-5 text-amber-400" />
        )}
      </div>
      <p className={`text-xs font-medium ${isOverdue ? 'text-red-400' : 'text-amber-400'}`}>
        {isOverdue ? `Overdue by ${(car.mileage - service.nextDue).toLocaleString()} km` : `Due at ${service.nextDue?.toLocaleString()} km`}
      </p>
    </div>
  )
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 border border-white/10">
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { cars, users, bookings, services, usageLog, currentUser } = useStore()

  // Calculate metrics
  const metrics = useMemo(() => {
    const availableCars = cars.filter(c => c.status === 'available').length
    const inUseCars = cars.filter(c => c.status === 'in-use').length
    const maintenanceCars = cars.filter(c => c.status === 'maintenance').length
    const totalDistance = usageLog.reduce((sum, log) => sum + log.distance, 0)
    const totalTrips = usageLog.length
    const activeBookings = bookings.filter(b => new Date(b.endDate) >= new Date()).length
    const totalServiceCost = services.reduce((sum, s) => sum + (s.cost || 0), 0)
    
    return {
      totalCars: cars.length,
      availableCars,
      inUseCars,
      maintenanceCars,
      totalDistance,
      totalTrips,
      activeBookings,
      totalServiceCost,
    }
  }, [cars, bookings, services, usageLog])

  // Daily usage data for chart
  const dailyUsage = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 13),
      end: new Date()
    })
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayLogs = usageLog.filter(log => log.date === dayStr)
      return {
        date: format(day, 'MMM d'),
        distance: dayLogs.reduce((sum, log) => sum + log.distance, 0),
        trips: dayLogs.length,
      }
    })
  }, [usageLog])

  // Usage by user
  const usageByUser = useMemo(() => {
    const userUsage = {}
    users.forEach(user => {
      userUsage[user.id] = { name: user.name.split(' ')[0], distance: 0, color: user.color }
    })
    usageLog.forEach(log => {
      if (userUsage[log.userId]) {
        userUsage[log.userId].distance += log.distance
      }
    })
    return Object.values(userUsage).filter(u => u.distance > 0)
  }, [usageLog, users])

  // Upcoming services
  const upcomingServices = useMemo(() => {
    return cars.flatMap(car => {
      const carServices = services.filter(s => s.carId === car.id && s.nextDue)
      return carServices.map(s => ({
        ...s,
        remaining: s.nextDue - car.mileage,
      }))
    }).filter(s => s.remaining <= 3000).sort((a, b) => a.remaining - b.remaining).slice(0, 3)
  }, [cars, services])

  // Recent activity
  const recentActivity = usageLog.slice(-5).reverse()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="animate-fadeIn">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {currentUser?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-400">Here's what's happening with your fleet today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Vehicles" 
          value={metrics.totalCars} 
          icon={Car}
          color="blue"
          delay={100}
        />
        <MetricCard 
          title="Active Bookings" 
          value={metrics.activeBookings} 
          change={12}
          changeType="up"
          icon={Calendar}
          color="green"
          delay={200}
        />
        <MetricCard 
          title="Total Distance" 
          value={`${metrics.totalDistance} km`}
          change={8}
          changeType="up"
          icon={Route}
          color="purple"
          delay={300}
        />
        <MetricCard 
          title="Service Costs" 
          value={`$${metrics.totalServiceCost}`}
          icon={Wrench}
          color="yellow"
          delay={400}
        />
      </div>

      {/* Fleet Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4 animate-slideUp opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{metrics.availableCars}</p>
            <p className="text-sm text-gray-400">Available</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4 animate-slideUp opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{metrics.inUseCars}</p>
            <p className="text-sm text-gray-400">In Use</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4 animate-slideUp opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{metrics.maintenanceCars}</p>
            <p className="text-sm text-gray-400">Maintenance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <div className="lg:col-span-2 card p-6 animate-slideUp opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Usage Overview</h3>
              <p className="text-sm text-gray-400">Daily distance traveled (last 14 days)</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyUsage}>
                <defs>
                  <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#4b5563"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#4b5563"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}km`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="distance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorDistance)"
                  name="Distance"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Driver Distribution */}
        <div className="card p-6 animate-slideUp opacity-0" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
          <h3 className="font-semibold text-white mb-6">Driver Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={usageByUser}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="distance"
                >
                  {usageByUser.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {usageByUser.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
                  <span className="text-sm text-gray-300">{user.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{user.distance} km</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Fleet */}
        <div className="lg:col-span-2 space-y-4 animate-slideUp opacity-0" style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Vehicle Fleet</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View all</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cars.map((car) => (
              <VehicleCard key={car.id} car={car} users={users} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 animate-slideUp opacity-0" style={{ animationDelay: '1100ms', animationFillMode: 'forwards' }}>
          {/* Upcoming Services */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Upcoming Services</h3>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            {upcomingServices.length > 0 ? (
              <div className="space-y-3">
                {upcomingServices.map((service) => (
                  <ServiceItem key={service.id} service={service} cars={cars} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">All services up to date</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
            <div className="divide-y divide-white/5">
              {recentActivity.map((activity) => (
                <ActivityItem 
                  key={activity.id} 
                  activity={activity} 
                  users={users}
                  cars={cars}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

