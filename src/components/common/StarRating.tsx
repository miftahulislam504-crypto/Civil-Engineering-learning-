import { Star } from 'lucide-react'
import { cn } from '@/utils'

interface Props {
  rating:    number
  max?:      number
  size?:     number
  editable?: boolean
  onChange?: (rating: number) => void
}

export default function StarRating({ rating, max = 5, size = 16, editable = false, onChange }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const half   = !filled && i < rating

        return (
          <button
            key={i}
            type="button"
            disabled={!editable}
            onClick={() => editable && onChange?.(i + 1)}
            className={cn(
              'relative transition-transform',
              editable && 'cursor-pointer hover:scale-110',
              !editable && 'cursor-default',
            )}
          >
            <Star
              size={size}
              className={cn(
                filled ? 'text-yellow-400 fill-yellow-400'
                : half  ? 'text-yellow-400'
                : 'text-slate-700',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
