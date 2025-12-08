import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [configError, setConfigError] = useState(!isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email)
        }
        if (event === 'SIGNED_OUT') {
          console.log('User signed out')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured' } }
    }
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
    return { error }
  }

  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  }

  const value = {
    user,
    session,
    loading,
    configError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!session,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
