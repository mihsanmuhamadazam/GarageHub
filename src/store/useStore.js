import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialCars = [
  {
    id: '1',
    name: 'Family SUV',
    make: 'Toyota',
    model: 'RAV4',
    year: 2023,
    plate: 'ABC 1234',
    color: '#1e3a5f',
    status: 'available',
    currentDriver: null,
    mileage: 15420,
    fuelLevel: 75,
    image: '/cars/suv.png',
    type: 'suv',
  },
  {
    id: '2',
    name: 'City Runner',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    plate: 'XYZ 5678',
    color: '#8b1a1a',
    status: 'in-use',
    currentDriver: 'Sarah',
    mileage: 32100,
    fuelLevel: 45,
    image: '/cars/sedan.png',
    type: 'sedan',
  },
  {
    id: '3',
    name: 'Weekend Cruiser',
    make: 'BMW',
    model: '3 Series',
    year: 2021,
    plate: 'BMW 9999',
    color: '#2d2d2d',
    status: 'maintenance',
    currentDriver: null,
    mileage: 48500,
    fuelLevel: 20,
    image: '/cars/luxury.png',
    type: 'luxury',
  },
]

const initialUsers = [
  { id: '1', name: 'James Wilson', email: 'james@garagehub.com', avatar: 'JW', role: 'admin', color: '#3b82f6' },
  { id: '2', name: 'Sarah Miller', email: 'sarah@garagehub.com', avatar: 'SM', role: 'member', color: '#ec4899' },
  { id: '3', name: 'Mike Johnson', email: 'mike@garagehub.com', avatar: 'MJ', role: 'member', color: '#10b981' },
  { id: '4', name: 'Emma Davis', email: 'emma@garagehub.com', avatar: 'ED', role: 'member', color: '#8b5cf6' },
]

const initialBookings = [
  {
    id: '1',
    carId: '1',
    userId: '1',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3600000 * 2).toISOString(),
    purpose: 'Grocery shopping',
  },
  {
    id: '2',
    carId: '2',
    userId: '2',
    startDate: new Date(Date.now() - 3600000).toISOString(),
    endDate: new Date(Date.now() + 3600000 * 4).toISOString(),
    purpose: 'College classes',
  },
]

const initialServices = [
  {
    id: '1',
    carId: '1',
    type: 'Oil Change',
    date: '2024-11-15',
    mileage: 15000,
    cost: 65,
    notes: 'Used synthetic oil',
    nextDue: 20000,
  },
  {
    id: '2',
    carId: '1',
    type: 'Tire Rotation',
    date: '2024-10-20',
    mileage: 14000,
    cost: 40,
    notes: 'All tires in good condition',
    nextDue: 20000,
  },
  {
    id: '3',
    carId: '2',
    type: 'Brake Inspection',
    date: '2024-11-01',
    mileage: 31500,
    cost: 0,
    notes: 'Pads at 60%, good for another 15k miles',
    nextDue: 45000,
  },
  {
    id: '4',
    carId: '3',
    type: 'Oil Change',
    date: '2024-09-10',
    mileage: 45000,
    cost: 85,
    notes: 'BMW recommended oil',
    nextDue: 50000,
  },
  {
    id: '5',
    carId: '3',
    type: 'Engine Check',
    date: '2024-12-01',
    mileage: 48500,
    cost: 150,
    notes: 'Minor sensor issue detected - in maintenance',
    nextDue: null,
  },
]

const initialMessages = [
  {
    id: '1',
    carId: '1',
    userId: '2',
    message: 'Please fill up the tank when you\'re done.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    type: 'note',
  },
  {
    id: '2',
    carId: '1',
    userId: '1',
    message: 'Will do. Also noticed the windshield wiper fluid is low.',
    timestamp: new Date(Date.now() - 82800000).toISOString(),
    type: 'note',
  },
  {
    id: '3',
    carId: '2',
    userId: '2',
    message: 'Can someone bring my laptop charger when they pick up the car? Left it at home.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'request',
  },
  {
    id: '4',
    carId: '3',
    userId: '3',
    message: 'How long will the BMW be in maintenance?',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'question',
  },
]

