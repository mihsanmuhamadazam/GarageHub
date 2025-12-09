import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Zap, Shield, Users, BarChart3 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Login({ onSwitchToSignup }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { data, error } = await signIn(email, password)
    
    if (error) {
      setError(error.message || 'Invalid email or password')
      setIsLoading(false)
      return
    }

    // Success - AuthContext will handle the session update
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-void-950">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-void-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-pattern" />
        
        {/* Animated orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-neon-500/20 rounded-full filter blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-electric-500/15 rounded-full filter blur-[100px] animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-coral-500/10 rounded-full filter blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-2xl gradient-neon flex items-center justify-center shadow-neon">
              <svg className="w-8 h-8 text-void-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Garage<span className="text-neon-400">Hub</span></h1>
              <p className="text-sm text-void-400">Vehicle Management</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Manage your fleet with{' '}
            <span className="text-gradient">precision</span> and control.
          </h2>
          
          <p className="text-void-300 text-lg mb-10">
            Track vehicles, schedule maintenance, analyze usage patterns, and coordinate with your team—all in one platform.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Zap, text: 'Real-time tracking', color: 'neon' },
              { icon: Shield, text: 'Smart maintenance', color: 'electric' },
              { icon: BarChart3, text: 'Usage analytics', color: 'coral' },
              { icon: Users, text: 'Team coordination', color: 'amber' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-void-800/50 border border-void-700">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  feature.color === 'neon' ? 'bg-neon-500/20' :
                  feature.color === 'electric' ? 'bg-electric-500/20' :
                  feature.color === 'coral' ? 'bg-coral-500/20' : 'bg-amber-500/20'
                }`}>
                  <feature.icon className={`w-5 h-5 ${
                    feature.color === 'neon' ? 'text-neon-400' :
                    feature.color === 'electric' ? 'text-electric-400' :
                    feature.color === 'coral' ? 'text-coral-400' : 'text-amber-400'
                  }`} />
                </div>
                <span className="text-sm font-medium text-void-200">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl gradient-neon flex items-center justify-center shadow-neon">
              <svg className="w-7 h-7 text-void-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Garage<span className="text-neon-400">Hub</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-void-400">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-coral-500/10 border border-coral-500/30 flex items-center gap-3 animate-scale-in">
              <AlertCircle className="w-5 h-5 text-coral-400 shrink-0" />
              <p className="text-sm text-coral-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-void-200 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-void-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full pl-12 pr-4 py-4 rounded-xl text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-void-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-void-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pl-12 pr-12 py-4 rounded-xl text-base"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-void-500 hover:text-void-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-void-600 bg-void-800 text-neon-500 focus:ring-neon-500/20" />
                <span className="text-sm text-void-400">Remember me</span>
              </label>
              <button type="button" className="text-sm text-neon-400 hover:text-neon-300 transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base font-semibold disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-void-900/30 border-t-void-900 rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-void-400">
              Don't have an account?{' '}
              <button 
                onClick={onSwitchToSignup}
                className="text-neon-400 hover:text-neon-300 font-semibold transition-colors"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
