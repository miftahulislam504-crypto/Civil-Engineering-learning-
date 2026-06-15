import { type LucideIcon } from 'lucide-react'
import { cn } from '@/utils'

interface Props {
  icon:    LucideIcon
  label:   string
  value:   string | number
  sub?:    string
  color?:  string
  bg?:     string
  trend?:  'up' | 'down'
  onClick?: () => void
}

export default function StatCard({
  icon: Icon, label, value, sub, color = 'text-brand-400',
  bg = 'bg-brand-500/10', trend, onClick,
}: Props) {
  return (
    <div
      className={cn(
        'card p-4 flex items-center gap-4',
        onClick && 'cursor-pointer card-hover',
      )}
      onClick={onClick}
    >
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', bg)}>
        <Icon size={20} className={color} />
      </div>
      <div className="min-w-0">
        <p className="font-display text-xl font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{label}</p>
        {sub && <p className="text-xs text-slate-600 mt-0.5 truncate">{sub}</p>}
      </div>
      {trend && (
        <div className={cn(
          'ml-auto text-xs font-medium px-1.5 py-0.5 rounded',
          trend === 'up'
            ? 'text-green-400 bg-green-500/10'
            : 'text-red-400 bg-red-500/10',
        )}>
          {trend === 'up' ? '↑' : '↓'}
        </div>
      )}
    </div>
  )
}
