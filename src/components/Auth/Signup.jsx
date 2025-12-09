import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User, Palette, Sparkles } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const COLORS = [
  { name: 'Neon', value: '#00e5c9' },
  { name: 'Electric', value: '#7c3aed' },
  { name: 'Coral', value: '#ff4d2a' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Success', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
]

export default function Signup({ onSwitchToLogin }) {
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    color: '#00e5c9',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    // Generate initials from full name
    const nameParts = formData.fullName.trim().split(' ')
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : formData.fullName.slice(0, 2).toUpperCase()

    const { data, error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      avatar_initials: initials,
      color: formData.color,
    })

    if (error) {
      setError(error.message || 'Failed to create account')
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-950 p-8">
        <div className="bg-pattern fixed inset-0 pointer-events-none" />
        <div className="w-full max-w-md text-center animate-scale-in relative z-10">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl gradient-neon flex items-center justify-center shadow-neon">
            <Sparkles className="w-12 h-12 text-void-900" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Account Created!</h2>
          <p className="text-void-300 mb-8 text-lg">
            Please check your email to verify your account before signing in.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="btn-primary px-8 py-4 rounded-xl font-semibold text-base"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-void-950">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-void-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-pattern" />
        
        {/* Animated orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-electric-500/20 rounded-full filter blur-[100px] animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-500/15 rounded-full filter blur-[100px] animate-float-slow" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-coral-500/10 rounded-full filter blur-[80px] animate-float" style={{ animationDelay: '3s' }} />
        
        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-2xl gradient-electric flex items-center justify-center shadow-electric">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Garage<span className="text-electric-400">Hub</span></h1>
              <p className="text-sm text-void-400">Vehicle Management</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Start managing your vehicles{' '}
            <span className="text-gradient-electric">smarter</span> today.
          </h2>
          
          <p className="text-void-300 text-lg mb-10">
            Join thousands of families and teams who use GarageHub to keep their fleet organized and running smoothly.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              'Free to start, upgrade anytime',
              'Invite unlimited family members',
              'Share vehicles with anyone',
              'Get maintenance reminders',
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-void-200">
                <div className="w-6 h-6 rounded-full bg-electric-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-electric-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md animate-fadeIn py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl gradient-electric flex items-center justify-center shadow-electric">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Garage<span className="text-electric-400">Hub</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-void-400">Get started with GarageHub for free</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-coral-500/10 border border-coral-500/30 flex items-center gap-3 animate-scale-in">
              <AlertCircle className="w-5 h-5 text-coral-400 shrink-0" />
              <p className="text-sm text-coral-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-void-200 mb-2">Full name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-void-500" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input w-full pl-12 pr-4 py-4 rounded-xl text-base"
                  placeholder="John Smith"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-void-200 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-void-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input w-full pl-12 pr-4 py-4 rounded-xl text-base"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-void-200 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-void-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input w-full pl-12 pr-11 py-4 rounded-xl text-base"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-void-500 hover:text-void-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-void-200 mb-2">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-void-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input w-full pl-12 pr-11 py-4 rounded-xl text-base"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-void-500 hover:text-void-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-void-200 mb-3">
                <Palette className="w-4 h-4" />
                Choose your accent color
              </label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-10 h-10 rounded-xl transition-all duration-300 ${
                      formData.color === color.value 
                        ? 'ring-2 ring-offset-2 ring-offset-void-950 scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: color.value,
                      ringColor: formData.color === color.value ? color.value : 'transparent'
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 rounded-xl bg-void-800/50 border border-void-700">
              <p className="text-xs text-void-500 mb-2">Preview</p>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-colors duration-300"
                  style={{ backgroundColor: formData.color + '30', color: formData.color }}
                >
                  {formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'YO'}
                </div>
                <div>
                  <p className="font-semibold text-white">{formData.fullName || 'Your Name'}</p>
                  <p className="text-sm text-void-400">{formData.email || 'your@email.com'}</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-electric w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base font-semibold disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-void-400">
              Already have an account?{' '}
              <button 
                onClick={onSwitchToLogin}
                className="text-electric-400 hover:text-electric-300 font-semibold transition-colors"
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
