import { useState, useEffect } from 'react'
import { 
  Users, 
  Link2, 
  Copy, 
  Check, 
  UserPlus, 
  Share2, 
  X,
  QrCode,
  ExternalLink,
  UserMinus,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Heart,
  Car,
  Send,
  Search,
  MessageSquare,
  Zap,
  Globe,
  Shield,
  RefreshCw
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAuth } from '../contexts/AuthContext'

// Loading Skeleton
function ConnectionSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-void-700/50 skeleton" />
        <div className="flex-1">
          <div className="h-5 w-32 bg-void-700/50 rounded skeleton mb-2" />
          <div className="h-4 w-24 bg-void-700/50 rounded skeleton" />
        </div>
        <div className="h-10 w-24 bg-void-700/50 rounded-xl skeleton" />
      </div>
    </div>
  )
}

// Hero Section with animated background
function SocialHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-8 lg:p-10 mb-8 animate-slideUpFade">
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-neon w-80 h-80 -top-20 -right-20" />
        <div className="orb orb-electric w-60 h-60 -bottom-20 -left-20" style={{ animationDelay: '2s' }} />
        <div className="orb orb-coral w-40 h-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-neon-500/10 border border-neon-500/30">
            <Zap className="w-4 h-4 text-neon-500" />
            <span className="text-sm font-medium text-neon-400">Social Hub</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
            Connect &{' '}
            <span className="text-gradient">Share</span>
          </h2>
          <p className="text-void-300 text-lg max-w-md">
            Invite friends and family to your garage. Share vehicles and coordinate trips together in real-time.
          </p>
          
          {/* Quick stats */}
          <div className="flex items-center justify-center lg:justify-start gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-success-400" />
              <span className="text-sm text-void-300">Secure Sharing</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-electric-400" />
              <span className="text-sm text-void-300">Instant Connect</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-neon-500/20 via-transparent to-electric-500/20 flex items-center justify-center animate-float">
            <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-full bg-void-800/50 backdrop-blur-sm border border-white/5 flex items-center justify-center">
              <Users className="w-16 h-16 lg:w-20 lg:h-20 text-neon-400/60" />
            </div>
          </div>
          {/* Floating particles */}
          <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-neon-400 animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-4 left-0 w-3 h-3 rounded-full bg-electric-400 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-coral-400 animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>
    </div>
  )
}

// Share Code Card with copy functionality
function ShareCodeCard({ shareCode, onCopy, copied, isLoading }) {
  const shareUrl = shareCode ? `${window.location.origin}?connect=${shareCode}` : ''
  
  const handleShare = async () => {
    if (!shareCode) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my GarageHub!',
          text: 'Connect with me on GarageHub to share vehicles and coordinate trips.',
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      onCopy()
    }
  }
  
  return (
    <div className="card p-6 animate-slideUpFade stagger-1">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl gradient-neon flex items-center justify-center shadow-neon">
          <Link2 className="w-6 h-6 text-void-900" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Your Share Code</h3>
          <p className="text-sm text-void-400">Share this with friends to connect</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 px-5 py-4 rounded-xl bg-void-900/80 border border-void-700 font-mono text-xl text-neon-400 tracking-[0.3em] text-center uppercase min-h-[60px] flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-neon-400" />
          ) : shareCode ? (
            shareCode
          ) : (
            <span className="text-void-500">Generating...</span>
          )}
        </div>
        <button
          onClick={onCopy}
          disabled={!shareCode || isLoading}
          className={`p-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            copied 
              ? 'bg-success-500/20 border border-success-500/30' 
              : 'bg-void-800 border border-void-700 hover:border-neon-500/30 hover:bg-void-700'
          }`}
        >
          {copied ? (
            <Check className="w-5 h-5 text-success-400" />
          ) : (
            <Copy className="w-5 h-5 text-void-300" />
          )}
        </button>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          disabled={!shareCode || isLoading}
          className="flex-1 btn-primary flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 className="w-4 h-4" />
          Share Link
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl)
            onCopy()
          }}
          className="btn-secondary flex items-center justify-center gap-2 px-4 py-3 rounded-xl"
          title="Copy full URL"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Connect Form with validation
