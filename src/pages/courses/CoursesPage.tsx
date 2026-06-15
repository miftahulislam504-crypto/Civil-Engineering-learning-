import { useState, useMemo } from 'react'
import { BookOpen } from 'lucide-react'
import { useCourses } from '@/hooks/useCourse'
import CourseCard from '@/components/course/CourseCard'
import CourseFilterBar from '@/components/course/CourseFilterBar'
import type { CourseCategory, CourseLevel } from '@/types/course.types'

interface Filters {
  search:   string
  category: CourseCategory | ''
  level:    CourseLevel | ''
  isFree:   boolean | null
}

export default function CoursesPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '', category: '', level: '', isFree: null,
  })

  const { data: courses = [], isLoading } = useCourses({
    category: filters.category || undefined,
    level:    filters.level    || undefined,
    isFree:   filters.isFree   ?? undefined,
  })

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!filters.search) return courses
    const q = filters.search.toLowerCase()
    return courses.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.titleBn?.toLowerCase().includes(q) ||
      c.tags?.some((t) => t.toLowerCase().includes(q))
    )
  }, [courses, filters.search])

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
            <BookOpen size={22} className="text-brand-400" />
          </div>
          কোর্সসমূহ
        </h1>
        <p className="text-slate-400 mt-2">
          বাংলায় Civil Engineering শেখার সেরা কোর্স সংগ্রহ
        </p>
      </div>

      {/* Filters */}
      <CourseFilterBar
        filters={filters}
        onChange={setFilters}
        total={filtered.length}
      />

      {/* Grid */}
      {isLoading ? (
        <CourseGridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}

function CourseGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card overflow-hidden animate-pulse">
          <div className="aspect-video bg-slate-800" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-slate-800 rounded w-2/3" />
            <div className="h-4 bg-slate-800 rounded" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
        <BookOpen size={28} className="text-slate-600" />
      </div>
      <p className="text-slate-400 font-medium mb-1">কোনো কোর্স পাওয়া যায়নি</p>
      <p className="text-slate-600 text-sm">ফিল্টার পরিবর্তন করে আবার চেষ্টা করো</p>
    </div>
  )
}
