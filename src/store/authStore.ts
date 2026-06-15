import { create } from 'zustand'
import { type UserProfile } from '@/types'

interface AuthState {
  user:       UserProfile | null
  loading:    boolean
  isLoading:  boolean
  error:      string | null
  setUser:    (user: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  clearAuth:  () => void
  logout:     () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:       null,
  loading:    true,
  isLoading:  true,
  error:      null,
  setUser:    (user)    => set({ user, isLoading: false, loading: false, error: null }),
  setLoading: (loading) => set({ loading, isLoading: loading }),
  clearAuth:  ()        => set({ user: null, loading: false, isLoading: false, error: null }),
  logout:     ()        => set({ user: null, loading: false, isLoading: false, error: null }),
}))
