import { useState, useMemo } from 'react'
import { Search, Grid3X3, List, BookMarked, X, LayoutGrid } from 'lucide-react'
import { useTopics } from '@/hooks/useEncyclopedia'
import { searchTopics } from '@/services/firebase/encyclopedia'
import TopicCard from '@/components/encyclopedia/TopicCard'
import {
  ENC_CATEGORY_LABELS, ENC_CATEGORY_ICONS, ENC_CATEGORY_COLORS,
  ENC_SUBCATEGORIES, type EncyclopediaCategory,
} from '@/types/encyclopedia.types'
import { cn } from '@/utils'

type ViewMode = 'grid' | 'list'

export default function EncyclopediaPage() {
  const [search,      setSearch]      = useState('')
  const [category,    setCategory]    = useState<EncyclopediaCategory | ''>('')
  const [subcategory, setSubcategory] = useState('')
  const [view,        setView]        = useState<ViewMode>('grid')

  const { data: topics = [], isLoading } = useTopics({
    category:    category || undefined,
    subcategory: subcategory || undefined,
  })

  const filtered = useMemo(
    () => searchTopics(topics, search),
    [topics, search],
  )

  const subcats = category ? (ENC_SUBCATEGORIES[category] ?? []) : []

  function clearFilters() {
    setSearch(''); setCategory(''); setSubcategory('')
  }

  const hasFilter = search || category || subcategory

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <BookMarked size={22} className="text-purple-400" />
            </div>
            Civil Encyclopedia
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            বাংলায় Civil Engineering-এর সম্পূর্ণ জ্ঞানভান্ডার
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => setView('grid')}
            className={cn('p-2 rounded-md transition-all', view === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-300')}
          >
            <Grid3X3 size={15} />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn('p-2 rounded-md transition-all', view === 'list' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-300')}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* ── Category Cards ── */}
      {!category && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(Object.keys(ENC_CATEGORY_LABELS) as EncyclopediaCategory[]).map((cat) => {
            const col = ENC_CATEGORY_COLORS[cat]
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'card-hover p-4 flex flex-col items-center gap-2 text-center group transition-all',
                  col.border,
                )}
              >
                <span className="text-2xl">{ENC_CATEGORY_ICONS[cat]}</span>
                <span className={cn('text-xs font-medium group-hover:opacity-100', col.text)}>
                  {ENC_CATEGORY_LABELS[cat]}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Search + Filters ── */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="বিষয় খুঁজুন... (বাংলা বা English)"
              className="input-field pl-10 w-full"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X size={14} />
              </button>
            )}
          </div>
          {hasFilter && (
            <button onClick={clearFilters} className="btn-secondary flex items-center gap-2 text-sm whitespace-nowrap">
              <X size={14} /> ফিল্টার মুছো
            </button>
          )}
        </div>

        {/* Active category + subcategory */}
        {category && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setCategory(''); setSubcategory('') }}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                ENC_CATEGORY_COLORS[category].bg,
                ENC_CATEGORY_COLORS[category].border,
                ENC_CATEGORY_COLORS[category].text,
              )}
            >
              {ENC_CATEGORY_ICONS[category]}
              {ENC_CATEGORY_LABELS[category]}
              <X size={12} />
            </button>

            {subcats.map((sc) => (
              <button
                key={sc}
                onClick={() => setSubcategory(subcategory === sc ? '' : sc)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border text-xs transition-all',
                  subcategory === sc
                    ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300',
                )}
              >
                {sc}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-500">
          {filtered.length} টি বিষয় পাওয়া গেছে
          {category && <span> — {ENC_CATEGORY_LABELS[category]}</span>}
          {search   && <span> "{search}" এর জন্য</span>}
        </p>
      </div>

      {/* ── Topics Grid / List ── */}
      {isLoading ? (
        <TopicsSkeleton view={view} />
      ) : filtered.length === 0 ? (
        <EmptyState onClear={clearFilters} />
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((topic) => (
            <TopicCard key={topic.id} topic={topic} view="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((topic) => (
            <TopicCard key={topic.id} topic={topic} view="list" />
          ))}
        </div>
      )}
    </div>
  )
}

function TopicsSkeleton({ view }: { view: ViewMode }) {
  const count = view === 'grid' ? 12 : 8
  return view === 'grid' ? (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 space-y-3 animate-pulse">
          <div className="w-10 h-10 bg-slate-800 rounded-xl" />
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-800 rounded" />
          <div className="h-3 bg-slate-800 rounded w-2/3" />
        </div>
      ))}
    </div>
  ) : (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 flex items-center gap-4 animate-pulse">
          <div className="w-10 h-10 bg-slate-800 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-1/2" />
            <div className="h-3 bg-slate-800 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
        <BookMarked size={28} className="text-slate-600" />
      </div>
      <p className="text-slate-400 font-medium mb-1">কোনো বিষয় পাওয়া যায়নি</p>
      <p className="text-slate-600 text-sm mb-4">ফিল্টার পরিবর্তন করে আবার চেষ্টা করো</p>
      <button onClick={onClear} className="btn-secondary text-sm">সব ফিল্টার মুছো</button>
    </div>
  )
}
