import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCourses, getCourse, getCourseLessons,
  enrollCourse, isEnrolled, getCourseReviews, addReview,
  getFeaturedCourses,
} from '@/services/firebase/course'
import { useAuthStore } from '@/stores/authStore'
import { addPoints } from '@/services/firebase/user'
import { POINTS } from '@/constants/points'
import type { CourseCategory, CourseLevel, CourseReview } from '@/types/course.types'
import toast from 'react-hot-toast'

// ─── Course List ───────────────────────────────────────────────────────────────
export function useCourses(filters?: {
  category?: CourseCategory
  level?:    CourseLevel
  isFree?:   boolean
}) {
  return useQuery({
    queryKey:  ['courses', filters],
    queryFn:   () => getCourses(filters),
    staleTime: 1000 * 60 * 5,
  })
}

// ─── Featured ─────────────────────────────────────────────────────────────────
export function useFeaturedCourses(count = 6) {
  return useQuery({
    queryKey:  ['courses', 'featured', count],
    queryFn:   () => getFeaturedCourses(count),
    staleTime: 1000 * 60 * 10,
  })
}

// ─── Single Course ─────────────────────────────────────────────────────────────
export function useCourse(courseId?: string) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn:  () => getCourse(courseId!),
    enabled:  !!courseId,
  })
}

// ─── Lessons ──────────────────────────────────────────────────────────────────
export function useCourseLessons(courseId?: string) {
  return useQuery({
    queryKey: ['lessons', courseId],
    queryFn:  () => getCourseLessons(courseId!),
    enabled:  !!courseId,
  })
}

// ─── Enrollment check ─────────────────────────────────────────────────────────
export function useIsEnrolled(courseId?: string) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['enrolled', user?.uid, courseId],
    queryFn:  () => isEnrolled(user!.uid, courseId!),
    enabled:  !!user?.uid && !!courseId,
  })
}

// ─── Enroll Mutation ──────────────────────────────────────────────────────────
export function useEnroll() {
  const queryClient = useQueryClient()
  const user        = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (courseId: string) => enrollCourse(user!.uid, courseId),
    onSuccess: async (_, courseId) => {
      await addPoints(user!.uid, POINTS.FIRST_LOGIN) // 5 pts for enrolling
      queryClient.invalidateQueries({ queryKey: ['enrolled', user!.uid, courseId] })
      queryClient.invalidateQueries({ queryKey: ['profile', user!.uid] })
      toast.success('কোর্সে সফলভাবে ভর্তি হয়েছো ✓')
    },
    onError: () => toast.error('ভর্তি ব্যর্থ হয়েছে'),
  })
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
export function useCourseReviews(courseId?: string) {
  return useQuery({
    queryKey: ['reviews', courseId],
    queryFn:  () => getCourseReviews(courseId!),
    enabled:  !!courseId,
  })
}

export function useAddReview() {
  const queryClient = useQueryClient()
  const user        = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: ({
      courseId, review,
    }: {
      courseId: string
      review: Omit<CourseReview, 'id' | 'courseId' | 'createdAt'>
    }) => addReview(courseId, review),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', courseId] })
      queryClient.invalidateQueries({ queryKey: ['course',  courseId] })
      toast.success('রিভিউ যোগ হয়েছে ✓')
    },
    onError: () => toast.error('রিভিউ যোগ ব্যর্থ হয়েছে'),
  })
}
