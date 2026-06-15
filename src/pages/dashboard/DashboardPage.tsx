import { Link } from 'react-router-dom'
import {
  BookOpen, FlaskConical, Award, Bot,
  TrendingUp, Bookmark, Zap, ArrowRight,
  HardHat, Monitor, Microscope, Briefcase,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { USER_ROLE_LABELS } from '@/types'
import Avatar from '@/components/common/Avatar'
import RankBadge from '@/components/common/RankBadge'
import StatCard from '@/components/common/StatCard'
import { useLearningProgress } from '@/hooks/useProfile'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: progress } = useLearningProgress()

  if (!user) return null

  const greeting       = getGreeting()
  const completedCount = progress?.filter((p) => p.isCompleted).length     ?? 0
  const inProgressList = progress?.filter((p) => !p.isCompleted && p.progressPercent > 0) ?? []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-500/15 bg-gradient-to-br from-brand-950/60 via-surface-800 to-surface-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/6 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 w-48 h-48 bg-accent-500/6 rounded-full blur-2xl" />

        <div className="relative z-10 p-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar name={user.displayName} photoURL={user.photoURL} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-brand-400 text-sm font-medium">{greeting}</p>
            <h1 className="font-display text-2xl font-bold text-white mt-0.5 truncate">
              {user.displayName}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{USER_ROLE_LABELS[user.role]}</p>
            <div className="mt-3">
              <RankBadge points={user.points} showBar />
            </div>
          </div>
          <Link
            to="/quiz/daily"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white
                       px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95
                       shrink-0 self-start sm:self-center"
          >
            <Zap size={15} className="text-yellow-300" />
            আজকের Quiz
          </Link>
        </div>

        {/* Weekly streak bar */}
        <div className="relative z-10 px-6 pb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500">সাপ্তাহিক লক্ষ্য</p>
            <span className="text-xs text-brand-400">৩/৭ দিন</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full ${
                  i < 3
                    ? 'bg-gradient-to-r from-brand-500 to-accent-500'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={BookOpen}   label="কোর্সে ভর্তি"      value={user.enrolledCourses.length} color="text-brand-400"  bg="bg-brand-500/10"  />
        <StatCard icon={Award}      label="কোর্স সম্পন্ন"     value={completedCount}               color="text-green-400" bg="bg-green-500/10"  />
        <StatCard icon={Bookmark}   label="সেভ করা আর্টিকেল" value={user.savedArticles.length}    color="text-purple-400" bg="bg-purple-500/10" />
        <StatCard icon={TrendingUp} label="মোট পয়েন্ট"       value={user.points}                  color="text-accent-400" bg="bg-accent-500/10" />
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="section-title mb-4">দ্রুত যাও</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {getQuickLinks(user.role).map(({ icon: Icon, label, to, color, bg, desc }) => (
            <Link key={to} to={to} className="card-hover p-4 flex flex-col gap-3 group">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors">
                  {label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Continue Learning + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-brand-400" />
              শেখা চালিয়ে যাও
            </h2>
            <Link to="/courses" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              সব দেখো <ArrowRight size={12} />
            </Link>
          </div>

          {inProgressList.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <BookOpen size={20} className="text-slate-500" />
              </div>
              <p className="text-slate-500 text-sm mb-3">এখনো কোনো কোর্স শুরু করোনি</p>
              <Link to="/courses" className="btn-primary text-sm px-4 py-2">কোর্স দেখো</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {inProgressList.slice(0, 4).map((p) => (
                <div key={p.courseId} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{p.courseId}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${p.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">{p.progressPercent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-display font-semibold text-white flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-accent-400" />
            সাম্প্রতিক কার্যক্রম
          </h2>
          <RecentActivity />
        </div>

      </div>

      {/* AI CTA */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-accent-500/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow shrink-0">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white">AI Civil Tutor</p>
            <p className="text-slate-400 text-sm">বাংলায় যেকোনো Civil Engineering প্রশ্ন করো</p>
          </div>
        </div>
        <Link to="/ai" className="relative z-10 btn-primary flex items-center gap-2 whitespace-nowrap">
          <Bot size={16} /> AI-কে জিজ্ঞাসা করো
        </Link>
      </div>

    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'সুপ্রভাত ☀️'
  if (h < 17) return 'শুভ অপরাহ্ন 🌤️'
  if (h < 20) return 'শুভ সন্ধ্যা 🌆'
  return 'শুভ রাত্রি 🌙'
}

function getQuickLinks(role: string) {
  const all = [
    { icon: BookOpen,     label: 'কোর্সসমূহ',      to: '/courses',      color: 'text-brand-400',  bg: 'bg-brand-500/10',  desc: 'ভিডিও ও PDF কোর্স'         },
    { icon: BookOpen,     label: 'Encyclopedia',     to: '/encyclopedia', color: 'text-purple-400', bg: 'bg-purple-500/10', desc: 'জ্ঞানের ভান্ডার'            },
    { icon: FlaskConical, label: 'ডিজাইন ল্যাব',    to: '/design-lab',   color: 'text-accent-400', bg: 'bg-accent-500/10', desc: 'ইন্টারেক্টিভ ক্যালকুলেটর' },
    { icon: Bot,          label: 'AI টিউটর',         to: '/ai',           color: 'text-green-400',  bg: 'bg-green-500/10',  desc: 'বাংলায় সাহায্য'            },
    { icon: HardHat,      label: 'কনস্ট্রাকশন হাব', to: '/construction', color: 'text-orange-400', bg: 'bg-orange-500/10', desc: 'সাইট ও QC গাইড'            },
    { icon: Monitor,      label: 'সফটওয়্যার হাব',  to: '/software',     color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   desc: 'ETABS, Revit...'            },
    { icon: Microscope,   label: 'রিসার্চ হাব',     to: '/research',     color: 'text-pink-400',   bg: 'bg-pink-500/10',   desc: 'গবেষণা রিসোর্স'            },
    { icon: Briefcase,    label: 'ক্যারিয়ার',       to: '/career',       color: 'text-yellow-400', bg: 'bg-yellow-500/10', desc: 'Career Roadmap'             },
  ]

  const priority: Record<string, string[]> = {
    student:           ['/courses', '/encyclopedia', '/design-lab', '/ai'],
    site_engineer:     ['/construction', '/encyclopedia', '/design-lab', '/ai'],
    design_engineer:   ['/design-lab', '/software', '/encyclopedia', '/ai'],
    diploma_engineer:  ['/courses', '/construction', '/design-lab', '/ai'],
    researcher:        ['/research', '/encyclopedia', '/courses', '/ai'],
    consultant:        ['/design-lab', '/software', '/encyclopedia', '/career'],
    contractor:        ['/construction', '/courses', '/encyclopedia', '/ai'],
    graduate_engineer: ['/courses', '/encyclopedia', '/design-lab', '/software'],
  }

  const order  = priority[role] ?? []
  const sorted = [
    ...all.filter((l) =>  order.includes(l.to)),
    ...all.filter((l) => !order.includes(l.to)),
  ]
  return sorted.slice(0, 8)
}

function RecentActivity() {
  const items = [
    { icon: '📖', text: 'Encyclopedia: RCC Beam পড়েছো',      time: '২ ঘণ্টা আগে', pts: '+2'  },
    { icon: '✅', text: 'Lesson: RCC Design Basics সম্পন্ন',  time: 'গতকাল',        pts: '+5'  },
    { icon: '🎯', text: 'Daily Quiz পাস (৮/১০)',               time: 'গতকাল',        pts: '+10' },
    { icon: '🔥', text: '৩ দিনের Streak!',                     time: '৩ দিন আগে',   pts: ''    },
  ]
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-800 last:border-0">
          <span className="text-lg shrink-0">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-300 truncate">{item.text}</p>
            <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
          </div>
          {item.pts && (
            <span className="text-xs text-brand-400 font-medium shrink-0">{item.pts}</span>
          )}
        </div>
      ))}
    </div>
  )
}
