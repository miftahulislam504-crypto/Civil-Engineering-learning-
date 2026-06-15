import { useState, useMemo } from 'react'
import {
  Library, Search, Grid3X3, List, X,
  BookOpen, FileText, Database, Table2,
} from 'lucide-react'
import { useLibraryItems, useStandards } from '@/hooks/useLibrary'
import { searchLibrary, REFERENCE_TABLES } from '@/services/firebase/library'
import LibraryCard from '@/components/library/LibraryCard'
import StandardCard from '@/components/library/StandardCard'
import ReferenceTableView from '@/components/library/ReferenceTableView'
import { LIBRARY_TYPE_LABELS, STANDARD_COLORS, type LibraryItemType, type StandardCode } from '@/types/library.types'
import { cn } from '@/utils'

type Tab = 'digital' | 'standards' | 'reference'
type ViewMode = 'grid' | 'list'

const CATEGORIES = [
  'Structural Engineering', 'Geotechnical Engineering',
  'Transportation Engineering', 'Water Resources', 'Construction',
  'Project Management', 'Quantity Surveying', 'Software',
]

const ITEM_TYPES: LibraryItemType[] = [
  'note', 'lecture_note', 'handbook', 'manual',
  'design_guide', 'technical_article', 'research_paper', 'thesis', 'design_example',
]

const STANDARD_CODES: StandardCode[] = ['BNBC', 'ACI', 'ASTM', 'AASHTO', 'Eurocode', 'IS', 'BS']

const REF_TABLE_LIST = Object.values(REFERENCE_TABLES)

