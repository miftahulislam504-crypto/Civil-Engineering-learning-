import { Link } from 'react-router-dom'
import { Clock, Users, Star, PlayCircle, FileText, BookOpen, Lock } from 'lucide-react'
import type { Course } from '@/types/course.types'
import { COURSE_CATEGORY_LABELS, COURSE_LEVEL_LABELS, LEVEL_COLORS } from '@/types/course.types'
import { formatDuration, cn } from '@/utils'

interface Props {
  course:   Course
  progress?: number  // 0-100
}

const TYPE_ICONS = {
  video:  PlayCircle,
  pdf:    FileText,
  text:   BookOpen,
  mixed:  PlayCircle,
}

export default function CourseCard({ course, progress }: Props) {
  const LevelBadgeClass = LEVEL_COLORS[course.level]
  const TypeIcon        = TYPE_ICONS[course.type] ?? PlayCircle

  return (
    <Link
      to={`/courses/${course.id}`}
      className="card-hover flex flex-col group overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-brand-900 to-surface-800 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.titleBn || course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TypeIcon size={40} className="text-brand-500/40" />
          </div>
        )}

        {/* Free badge */}
        {course.isFree && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            বিনামূল্যে
          </span>
        )}

        {/* Progress bar */}
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-brand-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Type icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <TypeIcon size={22} className="text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category + Level */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge-brand text-[10px]">
            {COURSE_CATEGORY_LABELS[course.category]}
          </span>
          <span className={cn('badge text-[10px] border', LevelBadgeClass)}>
            {COURSE_LEVEL_LABELS[course.level]}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-display font-semibold text-white text-sm leading-tight group-hover:text-brand-400 transition-colors line-clamp-2">
            {course.titleBn || course.title}
          </h3>
          {course.titleBn && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{course.title}</p>
          )}
        </div>

        {/* Instructor */}
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-[8px] font-bold shrink-0">
            {course.instructorName?.[0] ?? 'T'}
          </span>
          {course.instructorName}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-800">
          {/* Rating */}
          <span className="flex items-center gap-1">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-slate-300 font-medium">{course.rating.toFixed(1)}</span>
            <span>({course.ratingCount})</span>
          </span>

          {/* Duration */}
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formatDuration(course.totalDuration)}
          </span>

          {/* Lessons */}
          <span className="flex items-center gap-1">
            <PlayCircle size={11} />
            {course.totalLessons} লেসন
          </span>

          {/* Enroll count */}
          <span className="flex items-center gap-1 ml-auto">
            <Users size={11} />
            {course.enrollCount.toLocaleString()}
          </span>
        </div>

        {/* Progress text */}
        {progress !== undefined && (
          <p className="text-xs text-brand-400 font-medium">
            {progress === 100 ? '✓ সম্পন্ন' : `${progress}% সম্পন্ন`}
          </p>
        )}
      </div>
    </Link>
  )
}
