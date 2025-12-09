import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase config:', { 
  url: supabaseUrl ? '✓ Set' : '✗ Missing', 
  key: supabaseAnonKey ? '✓ Set' : '✗ Missing' 
})

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase is not configured. Database operations will not work.')
}

// Helper functions for database operations
export const db = {
  // Vehicles
  async getVehicles(userId) {
    if (!supabase) return { data: [], error: null }
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  },

  async createVehicle(vehicle) {
    if (!supabase) {
      console.error('createVehicle: Supabase not configured')
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    console.log('db.createVehicle:', vehicle)
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicle])
      .select()
      .single()
    if (error) {
      console.error('db.createVehicle error:', error)
    }
    return { data, error }
  },

  async updateVehicle(id, updates) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteVehicle(id) {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Bookings
  async getBookings(userId) {
    if (!supabase) return { data: [], error: null }
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
    return { data: data || [], error }
  },

  async createBooking(booking) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single()
    return { data, error }
  },

  async updateBooking(id, updates) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteBooking(id) {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Services
  async getServices(userId) {
    if (!supabase) return { data: [], error: null }
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    return { data: data || [], error }
  },

  async createService(service) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single()
    return { data, error }
  },

  async updateService(id, updates) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteService(id) {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Messages - simplified query without complex joins
  async getMessages(userId) {
    if (!supabase) return { data: [], error: null }
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    return { data: data || [], error }
  },

  async createMessage(message) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single()
    return { data, error }
  },

  async deleteMessage(id) {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Usage Log
  async getUsageLog(userId) {
    if (!supabase) return { data: [], error: null }
    const { data, error } = await supabase
      .from('usage_log')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    return { data: data || [], error }
  },

  async createUsageLog(log) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('usage_log')
      .insert([log])
      .select()
      .single()
    return { data, error }
  },

  // Connections (Social Features) - simplified queries
  async getConnections(userId) {
    if (!supabase) return { data: [], error: null }
    // First get connections
    const { data: connections, error } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'accepted')
    
    if (error || !connections?.length) {
      return { data: connections || [], error }
    }
    
    // Then get the connected users' profiles
    const connectedUserIds = connections.map(c => c.connected_user_id)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', connectedUserIds)
    
    // Merge data
    const enrichedConnections = connections.map(conn => ({
      ...conn,
      connected_user: profiles?.find(p => p.id === conn.connected_user_id) || null
    }))
    
    return { data: enrichedConnections, error: null }
  },

  async getPendingConnections(userId) {
    if (!supabase) return { data: [], error: null }
    // Get pending connections where user is the recipient
    const { data: connections, error } = await supabase
      .from('connections')
      .select('*')
      .eq('connected_user_id', userId)
      .eq('status', 'pending')
    
    if (error || !connections?.length) {
      return { data: connections || [], error }
    }
    
    // Get the requesting users' profiles
    const userIds = connections.map(c => c.user_id)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds)
    
    // Merge data
    const enrichedConnections = connections.map(conn => ({
      ...conn,
      user: profiles?.find(p => p.id === conn.user_id) || null
    }))
    
    return { data: enrichedConnections, error: null }
  },

  async createConnection(connection) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('connections')
      .insert([connection])
      .select()
      .single()
    return { data, error }
  },

  async updateConnection(id, status) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('connections')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteConnection(id) {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Profile
  async getProfile(userId) {
    if (!supabase) return { data: null, error: null }
    
    // First try to get existing profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    
    // If profile exists, return it
    if (data) {
      return { data, error: null }
    }
    
    // If no profile exists, try to create one
    if (!data && !error) {
      console.log('Profile not found, creating one for user:', userId)
      const newProfile = await this.createProfile(userId)
      return newProfile
    }
    
    return { data: null, error }
  },

  async createProfile(userId, metadata = {}) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    
    // Generate a random share code
    const shareCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    
    const profileData = {
      id: userId,
      full_name: metadata.full_name || 'User',
      avatar_initials: metadata.avatar_initials || 'US',
      color: metadata.color || '#00e5c9',
      share_code: shareCode,
      role: 'member',
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating profile:', error)
      // If insert failed due to duplicate, try to fetch existing
      if (error.code === '23505') {
        return this.getProfile(userId)
      }
    }
    
    return { data, error }
  },

  async updateProfile(userId, updates) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  async getProfileByShareCode(shareCode) {
    if (!supabase) return { data: null, error: null }
    
    // Try case-insensitive search using ilike
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('share_code', shareCode.trim())
      .maybeSingle()
    
    if (data) {
      return { data, error: null }
    }
    
    // If not found with ilike, try exact match with different cases
    if (!data && !error) {
      // Try uppercase
      const upperResult = await supabase
        .from('profiles')
        .select('*')
        .eq('share_code', shareCode.trim().toUpperCase())
        .maybeSingle()
      
      if (upperResult.data) {
        return { data: upperResult.data, error: null }
      }
      
      // Try lowercase
      const lowerResult = await supabase
        .from('profiles')
        .select('*')
        .eq('share_code', shareCode.trim().toLowerCase())
        .maybeSingle()
      
      if (lowerResult.data) {
        return { data: lowerResult.data, error: null }
      }
    }
    
    return { data: null, error }
  },

  // Shared Vehicles - simplified query
  async getSharedVehicles(userId) {
    if (!supabase) return { data: [], error: null }
    // Get shares
    const { data: shares, error } = await supabase
      .from('vehicle_shares')
      .select('*')
      .eq('shared_with', userId)
    
    if (error || !shares?.length) {
      return { data: shares || [], error }
    }
    
    // Get vehicles
    const vehicleIds = shares.map(s => s.vehicle_id)
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('*')
      .in('id', vehicleIds)
    
    // Get profiles of sharers
    const sharerIds = shares.map(s => s.shared_by)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', sharerIds)
    
    // Merge data
    const enrichedShares = shares.map(share => ({
      ...share,
      vehicle: vehicles?.find(v => v.id === share.vehicle_id) || null,
      shared_by_profile: profiles?.find(p => p.id === share.shared_by) || null
    }))
    
    return { data: enrichedShares, error: null }
  },

  async shareVehicle(vehicleId, sharedBy, sharedWith) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase
      .from('vehicle_shares')
      .insert([{ vehicle_id: vehicleId, shared_by: sharedBy, shared_with: sharedWith }])
      .select()
      .single()
    return { data, error }
  },

  async unshareVehicle(vehicleId, sharedWith) {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { error } = await supabase
      .from('vehicle_shares')
      .delete()
      .eq('vehicle_id', vehicleId)
      .eq('shared_with', sharedWith)
    return { error }
  }
}