const initialUsageLog = [
  { id: '1', carId: '1', userId: '1', date: '2024-12-01', distance: 45, duration: 90 },
  { id: '2', carId: '1', userId: '2', date: '2024-12-02', distance: 30, duration: 60 },
  { id: '3', carId: '2', userId: '2', date: '2024-12-01', distance: 65, duration: 120 },
  { id: '4', carId: '2', userId: '2', date: '2024-12-02', distance: 55, duration: 100 },
  { id: '5', carId: '1', userId: '1', date: '2024-12-03', distance: 80, duration: 150 },
  { id: '6', carId: '2', userId: '3', date: '2024-12-03', distance: 25, duration: 45 },
  { id: '7', carId: '1', userId: '2', date: '2024-12-04', distance: 40, duration: 75 },
  { id: '8', carId: '3', userId: '1', date: '2024-11-28', distance: 120, duration: 180 },
  { id: '9', carId: '3', userId: '2', date: '2024-11-29', distance: 90, duration: 140 },
  { id: '10', carId: '1', userId: '3', date: '2024-12-05', distance: 35, duration: 60 },
  { id: '11', carId: '2', userId: '1', date: '2024-12-05', distance: 50, duration: 85 },
  { id: '12', carId: '1', userId: '2', date: '2024-12-06', distance: 28, duration: 50 },
  { id: '13', carId: '1', userId: '1', date: '2024-12-07', distance: 62, duration: 95 },
  { id: '14', carId: '2', userId: '3', date: '2024-12-07', distance: 38, duration: 70 },
]

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      isAuthenticated: false,
      currentUser: null,
      
      // Data State
      cars: initialCars,
      users: initialUsers,
      bookings: initialBookings,
      services: initialServices,
      messages: initialMessages,
      usageLog: initialUsageLog,

      // Auth Actions
      login: (email, password) => {
        const user = get().users.find(u => u.email === email)
        if (user) {
          set({ isAuthenticated: true, currentUser: user })
          return { success: true }
        }
        return { success: false, error: 'Invalid credentials' }
      },
      
      logout: () => {
        set({ isAuthenticated: false, currentUser: null })
      },
      
      signup: (name, email, password) => {
        const existingUser = get().users.find(u => u.email === email)
        if (existingUser) {
          return { success: false, error: 'Email already exists' }
        }
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          avatar: initials,
          role: 'member',
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        }
        set((state) => ({
          users: [...state.users, newUser],
          isAuthenticated: true,
          currentUser: newUser,
        }))
        return { success: true }
      },

      // Car Actions
      addCar: (car) =>
        set((state) => ({
          cars: [...state.cars, { ...car, id: Date.now().toString() }],
        })),
      
      updateCar: (id, updates) =>
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === id ? { ...car, ...updates } : car
          ),
        })),
      
      deleteCar: (id) =>
        set((state) => ({
          cars: state.cars.filter((car) => car.id !== id),
        })),

      toggleCarStatus: (id, status, driver = null) =>
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === id ? { ...car, status, currentDriver: driver } : car
          ),
        })),

      // Booking Actions
      addBooking: (booking) =>
        set((state) => ({
          bookings: [...state.bookings, { ...booking, id: Date.now().toString() }],
        })),
      
      updateBooking: (id, updates) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, ...updates } : booking
          ),
        })),
      
      deleteBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.filter((booking) => booking.id !== id),
        })),

      // Service Actions
      addService: (service) =>
        set((state) => ({
          services: [...state.services, { ...service, id: Date.now().toString() }],
        })),
      
      updateService: (id, updates) =>
        set((state) => ({
          services: state.services.map((service) =>
            service.id === id ? { ...service, ...updates } : service
          ),
        })),
      
      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((service) => service.id !== id),
        })),

      // Message Actions
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...message, id: Date.now().toString(), timestamp: new Date().toISOString() },
          ],
        })),
      
      deleteMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((message) => message.id !== id),
        })),

      // Usage Log Actions
      addUsageLog: (log) =>
        set((state) => ({
          usageLog: [...state.usageLog, { ...log, id: Date.now().toString() }],
        })),

      // User Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, { ...user, id: Date.now().toString() }],
        })),
    }),
    {
      name: 'garagehub-storage',
    }
  )
)
