import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Clock, Users, Star, CheckCircle2, PlayCircle,
  ArrowLeft, ChevronDown, ChevronRight, BookOpen,
  Shield, Zap,
} from 'lucide-react'
import { useCourse, useIsEnrolled, useEnroll, useCourseReviews, useAddReview } from '@/hooks/useCourse'
import { useAuthStore } from '@/stores/authStore'
import { COURSE_CATEGORY_LABELS, COURSE_LEVEL_LABELS, LEVEL_COLORS } from '@/types/course.types'
import StarRating from '@/components/common/StarRating'
import { formatDuration, cn } from '@/utils'
import { useState as useFormState } from 'react'

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const user         = useAuthStore((s) => s.user)

  const { data: course,  isLoading }    = useCourse(courseId)
  const { data: enrolled }              = useIsEnrolled(courseId)
  const { data: reviews = [] }          = useCourseReviews(courseId)
  const { mutate: enroll, isPending }   = useEnroll()

  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [showReviewForm, setShowReviewForm] = useState(false)

  if (isLoading) return <CourseDetailSkeleton />
  if (!course)   return <NotFound />

  const totalLessons = course.sections?.reduce(
    (sum, s) => sum + (s.lessons?.length ?? 0), 0
  ) ?? course.totalLessons

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">

      {/* Back */}
      <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors">
        <ArrowLeft size={15} /> কোর্স তালিকায় ফিরে যাও
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* ── Left: Course Info ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl aspect-video bg-gradient-to-br from-brand-900 to-surface-800">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.titleBn} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlayCircle size={64} className="text-brand-500/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2 mb-2">
                <span className="badge-brand text-xs">{COURSE_CATEGORY_LABELS[course.category]}</span>
                <span className={cn('badge text-xs border', LEVEL_COLORS[course.level])}>
                  {COURSE_LEVEL_LABELS[course.level]}
                </span>
                {course.isFree && (
                  <span className="badge bg-green-500/20 border border-green-500/30 text-green-400 text-xs">বিনামূল্যে</span>
                )}
              </div>
            </div>
          </div>

          {/* Title + Meta */}
          <div className="space-y-4">
            <h1 className="font-display text-2xl font-bold text-white leading-tight">
              {course.titleBn || course.title}
            </h1>
            {course.titleBn && (
              <p className="text-slate-500 text-sm">{course.title}</p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">{course.rating.toFixed(1)}</span>
                ({course.ratingCount} রিভিউ)
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {course.enrollCount.toLocaleString()} শিক্ষার্থী
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {formatDuration(course.totalDuration)}
              </span>
              <span className="flex items-center gap-1.5">
                <PlayCircle size={14} />
                {totalLessons} লেসন
              </span>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl w-fit">
              <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                {course.instructorName?.[0] ?? 'T'}
              </div>
              <div>
                <p className="text-xs text-slate-500">ইন্সট্রাক্টর</p>
                <p className="text-sm font-medium text-white">{course.instructorName}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-white text-lg">কোর্স সম্পর্কে</h2>
            <p className="text-slate-400 leading-relaxed">
              {course.descriptionBn || course.description}
            </p>
          </div>

          {/* What you'll learn */}
          <div className="card p-5 space-y-4">
            <h2 className="font-display font-semibold text-white">যা শিখবে</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {(course.tags ?? []).map((tag) => (
                <div key={tag} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={15} className="text-brand-400 shrink-0 mt-0.5" />
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-white text-lg">কারিকুলাম</h2>
            <p className="text-slate-500 text-sm">
              {course.sections?.length ?? 0} সেকশন • {totalLessons} লেসন • {formatDuration(course.totalDuration)}
            </p>

            <div className="space-y-2">
              {(course.sections ?? []).map((section) => {
                const isOpen = openSections.has(section.id)
                return (
                  <div key={section.id} className="card overflow-hidden">
                    <button
                      onClick={() => {
                        const next = new Set(openSections)
                        isOpen ? next.delete(section.id) : next.add(section.id)
                        setOpenSections(next)
                      }}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={16} className="text-brand-400 shrink-0" />
                        <span className="font-medium text-white text-sm">
                          {section.titleBn || section.title}
                        </span>
                        <span className="text-xs text-slate-500">
                          {section.lessons?.length ?? 0} লেসন
                        </span>
                      </div>
                      {isOpen
                        ? <ChevronDown  size={15} className="text-slate-500 shrink-0" />
                        : <ChevronRight size={15} className="text-slate-500 shrink-0" />
                      }
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-800">
                        {(section.lessons ?? []).map((lesson, idx) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-800/50 last:border-0"
                          >
                            <PlayCircle size={14} className="text-slate-600 shrink-0" />
                            <span className="text-sm text-slate-400 flex-1">{lesson.titleBn || lesson.title}</span>
                            <span className="text-xs text-slate-600">{formatDuration(lesson.duration)}</span>
                            {lesson.isFree && (
                              <span className="text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">বিনামূল্যে</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reviews */}
          <ReviewsSection
            reviews={reviews}
            courseId={courseId!}
            isEnrolled={!!enrolled}
            showForm={showReviewForm}
            onToggleForm={() => setShowReviewForm(!showReviewForm)}
          />
        </div>

        {/* ── Right: Enroll Card ── */}
        <div className="lg:col-span-1">
          <div className="card p-5 space-y-5 sticky top-24">
            {/* Price */}
            <div>
              {course.isFree ? (
                <p className="font-display text-3xl font-bold text-green-400">বিনামূল্যে</p>
              ) : (
                <p className="font-display text-3xl font-bold text-white">
                  ৳{course.price.toLocaleString()}
                </p>
              )}
            </div>

            {/* CTA */}
            {enrolled ? (
              <Link
                to={`/courses/${courseId}/learn`}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                <PlayCircle size={17} /> শেখা চালিয়ে যাও
              </Link>
            ) : user ? (
              <button
                onClick={() => enroll(courseId!)}
                disabled={isPending}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {isPending ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : <Zap size={17} />}
                {isPending ? 'প্রক্রিয়া হচ্ছে...' : 'এখনই ভর্তি হও'}
              </button>
            ) : (
              <Link
                to="/auth/register"
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                ভর্তি হতে লগইন করো
              </Link>
            )}

            {/* Features */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              {[
                { icon: PlayCircle,    text: `${totalLessons} লেসন` },
                { icon: Clock,        text: formatDuration(course.totalDuration) },
                { icon: Shield,       text: 'Lifetime access' },
                { icon: CheckCircle2, text: 'Completion Certificate' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-slate-400">
                  <Icon size={14} className="text-brand-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Reviews Section ────────────────────────────────────────────────────────────
function ReviewsSection({ reviews, courseId, isEnrolled, showForm, onToggleForm }: {
  reviews:       ReturnType<typeof useCourseReviews>['data'] extends (infer T)[] | undefined ? NonNullable<T>[] : never
  courseId:      string
  isEnrolled:    boolean
  showForm:      boolean
  onToggleForm:  () => void
}) {
  const user = useAuthStore((s) => s.user)
  const { mutate: addReview, isPending } = useAddReview()
  const [rating,  setRating]  = useState(5)
  const [comment, setComment] = useState('')

  function submitReview() {
    if (!user || !comment.trim()) return
    addReview({
      courseId,
      review: {
        userId:    user.uid,
        userName:  user.displayName,
        userPhoto: user.photoURL ?? '',
        rating,
        comment,
      },
    }, {
      onSuccess: () => {
        setComment('')
        setRating(5)
        onToggleForm()
      },
    })
  }

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-white text-lg">
          রিভিউ ({reviews.length})
        </h2>
        {isEnrolled && !showForm && (
          <button onClick={onToggleForm} className="btn-secondary text-sm">রিভিউ লিখুন</button>
        )}
      </div>

      {/* Average */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 p-4 card">
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-white">{avg.toFixed(1)}</p>
            <StarRating rating={avg} size={14} />
            <p className="text-xs text-slate-500 mt-1">{reviews.length} রিভিউ</p>
          </div>
        </div>
      )}

      {/* Write review form */}
      {showForm && (
        <div className="card p-4 space-y-3">
          <p className="font-medium text-white text-sm">তোমার রিভিউ</p>
          <StarRating rating={rating} editable onChange={setRating} size={24} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="কোর্স সম্পর্কে তোমার মতামত লেখো..."
            className="input-field resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={submitReview}
              disabled={isPending || !comment.trim()}
              className="btn-primary text-sm flex items-center gap-2"
            >
              {isPending ? 'পাঠানো হচ্ছে...' : 'রিভিউ পাঠাও'}
            </button>
            <button onClick={onToggleForm} className="btn-secondary text-sm">বাতিল</button>
          </div>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold shrink-0">
              {r.userName?.[0] ?? 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">{r.userName}</p>
                <StarRating rating={r.rating} size={12} />
              </div>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">{r.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CourseDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 animate-pulse space-y-6">
      <div className="h-4 bg-slate-800 rounded w-32" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-slate-800 rounded-2xl" />
          <div className="h-6 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
        </div>
        <div className="card p-5 h-64" />
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <p className="text-slate-400 text-lg">কোর্স পাওয়া যায়নি</p>
        <Link to="/courses" className="btn-primary">কোর্স তালিকায় ফিরে যাও</Link>
      </div>
    </div>
  )
}
