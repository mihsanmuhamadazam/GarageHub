import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function Signup({ onSwitchToLogin }) {
  const { signup } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const result = signup(name, email, password)
    if (!result.success) {
      setError(result.error)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-[#0c0f14]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0f1419] to-[#0c0f14] items-center justify-center p-12">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-pattern" />
        
        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">GarageHub</h1>
              <p className="text-xs text-gray-500">Vehicle Management</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Start managing your fleet today.
          </h2>
          
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of teams who trust GarageHub for efficient vehicle management and coordination.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '50K+', label: 'Vehicles Managed' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Abstract car silhouette */}
        <div className="absolute bottom-0 right-0 w-96 h-48 opacity-5">
          <svg viewBox="0 0 400 200" className="w-full h-full" fill="currentColor">
            <path d="M380 160 L360 120 L300 100 L260 80 L180 80 L120 100 L60 120 L20 160 L380 160 Z" />
            <circle cx="100" cy="160" r="25" />
            <circle cx="300" cy="160" r="25" />
          </svg>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">GarageHub</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-gray-400">Get started with GarageHub vehicle management</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-scaleIn">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full pl-12 pr-4 py-3.5 rounded-xl"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full pl-12 pr-4 py-3.5 rounded-xl"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pl-12 pr-12 py-3.5 rounded-xl"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input w-full pl-12 pr-4 py-3.5 rounded-xl"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="w-4 h-4 mt-1 rounded border-gray-600 bg-transparent text-blue-500 focus:ring-blue-500/20" />
                <span className="text-sm text-gray-400">
                  I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