function ConnectForm({ onConnect, isLoading }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    
    setError('')
    setSuccess('')
    const result = await onConnect(code.trim().toUpperCase())
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess('Connection request sent successfully!')
      setCode('')
      setTimeout(() => setSuccess(''), 3000)
    }
  }
  
  return (
    <div className="card p-6 animate-slideUpFade stagger-2">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl gradient-electric flex items-center justify-center shadow-electric">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Connect with Someone</h3>
          <p className="text-sm text-void-400">Enter their share code to send a request</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-void-500" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter share code..."
            maxLength={8}
            className="w-full pl-12 pr-4 py-4 rounded-xl input font-mono tracking-widest text-lg placeholder:font-sans placeholder:tracking-normal placeholder:text-base"
          />
        </div>
        
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-coral-500/10 border border-coral-500/30">
            <XCircle className="w-5 h-5 text-coral-400 flex-shrink-0" />
            <p className="text-sm text-coral-400">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-success-500/10 border border-success-500/30">
            <CheckCircle className="w-5 h-5 text-success-400 flex-shrink-0" />
            <p className="text-sm text-success-400">{success}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="w-full btn-electric flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending Request...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Connection Request
            </>
          )}
        </button>
      </form>
    </div>
  )
}

// Pending Request Card
function PendingRequestCard({ request, onAccept, onReject, isProcessing }) {
  return (
    <div className="card p-5 hover:border-amber-500/30 transition-all duration-300 group animate-slideUpFade shine-effect">
      <div className="flex items-center gap-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-transform duration-300 group-hover:scale-110"
          style={{ 
            backgroundColor: (request.user?.color || '#f59e0b') + '30',
            color: request.user?.color || '#f59e0b'
          }}
        >
          {request.user?.avatar_initials || '??'}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{request.user?.full_name || 'Unknown User'}</h4>
          <p className="text-sm text-void-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Wants to connect with you
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAccept(request.id)}
            disabled={isProcessing}
            className="p-3 rounded-xl bg-success-500/20 border border-success-500/30 text-success-400 hover:bg-success-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50"
            title="Accept connection"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => onReject(request.id)}
            disabled={isProcessing}
            className="p-3 rounded-xl bg-coral-500/20 border border-coral-500/30 text-coral-400 hover:bg-coral-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50"
            title="Decline connection"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Connection Card with actions
