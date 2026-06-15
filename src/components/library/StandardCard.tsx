import { BookOpen, Download, ExternalLink } from 'lucide-react'
import type { Standard } from '@/types/library.types'
import { STANDARD_CODE_LABELS, STANDARD_COLORS } from '@/types/library.types'
import { cn } from '@/utils'

interface Props { standard: Standard }

export default function StandardCard({ standard }: Props) {
  const color = STANDARD_COLORS[standard.code]

  return (
    <div className="card-hover p-5 flex flex-col gap-4 group">
      {/* Code badge + year */}
      <div className="flex items-center justify-between">
        <span className={cn('font-display font-bold text-sm px-3 py-1 rounded-lg border', color.bg, color.text, color.border)}>
          {standard.code}
        </span>
        <span className="text-xs text-slate-500">{standard.year}</span>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm leading-tight group-hover:text-brand-400 transition-colors">
          {standard.titleBn || standard.title}
        </h3>
        {standard.titleBn && (
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{standard.title}</p>
        )}
      </div>

      {/* Full name */}
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
        {STANDARD_CODE_LABELS[standard.code]}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-2 text-[10px] text-slate-600">
        <BookOpen size={10} />
        <span>{standard.category}</span>
        {standard.chapterCount > 0 && (
          <span>• {standard.chapterCount} অধ্যায়</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-slate-800">
        {standard.fileUrl ? (
          <a
            href={standard.fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 flex-1 justify-center"
          >
            <Download size={11} /> ডাউনলোড
          </a>
        ) : (
          <span className="text-xs text-slate-600 py-1.5 px-3 flex items-center gap-1.5">
            ⚠️ শুধু Licensed ব্যবহারকারীদের জন্য
          </span>
        )}
        <button className="btn-ghost p-2 text-slate-500 hover:text-slate-300">
          <ExternalLink size={13} />
        </button>
      </div>
    </div>
  )
}
