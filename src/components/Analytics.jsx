import { useState, useMemo, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Car, 
  Clock,
  Fuel,
  Route,
  Calendar,
  Sparkles,
  Zap,
  Award,
  Target,
  Loader2
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import { useStore } from '../store/useStore'
import { useAuth } from '../contexts/AuthContext'

const carImages = {
  suv: '🚙',
  sedan: '🚗',
  luxury: '🚘',
  truck: '🛻',
  van: '🚐',
  sports: '🏎️',
}

const COLORS = ['#ff5a1f', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899']

// Loading Skeleton
function ChartSkeleton() {
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-ember-500 animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading analytics...</p>
      </div>
    </div>
  )
}

function StatCardSkeleton({ index }) {
  return (
    <div 
      className="animate-slideUpFade"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-midnight-700/50 skeleton" />
        </div>
        <div className="h-8 w-24 bg-midnight-700/50 rounded skeleton mb-2" />
        <div className="h-4 w-20 bg-midnight-700/50 rounded skeleton" />
      </div>
    </div>
  )
}

// Hero section
function AnalyticsHero({ totals, loading }) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-8 mb-8 animate-slideUpFade">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-ember-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-400">Usage Analytics</span>
            </div>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Data-Driven{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Insights</span>
          </h2>
          <p className="text-midnight-300 text-lg max-w-md">
            Track vehicle usage patterns and statistics to optimize your fleet.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-light rounded-2xl p-4 text-center animate-bounce-in stagger-1">
            {loading ? (
              <div className="h-8 w-12 mx-auto bg-midnight-700/50 rounded skeleton mb-1" />
            ) : (
              <p className="font-display text-3xl font-bold text-white">{totals.totalTrips}</p>
            )}
            <p className="text-xs text-midnight-400">Total Trips</p>
          </div>
          <div className="glass-light rounded-2xl p-4 text-center animate-bounce-in stagger-2">
            {loading ? (
              <div className="h-8 w-16 mx-auto bg-midnight-700/50 rounded skeleton mb-1" />
            ) : (
              <p className="font-display text-3xl font-bold gradient-text">{totals.totalDistance}km</p>
            )}
            <p className="text-xs text-midnight-400">Distance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subValue, color = 'ember', index, loading }) {
  const gradients = {
    ember: 'from-ember-500 to-ember-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    moss: 'from-moss-500 to-moss-600',
  }

  if (loading) {
    return <StatCardSkeleton index={index} />
  }

  return (
    <div 
      className="animate-slideUpFade"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="glass-card rounded-2xl p-6 group hover:scale-105 transition-all duration-500 shine-effect">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="font-display text-3xl font-bold text-white mb-1 count-up">{value}</p>
        <p className="text-sm text-midnight-400">{label}</p>
        {subValue && <p className="text-xs text-midnight-500 mt-1">{subValue}</p>}
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-4 border border-white/10 shadow-2xl shadow-black/50">
        <p className="text-sm text-white font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Empty State
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-midnight-700/30 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-midnight-500" />
      </div>
      <h4 className="font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

export default function Analytics() {
  const { user } = useAuth()
  const { usageLog, cars, users, services, profile, loading, fetchUsageLog } = useStore()
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    if (user?.id) {
      fetchUsageLog(user.id)
    }
  }, [user?.id, fetchUsageLog])

  const isLoading = loading.usageLog || loading.global

  // Calculate usage by user (now just current user)
  const usageByUser = useMemo(() => {
    if (!profile) return []
    
    const totalDistance = usageLog.reduce((sum, log) => sum + (log.distance || 0), 0)
    const totalTrips = usageLog.length
    const totalDuration = usageLog.reduce((sum, log) => sum + (log.duration || 0), 0)
    
    return [{
      name: profile.full_name?.split(' ')[0] || 'You',
      distance: totalDistance,
      trips: totalTrips,
      duration: totalDuration,
      avatar: profile.avatar_initials || 'U',
      color: profile.color || '#3b82f6',
    }]
  }, [usageLog, profile])

  // Calculate usage by car
  const usageByCar = useMemo(() => {
    const carUsage = {}
    cars.forEach(car => {
      carUsage[car.id] = { name: car.name, distance: 0, trips: 0, image: car.image }
    })
    usageLog.forEach(log => {
      if (carUsage[log.carId]) {
        carUsage[log.carId].distance += log.distance || 0
        carUsage[log.carId].trips += 1
      }
    })
    return Object.values(carUsage)
  }, [usageLog, cars])

  // Daily usage trend
  const dailyUsage = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 7),
      end: new Date()
    })
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayLogs = usageLog.filter(log => log.date === dayStr)
      return {
        date: format(day, 'EEE'),
        fullDate: format(day, 'MMM d'),
        distance: dayLogs.reduce((sum, log) => sum + (log.distance || 0), 0),
        trips: dayLogs.length,
      }
    })
  }, [usageLog])

  // Calculate totals
  const totals = useMemo(() => {
    const totalDistance = usageLog.reduce((sum, log) => sum + (log.distance || 0), 0)
    const totalTrips = usageLog.length
    const totalDuration = usageLog.reduce((sum, log) => sum + (log.duration || 0), 0)
    const avgTripDistance = totalTrips > 0 ? totalDistance / totalTrips : 0
    const totalServiceCost = services.reduce((sum, s) => sum + (s.cost || 0), 0)
    
    return { totalDistance, totalTrips, totalDuration, avgTripDistance, totalServiceCost }
  }, [usageLog, services])

  // Top driver & car
  const topDriver = usageByUser[0]
  const topCar = [...usageByCar].sort((a, b) => b.trips - a.trips)[0]

  // Pie chart data
  const pieData = usageByCar.filter(car => car.distance > 0).map((car, index) => ({
    name: car.name,
    value: car.distance,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div>
      {/* Hero Section */}
      <AnalyticsHero totals={totals} loading={isLoading} />

      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-8 animate-slideUpFade stagger-1">
        <div>
          <h3 className="font-display text-xl font-bold text-white">Overview</h3>
          <p className="text-sm text-midnight-400">Track performance metrics</p>
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                timeRange === range
                  ? 'bg-gradient-to-r from-ember-500/20 to-ember-600/10 text-ember-400 shadow-lg'
                  : 'text-midnight-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Route} label="Total Distance" value={`${totals.totalDistance} km`} subValue="All time" color="ember" index={0} loading={isLoading} />
        <StatCard icon={Car} label="Total Trips" value={totals.totalTrips} subValue={`Avg ${totals.avgTripDistance.toFixed(1)} km/trip`} color="blue" index={1} loading={isLoading} />
        <StatCard icon={Clock} label="Total Time" value={`${Math.floor(totals.totalDuration / 60)}h`} subValue="On the road" color="purple" index={2} loading={isLoading} />
        <StatCard icon={Fuel} label="Service Costs" value={`$${totals.totalServiceCost}`} subValue="Maintenance total" color="moss" index={3} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Trend Chart */}
        <div className="glass-card rounded-3xl p-6 animate-slideUpFade stagger-2">
          <h3 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-ember-400" />
            Daily Usage Trend
          </h3>
          {isLoading ? (
            <ChartSkeleton />
          ) : usageLog.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyUsage}>
                  <defs>
                    <linearGradient id="colorDistanceAnalytics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff5a1f" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ff5a1f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#627d98"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#627d98"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}km`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="distance"
                    stroke="#ff5a1f"
                    strokeWidth={3}
                    fill="url(#colorDistanceAnalytics)"
                    name="Distance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState 
              icon={TrendingUp}
              title="No Usage Data"
              description="Start logging trips to see trends"
            />
          )}
        </div>

        {/* Car Usage Distribution */}
        <div className="glass-card rounded-3xl p-6 animate-slideInRight stagger-3">
          <h3 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-400" />
            Vehicle Distribution
          </h3>
          {isLoading ? (
            <ChartSkeleton />
          ) : pieData.length > 0 ? (
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {pieData.map((car, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125"
                        style={{ backgroundColor: car.color, boxShadow: `0 0 10px ${car.color}50` }}
                      />
                      <span className="text-sm text-midnight-300">{car.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{car.value} km</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState 
              icon={Car}
              title="No Vehicle Data"
              description="Add vehicles and log trips to see distribution"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your Stats */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 animate-slideUpFade stagger-4">
          <h3 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Your Statistics
          </h3>
          
          {isLoading ? (
            <ChartSkeleton />
          ) : usageLog.length > 0 ? (
            <>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageByCar.filter(c => c.trips > 0)} layout="vertical">
                    <XAxis 
                      type="number" 
                      stroke="#627d98"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="#627d98"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="distance" 
                      name="Distance (km)"
                      radius={[0, 8, 8, 0]}
                    >
                      {usageByCar.filter(c => c.trips > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Table */}
              <div className="border-t border-midnight-700/30 pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-midnight-400 text-left">
                        <th className="pb-4 font-semibold">Vehicle</th>
                        <th className="pb-4 font-semibold">Trips</th>
                        <th className="pb-4 font-semibold">Distance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usageByCar.filter(c => c.trips > 0).map((car, index) => (
                        <tr key={index} className="border-t border-midnight-700/30 hover:bg-white/5 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{carImages[car.image]}</span>
                              <span className="text-white font-medium">{car.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-midnight-300">{car.trips}</td>
                          <td className="py-4 text-midnight-300">{car.distance} km</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <EmptyState 
              icon={BarChart3}
              title="No Statistics Yet"
              description="Start logging trips to build your statistics"
            />
          )}
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6 animate-slideInRight stagger-5">
          {/* Your Profile Stats */}
          <div className="glass-card rounded-3xl p-6">
            <h4 className="text-sm text-midnight-400 mb-4 font-semibold uppercase tracking-wider">Your Activity</h4>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 skeleton" />
                  <div>
                    <div className="h-6 w-24 bg-midnight-700/50 rounded skeleton mb-2" />
                    <div className="h-4 w-20 bg-midnight-700/50 rounded skeleton" />
                  </div>
                </div>
              </div>
            ) : topDriver ? (
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold animate-float"
                  style={{ backgroundColor: topDriver.color + '30', color: topDriver.color, boxShadow: `0 10px 30px ${topDriver.color}30` }}
                >
                  {topDriver.avatar}
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-white">{topDriver.name}</p>
                  <p className="text-sm text-midnight-400">{topDriver.distance} km driven</p>
                </div>
              </div>
            ) : (
              <p className="text-midnight-400 text-sm">No activity yet</p>
            )}
          </div>

          {/* Most Used Car */}
          <div className="glass-card rounded-3xl p-6">
            <h4 className="text-sm text-midnight-400 mb-4 font-semibold uppercase tracking-wider">Most Used Vehicle</h4>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 skeleton" />
                  <div>
                    <div className="h-6 w-24 bg-midnight-700/50 rounded skeleton mb-2" />
                    <div className="h-4 w-16 bg-midnight-700/50 rounded skeleton" />
                  </div>
                </div>
              </div>
            ) : topCar && topCar.trips > 0 ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center text-3xl animate-float-slow">
                  {carImages[topCar.image]}
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-white">{topCar.name}</p>
                  <p className="text-sm text-midnight-400">{topCar.trips} trips</p>
                </div>
              </div>
            ) : (
              <p className="text-midnight-400 text-sm">No vehicle data yet</p>
            )}
          </div>

          {/* Vehicle Stats */}
          <div className="glass-card rounded-3xl p-6">
            <h4 className="text-sm text-midnight-400 mb-4 font-semibold uppercase tracking-wider">Vehicle Statistics</h4>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-midnight-700/50 skeleton" />
                      <div className="h-4 w-20 bg-midnight-700/50 rounded skeleton" />
                    </div>
                    <div className="h-4 w-16 bg-midnight-700/50 rounded skeleton" />
                  </div>
                ))}
              </div>
            ) : usageByCar.some(c => c.trips > 0) ? (
              <div className="space-y-4">
                {usageByCar.filter(c => c.trips > 0).map((car, index) => (
                  <div key={index} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-xl transition-all duration-300 -mx-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{carImages[car.image]}</span>
                      <span className="text-sm text-white font-medium">{car.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{car.trips} trips</p>
                      <p className="text-xs text-midnight-400">{car.distance} km</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-midnight-400 text-sm">No statistics yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
