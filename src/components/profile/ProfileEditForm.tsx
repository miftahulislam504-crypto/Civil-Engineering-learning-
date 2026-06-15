import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, X } from 'lucide-react'
import { useUpdateProfile } from '@/hooks/useProfile'
import { useAuthStore } from '@/stores/authStore'
import { USER_ROLE_LABELS, type UserRole } from '@/types'

const schema = z.object({
  displayName: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর'),
  bio:         z.string().max(200, 'বায়ো ২০০ অক্ষরের বেশি নয়').optional(),
  university:  z.string().optional(),
  batch:       z.string().optional(),
  experience:  z.coerce.number().min(0).max(50).optional(),
  role: z.enum([
    'student', 'diploma_engineer', 'graduate_engineer', 'site_engineer',
    'design_engineer', 'consultant', 'contractor', 'researcher',
  ] as const),
})
type FormData = z.infer<typeof schema>

const roles: UserRole[] = [
  'student', 'diploma_engineer', 'graduate_engineer', 'site_engineer',
  'design_engineer', 'consultant', 'contractor', 'researcher',
]

interface Props {
  onCancel: () => void
}

export default function ProfileEditForm({ onCancel }: Props) {
  const user   = useAuthStore((s) => s.user)
  const { mutate: update, isPending } = useUpdateProfile()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user?.displayName ?? '',
      bio:         user?.bio         ?? '',
      university:  user?.university  ?? '',
      batch:       user?.batch       ?? '',
      experience:  user?.experience  ?? 0,
      role:        (user?.role as FormData['role']) ?? 'student',
    },
  })

  const bio    = watch('bio', '')
  const bioLen = (bio ?? '').length

  function onSubmit(data: FormData) {
    update(data, { onSuccess: onCancel })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Name */}
      <div>
        <label className="label">পুরো নাম *</label>
        <input {...register('displayName')} className="input-field" placeholder="তোমার নাম" />
        {errors.displayName && <p className="text-red-400 text-xs mt-1">{errors.displayName.message}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="label">তুমি কে? *</label>
        <select {...register('role')} className="input-field appearance-none cursor-pointer">
          {roles.map((r) => (
            <option key={r} value={r} className="bg-surface-900">{USER_ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>

      {/* University + Batch */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">বিশ্ববিদ্যালয়</label>
          <input {...register('university')} className="input-field" placeholder="BUET, CUET..." />
        </div>
        <div>
          <label className="label">ব্যাচ / পাস সাল</label>
          <input {...register('batch')} className="input-field" placeholder="যেমন: ২০২৩" />
        </div>
      </div>

      {/* Experience */}
      <div>
        <label className="label">অভিজ্ঞতা (বছর)</label>
        <input
          {...register('experience')}
          type="number"
          min={0}
          max={50}
          className="input-field"
          placeholder="০"
        />
      </div>

      {/* Bio */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label mb-0">সংক্ষিপ্ত পরিচয়</label>
          <span className={`text-xs ${bioLen > 180 ? 'text-red-400' : 'text-slate-500'}`}>
            {bioLen}/200
          </span>
        </div>
        <textarea
          {...register('bio')}
          rows={3}
          className="input-field resize-none"
          placeholder="নিজের সম্পর্কে কিছু লেখো..."
        />
        {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary flex items-center gap-2 flex-1 justify-center"
        >
          {isPending ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : <Save size={16} />}
          {isPending ? 'সেভ হচ্ছে...' : 'সেভ করো'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex items-center gap-2"
        >
          <X size={16} /> বাতিল
        </button>
      </div>
    </form>
  )
}
