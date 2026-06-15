import { Download, Bookmark, BookmarkCheck, Eye, FileText } from 'lucide-react'
import type { LibraryItem } from '@/types/library.types'
import {
  LIBRARY_TYPE_LABELS, LIBRARY_TYPE_ICONS,
  formatFileSize,
} from '@/types/library.types'
import { useAuthStore } from '@/stores/authStore'
import { useDownload, useLibraryBookmark } from '@/hooks/useLibrary'
import { cn } from '@/utils'

const LANG_LABELS = { bn: 'বাংলা', en: 'English', both: 'বাংলা + English' }
const LANG_COLORS = {
  bn:   'text-green-400  bg-green-500/10  border-green-500/20',
  en:   'text-blue-400   bg-blue-500/10   border-blue-500/20',
  both: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

interface Props {
  item:  LibraryItem
  view?: 'grid' | 'list'
}

export default function LibraryCard({ item, view = 'grid' }: Props) {
  const user         = useAuthStore((s) => s.user)
  const { download, downloading } = useDownload()
  const { mutate: toggleBookmark } = useLibraryBookmark()
  const isBookmarked = user?.bookmarks?.includes(item.id) ?? false
  const isDownloading = downloading === item.id

  function handleDownload(e: React.MouseEvent) {
    e.stopPropagation()
    download({ id: item.id, fileUrl: item.fileUrl, title: item.titleBn || item.title })
  }

  function handleBookmark(e: React.MouseEvent) {
    e.stopPropagation()
    if (!user) return
    toggleBookmark({ id: item.id, bookmarked: isBookmarked })
  }

  if (view === 'list') {
    return (
      <div className="card-hover flex items-center gap-4 p-4 group">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">
          {LIBRARY_TYPE_ICONS[item.type]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate group-hover:text-brand-400 transition-colors">
            {item.titleBn || item.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {item.authorBn || item.author} •{' '}
            {LIBRARY_TYPE_LABELS[item.type]}
          </p>
        </div>

        {/* Meta */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-600 shrink-0">
          <span className={cn('badge border text-[10px]', LANG_COLORS[item.language])}>
            {LANG_LABELS[item.language]}
          </span>
          {item.pages > 0 && <span>{item.pages} পৃষ্ঠা</span>}
          <span className="flex items-center gap-1">
            <Download size={10} /> {item.downloadCount}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {user && (
            <button
              onClick={handleBookmark}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isBookmarked
                  ? 'text-brand-400 bg-brand-500/10'
                  : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800',
              )}
            >
              {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            {isDownloading
              ? <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
              : <Download size={12} />}
            ডাউনলোড
          </button>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="card-hover flex flex-col gap-0 group overflow-hidden">
      {/* Header color strip */}
      <div className="h-1.5 bg-gradient-to-r from-brand-500 to-accent-500 w-full" />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shrink-0">
            {LIBRARY_TYPE_ICONS[item.type]}
          </div>
          {user && (
            <button
              onClick={handleBookmark}
              className={cn(
                'p-1.5 rounded-lg transition-colors shrink-0',
                isBookmarked
                  ? 'text-brand-400 bg-brand-500/10'
                  : 'text-slate-600 hover:text-slate-400',
              )}
            >
              {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-display font-semibold text-white text-sm leading-tight group-hover:text-brand-400 transition-colors line-clamp-2">
            {item.titleBn || item.title}
          </h3>
          {item.authorBn && (
            <p className="text-xs text-slate-500 mt-1">{item.authorBn}</p>
          )}
        </div>

        {/* Description */}
        {item.descriptionBn && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
            {item.descriptionBn}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          <span className="badge border text-[10px] bg-slate-800 text-slate-400 border-slate-700">
            {LIBRARY_TYPE_LABELS[item.type]}
          </span>
          <span className={cn('badge border text-[10px]', LANG_COLORS[item.language])}>
            {LANG_LABELS[item.language]}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex items-center gap-3 text-[10px] text-slate-600">
            {item.pages > 0 && (
              <span className="flex items-center gap-1">
                <FileText size={10} /> {item.pages}p
              </span>
            )}
            {item.fileSize > 0 && <span>{formatFileSize(item.fileSize)}</span>}
            <span className="flex items-center gap-1">
              <Download size={10} /> {item.downloadCount}
            </span>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-primary text-[11px] py-1.5 px-3 flex items-center gap-1.5"
          >
            {isDownloading
              ? <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
              : <Download size={11} />}
            ডাউনলোড
          </button>
        </div>
      </div>
    </div>
  )
}
