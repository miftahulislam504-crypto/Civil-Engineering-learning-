import { useState } from 'react'
import { Bell, X, BookOpen, Award, Zap } from 'lucide-react'
import { cn } from '@/utils'

interface Notification {
  id:      string
  type:    'course' | 'badge' | 'quiz' | 'system'
  title:   string
  body:    string
  time:    string
  isRead:  boolean
}

// Demo notifications — real data will come from Firestore
const DEMO: Notification[] = [
  {
    id: '1', type: 'quiz',   isRead: false,
    title: 'Daily Quiz অপেক্ষা করছে!',
    body:  'আজকের ১০টি প্রশ্ন উত্তর দিয়ে ১০ পয়েন্ট আয় করো',
    time:  'এখনই',
  },
  {
    id: '2', type: 'badge',  isRead: false,
    title: 'নতুন Badge অর্জন!',
    body:  'তুমি "প্রথম লগইন" Badge পেয়েছো 🎉',
    time:  '১ ঘণ্টা আগে',
  },
  {
    id: '3', type: 'course', isRead: true,
    title: 'নতুন কোর্স যোগ হয়েছে',
    body:  'ETABS Advanced Course এখন পাওয়া যাচ্ছে',
    time:  'গতকাল',
  },
]

const icons: Record<string, React.ElementType> = {
  course: BookOpen,
  badge:  Award,
  quiz:   Zap,
  system: Bell,
}

const colors: Record<string, string> = {
  course: 'text-brand-400 bg-brand-500/10',
  badge:  'text-yellow-400 bg-yellow-500/10',
  quiz:   'text-accent-400 bg-accent-500/10',
  system: 'text-slate-400 bg-slate-500/10',
}

export default function NotificationBell() {
  const [open,     setOpen]     = useState(false)
  const [notifs,   setNotifs]   = useState(DEMO)

  const unread = notifs.filter((n) => !n.isRead).length

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n))
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative btn-ghost p-2 rounded-lg"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 card shadow-card z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-display font-semibold text-white text-sm">নোটিফিকেশন</h3>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    সব পড়া হয়েছে
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  কোনো নোটিফিকেশন নেই
                </div>
              ) : (
                notifs.map((n) => {
                  const Icon  = icons[n.type] ?? Bell
                  const color = colors[n.type] ?? colors.system
                  return (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        'flex gap-3 p-4 border-b border-slate-800/50 last:border-0 cursor-pointer transition-colors',
                        !n.isRead ? 'bg-brand-500/5 hover:bg-brand-500/10' : 'hover:bg-slate-800/50',
                      )}
                    >
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', color)}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            'text-sm leading-tight',
                            !n.isRead ? 'text-white font-medium' : 'text-slate-300',
                          )}>
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="w-2 h-2 bg-brand-500 rounded-full shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.body}</p>
                        <p className="text-[10px] text-slate-600 mt-1">{n.time}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
