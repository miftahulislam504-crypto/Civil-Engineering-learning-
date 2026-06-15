import { BADGES } from '@/constants/points'
import { cn } from '@/utils'
import { Lock } from 'lucide-react'

interface Props {
  earnedBadges: string[]
}

export default function BadgesPanel({ earnedBadges }: Props) {
  const all = Object.entries(BADGES)

  return (
    <div>
      <h3 className="font-display font-semibold text-white mb-4">
        Badges
        <span className="ml-2 badge-brand text-xs px-2 py-0.5 rounded-full">
          {earnedBadges.length}/{all.length}
        </span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {all.map(([key, badge]) => {
          const earned = earnedBadges.includes(key)
          return (
            <div
              key={key}
              className={cn(
                'rounded-xl border p-3 flex flex-col items-center gap-2 text-center transition-all',
                earned
                  ? `${badge.color} border-current/20 bg-current/5`
                  : 'border-slate-800 bg-slate-800/30 opacity-50',
              )}
            >
              <span className={cn('text-2xl', !earned && 'grayscale')}>
                {earned ? badge.icon : <Lock size={20} className="text-slate-600" />}
              </span>
              <div>
                <p className={cn(
                  'text-xs font-medium',
                  earned ? 'text-white' : 'text-slate-500',
                )}>
                  {badge.label}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">{badge.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
