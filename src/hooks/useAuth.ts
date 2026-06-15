import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, getUserProfile } from '@/services/firebase/auth'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const { user, isLoading, error, setUser, setLoading, clearAuth } = useAuthStore()

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid)
          setUser(profile)
        } catch {
          setUser(null)
        }
      } else {
        clearAuth()
      }
    })
    return () => unsubscribe()
  }, [])

  return { user, isLoading, error }
}
