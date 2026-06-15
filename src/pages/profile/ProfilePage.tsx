import { useState } from 'react'
import {
  Edit3, BookOpen, Bookmark, Clock, MapPin,
  GraduationCap, Briefcase, Calendar, Star,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { USER_ROLE_LABELS } from '@/types'
import Avatar from '@/components/common/Avatar'
import RankBadge from '@/components/common/RankBadge'
import StatCard from '@/components/common/StatCard'
import ProfileEditForm from '@/components/profile/ProfileEditForm'
import BadgesPanel from '@/components/profile/BadgesPanel'
import LearningRoadmap from '@/components/profile/LearningRoadmap'
import { useLearningProgress } from '@/hooks/useProfile'
import { calcProgress } from '@/utils'

type Tab = 'overview' | 'roadmap' | 'badges' | 'activity'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const [editing, setEditing] = useState(false)
  const [tab,     setTab]     = useState<Tab>('overview')

  const { data: progress } = useLearningProgress()

  if (!user) return null

  const completedCourses = progress?.filter((p) => p.isCompleted).length ?? 0
  const inProgress       = progress?.filter((p) => !p.isCompleted && p.progressPercent > 0).length ?? 0

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 animate-fade-in">

      {/* ── Profile Header Card ── */}
      <div className="card overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-brand-900 via-surface-800 to-accent-900 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-5">
            <Avatar
              name={user.displayName}
              photoURL={user.photoURL}
              size="xl"
              editable={!editing}
            />
            <div className="flex gap-2 sm:mb-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <Edit3 size={15} /> প্রোফাইল সম্পাদনা
                </button>
              ) : null}
            </div>
          </div>

          {editing ? (
            <ProfileEditForm onCancel={() => setEditing(false)} />
          ) : (
            <div className="space-y-3">
              {/* Name + Role */}
              <div>
                <h1 className="font-display text-2xl font-bold text-white">{user.displayName}</h1>
                <p className="text-brand-400 text-sm font-medium mt-0.5">
                  {USER_ROLE_LABELS[user.role]}
                </p>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{user.bio}</p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                {user.university && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap size={14} /> {user.university}
                  </span>
                )}
                {user.batch && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> ব্যাচ: {user.batch}
                  </span>
                )}
                {user.experience > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={14} /> {user.experience} বছরের অভিজ্ঞতা
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="text-yellow-400" /> {user.points} পয়েন্ট
                </span>
              </div>

              {/* Rank */}
              <RankBadge points={user.points} showBar showNext />
            </div>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={BookOpen}  label="কোর্সে ভর্তি"    value={user.enrolledCourses.length} color="text-brand-400"  bg="bg-brand-500/10"  />
        <StatCard icon={BookOpen}  label="কোর্স সম্পন্ন"   value={completedCourses}             color="text-green-400" bg="bg-green-500/10"  />
        <StatCard icon={Bookmark}  label="সেভ করা আর্টিকেল" value={user.savedArticles.length}  color="text-purple-400" bg="bg-purple-500/10" />
        <StatCard icon={Clock}     label="সম্প্রতি দেখা"   value={user.recentlyViewed.length}   color="text-accent-400" bg="bg-accent-500/10" />
      </div>

      {/* ── Tabs ── */}
      <div className="border-b border-slate-800">
        <nav className="flex gap-1 -mb-px">
          {([
            ['overview', 'সংক্ষেপ'],
            ['roadmap',  'Learning Roadmap'],
            ['badges',   'Badges'],
            ['activity', 'সাম্প্রতিক কার্যক্রম'],
          ] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Tab Content ── */}
      <div className="animate-fade-in">

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* In Progress */}
            <div className="card p-5">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-brand-400" />
                চলমান কোর্সসমূহ
                <span className="badge-brand ml-auto text-xs">{inProgress}</span>
              </h3>
              {inProgress === 0 ? (
                <EmptyPlaceholder text="এখনো কোনো কোর্স শুরু করোনি" link="/courses" linkText="কোর্স দেখো" />
              ) : (
                <div className="space-y-3">
                  {progress?.filter((p) => !p.isCompleted && p.progressPercent > 0).map((p) => (
                    <div key={p.courseId} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-500/15 flex items-center justify-center shrink-0">
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

            {/* Saved Articles */}
            <div className="card p-5">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Bookmark size={16} className="text-purple-400" />
                সেভ করা আর্টিকেল
                <span className="ml-auto text-xs bg-purple-500/15 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                  {user.savedArticles.length}
                </span>
              </h3>
              {user.savedArticles.length === 0 ? (
                <EmptyPlaceholder text="কোনো আর্টিকেল সেভ করোনি" link="/encyclopedia" linkText="Encyclopedia দেখো" />
              ) : (
                <p className="text-slate-400 text-sm">লোড হচ্ছে...</p>
              )}
            </div>

            {/* Recently Viewed */}
            <div className="card p-5">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={16} className="text-accent-400" />
                সম্প্রতি দেখেছো
              </h3>
              {user.recentlyViewed.length === 0 ? (
                <EmptyPlaceholder text="কিছু দেখোনি এখনো" link="/encyclopedia" linkText="শুরু করো" />
              ) : (
                <p className="text-slate-400 text-sm">লোড হচ্ছে...</p>
              )}
            </div>

            {/* Profile completion */}
            <div className="card p-5">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-green-400" />
                প্রোফাইল সম্পূর্ণতা
              </h3>
              <ProfileCompletion user={user} />
            </div>
          </div>
        )}

        {/* Roadmap */}
        {tab === 'roadmap' && (
          <div className="card p-6">
            <LearningRoadmap role={user.role} earnedBadges={user.badges} />
          </div>
        )}

        {/* Badges */}
        {tab === 'badges' && (
          <div className="card p-6">
            <BadgesPanel earnedBadges={user.badges} />
          </div>
        )}

        {/* Activity */}
        {tab === 'activity' && (
          <div className="card p-6">
            <h3 className="font-display font-semibold text-white mb-4">সাম্প্রতিক কার্যক্রম</h3>
            <ActivityFeed />
          </div>
        )}

      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ProfileCompletion({ user }: { user: ReturnType<typeof useAuthStore.getState>['user'] }) {
  if (!user) return null

  const items = [
    { label: 'নাম যোগ করা',        done: !!user.displayName },
    { label: 'ছবি যোগ করা',        done: !!user.photoURL    },
    { label: 'বিশ্ববিদ্যালয়',     done: !!user.university  },
    { label: 'সংক্ষিপ্ত পরিচয়',   done: !!user.bio         },
    { label: 'প্রথম কোর্সে ভর্তি', done: user.enrolledCourses.length > 0 },
  ]
  const done = items.filter((i) => i.done).length
  const pct  = calcProgress(done, items.length)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{pct}% সম্পূর্ণ</span>
        <span className="text-slate-500">{done}/{items.length}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="space-y-2 mt-3">
        {items.map(({ label, done }) => (
          <div key={label} className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
              done ? 'bg-brand-600' : 'bg-slate-800 border border-slate-700'
            }`}>
              {done && <span className="text-white text-[10px]">✓</span>}
            </div>
            <span className={done ? 'text-slate-300' : 'text-slate-500'}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivityFeed() {
  const items = [
    { icon: '📖', text: 'Encyclopedia: RCC Beam পড়েছো',       time: '২ ঘণ্টা আগে',  pts: '+2' },
    { icon: '✅', text: 'Lesson সম্পন্ন: RCC Design Basics',   time: 'গতকাল',         pts: '+5' },
    { icon: '🎯', text: 'Daily Quiz পাস করেছো (৮/১০)',         time: 'গতকাল',         pts: '+10' },
    { icon: '📚', text: 'Structural Engineering কোর্সে ভর্তি', time: '২ দিন আগে',     pts: '+5' },
    { icon: '🔥', text: '৩ দিনের Streak!',                      time: '৩ দিন আগে',    pts: '' },
  ]

  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-3 border-b border-slate-800 last:border-0"
        >
          <span className="text-xl shrink-0">{item.icon}</span>
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

function EmptyPlaceholder({ text, link, linkText }: { text: string; link: string; linkText: string }) {
  return (
    <div className="text-center py-6">
      <p className="text-slate-500 text-sm mb-3">{text}</p>
      <a href={link} className="btn-primary text-xs px-4 py-2">{linkText}</a>
    </div>
  )
}