function ConnectionCard({ connection, onRemove, onMessage, isRemoving }) {
  const connectedUser = connection.connected_user
  
  return (
    <div className="card p-5 hover:border-neon-500/30 transition-all duration-300 group animate-slideUpFade shine-effect">
      <div className="flex items-center gap-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-300 group-hover:scale-110"
          style={{ 
            backgroundColor: (connectedUser?.color || '#00e5c9') + '30',
            color: connectedUser?.color || '#00e5c9',
            boxShadow: `0 10px 30px ${connectedUser?.color || '#00e5c9'}20`
          }}
        >
          {connectedUser?.avatar_initials || '??'}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white group-hover:text-neon-400 transition-colors truncate">
            {connectedUser?.full_name || 'Unknown User'}
          </h4>
          <p className="text-sm text-void-400 flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-success-400" />
            Connected · Vehicles shared automatically
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onMessage(connectedUser)}
            className="p-2.5 rounded-xl bg-electric-500/20 border border-electric-500/30 text-electric-400 hover:bg-electric-500/30 hover:scale-105 transition-all duration-300"
            title="Send message"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={() => onRemove(connection.id)}
            disabled={isRemoving}
            className="p-2.5 rounded-xl bg-coral-500/20 border border-coral-500/30 text-coral-400 hover:bg-coral-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50"
            title="Remove connection"
          >
            {isRemoving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UserMinus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Stats Cards
function SocialStats({ connections, pendingRequests, sharedVehicles, loading }) {
  const stats = [
    { 
      label: 'Connections', 
      value: connections, 
      icon: Users, 
      gradient: 'gradient-neon',
      shadow: 'shadow-neon',
      textColor: 'text-neon-400'
    },
    { 
      label: 'Pending', 
      value: pendingRequests, 
      icon: Clock, 
      gradient: 'gradient-amber',
      shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      textColor: 'text-amber-400'
    },
    { 
      label: 'Shared Vehicles', 
      value: sharedVehicles, 
      icon: Car, 
      gradient: 'gradient-electric',
      shadow: 'shadow-electric',
      textColor: 'text-electric-400'
    },
  ]
  
  return (
    <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <div 
            key={stat.label}
            className="animate-slideUpFade"
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div className="card p-5 lg:p-6 text-center group hover:scale-105 transition-all duration-500 shine-effect">
              <div className={`w-12 h-12 lg:w-14 lg:h-14 mx-auto rounded-2xl ${stat.gradient} flex items-center justify-center mb-4 ${stat.shadow} group-hover:scale-110 transition-transform duration-500`}>
                <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              {loading ? (
                <div className="h-9 w-14 mx-auto bg-void-700/50 rounded skeleton mb-2" />
              ) : (
                <p className={`font-display text-3xl lg:text-4xl font-bold ${stat.textColor} mb-1`}>{stat.value}</p>
              )}
              <p className="text-sm text-void-400">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Vehicle Share Modal
// Main Social Component
export default function Social() {
  const { user } = useAuth()
  const {
    profile,
    vehicles,
    connectedUsersVehicles,
    connections,
    pendingConnections,
    loading,
    fetchConnections,
    fetchConnectedUsersVehicles,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    removeConnection,
  } = useStore()
  
  const [copied, setCopied] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [processingId, setProcessingId] = useState(null)
  
  // Fetch connections on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchConnections(user.id)
      fetchConnectedUsersVehicles(user.id)
    }
  }, [user?.id, fetchConnections, fetchConnectedUsersVehicles])
  
  // Handle URL connection code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const connectCode = params.get('connect')
    if (connectCode && user?.id) {
      // Auto-fill the connect form or auto-send request
      handleConnect(connectCode)
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [user?.id])
  
  const handleCopyCode = () => {
    if (profile?.share_code) {
      navigator.clipboard.writeText(profile.share_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  const handleConnect = async (code) => {
    setIsConnecting(true)
    const result = await sendConnectionRequest(code)
    setIsConnecting(false)
    return result
  }
  
  const handleAccept = async (id) => {
    setProcessingId(id)
    await acceptConnection(id)
    // Refresh connections after accepting
    if (user?.id) {
      await fetchConnections(user.id)
    }
    setProcessingId(null)
  }
  
  const handleReject = async (id) => {
    setProcessingId(id)
    await rejectConnection(id)
    setProcessingId(null)
  }
  
  const handleRemove = async (id) => {
    if (confirm('Are you sure you want to remove this connection?')) {
      setProcessingId(id)
      await removeConnection(id)
      setProcessingId(null)
    }
  }
  
  const handleMessage = (targetUser) => {
    // TODO: Navigate to messages with this user
    console.log('Message user:', targetUser)
  }
  
  const isLoading = loading.connections || loading.global
  
  return (
    <div>
      {/* Hero Section */}
      <SocialHero />
      
      {/* Stats */}
      <SocialStats 
        connections={connections.length}
        pendingRequests={pendingConnections.length}
        sharedVehicles={connectedUsersVehicles.length}
        loading={isLoading}
      />
      
      {/* Main Content - Share & Connect */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ShareCodeCard 
          shareCode={profile?.share_code}
          onCopy={handleCopyCode}
          copied={copied}
          isLoading={loading.profile || loading.global}
        />
        
        <ConnectForm 
          onConnect={handleConnect}
          isLoading={isConnecting}
        />
      </div>
      
      {/* Pending Requests */}
      {pendingConnections.length > 0 && (
        <div className="mb-8 animate-slideUpFade stagger-3">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">Pending Requests</h3>
              <p className="text-sm text-void-400">{pendingConnections.length} people want to connect</p>
            </div>
          </div>
          <div className="space-y-3">
            {pendingConnections.map((request) => (
              <PendingRequestCard
                key={request.id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
                isProcessing={processingId === request.id}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Connections List */}
      <div className="animate-slideUpFade stagger-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-neon-400" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">Your Connections</h3>
              <p className="text-sm text-void-400">{connections.length} connected users</p>
            </div>
          </div>
          {connections.length > 0 && (
            <button
              onClick={() => user?.id && fetchConnections(user.id)}
              className="p-2 rounded-lg hover:bg-void-700 transition-colors"
              title="Refresh connections"
            >
              <RefreshCw className="w-5 h-5 text-void-400" />
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <ConnectionSkeleton key={i} />
            ))}
          </div>
        ) : connections.length > 0 ? (
          <div className="space-y-3">
            {connections.map((connection) => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                onRemove={handleRemove}
                onMessage={handleMessage}
                isRemoving={processingId === connection.id}
              />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-void-800/50 flex items-center justify-center mb-5">
              <Users className="w-12 h-12 text-void-600" />
            </div>
            <h4 className="font-display text-xl font-bold text-white mb-2">No Connections Yet</h4>
            <p className="text-void-400 max-w-sm mx-auto mb-6">
              Share your code with friends and family, or enter someone's code above to start connecting.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-void-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-500" />
                Secure
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-electric-500" />
                Instant
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-500" />
                Easy
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Connected Users' Vehicles Section */}
      {connectedUsersVehicles.length > 0 && (
        <div className="mt-8 animate-slideUpFade stagger-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-electric-500/20 flex items-center justify-center">
              <Car className="w-5 h-5 text-electric-400" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">Vehicles From Connections</h3>
              <p className="text-sm text-void-400">{connectedUsersVehicles.length} vehicles from your connected users</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedUsersVehicles.map((vehicle) => (
              <ConnectedVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Shared Vehicle Card Component
// Connected Vehicle Card - Shows vehicle from a connected user (automatic sharing)
function ConnectedVehicleCard({ vehicle }) {
  const owner = vehicle.owner
  
  if (!vehicle) return null
  
  return (
    <div className="card p-5 hover:border-electric-500/30 transition-all duration-300 group">
      <div className="flex items-start gap-4 mb-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: (vehicle.color || '#7c3aed') + '20' }}
        >
          <Car className="w-7 h-7" style={{ color: vehicle.color || '#7c3aed' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{vehicle.name}</h4>
          <p className="text-sm text-void-400">{vehicle.make} {vehicle.model}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-void-800/50 rounded-lg p-3">
          <p className="text-xs text-void-500 mb-1">Status</p>
          <p className={`text-sm font-medium ${
            vehicle.status === 'available' ? 'text-success-400' :
            vehicle.status === 'in-use' ? 'text-neon-400' : 'text-amber-400'
          }`}>
            {vehicle.status?.replace('-', ' ') || 'Unknown'}
          </p>
        </div>
        <div className="bg-void-800/50 rounded-lg p-3">
          <p className="text-xs text-void-500 mb-1">Fuel</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-void-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  (vehicle.fuel_level || 0) > 50 ? 'bg-success-400' : 
                  (vehicle.fuel_level || 0) > 25 ? 'bg-amber-400' : 'bg-coral-400'
                }`}
                style={{ width: `${vehicle.fuel_level || 0}%` }}
              />
            </div>
            <span className="text-xs text-void-400">{vehicle.fuel_level || 0}%</span>
          </div>
        </div>
      </div>
      
      {owner && (
        <div className="flex items-center gap-2 pt-3 border-t border-void-700">
          <div 
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: (owner.color || '#00e5c9') + '30', color: owner.color || '#00e5c9' }}
          >
            {owner.avatar_initials || '??'}
          </div>
          <p className="text-xs text-void-400">
            Owned by <span className="text-void-300 font-medium">{owner.full_name}</span>
          </p>
        </div>
      )}
    </div>
  )
}
