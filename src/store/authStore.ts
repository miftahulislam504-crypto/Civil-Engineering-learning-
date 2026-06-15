import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile } from '@/types'

interface AuthStore {
  user:      UserProfile | null
  isLoading: boolean
  error:     string | null

  setUser:      (user: UserProfile | null) => void
  setLoading:   (loading: boolean) => void
  setError:     (error: string | null) => void
  clearAuth:    () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user:      null,
      isLoading: true,
      error:     null,

      setUser:    (user)    => set({ user, isLoading: false, error: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError:   (error)   => set({ error, isLoading: false }),
      clearAuth:  ()        => set({ user: null, isLoading: false, error: null }),
    }),
    {
      name: 'enginex-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
