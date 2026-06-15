import { Outlet, Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/hooks/useAuth'
import PageLoader from '@/components/common/PageLoader'

export default function AuthLayout() {
  const { isLoading } = useAuth()
  const user          = useAuthStore((s) => s.user)

  if (isLoading) return <PageLoader />
  if (user)      return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-surface-900 bg-grid-pattern flex">

      {/* Left panel — branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface-950 via-surface-900 to-brand-950 flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-10 w-60 h-60 bg-accent-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
            <span className="font-display font-bold text-white text-xl">E</span>
          </div>
          <div>
            <p className="font-display font-bold text-white text-xl tracking-tight">Enginex Learn</p>
            <p className="text-xs text-brand-400 tracking-widest uppercase">Civil Engineering Platform</p>
          </div>
        </Link>

        {/* Center content */}
        <div className="z-10 space-y-6">
          <h1 className="font-display text-4xl font-bold text-white leading-tight">
            বাংলার সেরা<br />
            <span className="gradient-text">Civil Engineering</span><br />
            Learning Platform
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            ১ম বর্ষ থেকে শুরু করে Professional Engineer হওয়া পর্যন্ত —
            সব শেখার রিসোর্স বাংলায়।
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '১০,০০০+', label: 'আর্টিকেল' },
              { value: '৫০০+',   label: 'ভিডিও লেসন' },
              { value: '৫০+',    label: 'ক্যালকুলেটর' },
            ].map(({ value, label }) => (
              <div key={label} className="card p-4 text-center">
                <p className="font-display text-2xl font-bold gradient-text">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-sm z-10">© 2025 Enginex Learn</p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <span className="font-display font-bold text-white">E</span>
              </div>
              <span className="font-display font-bold text-white text-xl">Enginex Learn</span>
            </Link>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
