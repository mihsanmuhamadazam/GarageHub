import { useState } from 'react'
import { 
  Plus, 
  Key, 
  User, 
  Fuel, 
  Gauge, 
  Car,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react'
import { useStore } from '../store/useStore'

const carImages = {
  suv: '🚙',
  sedan: '🚗',
  luxury: '🚘',
  truck: '🛻',
  van: '🚐',
  sports: '🏎️',
}

const statusConfig = {
  'available': {
    label: 'Available',
    color: 'text-moss-400',
    bg: 'bg-moss-500/20',
    border: 'border-moss-500/30',
    glow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    icon: CheckCircle2,
    gradient: 'from-moss-500/20 to-moss-600/5',
  },
  'in-use': {
    label: 'In Use',
    color: 'text-ember-400',
    bg: 'bg-ember-500/20',
    border: 'border-ember-500/30',
    glow: 'shadow-[0_0_30px_rgba(255,90,31,0.3)]',
    icon: Clock,
    gradient: 'from-ember-500/20 to-ember-600/5',
  },
  'maintenance': {
    label: 'Maintenance',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
    icon: AlertCircle,
    gradient: 'from-yellow-500/20 to-yellow-600/5',
  },
}

// Hero section component
function HeroSection({ availableCars, totalCars }) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-8 mb-8 animate-slideUpFade">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-ember-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-[200px] opacity-5 select-none">🚗</div>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 rounded-full bg-ember-500/20 border border-ember-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ember-400" />
              <span className="text-xs font-medium text-ember-400">Virtual Key Rack</span>
            </div>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Your Fleet,{' '}
            <span className="gradient-text">Simplified</span>
          </h2>
          <p className="text-midnight-300 text-lg max-w-md">
            Manage vehicles effortlessly. Track availability, assign drivers, and stay in control.
          </p>
        </div>
        
        {/* Animated car illustration */}
        <div className="relative">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-ember-500/20 via-transparent to-blue-500/20 flex items-center justify-center animate-float">
            <div className="text-8xl md:text-9xl animate-float-slow">🚗</div>
          </div>
          {/* Orbiting stats */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 glass px-3 py-1.5 rounded-full animate-bounce-in stagger-1">
            <span className="text-xs font-medium text-moss-400">{availableCars} Ready</span>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass px-3 py-1.5 rounded-full animate-bounce-in stagger-2">
            <span className="text-xs font-medium text-midnight-300">{totalCars} Total</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats cards component
function StatsCards({ availableCars, inUseCars, maintenanceCars }) {
  const stats = [
    { 
      label: 'Available', 
      value: availableCars, 
      icon: CheckCircle2, 
      color: 'moss',
      gradient: 'from-moss-500 to-moss-600'
    },
    { 
      label: 'In Use', 
      value: inUseCars, 
      icon: Clock, 
      color: 'ember',
      gradient: 'from-ember-500 to-ember-600'
    },
    { 
      label: 'Maintenance', 
      value: maintenanceCars, 
      icon: AlertCircle, 
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-600'
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div 
            key={stat.label}
            className="animate-slideUpFade"
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div className="glass-card rounded-2xl p-5 text-center group hover:scale-105 transition-all duration-500 shine-effect">
              <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-display text-3xl font-bold text-white mb-1 count-up">{stat.value}</p>
              <p className="text-sm text-midnight-400">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CarCard({ car, onEdit, onDelete, onStatusChange, index }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const { users, currentUser } = useStore()
  
  const status = statusConfig[car.status]
  const StatusIcon = status.icon

  return (
    <div 
      className="animate-slideUpFade card-3d"
      style={{ animationDelay: `${(index + 3) * 100}ms` }}
    >
      <div className={`card-3d-inner glass-card rounded-3xl p-6 transition-all duration-500 hover:bg-white/5 ${status.glow} group shine-effect`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              style={{ backgroundColor: car.color + '20', boxShadow: `0 10px 30px ${car.color}30` }}
            >
              {carImages[car.image] || '🚗'}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-1 group-hover:text-ember-400 transition-colors">
                {car.name}
              </h3>
              <p className="text-sm text-midnight-400">{car.make} {car.model}</p>
              <p className="text-xs text-midnight-500">{car.year}</p>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 opacity-50 group-hover:opacity-100"
            >
              <MoreVertical className="w-5 h-5 text-midnight-400" />
            </button>
            
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 glass rounded-xl shadow-2xl shadow-black/50 border border-white/10 py-2 z-20 animate-scale-in overflow-hidden">
                  <button 
                    onClick={() => { onEdit(car); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-midnight-400" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => { onDelete(car.id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${status.bg} ${status.border} border transition-all duration-300`}>
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
            <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
          </div>
          {car.currentDriver && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <User className="w-4 h-4 text-midnight-300" />
              <span className="text-sm text-white font-medium">{car.currentDriver}</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="glass-light rounded-xl p-4 group/stat hover:bg-white/5 transition-all duration-300">
            <div className="flex items-center gap-2 text-midnight-400 mb-2">
              <Gauge className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Mileage</span>
            </div>
            <p className="font-display text-xl font-bold text-white">
              {car.mileage.toLocaleString()}
              <span className="text-sm font-normal text-midnight-400 ml-1">km</span>
            </p>
          </div>
          <div className="glass-light rounded-xl p-4 group/stat hover:bg-white/5 transition-all duration-300">
            <div className="flex items-center gap-2 text-midnight-400 mb-2">
              <Fuel className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Fuel</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-display text-white">{car.fuelLevel}%</span>
              </div>
              <div className="h-2 bg-midnight-800/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    car.fuelLevel > 50 ? 'bg-gradient-to-r from-moss-500 to-moss-400' : 
                    car.fuelLevel > 25 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                    'bg-gradient-to-r from-red-500 to-red-400'
                  } progress-animated`}
                  style={{ width: `${car.fuelLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* License Plate */}
        <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl bg-gradient-to-r from-midnight-800/50 to-midnight-900/50 border border-midnight-700/50">
          <Car className="w-5 h-5 text-ember-400" />
          <span className="font-mono text-sm text-white tracking-widest">{car.plate}</span>
        </div>

        {/* Action Button */}
        <div className="relative">
          <button
            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
            disabled={car.status === 'maintenance'}
            className={`btn-premium w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-500 ${
              car.status === 'available'
                ? 'bg-gradient-to-r from-moss-500 to-moss-600 text-white shadow-lg shadow-moss-500/30 hover:shadow-moss-500/50 hover:scale-[1.02]'
                : car.status === 'in-use' && car.currentDriver === currentUser.name
                ? 'bg-gradient-to-r from-ember-500 to-ember-600 text-white shadow-lg shadow-ember-500/30 hover:shadow-ember-500/50 hover:scale-[1.02]'
                : 'bg-midnight-800/50 text-midnight-400 cursor-not-allowed'
            }`}
          >
            <Key className="w-5 h-5" />
            {car.status === 'available' 
              ? 'Take Keys' 
              : car.status === 'in-use' && car.currentDriver === currentUser.name
              ? 'Return Keys'
              : car.status === 'maintenance'
              ? 'In Maintenance'
              : `Used by ${car.currentDriver}`}
          </button>

          {statusMenuOpen && car.status !== 'maintenance' && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusMenuOpen(false)} />
              <div className="absolute bottom-full left-0 right-0 mb-2 glass rounded-xl shadow-2xl shadow-black/50 border border-white/10 py-2 z-20 animate-scale-in">
                <p className="px-4 py-2 text-xs text-midnight-400 uppercase tracking-wider border-b border-white/10">Change Status</p>
                {Object.entries(statusConfig).map(([key, config]) => {
                  const Icon = config.icon
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        onStatusChange(car.id, key, key === 'in-use' ? currentUser.name : null)
                        setStatusMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors ${
                        car.status === key ? config.bg : ''
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <span className={config.color}>{config.label}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function AddCarModal({ isOpen, onClose, editCar, onSave }) {
  const [formData, setFormData] = useState(editCar || {
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    color: '#ff5a1f',
    image: 'sedan',
    mileage: 0,
    fuelLevel: 100,
    status: 'available',
    currentDriver: null,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-3xl w-full max-w-md p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-midnight-400" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center mb-4 shadow-lg shadow-ember-500/30">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            {editCar ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <p className="text-sm text-midnight-400 mt-1">Fill in the details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-midnight-300 mb-2 font-medium">Nickname</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all duration-300 placeholder:text-midnight-500"
              placeholder="Family SUV"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">Make</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all duration-300 placeholder:text-midnight-500"
                placeholder="Toyota"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all duration-300 placeholder:text-midnight-500"
                placeholder="RAV4"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all duration-300"
                min="1990"
                max="2030"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">License Plate</label>
              <input
                type="text"
                value={formData.plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all duration-300 font-mono tracking-wider placeholder:text-midnight-500"
                placeholder="ABC 1234"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-14 h-12 rounded-xl cursor-pointer border border-midnight-600"
                />
                <span className="text-sm text-midnight-400 font-mono">{formData.color}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-midnight-300 mb-2 font-medium">Type</label>
              <select
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all duration-300"
              >
                {Object.entries(carImages).map(([key, emoji]) => (
                  <option key={key} value={key}>{emoji} {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-midnight-300 mb-2 font-medium">Current Mileage (km)</label>
            <input
              type="number"
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all duration-300"
              min="0"
            />
          </div>

          <button
            type="submit"
            className="btn-premium w-full py-4 rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 text-white font-semibold uppercase tracking-wider shadow-lg shadow-ember-500/30 hover:shadow-ember-500/50 hover:scale-[1.02] transition-all duration-500"
          >
            {editCar ? 'Save Changes' : 'Add Vehicle'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Empty state component
function EmptyState({ onAdd }) {
  return (
    <div className="col-span-full animate-slideUpFade">
      <div className="glass-card rounded-3xl p-16 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ember-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-midnight-700/50 to-midnight-800/50 flex items-center justify-center mb-6 border border-white/5">
            <Car className="w-12 h-12 text-midnight-500" />
          </div>
          <h3 className="font-display text-2xl font-bold text-white mb-3">No Vehicles Yet</h3>
          <p className="text-midnight-400 mb-8 max-w-sm mx-auto">Add your first vehicle to start managing your fleet with ease</p>
          <button
            onClick={onAdd}
            className="btn-premium inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 text-white font-semibold uppercase tracking-wider shadow-lg shadow-ember-500/30 hover:shadow-ember-500/50 hover:scale-105 transition-all duration-500"
          >
            <Plus className="w-5 h-5" />
            Add Your First Vehicle
          </button>
        </div>
      </div>
    </div>
  )
}

export default function KeyRack() {
  const { cars, addCar, updateCar, deleteCar, toggleCarStatus } = useStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCar, setEditingCar] = useState(null)

  const handleEdit = (car) => {
    setEditingCar(car)
    setModalOpen(true)
  }

  const handleSave = (carData) => {
    if (editingCar) {
      updateCar(editingCar.id, carData)
    } else {
      addCar(carData)
    }
    setEditingCar(null)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingCar(null)
  }

  const availableCars = cars.filter(c => c.status === 'available').length
  const inUseCars = cars.filter(c => c.status === 'in-use').length
  const maintenanceCars = cars.filter(c => c.status === 'maintenance').length

  return (
    <div>
      {/* Hero Section */}
      <HeroSection availableCars={availableCars} totalCars={cars.length} />

      {/* Stats Section */}
      <StatsCards 
        availableCars={availableCars} 
        inUseCars={inUseCars} 
        maintenanceCars={maintenanceCars} 
      />

      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6 animate-slideUpFade stagger-3">
        <div>
          <h3 className="font-display text-xl font-bold text-white">Your Vehicles</h3>
          <p className="text-sm text-midnight-400">{cars.length} vehicle{cars.length !== 1 ? 's' : ''} in your garage</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-premium flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 text-white font-medium shadow-lg shadow-ember-500/30 hover:shadow-ember-500/50 hover:scale-105 transition-all duration-500"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Vehicle</span>
        </button>
      </div>

      {/* Car Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.length > 0 ? (
          cars.map((car, index) => (
            <CarCard 
              key={car.id}
              car={car} 
              index={index}
              onEdit={handleEdit}
              onDelete={deleteCar}
              onStatusChange={toggleCarStatus}
            />
          ))
        ) : (
          <EmptyState onAdd={() => setModalOpen(true)} />
        )}
      </div>

      <AddCarModal 
        isOpen={modalOpen} 
        onClose={handleCloseModal}
        editCar={editingCar}
        onSave={handleSave}
      />
    </div>
  )
}
