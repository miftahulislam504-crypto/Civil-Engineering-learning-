// ─── Points System ────────────────────────────────────────────────────────────
export const POINTS = {
  ARTICLE_READ:       2,
  LESSON_COMPLETE:    5,
  QUIZ_PASS:         10,
  MOCK_TEST_PASS:    20,
  COURSE_COMPLETE:   50,
  DAILY_STREAK_7:    30,
  PROFILE_COMPLETE:  10,
  FIRST_LOGIN:        5,
} as const

// ─── Rank System ──────────────────────────────────────────────────────────────
export const RANKS = [
  { label: 'Apprentice',       min: 0,    max: 100,  icon: '🌱', color: 'text-slate-400'  },
  { label: 'Junior Engineer',  min: 101,  max: 500,  icon: '⚙️', color: 'text-blue-400'   },
  { label: 'Engineer',         min: 501,  max: 1500, icon: '🔧', color: 'text-brand-400'  },
  { label: 'Senior Engineer',  min: 1501, max: 5000, icon: '🏗️', color: 'text-accent-400' },
  { label: 'Expert Engineer',  min: 5001, max: Infinity, icon: '🏆', color: 'text-yellow-400' },
] as const

export function getRank(points: number) {
  return RANKS.find((r) => points >= r.min && points <= r.max) ?? RANKS[0]
}

export function getNextRank(points: number) {
  const idx = RANKS.findIndex((r) => points >= r.min && points <= r.max)
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null
}

export function getRankProgress(points: number) {
  const rank = getRank(points)
  if (rank.max === Infinity) return 100
  const range = rank.max - rank.min
  const progress = points - rank.min
  return Math.round((progress / range) * 100)
}

// ─── Badges ───────────────────────────────────────────────────────────────────
export const BADGES: Record<string, { label: string; icon: string; desc: string; color: string }> = {
  first_login:       { label: 'প্রথম লগইন',      icon: '👋', desc: 'Enginex Learn-এ প্রথম লগইন',         color: 'bg-blue-500/15 border-blue-500/30 text-blue-400'    },
  profile_complete:  { label: 'প্রোফাইল পূর্ণ',  icon: '✅', desc: 'প্রোফাইল সম্পূর্ণ করেছো',            color: 'bg-green-500/15 border-green-500/30 text-green-400'  },
  first_course:      { label: 'প্রথম কোর্স',     icon: '📚', desc: 'প্রথম কোর্সে ভর্তি হয়েছো',           color: 'bg-brand-500/15 border-brand-500/30 text-brand-400'  },
  course_complete:   { label: 'কোর্স সম্পন্ন',   icon: '🎓', desc: 'প্রথম কোর্স সম্পূর্ণ করেছো',         color: 'bg-purple-500/15 border-purple-500/30 text-purple-400'},
  quiz_master:       { label: 'Quiz Master',      icon: '🎯', desc: '১০টি Quiz পাস করেছো',                 color: 'bg-accent-500/15 border-accent-500/30 text-accent-400'},
  streak_7:          { label: '৭ দিনের Streak',   icon: '🔥', desc: '৭ দিন ধারাবাহিকভাবে লগইন করেছো',   color: 'bg-orange-500/15 border-orange-500/30 text-orange-400'},
  encyclopedia_pro:  { label: 'Encyclopedia Pro', icon: '📖', desc: '৫০টি Wikipedia পড়েছো',              color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'     },
  design_expert:     { label: 'Design Expert',    icon: '📐', desc: 'Design Lab ১০ বার ব্যবহার করেছো',   color: 'bg-pink-500/15 border-pink-500/30 text-pink-400'     },
}
