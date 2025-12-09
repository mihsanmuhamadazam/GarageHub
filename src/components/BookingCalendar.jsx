import { useState, useMemo, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Calendar,
  Clock,
  Car,
  User,
  FileText,
  Trash2,
  Sparkles,
  CalendarDays,
  Timer,
  Loader2
} from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  isToday,
  parseISO,
  isWithinInterval
} from 'date-fns'
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

// Loading Skeleton
function BookingSkeleton() {
  return (
    <div className="glass-light rounded-xl p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-midnight-700/50 skeleton" />
          <div className="h-5 w-24 bg-midnight-700/50 rounded skeleton" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-20 bg-midnight-700/50 rounded skeleton" />
        <div className="h-4 w-32 bg-midnight-700/50 rounded skeleton" />
      </div>
    </div>
  )
}

// Hero section for calendar
function CalendarHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-8 mb-8 animate-slideUpFade">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">Booking Calendar</span>
            </div>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Plan Your{' '}
            <span className="gradient-text-blue">Drives</span>
          </h2>
          <p className="text-midnight-300 text-lg max-w-md">
            Schedule and manage vehicle reservations with ease. Never have conflicts again.
          </p>
        </div>
        
        <div className="relative">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 flex items-center justify-center animate-float">
            <Calendar className="w-20 h-20 text-blue-400/50" />
          </div>
        </div>
      </div>
    </div>
  )
}

