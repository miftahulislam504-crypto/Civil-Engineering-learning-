import { getRank, getRankProgress, getNextRank } from '@/constants/points'
import { cn } from '@/utils'

interface Props {
  points:    number
  showBar?:  boolean
  showNext?: boolean
  size?:     'sm' | 'md'
}

export default function RankBadge({ points, showBar = false, showNext = false, size = 'md' }: Props) {
  const rank     = getRank(points)
  const nextRank = getNextRank(points)
  const pct      = getRankProgress(points)

  return (
    <div className="space-y-2">
      {/* Rank pill */}
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1',
          'bg-slate-800/80 border-slate-700',
          size === 'sm' ? 'text-xs' : 'text-sm',
        )}
      >
        <span>{rank.icon}</span>
        <span className={cn('font-medium', rank.color)}>{rank.label}</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-400">{points.toLocaleString()} pts</span>
      </div>

      {/* Progress bar */}
      {showBar && nextRank && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>{rank.label}</span>
            <span>{nextRank.label} পেতে {(nextRank.min - points).toLocaleString()} pts দরকার</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Next rank hint */}
      {showNext && nextRank && (
        <p className="text-xs text-slate-500">
          পরবর্তী Rank: {nextRank.icon} {nextRank.label}
        </p>
      )}
    </div>
  )
}
