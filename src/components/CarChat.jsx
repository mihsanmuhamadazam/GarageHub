import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  MessageSquare, 
  Car,
  User,
  Smile,
  MoreVertical,
  Trash2,
  AlertCircle,
  HelpCircle,
  FileText,
  Bell,
  Sparkles,
  MessagesSquare,
  Loader2
} from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
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

const messageTypes = [
  { type: 'note', icon: FileText, label: 'Note', color: 'blue', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  { type: 'request', icon: Bell, label: 'Request', color: 'ember', bg: 'bg-ember-500/20', border: 'border-ember-500/30' },
  { type: 'question', icon: HelpCircle, label: 'Question', color: 'purple', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  { type: 'alert', icon: AlertCircle, label: 'Alert', color: 'yellow', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
]

// Loading Skeleton
function MessageSkeleton({ isOwn }) {
  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <div className="w-10 h-10 rounded-full bg-midnight-700/50 skeleton shrink-0" />
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-4 w-20 bg-midnight-700/50 rounded skeleton" />
          <div className="h-4 w-16 bg-midnight-700/50 rounded skeleton" />
        </div>
        <div className="rounded-2xl p-4 bg-midnight-700/30">
          <div className="h-4 w-48 bg-midnight-700/50 rounded skeleton mb-2" />
          <div className="h-4 w-32 bg-midnight-700/50 rounded skeleton" />
        </div>
      </div>
    </div>
  )
}

function CarSelectorSkeleton() {
  return (
    <div className="w-full flex items-center gap-3 p-4 rounded-xl glass-light animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-midnight-700/50 skeleton" />
      <div className="flex-1">
        <div className="h-5 w-24 bg-midnight-700/50 rounded skeleton mb-2" />
        <div className="h-4 w-20 bg-midnight-700/50 rounded skeleton" />
      </div>
    </div>
  )
}

// Hero section
function ChatHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-8 mb-8 animate-slideUpFade">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center gap-1.5">
              <MessagesSquare className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-xs font-medium text-pink-400">Car Chat</span>
            </div>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Stay{' '}
            <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">Connected</span>
          </h2>
          <p className="text-midnight-300 text-lg max-w-md">
            Leave messages, requests, and notes for each of your vehicles.
          </p>
        </div>
        
        <div className="relative">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-pink-500/20 via-transparent to-indigo-500/20 flex items-center justify-center animate-float">
            <MessageSquare className="w-20 h-20 text-pink-400/50" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message, profile, onDelete, index, isDeleting }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const messageType = messageTypes.find(t => t.type === message.type) || messageTypes[0]
  const TypeIcon = messageType.icon

  return (
    <div 
      className="flex gap-3 animate-slideUpFade"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-transform duration-300 hover:scale-110"
        style={{ backgroundColor: (profile?.color || '#3b82f6') + '30', color: profile?.color || '#3b82f6', boxShadow: `0 4px 15px ${profile?.color || '#3b82f6'}30` }}
      >
        {profile?.avatar_initials || 'U'}
      </div>
      
      <div className="max-w-[70%]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-semibold text-white">{profile?.full_name || 'You'}</span>
          <span className="text-xs text-midnight-500">
            {message.timestamp ? formatDistanceToNow(parseISO(message.timestamp), { addSuffix: true }) : 'Just now'}
          </span>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${messageType.bg} ${messageType.border} border`}>
            <TypeIcon className="w-3 h-3" />
            {messageType.label}
          </div>
        </div>
        
        <div className={`relative group rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] glass-light rounded-tl-sm ${isDeleting ? 'opacity-50' : ''}`}>
          <p className="text-sm text-midnight-100 leading-relaxed">{message.message}</p>
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-midnight-400" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-32 glass rounded-xl shadow-2xl shadow-black/50 border border-white/10 py-1 z-20 animate-scale-in">
                    <button 
                      onClick={() => { onDelete(message.id); setMenuOpen(false); }}
                      disabled={isDeleting}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CarSelector({ cars, selectedCarId, onSelect, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <CarSelectorSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-8">
        <Car className="w-12 h-12 mx-auto text-midnight-600 mb-3" />
        <p className="text-sm text-midnight-400">No vehicles yet</p>
        <p className="text-xs text-midnight-500">Add a vehicle to start chatting</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {cars.map((car, index) => (
        <button
          key={car.id}
          onClick={() => onSelect(car.id)}
          style={{ animationDelay: `${index * 50}ms` }}
          className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 animate-slideUpFade group ${
            selectedCarId === car.id
              ? 'bg-gradient-to-r from-ember-500/20 to-ember-600/10 border border-ember-500/30 shadow-lg shadow-ember-500/10'
              : 'glass-light hover:bg-white/5'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-midnight-700/50 flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110">
            {carImages[car.image]}
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-white text-sm">{car.name}</p>
            <p className="text-xs text-midnight-400">{car.make} {car.model}</p>
          </div>
          {selectedCarId === car.id && (
            <div className="w-2.5 h-2.5 rounded-full bg-ember-500 animate-pulse shadow-lg shadow-ember-500/50" />
          )}
        </button>
      ))}
    </div>
  )
}

export default function CarChat() {
  const { user } = useAuth()
  const { messages, vehicles, profile, loading, addMessage, deleteMessage, fetchMessages } = useStore()
  const [selectedCarId, setSelectedCarId] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [messageType, setMessageType] = useState('note')
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const messagesEndRef = useRef(null)

  // Transform vehicles to cars format
  const cars = vehicles.map(v => ({
    id: v.id,
    name: v.name,
    make: v.make,
    model: v.model,
    year: v.year,
    plate: v.plate,
    color: v.color,
    status: v.status,
    currentDriver: v.current_driver,
    mileage: v.mileage,
    fuelLevel: v.fuel_level,
    image: v.image,
  }))

  useEffect(() => {
    if (user?.id) {
      fetchMessages(user.id)
    }
  }, [user?.id, fetchMessages])

  // Set selected car when cars are loaded
  useEffect(() => {
    if (cars.length > 0 && !selectedCarId) {
      setSelectedCarId(cars[0].id)
    }
  }, [cars, selectedCarId])

  const isLoading = loading.messages || loading.global
  const selectedCar = cars.find(c => c.id === selectedCarId)
  const carMessages = messages
    .filter(m => m.carId === selectedCarId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [carMessages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedCarId) return

    setIsSending(true)
    await addMessage({
      carId: selectedCarId,
      message: newMessage.trim(),
      type: messageType,
    })
    setNewMessage('')
    setIsSending(false)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    await deleteMessage(id)
    setDeletingId(null)
  }

  const selectedType = messageTypes.find(t => t.type === messageType)
  const TypeIcon = selectedType?.icon || FileText

  const quickMessages = [
    'Please fill up the tank 🙏',
    'Left something in the car',
    'Car needs cleaning',
    'Check tire pressure',
    'When will you return?',
  ]

  return (
    <div>
      {/* Hero Section */}
      <ChatHero />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-380px)] min-h-[500px]">
        {/* Car List Sidebar */}
        <div className="glass-card rounded-3xl p-5 lg:h-full overflow-y-auto animate-slideInLeft">
          <h3 className="font-display text-sm font-bold text-midnight-400 uppercase tracking-wider mb-4 px-2">
            Select Vehicle
          </h3>
          <CarSelector 
            cars={cars} 
            selectedCarId={selectedCarId} 
            onSelect={setSelectedCarId}
            loading={loading.vehicles}
          />

          {/* Message Type Stats */}
          {selectedCarId && (
            <div className="mt-6 pt-6 border-t border-midnight-700/30">
              <h4 className="text-xs text-midnight-500 uppercase tracking-wider mb-3 px-2 font-semibold">Message Types</h4>
              <div className="space-y-2">
                {messageTypes.map((type) => {
                  const Icon = type.icon
                  const count = messages.filter(m => m.carId === selectedCarId && m.type === type.type).length
                  return (
                    <div 
                      key={type.type}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm ${type.bg} border ${type.border}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <span className="text-xs font-semibold">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 glass-card rounded-3xl flex flex-col h-full animate-slideInRight">
          {/* Chat Header */}
          <div className="flex items-center gap-4 p-5 border-b border-midnight-700/30">
            {selectedCar ? (
              <>
                <div className="w-14 h-14 rounded-xl bg-midnight-700/50 flex items-center justify-center text-3xl">
                  {carImages[selectedCar?.image]}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold text-white">{selectedCar?.name}</h3>
                  <p className="text-sm text-midnight-400">{selectedCar?.make} {selectedCar?.model} • {selectedCar?.plate}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-midnight-400 glass-light px-4 py-2 rounded-xl">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">{carMessages.length} messages</span>
                </div>
              </>
            ) : (
              <div className="flex-1 text-center py-4">
                <p className="text-midnight-400">Select a vehicle to view messages</p>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <MessageSkeleton isOwn={false} />
                <MessageSkeleton isOwn={true} />
                <MessageSkeleton isOwn={false} />
              </div>
            ) : carMessages.length > 0 ? (
              <>
                {carMessages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    profile={profile}
                    onDelete={handleDelete}
                    index={index}
                    isDeleting={deletingId === message.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : selectedCarId ? (
              <div className="flex-1 flex items-center justify-center h-full min-h-[200px]">
                <div className="text-center animate-fadeIn">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-midnight-700/30 flex items-center justify-center mb-4">
                    <MessageSquare className="w-10 h-10 text-midnight-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">No Messages Yet</h3>
                  <p className="text-sm text-midnight-400 max-w-xs">
                    Start a conversation about this vehicle. Leave notes, requests, or questions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full min-h-[200px]">
                <div className="text-center animate-fadeIn">
                  <Car className="w-16 h-16 mx-auto text-midnight-600 mb-4" />
                  <p className="text-midnight-400">Select a vehicle to start messaging</p>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          {selectedCarId && (
            <form onSubmit={handleSend} className="p-5 border-t border-midnight-700/30">
              <div className="flex items-end gap-3">
                {/* Message Type Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTypeMenu(!showTypeMenu)}
                    className={`p-3.5 rounded-xl ${selectedType?.bg} ${selectedType?.border} border hover:scale-105 transition-all duration-300`}
                    title={`Message type: ${selectedType?.label}`}
                  >
                    <TypeIcon className="w-5 h-5" />
                  </button>
                  
                  {showTypeMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowTypeMenu(false)} />
                      <div className="absolute bottom-full left-0 mb-2 glass rounded-xl shadow-2xl shadow-black/50 border border-white/10 py-2 z-20 animate-scale-in">
                        <p className="px-4 py-2 text-xs text-midnight-400 border-b border-white/10 font-semibold uppercase tracking-wider">Type</p>
                        {messageTypes.map((type) => {
                          const Icon = type.icon
                          return (
                            <button
                              key={type.type}
                              type="button"
                              onClick={() => {
                                setMessageType(type.type)
                                setShowTypeMenu(false)
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                                messageType === type.type ? type.bg : ''
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="font-medium">{type.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Input Field */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Type a ${selectedType?.label.toLowerCase()}...`}
                    className="w-full px-5 py-3.5 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all pr-14 placeholder:text-midnight-500"
                    disabled={isSending}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/5 transition-colors text-midnight-400 hover:text-white"
                    title="Add emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="btn-premium p-3.5 rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 text-white shadow-lg shadow-ember-500/30 hover:shadow-ember-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-ember-500/30 hover:scale-105 disabled:hover:scale-100"
                >
                  {isSending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Quick Messages */}
              <div className="flex flex-wrap gap-2 mt-4">
                {quickMessages.map((quick, index) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setNewMessage(quick)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="px-4 py-2 rounded-full text-xs glass-light hover:bg-white/10 transition-all duration-300 text-midnight-300 hover:text-white hover:scale-105 animate-fadeIn"
                    disabled={isSending}
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
