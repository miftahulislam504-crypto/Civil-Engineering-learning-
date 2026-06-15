import { Link, useNavigate } from 'react-router-dom'
import { Menu, Sun, Moon, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { logout } from '@/services/firebase/auth'
import { getInitials } from '@/utils'
import NotificationBell from '@/components/common/NotificationBell'
import toast from 'react-hot-toast'

export default function Navbar() {
  const navigate  = useNavigate()
  const user      = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const { theme, toggleTheme, toggleSidebar } = useUIStore()

  async function handleLogout() {
    try {
      await logout()
      clearAuth()
      navigate('/')
      toast.success('লগআউট সফল হয়েছে')
    } catch {
      toast.error('লগআউট ব্যর্থ হয়েছে')
    }
  }

  return (
    <header className="sticky top-0 z-50 h-16 bg-surface-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="flex items-center justify-between h-full px-4 max-w-screen-2xl mx-auto">

        {/* Left */}
        <div className="flex items-center gap-3">
          {user && (
            <button onClick={toggleSidebar} className="btn-ghost p-2 rounded-lg" aria-label="Toggle sidebar">
              <Menu size={20} />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
              <span className="font-display font-bold text-white text-sm">E</span>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-bold text-white text-base tracking-tight">Enginex</span>
              <span className="text-[10px] text-brand-400 font-medium tracking-widest uppercase">Learn</span>
            </div>
          </Link>
        </div>

        {/* Center nav (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'কোর্স',           to: '/courses'      },
            { label: 'Encyclopedia',     to: '/encyclopedia' },
            { label: 'লাইব্রেরি',       to: '/library'      },
            { label: 'AI টিউটর',        to: '/ai'           },
          ].map(({ label, to }) => (
            <Link key={to} to={to} className="btn-ghost text-sm">{label}</Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="btn-ghost p-2 rounded-lg" aria-label="Toggle theme">
            {theme === 'dark'
              ? <Sun  size={18} className="text-slate-400" />
              : <Moon size={18} className="text-slate-400" />
            }
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Link to="/dashboard" className="btn-ghost hidden sm:flex items-center gap-2 text-sm">
                <LayoutDashboard size={16} />
                <span>ড্যাশবোর্ড</span>
              </Link>

              {/* Avatar dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user.displayName)}
                    </div>
                  )}
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 card shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-slate-700">
                    <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <Link to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                      <User size={15} /> প্রোফাইল
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                      <LogOut size={15} /> লগআউট
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth/login"    className="btn-ghost text-sm">লগইন</Link>
              <Link to="/auth/register" className="btn-primary text-sm">শুরু করুন</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
