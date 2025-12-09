import { create } from 'zustand'
import { db, supabase } from '../lib/supabase'

export const useStore = create((set, get) => ({
  // Data State - No more fake data, all from Supabase
  vehicles: [],
  bookings: [],
  services: [],
  messages: [],
  usageLog: [],
  connections: [],
  pendingConnections: [],
  sharedVehicles: [],
  profile: null,
  
  // Loading States
  loading: {
    vehicles: false,
    bookings: false,
    services: false,
    messages: false,
    usageLog: false,
    connections: false,
    profile: false,
    global: true,
  },
  
  // Error States
  errors: {
    vehicles: null,
    bookings: null,
    services: null,
    messages: null,
    usageLog: null,
    connections: null,
    profile: null,
  },

  // Current User from Auth
  currentUser: null,

  // Set Loading
  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    })),

  // Set Error
  setError: (key, error) =>
    set((state) => ({
      errors: { ...state.errors, [key]: error },
    })),

  // Set Current User
  setCurrentUser: (user) => set({ currentUser: user }),

  // Initialize all data for a user
  initializeData: async (userId) => {
    if (!userId) return
    
    set((state) => ({
      loading: { ...state.loading, global: true },
    }))

    try {
      // Fetch all data in parallel
      const [
        vehiclesRes,
        bookingsRes,
        servicesRes,
        messagesRes,
        usageLogRes,
        connectionsRes,
        pendingRes,
        sharedRes,
        profileRes,
      ] = await Promise.all([
        db.getVehicles(userId),
        db.getBookings(userId),
        db.getServices(userId),
        db.getMessages(userId),
        db.getUsageLog(userId),
        db.getConnections(userId),
        db.getPendingConnections(userId),
        db.getSharedVehicles(userId),
        db.getProfile(userId),
      ])

      set({
        vehicles: vehiclesRes.data || [],
        bookings: (bookingsRes.data || []).map(b => ({
          id: b.id,
          carId: b.vehicle_id,
          userId: b.user_id,
          startDate: b.start_date,
          endDate: b.end_date,
          purpose: b.purpose,
        })),
        services: (servicesRes.data || []).map(s => ({
          id: s.id,
          carId: s.vehicle_id,
          type: s.type,
          date: s.date,
          mileage: s.mileage,
          cost: s.cost,
          notes: s.notes,
          nextDue: s.next_due,
        })),
        messages: (messagesRes.data || []).map(m => ({
          id: m.id,
          carId: m.vehicle_id,
          userId: m.user_id,
          message: m.message,
          type: m.type,
          timestamp: m.created_at,
        })),
        usageLog: (usageLogRes.data || []).map(l => ({
          id: l.id,
          carId: l.vehicle_id,
          userId: l.user_id,
          date: l.date,
          distance: l.distance,
          duration: l.duration,
        })),
        connections: connectionsRes.data || [],
        pendingConnections: pendingRes.data || [],
        sharedVehicles: sharedRes.data || [],
        profile: profileRes.data,
        loading: {
          vehicles: false,
          bookings: false,
          services: false,
          messages: false,
          usageLog: false,
          connections: false,
          profile: false,
          global: false,
        },
      })
    } catch (error) {
      console.error('Error initializing data:', error)
      set((state) => ({
        loading: { ...state.loading, global: false },
      }))
    }
  },

  // Vehicles - using 'cars' alias for compatibility
  get cars() {
    return get().vehicles.map(v => ({
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
  },

  // Vehicle Actions
  fetchVehicles: async (userId) => {
    set((state) => ({ loading: { ...state.loading, vehicles: true } }))
    const { data, error } = await db.getVehicles(userId)
    set({
      vehicles: data || [],
      loading: { ...get().loading, vehicles: false },
      errors: { ...get().errors, vehicles: error },
    })
  },

  addCar: async (car) => {
    const userId = get().currentUser?.id
    if (!userId) return

    set((state) => ({ loading: { ...state.loading, vehicles: true } }))
    
    const vehicleData = {
      owner_id: userId,
      name: car.name,
      make: car.make,
      model: car.model,
      year: car.year,
      plate: car.plate,
      color: car.color,
      status: car.status || 'available',
      current_driver: car.currentDriver,
      mileage: car.mileage || 0,
      fuel_level: car.fuelLevel || 100,
      image: car.image || 'sedan',
    }

    const { data, error } = await db.createVehicle(vehicleData)
    
    if (data) {
      set((state) => ({
        vehicles: [data, ...state.vehicles],
        loading: { ...state.loading, vehicles: false },
      }))
    } else {
      set((state) => ({
        loading: { ...state.loading, vehicles: false },
        errors: { ...state.errors, vehicles: error },
      }))
    }
  },

  updateCar: async (id, updates) => {
    const dbUpdates = {
      name: updates.name,
      make: updates.make,
      model: updates.model,
      year: updates.year,
      plate: updates.plate,
      color: updates.color,
      status: updates.status,
      current_driver: updates.currentDriver,
      mileage: updates.mileage,
      fuel_level: updates.fuelLevel,
      image: updates.image,
    }
    
    // Remove undefined values
    Object.keys(dbUpdates).forEach(key => 
      dbUpdates[key] === undefined && delete dbUpdates[key]
    )

    const { data, error } = await db.updateVehicle(id, dbUpdates)
    
    if (data) {
      set((state) => ({
        vehicles: state.vehicles.map((v) =>
          v.id === id ? data : v
        ),
      }))
    }
  },

  deleteCar: async (id) => {
    const { error } = await db.deleteVehicle(id)
    if (!error) {
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id),
      }))
    }
  },

  toggleCarStatus: async (id, status, driver = null) => {
    const { data, error } = await db.updateVehicle(id, {
      status,
      current_driver: driver,
    })
    
    if (data) {
      set((state) => ({
        vehicles: state.vehicles.map((v) =>
          v.id === id ? data : v
        ),
      }))
    }
  },

  // Booking Actions
  fetchBookings: async (userId) => {
    set((state) => ({ loading: { ...state.loading, bookings: true } }))
    const { data, error } = await db.getBookings(userId)
    set({
      bookings: (data || []).map(b => ({
        id: b.id,
        carId: b.vehicle_id,
        userId: b.user_id,
        startDate: b.start_date,
        endDate: b.end_date,
        purpose: b.purpose,
      })),
      loading: { ...get().loading, bookings: false },
      errors: { ...get().errors, bookings: error },
    })
  },

  addBooking: async (booking) => {
    const userId = get().currentUser?.id
    if (!userId) return

    const bookingData = {
      user_id: userId,
      vehicle_id: booking.carId,
      start_date: booking.startDate,
      end_date: booking.endDate,
      purpose: booking.purpose,
    }

    const { data, error } = await db.createBooking(bookingData)
    
    if (data) {
      set((state) => ({
        bookings: [...state.bookings, {
          id: data.id,
          carId: data.vehicle_id,
          userId: data.user_id,
          startDate: data.start_date,
          endDate: data.end_date,
          purpose: data.purpose,
        }],
      }))
    }
  },

  updateBooking: async (id, updates) => {
    const dbUpdates = {
      vehicle_id: updates.carId,
      start_date: updates.startDate,
      end_date: updates.endDate,
      purpose: updates.purpose,
    }
    
    Object.keys(dbUpdates).forEach(key => 
      dbUpdates[key] === undefined && delete dbUpdates[key]
    )

    const { data, error } = await db.updateBooking(id, dbUpdates)
    
    if (data) {
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? {
            id: data.id,
            carId: data.vehicle_id,
            userId: data.user_id,
            startDate: data.start_date,
            endDate: data.end_date,
            purpose: data.purpose,
          } : b
        ),
      }))
    }
  },

  deleteBooking: async (id) => {
    const { error } = await db.deleteBooking(id)
    if (!error) {
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id),
      }))
    }
  },

  // Service Actions
  fetchServices: async (userId) => {
    set((state) => ({ loading: { ...state.loading, services: true } }))
    const { data, error } = await db.getServices(userId)
    set({
      services: (data || []).map(s => ({
        id: s.id,
        carId: s.vehicle_id,
        type: s.type,
        date: s.date,
        mileage: s.mileage,
        cost: s.cost,
        notes: s.notes,
        nextDue: s.next_due,
      })),
      loading: { ...get().loading, services: false },
      errors: { ...get().errors, services: error },
    })
  },

  addService: async (service) => {
    const userId = get().currentUser?.id
    if (!userId) return

    const serviceData = {
      user_id: userId,
      vehicle_id: service.carId,
      type: service.type,
      date: service.date,
      mileage: service.mileage || 0,
      cost: service.cost || 0,
      notes: service.notes,
      next_due: service.nextDue,
    }

    const { data, error } = await db.createService(serviceData)
    
    if (data) {
        set((state) => ({
        services: [...state.services, {
          id: data.id,
          carId: data.vehicle_id,
          type: data.type,
          date: data.date,
          mileage: data.mileage,
          cost: data.cost,
          notes: data.notes,
          nextDue: data.next_due,
        }],
      }))
    }
  },

  updateService: async (id, updates) => {
    const dbUpdates = {
      vehicle_id: updates.carId,
      type: updates.type,
      date: updates.date,
      mileage: updates.mileage,
      cost: updates.cost,
      notes: updates.notes,
      next_due: updates.nextDue,
    }
    
    Object.keys(dbUpdates).forEach(key => 
      dbUpdates[key] === undefined && delete dbUpdates[key]
    )

    const { data, error } = await db.updateService(id, dbUpdates)
    
    if (data) {
        set((state) => ({
        services: state.services.map((s) =>
          s.id === id ? {
            id: data.id,
            carId: data.vehicle_id,
            type: data.type,
            date: data.date,
            mileage: data.mileage,
            cost: data.cost,
            notes: data.notes,
            nextDue: data.next_due,
          } : s
        ),
      }))
    }
  },

  deleteService: async (id) => {
    const { error } = await db.deleteService(id)
    if (!error) {
        set((state) => ({
        services: state.services.filter((s) => s.id !== id),
      }))
    }
  },

  // Message Actions
  fetchMessages: async (userId) => {
    set((state) => ({ loading: { ...state.loading, messages: true } }))
    const { data, error } = await db.getMessages(userId)
    set({
      messages: (data || []).map(m => ({
        id: m.id,
        carId: m.vehicle_id,
        userId: m.user_id,
        message: m.message,
        type: m.type,
        timestamp: m.created_at,
      })),
      loading: { ...get().loading, messages: false },
      errors: { ...get().errors, messages: error },
    })
  },

  addMessage: async (message) => {
    const userId = get().currentUser?.id
    if (!userId) return

    const messageData = {
      user_id: userId,
      vehicle_id: message.carId,
      message: message.message,
      type: message.type || 'note',
    }

    const { data, error } = await db.createMessage(messageData)
    
    if (data) {
        set((state) => ({
        messages: [...state.messages, {
          id: data.id,
          carId: data.vehicle_id,
          userId: data.user_id,
          message: data.message,
          type: data.type,
          timestamp: data.created_at,
        }],
      }))
    }
  },

  deleteMessage: async (id) => {
    const { error } = await db.deleteMessage(id)
    if (!error) {
        set((state) => ({
        messages: state.messages.filter((m) => m.id !== id),
      }))
    }
  },

  // Usage Log Actions
  fetchUsageLog: async (userId) => {
    set((state) => ({ loading: { ...state.loading, usageLog: true } }))
    const { data, error } = await db.getUsageLog(userId)
    set({
      usageLog: (data || []).map(l => ({
        id: l.id,
        carId: l.vehicle_id,
        userId: l.user_id,
        date: l.date,
        distance: l.distance,
        duration: l.duration,
      })),
      loading: { ...get().loading, usageLog: false },
      errors: { ...get().errors, usageLog: error },
    })
  },

  addUsageLog: async (log) => {
    const userId = get().currentUser?.id
    if (!userId) return

    const logData = {
      user_id: userId,
      vehicle_id: log.carId,
      date: log.date,
      distance: log.distance || 0,
      duration: log.duration || 0,
    }

    const { data, error } = await db.createUsageLog(logData)
    
    if (data) {
        set((state) => ({
        usageLog: [...state.usageLog, {
          id: data.id,
          carId: data.vehicle_id,
          userId: data.user_id,
          date: data.date,
          distance: data.distance,
          duration: data.duration,
        }],
      }))
    }
  },

  // Connection/Social Actions
  fetchConnections: async (userId) => {
    set((state) => ({ loading: { ...state.loading, connections: true } }))
    const [connectionsRes, pendingRes] = await Promise.all([
      db.getConnections(userId),
      db.getPendingConnections(userId),
    ])
    set({
      connections: connectionsRes.data || [],
      pendingConnections: pendingRes.data || [],
      loading: { ...get().loading, connections: false },
    })
  },

  sendConnectionRequest: async (shareCode) => {
    const userId = get().currentUser?.id
    if (!userId) return { error: 'Not logged in' }

    // Find user by share code
    const { data: targetUser, error: findError } = await db.getProfileByShareCode(shareCode)
    
    if (findError || !targetUser) {
      return { error: 'User not found with that code' }
    }

    if (targetUser.id === userId) {
      return { error: 'Cannot connect with yourself' }
    }

    const { data, error } = await db.createConnection({
      user_id: userId,
      connected_user_id: targetUser.id,
      status: 'pending',
    })

    if (error) {
      return { error: error.message }
    }

    return { data }
  },

  acceptConnection: async (connectionId) => {
    const { data, error } = await db.updateConnection(connectionId, 'accepted')
    if (data) {
        set((state) => ({
        pendingConnections: state.pendingConnections.filter(c => c.id !== connectionId),
        connections: [...state.connections, data],
      }))
    }
    return { data, error }
  },

  rejectConnection: async (connectionId) => {
    const { error } = await db.deleteConnection(connectionId)
    if (!error) {
        set((state) => ({
        pendingConnections: state.pendingConnections.filter(c => c.id !== connectionId),
      }))
    }
    return { error }
  },

  removeConnection: async (connectionId) => {
    const { error } = await db.deleteConnection(connectionId)
    if (!error) {
        set((state) => ({
        connections: state.connections.filter(c => c.id !== connectionId),
      }))
    }
    return { error }
  },

  // Profile Actions
  fetchProfile: async (userId) => {
    set((state) => ({ loading: { ...state.loading, profile: true } }))
    const { data, error } = await db.getProfile(userId)
    set({
      profile: data,
      loading: { ...get().loading, profile: false },
      errors: { ...get().errors, profile: error },
    })
  },

  updateProfile: async (updates) => {
    const userId = get().currentUser?.id
    if (!userId) return

    const { data, error } = await db.updateProfile(userId, updates)
    if (data) {
      set({ profile: data })
    }
    return { data, error }
  },

  // Vehicle Sharing
  shareVehicle: async (vehicleId, targetUserId) => {
    const userId = get().currentUser?.id
    if (!userId) return { error: 'Not logged in' }

    const { data, error } = await db.shareVehicle(vehicleId, userId, targetUserId)
    return { data, error }
  },

  unshareVehicle: async (vehicleId, targetUserId) => {
    const { error } = await db.unshareVehicle(vehicleId, targetUserId)
    return { error }
  },

  fetchSharedVehicles: async (userId) => {
    const { data, error } = await db.getSharedVehicles(userId)
    if (data) {
      set({ sharedVehicles: data })
    }
    return { data, error }
  },

  // For compatibility - get users (now just the current user + connections)
  get users() {
    const profile = get().profile
    const connections = get().connections
    const currentUser = get().currentUser
    
    const users = []
    
    if (profile && currentUser) {
      users.push({
        id: currentUser.id,
        name: profile.full_name || currentUser.email,
        email: currentUser.email,
        avatar: profile.avatar_initials || 'U',
        role: profile.role || 'member',
        color: profile.color || '#3b82f6',
      })
    }
    
    connections.forEach(conn => {
      if (conn.connected_user) {
        users.push({
          id: conn.connected_user.id,
          name: conn.connected_user.full_name,
          email: '', // Not exposed for privacy
          avatar: conn.connected_user.avatar_initials,
          role: 'member',
          color: conn.connected_user.color || '#3b82f6',
        })
      }
    })
    
    return users
  },

  // Clear all data (for logout)
  clearData: () => {
    set({
      vehicles: [],
      bookings: [],
      services: [],
      messages: [],
      usageLog: [],
      connections: [],
      pendingConnections: [],
      sharedVehicles: [],
      profile: null,
      currentUser: null,
      loading: {
        vehicles: false,
        bookings: false,
        services: false,
        messages: false,
        usageLog: false,
        connections: false,
        profile: false,
        global: false,
      },
      errors: {
        vehicles: null,
        bookings: null,
        services: null,
        messages: null,
        usageLog: null,
        connections: null,
        profile: null,
      },
    })
  },
}))
