import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { type EncyclopediaTopic } from '@/types/encyclopedia.types'
import { ENC_CATEGORY_COLORS, ENC_CATEGORY_ICONS, ENC_CATEGORY_LABELS } from '@/types/encyclopedia.types'
import { cn } from '@/utils'

interface Props {
  topic: EncyclopediaTopic
  view: 'grid' | 'list'
}

export default function TopicCard({ topic, view }: Props) {
  const color = ENC_CATEGORY_COLORS[topic.category]
  const icon  = ENC_CATEGORY_ICONS[topic.category]

  if (view === 'list') {
    return (
      <Link
        to={`/encyclopedia/${topic.slug}`}
        className="card p-4 flex items-center gap-4 hover:border-brand-500/40 transition-all group"
      >
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg', color.bg)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white text-sm truncate group-hover:text-brand-300 transition-colors">
            {topic.titleBn || topic.title}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{topic.overview}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-600 shrink-0">
          <Eye size={11} /> {topic.viewCount}
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/encyclopedia/${topic.slug}`}
      className="card p-5 flex flex-col gap-3 hover:border-brand-500/40 transition-all group card-hover"
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl', color.bg)}>
        {icon}
      </div>
      <div>
        <p className="font-semibold text-white text-sm leading-snug group-hover:text-brand-300 transition-colors">
          {topic.titleBn || topic.title}
        </p>
        {topic.subcategory && (
          <p className={cn('text-[10px] mt-0.5 font-medium', color.text)}>{topic.subcategory}</p>
        )}
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{topic.overview}</p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800">
        <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', color.bg, color.border, color.text)}>
          {ENC_CATEGORY_LABELS[topic.category]}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-slate-600">
          <Eye size={10} /> {topic.viewCount}
        </span>
      </div>
    </Link>
  )
}
