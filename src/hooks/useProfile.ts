import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile } from '@/services/firebase/auth'
import {
  updateUserProfile,
  uploadProfilePhoto,
  getAllProgress,
} from '@/services/firebase/user'
import { useAuthStore } from '@/stores/authStore'
import type { UserProfile } from '@/types'
import toast from 'react-hot-toast'

// ─── Fetch profile ─────────────────────────────────────────────────────────────
export function useProfile(uid?: string) {
  return useQuery({
    queryKey: ['profile', uid],
    queryFn:  () => getUserProfile(uid!),
    enabled:  !!uid,
    staleTime: 1000 * 60 * 5,
  })
}

// ─── Update profile ────────────────────────────────────────────────────────────
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { user, setUser } = useAuthStore()

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) =>
      updateUserProfile(user!.uid, data),
    onSuccess: async () => {
      const updated = await getUserProfile(user!.uid)
      setUser(updated)
      queryClient.invalidateQueries({ queryKey: ['profile', user!.uid] })
      toast.success('প্রোফাইল আপডেট হয়েছে ✓')
    },
    onError: () => {
      toast.error('আপডেট ব্যর্থ হয়েছে')
    },
  })
}

// ─── Upload photo ──────────────────────────────────────────────────────────────
export function useUploadPhoto() {
  const [progress, setProgress] = useState(0)
  const queryClient = useQueryClient()
  const { user, setUser } = useAuthStore()

  const mutation = useMutation({
    mutationFn: (file: File) => {
      setProgress(30)
      return uploadProfilePhoto(user!.uid, file)
    },
    onSuccess: async (url) => {
      setProgress(100)
      const updated = await getUserProfile(user!.uid)
      setUser({ ...updated!, photoURL: url })
      queryClient.invalidateQueries({ queryKey: ['profile', user!.uid] })
      toast.success('ছবি আপলোড হয়েছে ✓')
      setTimeout(() => setProgress(0), 1000)
    },
    onError: () => {
      setProgress(0)
      toast.error('ছবি আপলোড ব্যর্থ হয়েছে')
    },
  })

  return { ...mutation, progress }
}

// ─── Learning progress ────────────────────────────────────────────────────────
export function useLearningProgress() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['progress', user?.uid],
    queryFn:  () => getAllProgress(user!.uid),
    enabled:  !!user?.uid,
  })
}
