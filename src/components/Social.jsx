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
  MessageSquare
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAuth } from '../contexts/AuthContext'

// Loading Skeleton
function ConnectionSkeleton() {
  return (
    <div className="glass-light rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-midnight-700/50 skeleton" />
        <div className="flex-1">
          <div className="h-5 w-32 bg-midnight-700/50 rounded skeleton mb-2" />
          <div className="h-4 w-24 bg-midnight-700/50 rounded skeleton" />
        </div>
        <div className="h-10 w-24 bg-midnight-700/50 rounded-xl skeleton" />
      </div>
    </div>
  )
}

// Hero Section
function SocialHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-8 mb-8 animate-slideUpFade">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-400">Social Hub</span>
            </div>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Connect &{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Share</span>
          </h2>
          <p className="text-midnight-300 text-lg max-w-md">
            Invite friends and family to your garage. Share vehicles and coordinate trips together.
          </p>
        </div>
        
        <div className="relative">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 flex items-center justify-center animate-float">
            <Users className="w-20 h-20 text-purple-400/50" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Share Code Card
function ShareCodeCard({ shareCode, onCopy, copied }) {
  const shareUrl = `${window.location.origin}?connect=${shareCode}`
  
  const handleShare = async () => {
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
    <div className="glass-card rounded-3xl p-6 animate-slideUpFade stagger-1">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Link2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Your Share Code</h3>
          <p className="text-sm text-midnight-400">Share this with friends to connect</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 font-mono text-lg text-white tracking-widest text-center">
          {shareCode || 'Loading...'}
        </div>
        <button
          onClick={onCopy}
          className={`p-3 rounded-xl transition-all duration-300 ${
            copied 
              ? 'bg-moss-500/20 border border-moss-500/30' 
              : 'bg-midnight-800/50 border border-midnight-600 hover:bg-white/5'
          }`}
        >
          {copied ? (
            <Check className="w-5 h-5 text-moss-400" />
          ) : (
            <Copy className="w-5 h-5 text-midnight-400" />
          )}
        </button>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-500"
        >
          <Share2 className="w-4 h-4" />
          Share Link
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl)
            onCopy()
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-light hover:bg-white/5 transition-all duration-300"
        >
          <ExternalLink className="w-4 h-4 text-midnight-400" />
        </button>
      </div>
    </div>
  )
}

// Connect Form
function ConnectForm({ onConnect, isLoading }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    
    setError('')
    const result = await onConnect(code.trim())
    if (result?.error) {
      setError(result.error)
    } else {
      setCode('')
    }
  }
  
  return (
    <div className="glass-card rounded-3xl p-6 animate-slideUpFade stagger-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Connect with Someone</h3>
          <p className="text-sm text-midnight-400">Enter their share code to send a request</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter share code..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all font-mono tracking-wider placeholder:text-midnight-500 placeholder:font-sans placeholder:tracking-normal"
          />
        </div>
        
        {error && (
          <p className="text-sm text-red-400 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-500 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Request
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
    <div className="glass-light rounded-2xl p-5 hover:bg-white/5 transition-all duration-300 group animate-slideUpFade shine-effect">
      <div className="flex items-center gap-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
          style={{ 
            backgroundColor: (request.user?.color || '#3b82f6') + '30',
            color: request.user?.color || '#3b82f6'
          }}
        >
          {request.user?.avatar_initials || '??'}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white">{request.user?.full_name || 'Unknown'}</h4>
          <p className="text-sm text-midnight-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending request
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAccept(request.id)}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-moss-500/20 border border-moss-500/30 text-moss-400 hover:bg-moss-500/30 transition-all duration-300 disabled:opacity-50"
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
            className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Connection Card
function ConnectionCard({ connection, onRemove, onMessage, isRemoving }) {
  const connectedUser = connection.connected_user
  
  return (
    <div className="glass-light rounded-2xl p-5 hover:bg-white/5 transition-all duration-300 group animate-slideUpFade shine-effect">
      <div className="flex items-center gap-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-transform duration-300 group-hover:scale-110"
          style={{ 
            backgroundColor: (connectedUser?.color || '#3b82f6') + '30',
            color: connectedUser?.color || '#3b82f6',
            boxShadow: `0 10px 30px ${connectedUser?.color || '#3b82f6'}30`
          }}
        >
          {connectedUser?.avatar_initials || '??'}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
            {connectedUser?.full_name || 'Unknown'}
          </h4>
          <p className="text-sm text-midnight-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-moss-400" />
            Connected
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onMessage(connectedUser)}
            className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all duration-300"
            title="Send message"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={() => onRemove(connection.id)}
            disabled={isRemoving}
            className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50"
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

// Stats Card
function SocialStats({ connections, pendingRequests, sharedVehicles, loading }) {
  const stats = [
    { label: 'Connections', value: connections, icon: Users, color: 'purple' },
    { label: 'Pending', value: pendingRequests, icon: Clock, color: 'yellow' },
    { label: 'Shared Vehicles', value: sharedVehicles, icon: Car, color: 'blue' },
  ]
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const gradients = {
          purple: 'from-purple-500 to-purple-600',
          yellow: 'from-yellow-500 to-yellow-600',
          blue: 'from-blue-500 to-blue-600',
        }
        
        return (
          <div 
            key={stat.label}
            className="animate-slideUpFade"
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div className="glass-card rounded-2xl p-5 text-center group hover:scale-105 transition-all duration-500 shine-effect">
              <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${gradients[stat.color]} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {loading ? (
                <div className="h-8 w-12 mx-auto bg-midnight-700/50 rounded skeleton mb-1" />
              ) : (
                <p className="font-display text-3xl font-bold text-white mb-1">{stat.value}</p>
              )}
              <p className="text-sm text-midnight-400">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Social() {
  const { user } = useAuth()
  const {
    profile,
    connections,
    pendingConnections,
    sharedVehicles,
    loading,
    fetchConnections,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    removeConnection,
  } = useStore()
  
  const [copied, setCopied] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [processingId, setProcessingId] = useState(null)
  
  useEffect(() => {
    if (user?.id) {
      fetchConnections(user.id)
    }
  }, [user?.id, fetchConnections])
  
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
  
  const handleMessage = (user) => {
    // TODO: Navigate to messages with this user
    console.log('Message user:', user)
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
        sharedVehicles={sharedVehicles.length}
        loading={isLoading}
      />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Share Code */}
        <ShareCodeCard 
          shareCode={profile?.share_code}
          onCopy={handleCopyCode}
          copied={copied}
        />
        
        {/* Connect Form */}
        <ConnectForm 
          onConnect={handleConnect}
          isLoading={isConnecting}
        />
      </div>
      
      {/* Pending Requests */}
      {pendingConnections.length > 0 && (
        <div className="mb-8 animate-slideUpFade stagger-3">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Pending Requests
            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">
              {pendingConnections.length}
            </span>
          </h3>
          <div className="space-y-3">
            {pendingConnections.map((request, index) => (
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
      
      {/* Connections */}
      <div className="animate-slideUpFade stagger-4">
        <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          Your Connections
        </h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <ConnectionSkeleton key={i} />
            ))}
          </div>
        ) : connections.length > 0 ? (
          <div className="space-y-3">
            {connections.map((connection, index) => (
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
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-midnight-700/30 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-midnight-600" />
            </div>
            <h4 className="font-display text-xl font-bold text-white mb-2">No Connections Yet</h4>
            <p className="text-midnight-400 max-w-sm mx-auto">
              Share your code or enter someone else's code above to start connecting with friends and family.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

