import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getLibraryItems, getLibraryItem, getStandards,
  searchLibrary, incrementDownload,
} from '@/services/firebase/library'
import { addBookmark, removeBookmark } from '@/services/firebase/user'
import { useAuthStore } from '@/stores/authStore'
import type { LibraryItemType, StandardCode } from '@/types/library.types'
import toast from 'react-hot-toast'

// ─── Library Items ─────────────────────────────────────────────────────────────
export function useLibraryItems(filters?: {
  type?:     LibraryItemType
  category?: string
  language?: 'bn' | 'en' | 'both'
}) {
  return useQuery({
    queryKey:  ['library', 'items', filters],
    queryFn:   () => getLibraryItems(filters),
    staleTime: 1000 * 60 * 10,
  })
}

// ─── Single Item ───────────────────────────────────────────────────────────────
export function useLibraryItem(id?: string) {
  return useQuery({
    queryKey: ['library', 'item', id],
    queryFn:  () => getLibraryItem(id!),
    enabled:  !!id,
  })
}

// ─── Standards ─────────────────────────────────────────────────────────────────
export function useStandards(code?: StandardCode) {
  return useQuery({
    queryKey:  ['library', 'standards', code],
    queryFn:   () => getStandards(code),
    staleTime: 1000 * 60 * 30,
  })
}

// ─── Download ─────────────────────────────────────────────────────────────────
export function useDownload() {
  const [downloading, setDownloading] = useState<string | null>(null)

  async function download(item: { id: string; fileUrl: string; title: string }) {
    if (!item.fileUrl) { toast.error('ফাইল পাওয়া যাচ্ছে না'); return }
    setDownloading(item.id)
    try {
      await incrementDownload(item.id)
      const a = document.createElement('a')
      a.href     = item.fileUrl
      a.download = item.title
      a.target   = '_blank'
      a.click()
      toast.success('ডাউনলোড শুরু হয়েছে ✓')
    } catch {
      toast.error('ডাউনলোড ব্যর্থ হয়েছে')
    } finally {
      setDownloading(null)
    }
  }

  return { download, downloading }
}

// ─── Bookmark ─────────────────────────────────────────────────────────────────
export function useLibraryBookmark() {
  const user        = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, bookmarked }: { id: string; bookmarked: boolean }) =>
      bookmarked
        ? removeBookmark(user!.uid, id)
        : addBookmark(user!.uid, id),
    onSuccess: (_, { bookmarked }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user!.uid] })
      toast.success(bookmarked ? 'বুকমার্ক সরানো হয়েছে' : 'বুকমার্ক করা হয়েছে ✓')
    },
  })
}