function BookingModal({ isOpen, onClose, selectedDate, editBooking, cars, profile }) {
  const { addBooking, updateBooking, currentUser } = useStore()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    carId: cars[0]?.id || '',
    userId: currentUser?.id || '',
    startDate: selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm") : '',
    endDate: selectedDate ? format(addDays(selectedDate, 0), "yyyy-MM-dd'T'HH:mm") : '',
    purpose: '',
  })

  useEffect(() => {
    if (editBooking) {
      setFormData({
        carId: editBooking.carId,
        userId: editBooking.userId,
        startDate: format(parseISO(editBooking.startDate), "yyyy-MM-dd'T'HH:mm"),
        endDate: format(parseISO(editBooking.endDate), "yyyy-MM-dd'T'HH:mm"),
        purpose: editBooking.purpose || '',
      })
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        carId: cars[0]?.id || '',
        startDate: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
        endDate: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      }))
    }
  }, [editBooking, selectedDate, cars])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    const bookingData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    }
    
    if (editBooking) {
      await updateBooking(editBooking.id, bookingData)
    } else {
      await addBooking(bookingData)
    }
    
    setIsSaving(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-3xl w-full max-w-md p-8 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-midnight-400" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            {editBooking ? 'Edit Booking' : 'New Booking'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-midnight-300 mb-2 font-medium">Select Vehicle</label>
            <select
              value={formData.carId}
              onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              required
            >
              {cars.length === 0 ? (
                <option value="">No vehicles available</option>
              ) : (
                cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {carImages[car.image]} {car.name} - {car.make} {car.model}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm text-midnight-300 mb-2 font-medium">Driver</label>
            <div className="px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 text-white">
              {profile?.full_name || 'You'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">Start</label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">End</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-midnight-300 mb-2 font-medium">Purpose</label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-midnight-500"
              placeholder="e.g., Grocery shopping, Work commute"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || cars.length === 0}
            className="btn-premium w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold uppercase tracking-wider shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-500 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </span>
            ) : (
              editBooking ? 'Update Booking' : 'Create Booking'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function DayCell({ date, currentMonth, bookings, cars, onDayClick, profile }) {
  const dayBookings = bookings.filter(booking => {
    try {
      const start = parseISO(booking.startDate)
      const end = parseISO(booking.endDate)
      return isSameDay(date, start) || isSameDay(date, end) || 
             isWithinInterval(date, { start, end })
    } catch {
      return false
    }
  })

  const isCurrentMonth = isSameMonth(date, currentMonth)
  const today = isToday(date)

  return (
    <div
      onClick={() => onDayClick(date)}
      className={`min-h-[100px] p-2 border border-midnight-700/30 cursor-pointer transition-all duration-300 hover:bg-white/5 group ${
        !isCurrentMonth ? 'opacity-30' : ''
      } ${today ? 'bg-gradient-to-br from-ember-500/10 to-transparent border-ember-500/30 ring-1 ring-ember-500/20' : ''}`}
    >
      <div className={`text-sm font-semibold mb-1.5 transition-colors ${
        today ? 'text-ember-400' : isCurrentMonth ? 'text-white group-hover:text-ember-400' : 'text-midnight-600'
      }`}>
        {format(date, 'd')}
      </div>
      <div className="space-y-1">
        {dayBookings.slice(0, 3).map((booking) => {
          const car = cars.find(c => c.id === booking.carId)
          return (
            <div
              key={booking.id}
              className="text-xs px-2 py-1 rounded-md truncate transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: (profile?.color || '#3b82f6') + '30', borderLeft: `3px solid ${profile?.color || '#3b82f6'}` }}
              title={`${car?.name} - ${booking.purpose || 'No purpose'}`}
            >
              {carImages[car?.image]} {car?.name || 'Vehicle'}
            </div>
          )
        })}
        {dayBookings.length > 3 && (
          <div className="text-xs text-midnight-400 px-2 font-medium">
            +{dayBookings.length - 3} more
          </div>
        )}
      </div>
    </div>
  )
}

export default function BookingCalendar() {
  const { user } = useAuth()
  const { bookings, cars, profile, loading, deleteBooking, fetchBookings } = useStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (user?.id) {
      fetchBookings(user.id)
    }
  }, [user?.id, fetchBookings])

  const isLoading = loading.bookings || loading.global

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const days = []
    let day = startDate
    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }
    return days
  }, [currentMonth])

  const handleDayClick = (date) => {
    setSelectedDate(date)
    setSelectedBooking(null)
    setModalOpen(true)
  }

  const handleDeleteBooking = async (id) => {
    setDeletingId(id)
    await deleteBooking(id)
    setDeletingId(null)
  }

  const upcomingBookings = bookings
    .filter(b => {
      try {
        return new Date(b.startDate) >= new Date()
      } catch {
        return false
      }
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5)

  return (
    <div>
      {/* Hero Section */}
      <CalendarHero />

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6 animate-slideUpFade stagger-1">
        <div>
          <h3 className="font-display text-xl font-bold text-white">Schedule</h3>
          {isLoading ? (
            <div className="h-4 w-24 bg-midnight-700/50 rounded skeleton mt-1" />
          ) : (
            <p className="text-sm text-midnight-400">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
          )}
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date())
            setSelectedBooking(null)
            setModalOpen(true)
          }}
          className="btn-premium flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-500"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Booking</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 glass-card rounded-3xl p-6 animate-slideUpFade stagger-2">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-3 rounded-xl glass-light hover:bg-white/10 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-display text-2xl font-bold text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-3 rounded-xl glass-light hover:bg-white/10 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-midnight-400 py-3 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-400">Loading calendar...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-7 rounded-2xl overflow-hidden border border-midnight-700/30 bg-midnight-900/30">
              {calendarDays.map((day, index) => (
                <DayCell
                  key={index}
                  date={day}
                  currentMonth={currentMonth}
                  bookings={bookings}
                  cars={cars}
                  profile={profile}
                  onDayClick={handleDayClick}
                />
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-midnight-700/30">
            <span className="text-sm text-midnight-400 font-medium">Legend:</span>
            <div className="flex items-center gap-2 animate-fadeIn">
              <div 
                className="w-3 h-3 rounded-full shadow-lg"
                style={{ backgroundColor: profile?.color || '#3b82f6', boxShadow: `0 0 10px ${profile?.color || '#3b82f6'}50` }}
              />
              <span className="text-sm text-midnight-300">{profile?.full_name || 'Your bookings'}</span>
            </div>
          </div>
        </div>

        {/* Sidebar - Upcoming Bookings */}
        <div className="glass-card rounded-3xl p-6 h-fit animate-slideInRight stagger-3">
          <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-400" />
            Upcoming
          </h3>

          <div className="space-y-3">
            {isLoading ? (
              [1, 2, 3].map((i) => <BookingSkeleton key={i} />)
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking, index) => {
                const car = cars.find(c => c.id === booking.carId)
                return (
                  <div
                    key={booking.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="glass-light rounded-xl p-4 hover:bg-white/5 transition-all duration-300 group animate-slideUpFade shine-effect"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{carImages[car?.image]}</span>
                        <span className="text-sm font-semibold text-white">{car?.name || 'Vehicle'}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        disabled={deletingId === booking.id}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50"
                      >
                        {deletingId === booking.id ? (
                          <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-400" />
                        )}
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-midnight-400">
                        <User className="w-3 h-3" />
                        <span style={{ color: profile?.color }}>{profile?.full_name || 'You'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-midnight-400">
                        <Calendar className="w-3 h-3" />
                        <span>{format(parseISO(booking.startDate), 'MMM d, h:mm a')}</span>
                      </div>
                      {booking.purpose && (
                        <div className="flex items-center gap-2 text-xs text-midnight-400">
                          <FileText className="w-3 h-3" />
                          <span className="truncate">{booking.purpose}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-midnight-600 mb-3" />
                <p className="text-sm text-midnight-400">No upcoming bookings</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-midnight-700/30">
            <h4 className="text-sm font-semibold text-midnight-300 mb-4">This Month</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-light rounded-xl p-4 text-center">
                {isLoading ? (
                  <div className="h-8 w-12 mx-auto bg-midnight-700/50 rounded skeleton mb-1" />
                ) : (
                  <p className="font-display text-2xl font-bold text-white">
                    {bookings.filter(b => {
                      try {
                        return isSameMonth(parseISO(b.startDate), currentMonth)
                      } catch {
                        return false
                      }
                    }).length}
                  </p>
                )}
                <p className="text-xs text-midnight-400">Bookings</p>
              </div>
              <div className="glass-light rounded-xl p-4 text-center">
                {isLoading ? (
                  <div className="h-8 w-12 mx-auto bg-midnight-700/50 rounded skeleton mb-1" />
                ) : (
                  <p className="font-display text-2xl font-bold text-white">
                    {[...new Set(bookings.filter(b => {
                      try {
                        return isSameMonth(parseISO(b.startDate), currentMonth)
                      } catch {
                        return false
                      }
                    }).map(b => b.carId))].length}
                  </p>
                )}
                <p className="text-xs text-midnight-400">Cars Used</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedDate(null)
          setSelectedBooking(null)
        }}
        selectedDate={selectedDate}
        editBooking={selectedBooking}
        cars={cars}
        profile={profile}
      />
    </div>
  )
}
