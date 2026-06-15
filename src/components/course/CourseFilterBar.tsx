import { Search, SlidersHorizontal, X } from 'lucide-react'
import { COURSE_CATEGORY_LABELS, COURSE_LEVEL_LABELS, type CourseCategory, type CourseLevel } from '@/types/course.types'
import { cn } from '@/utils'

interface Filters {
  search:   string
  category: CourseCategory | ''
  level:    CourseLevel | ''
  isFree:   boolean | null
}

interface Props {
  filters:   Filters
  onChange:  (f: Filters) => void
  total:     number
}

export default function CourseFilterBar({ filters, onChange, total }: Props) {
  const hasActive = filters.category || filters.level || filters.isFree !== null || filters.search

  function clear() {
    onChange({ search: '', category: '', level: '', isFree: null })
  }

  return (
    <div className="space-y-4">
      {/* Search + clear */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="কোর্স খুঁজুন..."
            className="input-field pl-10 w-full"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {hasActive && (
          <button onClick={clear} className="btn-secondary flex items-center gap-2 text-sm whitespace-nowrap">
            <X size={14} /> ফিল্টার মুছো
          </button>
        )}
      </div>

      {/* Filter chips row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <SlidersHorizontal size={13} /> ফিল্টার:
        </span>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value as CourseCategory | '' })}
          className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer"
        >
          <option value="">সব বিভাগ</option>
          {(Object.keys(COURSE_CATEGORY_LABELS) as CourseCategory[]).map((c) => (
            <option key={c} value={c} className="bg-surface-900">{COURSE_CATEGORY_LABELS[c]}</option>
          ))}
        </select>

        {/* Level */}
        <select
          value={filters.level}
          onChange={(e) => onChange({ ...filters, level: e.target.value as CourseLevel | '' })}
          className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer"
        >
          <option value="">সব লেভেল</option>
          {(Object.keys(COURSE_LEVEL_LABELS) as CourseLevel[]).map((l) => (
            <option key={l} value={l} className="bg-surface-900">{COURSE_LEVEL_LABELS[l]}</option>
          ))}
        </select>

        {/* Free toggle */}
        <button
          onClick={() => onChange({ ...filters, isFree: filters.isFree === true ? null : true })}
          className={cn(
            'text-xs px-3 py-1.5 rounded-lg border transition-all',
            filters.isFree === true
              ? 'bg-green-500/15 border-green-500/30 text-green-400'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300',
          )}
        >
          বিনামূল্যে
        </button>
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-500">
        {total} টি কোর্স পাওয়া গেছে
        {filters.search && <span> "{filters.search}" এর জন্য</span>}
      </p>
    </div>
  )
}
