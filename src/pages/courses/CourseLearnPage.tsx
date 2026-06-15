import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Award } from 'lucide-react'
import { useCourse } from '@/hooks/useCourse'
import { useIsEnrolled } from '@/hooks/useCourse'
import { useAuthStore } from '@/stores/authStore'
import { markLessonComplete, getCourseProgress } from '@/services/firebase/user'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import CoursePlayer from '@/components/course/CoursePlayer'
import type { Lesson } from '@/types/course.types'
import PageLoader from '@/components/common/PageLoader'
import toast from 'react-hot-toast'

export default function CourseLearnPage() {
  const { courseId }   = useParams<{ courseId: string }>()
  const user           = useAuthStore((s) => s.user)
  const queryClient    = useQueryClient()

  const { data: course,   isLoading: courseLoading } = useCourse(courseId)
  const { data: enrolled, isLoading: enrollLoading } = useIsEnrolled(courseId)

  // Course progress
  const { data: progress } = useQuery({
    queryKey: ['course-progress', user?.uid, courseId],
    queryFn:  () => getCourseProgress(user!.uid, courseId!),
    enabled:  !!user?.uid && !!courseId,
  })

  // Flatten all lessons across sections
  const allLessons: Lesson[] = course?.sections?.flatMap((s) => s.lessons ?? []) ?? []

  // Active lesson state
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    if (!allLessons.length) return
    // Resume from last accessed lesson
    if (progress?.lastAccessedLesson) {
      const last = allLessons.find((l) => l.id === progress.lastAccessedLesson)
      if (last) { setCurrentLesson(last); return }
    }
    setCurrentLesson(allLessons[0])
  }, [course, progress])

  async function handleComplete(lessonId: string) {
    if (!user || !courseId) return
    try {
      await markLessonComplete(user.uid, courseId, lessonId, allLessons.length)
      queryClient.invalidateQueries({ queryKey: ['course-progress', user.uid, courseId] })

      const wasLastLesson = allLessons[allLessons.length - 1]?.id === lessonId
      if (wasLastLesson) {
        toast.success('🎉 কোর্স সম্পন্ন! সার্টিফিকেট পেতে প্রোফাইল দেখো।', { duration: 5000 })
      } else {
        toast.success('লেসন সম্পন্ন ✓ +5 পয়েন্ট')
        // Auto-advance to next
        const idx  = allLessons.findIndex((l) => l.id === lessonId)
        const next = allLessons[idx + 1]
        if (next) setTimeout(() => setCurrentLesson(next), 800)
      }
    } catch {
      toast.error('প্রগ্রেস সেভ ব্যর্থ হয়েছে')
    }
  }

  if (courseLoading || enrollLoading) return <PageLoader />
  if (!enrolled) return <Navigate to={`/courses/${courseId}`} replace />
  if (!course)   return <Navigate to="/courses" replace />

  const completedLessons: string[] = progress?.completedLessons ?? []
  const progressPct                = progress?.progressPercent ?? 0

  return (
    <div className="flex flex-col h-screen bg-surface-900">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-surface-900/90 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/courses/${courseId}`}
            className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <p className="font-display font-semibold text-white text-sm truncate">
              {course.titleBn || course.title}
            </p>
            {currentLesson && (
              <p className="text-xs text-slate-500 truncate">
                {currentLesson.titleBn || currentLesson.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span>{progressPct}%</span>
          </div>

          {progress?.isCompleted && (
            <Link to="/certificates" className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
              <Award size={13} /> সার্টিফিকেট
            </Link>
          )}
        </div>
      </div>

      {/* Player */}
      <div className="flex-1 overflow-hidden">
        <CoursePlayer
          sections={course.sections ?? []}
          allLessons={allLessons}
          currentLesson={currentLesson}
          completedLessons={completedLessons}
          onSelectLesson={setCurrentLesson}
          onComplete={handleComplete}
        />
      </div>
    </div>
  )
}
