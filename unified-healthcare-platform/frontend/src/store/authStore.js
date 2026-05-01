import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      role: null, // 'doctor', 'radiologist', 'admin', 'patient'
      
      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true,
        role: userData.role 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        role: null 
      }),
      
      updateUser: (userData) => set((state) => ({ 
        user: { ...state.user, ...userData } 
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
)
