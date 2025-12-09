import { useState, useEffect } from 'react'
import { 
  Plus, 
  X, 
  Wrench, 
  Calendar,
  Gauge,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Car,
  Trash2,
  Edit,
  Settings,
  Shield,
  Loader2
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
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

const serviceTypes = [
  { value: 'Oil Change', icon: '🛢️', interval: 5000 },
  { value: 'Tire Rotation', icon: '🔄', interval: 10000 },
  { value: 'Brake Inspection', icon: '🛑', interval: 15000 },
  { value: 'Air Filter', icon: '💨', interval: 15000 },
  { value: 'Transmission', icon: '⚙️', interval: 30000 },
  { value: 'Coolant Flush', icon: '❄️', interval: 30000 },
  { value: 'Spark Plugs', icon: '⚡', interval: 30000 },
  { value: 'Battery', icon: '🔋', interval: 50000 },
  { value: 'Timing Belt', icon: '⏱️', interval: 60000 },
  { value: 'Full Service', icon: '🔧', interval: 10000 },
  { value: 'Engine Check', icon: '🔍', interval: null },
  { value: 'Other', icon: '📋', interval: null },
]

// Loading Skeleton
function ServiceSkeleton() {
  return (
    <div className="glass-light rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-midnight-700/50 skeleton" />
          <div>
            <div className="h-5 w-24 bg-midnight-700/50 rounded skeleton mb-2" />
            <div className="h-4 w-20 bg-midnight-700/50 rounded skeleton" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-5 w-24 bg-midnight-700/50 rounded skeleton" />
        <div className="h-5 w-24 bg-midnight-700/50 rounded skeleton" />
      </div>
    </div>
  )
}

// Hero section
function ServiceHero({ totalServices, totalCost, loading }) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-8 mb-8 animate-slideUpFade">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-moss-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 rounded-full bg-moss-500/20 border border-moss-500/30 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-moss-400" />
              <span className="text-xs font-medium text-moss-400">Service Tracker</span>
            </div>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Keep Them{' '}
            <span className="bg-gradient-to-r from-moss-400 to-emerald-400 bg-clip-text text-transparent">Running</span>
          </h2>
          <p className="text-midnight-300 text-lg max-w-md">
            Maintenance logbook and service reminders to keep your fleet in top condition.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-light rounded-2xl p-4 text-center animate-bounce-in stagger-1">
            {loading ? (
              <div className="h-8 w-12 mx-auto bg-midnight-700/50 rounded skeleton mb-1" />
            ) : (
              <p className="font-display text-3xl font-bold text-white">{totalServices}</p>
            )}
            <p className="text-xs text-midnight-400">Services</p>
          </div>
          <div className="glass-light rounded-2xl p-4 text-center animate-bounce-in stagger-2">
            {loading ? (
              <div className="h-8 w-16 mx-auto bg-midnight-700/50 rounded skeleton mb-1" />
            ) : (
              <p className="font-display text-3xl font-bold text-moss-400">${totalCost}</p>
            )}
            <p className="text-xs text-midnight-400">Total Spent</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceModal({ isOpen, onClose, editService, selectedCarId, cars }) {
  const { addService, updateService } = useStore()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    carId: selectedCarId || cars[0]?.id || '',
    type: 'Oil Change',
    date: format(new Date(), 'yyyy-MM-dd'),
    mileage: '',
    cost: '',
    notes: '',
    nextDue: '',
  })

  useEffect(() => {
    if (editService) {
      setFormData({
        carId: editService.carId,
        type: editService.type,
        date: editService.date,
        mileage: editService.mileage?.toString() || '',
        cost: editService.cost?.toString() || '',
        notes: editService.notes || '',
        nextDue: editService.nextDue?.toString() || '',
      })
    } else {
      setFormData({
        carId: selectedCarId || cars[0]?.id || '',
        type: 'Oil Change',
        date: format(new Date(), 'yyyy-MM-dd'),
        mileage: '',
        cost: '',
        notes: '',
        nextDue: '',
      })
    }
  }, [editService, selectedCarId, cars])

  const selectedServiceType = serviceTypes.find(s => s.value === formData.type)
  const selectedCar = cars.find(c => c.id === formData.carId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    const serviceData = {
      ...formData,
      mileage: parseInt(formData.mileage) || 0,
      cost: parseFloat(formData.cost) || 0,
      nextDue: formData.nextDue ? parseInt(formData.nextDue) : null,
    }
    
    if (editService) {
      await updateService(editService.id, serviceData)
    } else {
      await addService(serviceData)
    }
    
    setIsSaving(false)
    onClose()
  }

  const suggestNextDue = () => {
    if (selectedServiceType?.interval && formData.mileage) {
      setFormData({
        ...formData,
        nextDue: (parseInt(formData.mileage) + selectedServiceType.interval).toString(),
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-3xl w-full max-w-md p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-midnight-400" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-moss-500 to-moss-600 flex items-center justify-center mb-4 shadow-lg shadow-moss-500/30">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            {editService ? 'Edit Service' : 'Log Service'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-midnight-300 mb-2 font-medium">Vehicle</label>
            <select
              value={formData.carId}
              onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 focus:outline-none transition-all"
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
            <label className="block text-sm text-midnight-300 mb-2 font-medium">Service Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 focus:outline-none transition-all"
              required
            >
              {serviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.value}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">Mileage (km)</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                placeholder={selectedCar?.mileage?.toString()}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">Cost ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 focus:outline-none transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">Next Due (km)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.nextDue}
                  onChange={(e) => setFormData({ ...formData, nextDue: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 focus:outline-none transition-all"
                  placeholder="Optional"
                />
                {selectedServiceType?.interval && (
                  <button
                    type="button"
                    onClick={suggestNextDue}
                    className="px-3 rounded-xl bg-moss-500/20 text-moss-400 hover:bg-moss-500/30 transition-colors text-sm font-medium"
                    title="Auto-calculate"
                  >
                    Auto
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-midnight-300 mb-2 font-medium">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 focus:outline-none transition-all resize-none"
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || cars.length === 0}
            className="btn-premium w-full py-4 rounded-xl bg-gradient-to-r from-moss-500 to-moss-600 text-white font-semibold uppercase tracking-wider shadow-lg shadow-moss-500/30 hover:shadow-moss-500/50 hover:scale-[1.02] transition-all duration-500 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </span>
            ) : (
              editService ? 'Update Service' : 'Log Service'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function ServiceCard({ service, car, onEdit, onDelete, index, isDeleting }) {
  const serviceType = serviceTypes.find(s => s.value === service.type)
  const isOverdue = service.nextDue && car && (car.mileage || 0) >= service.nextDue
  const isUpcoming = service.nextDue && car && (car.mileage || 0) >= service.nextDue - 1000 && !isOverdue

  return (
    <div 
      className="animate-slideUpFade"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`glass-light rounded-2xl p-5 hover:bg-white/5 transition-all duration-300 group shine-effect ${isDeleting ? 'opacity-50' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-midnight-700/50 flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110">
              {serviceType?.icon || '🔧'}
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg">{service.type}</h4>
              <p className="text-sm text-midnight-400">{carImages[car?.image]} {car?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(service)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Edit className="w-4 h-4 text-midnight-400" />
            </button>
            <button
              onClick={() => onDelete(service.id)}
              disabled={isDeleting}
              className="p-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 text-red-400" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-midnight-400">
            <Calendar className="w-4 h-4" />
            <span>{format(parseISO(service.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-midnight-400">
            <Gauge className="w-4 h-4" />
            <span>{(service.mileage || 0).toLocaleString()} km</span>
          </div>
          {(service.cost || 0) > 0 && (
            <div className="flex items-center gap-2 text-midnight-400">
              <DollarSign className="w-4 h-4" />
              <span>${(service.cost || 0).toFixed(2)}</span>
            </div>
          )}
          {service.nextDue && (
            <div className={`flex items-center gap-2 ${
              isOverdue ? 'text-red-400' : isUpcoming ? 'text-yellow-400' : 'text-moss-400'
            }`}>
              {isOverdue ? <AlertTriangle className="w-4 h-4" /> : 
               isUpcoming ? <Clock className="w-4 h-4" /> : 
               <CheckCircle className="w-4 h-4" />}
              <span>Due: {service.nextDue.toLocaleString()} km</span>
            </div>
          )}
        </div>

        {service.notes && (
          <div className="mt-4 pt-4 border-t border-midnight-700/30">
            <div className="flex items-start gap-2 text-sm text-midnight-400">
              <FileText className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{service.notes}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ServiceTracker() {
  const { user } = useAuth()
  const { services, cars, loading, deleteService, fetchServices } = useStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [selectedCarId, setSelectedCarId] = useState('all')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (user?.id) {
      fetchServices(user.id)
    }
  }, [user?.id, fetchServices])

  const isLoading = loading.services || loading.global

  const filteredServices = selectedCarId === 'all' 
    ? services 
    : services.filter(s => s.carId === selectedCarId)

  const sortedServices = [...filteredServices].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const handleEdit = (service) => {
    setEditingService(service)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingService(null)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    await deleteService(id)
    setDeletingId(null)
  }

  // Calculate upcoming services
  const upcomingServices = cars.flatMap(car => {
    const carServices = services.filter(s => s.carId === car.id && s.nextDue)
    return carServices.map(s => ({
      ...s,
      car,
      remaining: s.nextDue - (car.mileage || 0),
    }))
  }).filter(s => s.remaining <= 2000).sort((a, b) => a.remaining - b.remaining)

  const totalCosts = services.reduce((acc, s) => acc + (s.cost || 0), 0)

  return (
    <div>
      {/* Hero Section */}
      <ServiceHero 
        totalServices={services.length} 
        totalCost={totalCosts.toFixed(0)}
        loading={isLoading}
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-slideUpFade stagger-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-midnight-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <select
            value={selectedCarId}
            onChange={(e) => setSelectedCarId(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-moss-500 focus:outline-none transition-all text-sm"
          >
            <option value="all">All Vehicles</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {carImages[car.image]} {car.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-premium flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-moss-500 to-moss-600 text-white font-medium shadow-lg shadow-moss-500/30 hover:shadow-moss-500/50 hover:scale-105 transition-all duration-500"
        >
          <Plus className="w-4 h-4" />
          Log Service
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Log */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            [1, 2, 3].map((i) => <ServiceSkeleton key={i} />)
          ) : sortedServices.length > 0 ? (
            sortedServices.map((service, index) => {
              const car = cars.find(c => c.id === service.carId)
              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  car={car}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  index={index}
                  isDeleting={deletingId === service.id}
                />
              )
            })
          ) : (
            <div className="glass-card rounded-3xl p-16 text-center animate-slideUpFade">
              <Wrench className="w-16 h-16 mx-auto text-midnight-600 mb-4" />
              <h3 className="font-display text-2xl font-bold text-white mb-3">No Services Logged</h3>
              <p className="text-midnight-400 mb-6">Start tracking your vehicle maintenance</p>
              <button
                onClick={() => setModalOpen(true)}
                className="btn-premium inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-moss-500 to-moss-600 text-white font-semibold shadow-lg shadow-moss-500/30 hover:shadow-moss-500/50 hover:scale-105 transition-all duration-500"
              >
                <Plus className="w-5 h-5" />
                Log First Service
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Maintenance */}
          <div className="glass-card rounded-3xl p-6 animate-slideInRight stagger-2">
            <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Upcoming
            </h3>

            <div className="space-y-3">
              {isLoading ? (
                [1, 2].map((i) => (
                  <div key={i} className="h-24 bg-midnight-700/50 rounded-xl skeleton" />
                ))
              ) : upcomingServices.length > 0 ? (
                upcomingServices.map((service, index) => {
                  const isOverdue = service.remaining <= 0
                  return (
                    <div
                      key={service.id}
                      style={{ animationDelay: `${index * 100}ms` }}
                      className={`rounded-xl p-4 animate-slideUpFade ${
                        isOverdue ? 'bg-red-500/10 border border-red-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{serviceTypes.find(s => s.value === service.type)?.icon}</span>
                        <span className="text-sm font-semibold text-white">{service.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-midnight-400 mb-1">
                        <Car className="w-3 h-3" />
                        <span>{service.car?.name}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-semibold ${
                        isOverdue ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {isOverdue ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>Overdue by {Math.abs(service.remaining).toLocaleString()} km</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>In {service.remaining.toLocaleString()} km</span>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-6">
                  <Shield className="w-12 h-12 mx-auto text-moss-500 mb-3" />
                  <p className="text-sm text-midnight-400">All maintenance up to date!</p>
                </div>
              )}
            </div>
          </div>

          {/* Service Intervals */}
          <div className="glass-card rounded-3xl p-6 animate-slideInRight stagger-3">
            <h4 className="text-sm font-semibold text-midnight-300 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Recommended Intervals
            </h4>
            <div className="space-y-3">
              {serviceTypes.filter(s => s.interval).slice(0, 6).map((type) => (
                <div key={type.value} className="flex items-center justify-between text-sm group hover:bg-white/5 p-2 rounded-lg -mx-2 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <span className="text-lg transition-transform duration-300 group-hover:scale-110">{type.icon}</span>
                    <span className="text-midnight-300">{type.value}</span>
                  </div>
                  <span className="text-midnight-400 font-mono text-xs">{type.interval.toLocaleString()} km</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ServiceModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editService={editingService}
        selectedCarId={selectedCarId !== 'all' ? selectedCarId : null}
        cars={cars}
      />
    </div>
  )
}
