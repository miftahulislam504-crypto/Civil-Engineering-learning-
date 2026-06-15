import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
import { loginWithEmail, loginWithGoogle } from '@/services/firebase/auth'
import { getUserProfile } from '@/services/firebase/auth'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

const schema = z.object({
  email:    z.string().email('সঠিক ইমেইল দাও'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [gLoading, setGLoading] = useState(false)

  const navigate  = useNavigate()
  const location  = useLocation()
  const setUser   = useAuthStore((s) => s.setUser)
  const from      = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const fbUser  = await loginWithEmail(data.email, data.password)
      const profile = await getUserProfile(fbUser.uid)
      setUser(profile)
      toast.success('স্বাগতম! লগইন সফল হয়েছে ✓')
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        toast.error('ইমেইল বা পাসওয়ার্ড ভুল')
      } else {
        toast.error('লগইন ব্যর্থ হয়েছে, আবার চেষ্টা করো')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGLoading(true)
    try {
      const fbUser  = await loginWithGoogle()
      const profile = await getUserProfile(fbUser.uid)
      setUser(profile)
      toast.success('Google দিয়ে লগইন সফল ✓')
      navigate(from, { replace: true })
    } catch {
      toast.error('Google লগইন ব্যর্থ হয়েছে')
    } finally {
      setGLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-white">স্বাগতম আবার!</h2>
        <p className="text-slate-400 mt-1 text-sm">তোমার অ্যাকাউন্টে লগইন করো</p>
      </div>

      {/* Google Button */}
      <button
        onClick={handleGoogle}
        disabled={gLoading}
        className="w-full flex items-center justify-center gap-3 btn-secondary mb-6 py-3"
      >
        {gLoading ? (
          <Spinner />
        ) : (
          <GoogleIcon />
        )}
        <span>Google দিয়ে লগইন করো</span>
      </button>

      <Divider />

      {/* Email Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="label">ইমেইল</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              {...register('email')}
              type="email"
              placeholder="example@email.com"
              className="input-field pl-10"
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0">পাসওয়ার্ড</label>
            <Link to="/auth/reset" className="text-xs text-brand-400 hover:text-brand-300">
              ভুলে গেছো?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              {...register('password')}
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              className="input-field pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? <Spinner /> : <LogIn size={17} />}
          {loading ? 'লগইন হচ্ছে...' : 'লগইন করো'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        অ্যাকাউন্ট নেই?{' '}
        <Link to="/auth/register" className="text-brand-400 hover:text-brand-300 font-medium">
          রেজিস্ট্রেশন করো
        </Link>
      </p>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 h-px bg-slate-800" />
      <span className="text-xs text-slate-600">অথবা</span>
      <div className="flex-1 h-px bg-slate-800" />
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
