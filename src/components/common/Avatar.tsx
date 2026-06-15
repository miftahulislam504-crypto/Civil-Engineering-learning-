import { useRef } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { useUploadPhoto } from '@/hooks/useProfile'
import { getInitials, cn } from '@/utils'

interface AvatarProps {
  name:      string
  photoURL?: string | null
  size?:     'sm' | 'md' | 'lg' | 'xl'
  editable?: boolean
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-20 h-20 text-xl',
  xl: 'w-28 h-28 text-3xl',
}

export default function Avatar({
  name, photoURL, size = 'md', editable = false,
}: AvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate: upload, isPending, progress } = useUploadPhoto()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('ছবির সাইজ ২ MB-এর কম হতে হবে')
      return
    }
    upload(file)
  }

  return (
    <div className="relative inline-block">
      {/* Avatar */}
      <div
        className={cn(
          sizes[size],
          'rounded-full flex items-center justify-center overflow-hidden ring-2 ring-brand-500/30 shrink-0',
          editable && 'cursor-pointer group',
        )}
        onClick={() => editable && inputRef.current?.click()}
      >
        {photoURL ? (
          <img src={photoURL} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <span className="font-display font-bold text-white">{getInitials(name)}</span>
          </div>
        )}

        {/* Overlay on hover */}
        {editable && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isPending
              ? <Loader2 size={20} className="text-white animate-spin" />
              : <Camera size={20} className="text-white" />
            }
          </div>
        )}
      </div>

      {/* Upload progress ring */}
      {isPending && progress > 0 && (
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50" cy="50" r="47"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 47}`}
            strokeDashoffset={`${2 * Math.PI * 47 * (1 - progress / 100)}`}
            className="transition-all duration-300"
          />
        </svg>
      )}

      {/* Edit badge */}
      {editable && !isPending && (
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-600 hover:bg-brand-500 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <Camera size={12} className="text-white" />
        </button>
      )}

      {/* Hidden file input */}
      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
    </div>
  )
}
