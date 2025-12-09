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
      .select('*, vehicles(*)')
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
      .select('*, vehicles(*)')
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

  // Messages
  async getMessages(userId) {
    if (!supabase) return { data: [], error: null }
    const { data, error } = await supabase
      .from('messages')
      .select('*, vehicles(*), profiles(*)')
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
      .select('*, vehicles(*)')
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

  // Connections (Social Features)
  async getConnections(userId) {
    if (!supabase) return { data: [], error: null }
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        connected_user:profiles!connections_connected_user_id_fkey(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted')
    return { data: data || [], error }
  },

  async getPendingConnections(userId) {
    if (!supabase) return { data: [], error: null }
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        user:profiles!connections_user_id_fkey(*)
      `)
      .eq('connected_user_id', userId)
      .eq('status', 'pending')
    return { data: data || [], error }
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('share_code', shareCode)
      .single()
    return { data, error }
  },

  // Shared Vehicles (vehicles shared by connections)
  async getSharedVehicles(userId) {
    if (!supabase) return { data: [], error: null }
    const { data, error } = await supabase
      .from('vehicle_shares')
      .select(`
        *,
        vehicle:vehicles(*),
        shared_by:profiles!vehicle_shares_shared_by_fkey(*)
      `)
      .eq('shared_with', userId)
    return { data: data || [], error }
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