export default function LibraryPage() {
  const [tab,      setTab]      = useState<Tab>('digital')
  const [view,     setView]     = useState<ViewMode>('grid')
  const [search,   setSearch]   = useState('')
  const [typeFilter, setType]   = useState<LibraryItemType | ''>('')
  const [catFilter,  setCat]    = useState('')
  const [langFilter, setLang]   = useState<'bn' | 'en' | 'both' | ''>('')
  const [stdCode,    setStdCode] = useState<StandardCode | ''>('')

  const { data: items = [],     isLoading: itemsLoading }   = useLibraryItems({
    type:     typeFilter  || undefined,
    category: catFilter   || undefined,
    language: langFilter  || undefined,
  })
  const { data: standards = [], isLoading: stdLoading }     = useStandards(stdCode || undefined)

  const filteredItems = useMemo(() => searchLibrary(items, search), [items, search])

  const hasFilter = search || typeFilter || catFilter || langFilter

  function clearFilters() { setSearch(''); setType(''); setCat(''); setLang('') }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Library size={22} className="text-green-400" />
            </div>
            Engineering Library
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Notes, Handbooks, Standards ও Reference Tables এক জায়গায়
          </p>
        </div>

        {/* View toggle (only for digital tab) */}
        {tab === 'digital' && (
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 self-start sm:self-auto">
            <button onClick={() => setView('grid')}
              className={cn('p-2 rounded-md transition-all', view === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-300')}>
              <Grid3X3 size={15} />
            </button>
            <button onClick={() => setView('list')}
              className={cn('p-2 rounded-md transition-all', view === 'list' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-300')}>
              <List size={15} />
            </button>
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-slate-800 -mb-2">
        {([
          ['digital',   <FileText  size={15} />, 'ডিজিটাল লাইব্রেরি'],
          ['standards', <BookOpen  size={15} />, 'Standards Library'],
          ['reference', <Table2    size={15} />, 'Reference Tables'],
        ] as [Tab, React.ReactNode, string][]).map(([t, icon, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              tab === t
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-300',
            )}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ══ DIGITAL LIBRARY TAB ══ */}
      {tab === 'digital' && (
        <div className="space-y-6">
          {/* Search + Filters */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="বই, নোট বা আর্টিকেল খুঁজুন..."
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
                  <X size={14} /> মুছো
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Type */}
              <select value={typeFilter} onChange={(e) => setType(e.target.value as LibraryItemType | '')}
                className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer">
                <option value="">সব ধরন</option>
                {ITEM_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-surface-900">{LIBRARY_TYPE_LABELS[t]}</option>
                ))}
              </select>

              {/* Category */}
              <select value={catFilter} onChange={(e) => setCat(e.target.value)}
                className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer">
                <option value="">সব বিভাগ</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-surface-900">{c}</option>
                ))}
              </select>

              {/* Language */}
              {(['', 'bn', 'en', 'both'] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-lg border transition-all',
                    langFilter === l
                      ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300',
                  )}>
                  {l === ''   ? 'সব ভাষা'
                   : l === 'bn'  ? '🇧🇩 বাংলা'
                   : l === 'en'  ? '🇬🇧 English'
                   : '🌐 উভয়'}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500">{filteredItems.length} টি আইটেম পাওয়া গেছে</p>
          </div>

          {/* Copyright notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <span className="text-lg shrink-0">⚠️</span>
            <p className="text-xs text-amber-300 leading-relaxed">
              এখানে শুধুমাত্র copyright-free, public domain বা proper license-এর আওতায় থাকা কনটেন্ট রাখা হয়েছে।
              কনটেন্ট আপলোডের সময় অবশ্যই license যাচাই করতে হবে।
            </p>
          </div>

          {/* Items Grid/List */}
          {itemsLoading ? (
            <LibrarySkeleton view={view} />
          ) : filteredItems.length === 0 ? (
            <EmptyLibrary onClear={clearFilters} />
          ) : view === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <LibraryCard key={item.id} item={item} view="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <LibraryCard key={item.id} item={item} view="list" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ STANDARDS TAB ══ */}
      {tab === 'standards' && (
        <div className="space-y-6">
          {/* Code filter */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setStdCode('')}
              className={cn('text-xs px-4 py-2 rounded-lg border transition-all',
                stdCode === '' ? 'bg-brand-500/15 border-brand-500/30 text-brand-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
              সব Codes
            </button>
            {STANDARD_CODES.map((code) => {
              const col = STANDARD_COLORS[code]
              return (
                <button key={code} onClick={() => setStdCode(code === stdCode ? '' : code)}
                  className={cn(
                    'text-xs px-4 py-2 rounded-lg border font-semibold transition-all',
                    stdCode === code
                      ? `${col.bg} ${col.border} ${col.text}`
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300',
                  )}>
                  {code}
                </button>
              )
            })}
          </div>

          {/* Copyright notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/8 border border-blue-500/20">
            <span className="text-lg shrink-0">ℹ️</span>
            <p className="text-xs text-blue-300 leading-relaxed">
              BNBC সম্পূর্ণ বিনামূল্যে পাওয়া যায়। ACI, ASTM, Eurocode-এর জন্য official license প্রয়োজন।
              এখানে শুধুমাত্র freely available বা licensed কনটেন্ট রাখা হয়েছে।
            </p>
          </div>

          {stdLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card p-5 space-y-3 animate-pulse h-48">
                  <div className="h-6 bg-slate-800 rounded w-20" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : standards.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={36} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Standards লোড হচ্ছে...</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {standards.map((s) => (
                <StandardCard key={s.id} standard={s} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ REFERENCE TABLES TAB ══ */}
      {tab === 'reference' && (
        <div className="space-y-8">
          <p className="text-slate-400 text-sm">
            Civil Engineering-এর সবচেয়ে বেশি ব্যবহৃত Reference Tables — সার্চযোগ্য ও সাজানোযোগ্য।
          </p>

          {/* Quick nav */}
          <div className="flex flex-wrap gap-2">
            {REF_TABLE_LIST.map((t) => (
              <a
                key={t.id}
                href={`#table-${t.id}`}
                className="text-xs bg-slate-800 border border-slate-700 text-slate-400 hover:text-brand-400 hover:border-brand-500/30 px-3 py-1.5 rounded-lg transition-all"
              >
                {t.titleBn}
              </a>
            ))}
          </div>

          {/* Tables */}
          <div className="space-y-8">
            {REF_TABLE_LIST.map((table) => (
              <div key={table.id} id={`table-${table.id}`} className="scroll-mt-24">
                <ReferenceTableView table={table} />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

function LibrarySkeleton({ view }: { view: ViewMode }) {
  return view === 'grid' ? (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card overflow-hidden animate-pulse">
          <div className="h-1.5 bg-slate-800 w-full" />
          <div className="p-5 space-y-3">
            <div className="w-11 h-11 bg-slate-800 rounded-xl" />
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800 rounded" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card p-4 flex items-center gap-4 animate-pulse">
          <div className="w-10 h-10 bg-slate-800 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-1/2" />
            <div className="h-3 bg-slate-800 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyLibrary({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
        <Library size={28} className="text-slate-600" />
      </div>
      <p className="text-slate-400 font-medium mb-1">কোনো আইটেম পাওয়া যায়নি</p>
      <p className="text-slate-600 text-sm mb-4">ফিল্টার পরিবর্তন করো</p>
      <button onClick={onClear} className="btn-secondary text-sm">সব ফিল্টার মুছো</button>
    </div>
  )
}
