import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, BookMarked, Library,
  FlaskConical, HardHat, Monitor, Microscope,
  Briefcase, Award, Bot, User, ChevronRight,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'ড্যাশবোর্ড',       to: '/dashboard' },
  { icon: BookOpen,        label: 'কোর্সসমূহ',         to: '/courses' },
  { icon: BookMarked,      label: 'এনসাইক্লোপিডিয়া', to: '/encyclopedia' },
  { icon: Library,         label: 'লাইব্রেরি',         to: '/library' },
  { icon: FlaskConical,    label: 'ডিজাইন ল্যাব',      to: '/design-lab' },
  { icon: HardHat,         label: 'কনস্ট্রাকশন হাব',   to: '/construction' },
  { icon: Monitor,         label: 'সফটওয়্যার হাব',    to: '/software' },
  { icon: Microscope,      label: 'রিসার্চ হাব',       to: '/research' },
  { icon: Briefcase,       label: 'ক্যারিয়ার',         to: '/career' },
  { icon: Bot,             label: 'AI টিউটর',           to: '/ai' },
  { icon: Award,           label: 'সার্টিফিকেট',       to: '/certificates' },
  { icon: User,            label: 'প্রোফাইল',           to: '/profile' },
]

export default function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const user        = useAuthStore((s) => s.user)

  if (!user) return null

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-surface-900 border-r border-slate-800',
        'flex flex-col z-40 transition-all duration-300 overflow-hidden',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group relative',
                isActive
                  ? 'bg-brand-600/20 text-brand-400 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-500 rounded-r-full" />
                )}
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && (
                  <span className="truncate font-body">{label}</span>
                )}
                {sidebarOpen && (
                  <ChevronRight
                    size={14}
                    className={cn(
                      'ml-auto opacity-0 group-hover:opacity-100 transition-opacity',
                      isActive ? 'opacity-100 text-brand-400' : 'text-slate-600'
                    )}
                  />
                )}

                {/* Tooltip when sidebar closed */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 border border-slate-700">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: User info */}
      {sidebarOpen && (
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/50">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.displayName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">{user.displayName}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.points} পয়েন্ট</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
