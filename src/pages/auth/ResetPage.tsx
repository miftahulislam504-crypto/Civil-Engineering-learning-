import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import { resetPassword } from '@/services/firebase/auth'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('সঠিক ইমেইল দাও'),
})
type FormData = z.infer<typeof schema>

export default function ResetPage() {
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      await resetPassword(data.email)
      setSent(true)
      toast.success('রিসেট লিঙ্ক পাঠানো হয়েছে')
    } catch {
      toast.error('ইমেইল পাঠাতে ব্যর্থ হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="animate-fade-in text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mx-auto">
          <Mail size={28} className="text-brand-400" />
        </div>
        <h2 className="font-display text-xl font-bold text-white">ইমেইল পাঠানো হয়েছে!</h2>
        <p className="text-slate-400 text-sm">
          তোমার ইমেইলে পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে।
          ইনবক্স চেক করো।
        </p>
        <Link to="/auth/login" className="btn-primary inline-flex items-center gap-2 mt-4">
          <ArrowLeft size={16} /> লগইন পেজে যাও
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-white">পাসওয়ার্ড ভুলে গেছো?</h2>
        <p className="text-slate-400 mt-1 text-sm">
          ইমেইল দাও, রিসেট লিঙ্ক পাঠাবো
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">ইমেইল</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              {...register('email')}
              type="email"
              placeholder="তোমার ইমেইল"
              className="input-field pl-10"
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : <Send size={16} />}
          {loading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিঙ্ক পাঠাও'}
        </button>
      </form>

      <Link
        to="/auth/login"
        className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 mt-6 transition-colors"
      >
        <ArrowLeft size={15} /> লগইন পেজে ফিরে যাও
      </Link>
    </div>
  )
}
