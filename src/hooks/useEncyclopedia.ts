import { useQuery } from '@tanstack/react-query'
import {
  getTopics, getTopicBySlug, getRelatedTopics,
  getPopularTopics, searchTopics, incrementView,
} from '@/services/firebase/encyclopedia'
import { addRecentlyViewed, saveArticle, unsaveArticle } from '@/services/firebase/user'
import { useAuthStore } from '@/stores/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { EncyclopediaCategory } from '@/types/encyclopedia.types'
import toast from 'react-hot-toast'

// ─── Topics list ───────────────────────────────────────────────────────────────
export function useTopics(filters?: {
  category?:    EncyclopediaCategory
  subcategory?: string
}) {
  return useQuery({
    queryKey:  ['encyclopedia', 'list', filters],
    queryFn:   () => getTopics(filters),
    staleTime: 1000 * 60 * 10,
  })
}

// ─── Popular topics ────────────────────────────────────────────────────────────
export function usePopularTopics(count = 8) {
  return useQuery({
    queryKey:  ['encyclopedia', 'popular', count],
    queryFn:   () => getPopularTopics(count),
    staleTime: 1000 * 60 * 10,
  })
}

// ─── Single topic by slug ──────────────────────────────────────────────────────
export function useTopic(slug?: string) {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['encyclopedia', 'topic', slug],
    queryFn:  async () => {
      const topic = await getTopicBySlug(slug!)
      if (topic) {
        // Track view
        void incrementView(topic.id)
        if (user?.uid) void addRecentlyViewed(user.uid, topic.id)
      }
      return topic
    },
    enabled:   !!slug,
    staleTime: 1000 * 60 * 5,
  })
}

// ─── Related topics ────────────────────────────────────────────────────────────
export function useRelatedTopics(ids?: string[]) {
  return useQuery({
    queryKey: ['encyclopedia', 'related', ids],
    queryFn:  () => getRelatedTopics(ids!),
    enabled:  !!ids?.length,
  })
}

// ─── Save / unsave article ─────────────────────────────────────────────────────
export function useSaveArticle() {
  const user        = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ topicId, saved }: { topicId: string; saved: boolean }) =>
      saved
        ? unsaveArticle(user!.uid, topicId)
        : saveArticle(user!.uid, topicId),
    onSuccess: (_, { saved }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user!.uid] })
      toast.success(saved ? 'সেভ থেকে সরানো হয়েছে' : 'আর্টিকেল সেভ করা হয়েছে ✓')
    },
  })
}
