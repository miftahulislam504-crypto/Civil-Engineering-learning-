import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Target, Clock, Zap, BookOpen, TrendingUp, Trophy, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

const QUIZ_CATEGORIES = [
  { id: 'structural',       label: 'স্ট্রাকচারাল',       icon: '🏗️', count: 45 },
  { id: 'geotechnical',     label: 'জিওটেকনিক্যাল',      icon: '🌍', count: 30 },
  { id: 'transportation',   label: 'ট্রান্সপোর্টেশন',    icon: '🛣️', count: 28 },
  { id: 'water_resources',  label: 'পানি সম্পদ',         icon: '💧', count: 22 },
  { id: 'construction',     label: 'কনস্ট্রাকশন',        icon: '🔨', count: 35 },
  { id: 'materials',        label: 'নির্মাণ উপকরণ',      icon: '🧱', count: 18 },
]

const MOCK_TESTS = [
  { id: 'mock-1', title: 'Full Civil Engineering Mock Test',    titleBn: 'পূর্ণাঙ্গ Mock Test - ১', questions: 50, duration: 60, difficulty: 'hard'   },
  { id: 'mock-2', title: 'Structural Engineering Mock Test',    titleBn: 'স্ট্রাকচারাল Mock Test',  questions: 30, duration: 40, difficulty: 'medium' },
  { id: 'mock-3', title: 'Geotechnical Engineering Mock Test',  titleBn: 'জিওটেক Mock Test',        questions: 30, duration: 40, difficulty: 'medium' },
]

export default function QuizPage() {
  const [activeTab, setActiveTab] = useState<'topic' | 'mock' | 'daily'>('topic')

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center">
            <Target size={22} className="text-accent-400" />
          </div>
          Quiz ও পরীক্ষা
        </h1>
        <p className="text-slate-400 mt-2 text-sm">MCQ Quiz, Mock Test ও Daily Challenge</p>
      </div>

      {/* Daily Quiz Banner */}
      <Link to="/quiz/daily" className="block relative overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-950/60 to-surface-800 p-6 group">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow shrink-0">
              <Zap size={22} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-lg">আজকের Daily Quiz</p>
              <p className="text-slate-400 text-sm mt-0.5">১০টি প্রশ্ন • ১০ মিনিট • +১০ পয়েন্ট</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-brand-600 group-hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap">
            শুরু করো <ChevronRight size={15} />
          </div>
        </div>
      </Link>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800">
        {([
          ['topic', <BookOpen size={14} />, 'বিষয়ভিত্তিক Quiz'],
          ['mock',  <Clock    size={14} />, 'Mock Test'],
          ['daily', <TrendingUp size={14}/>, 'আমার স্কোর'],
        ] as [typeof activeTab, React.ReactNode, string][]).map(([t, icon, label]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === t ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-300')}>
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Topic Quizzes */}
      {activeTab === 'topic' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUIZ_CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/quiz/${cat.id}`}
              className="card-hover p-5 flex flex-col gap-3 group">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs text-slate-500">{cat.count} প্রশ্ন</span>
              </div>
              <h3 className="font-display font-semibold text-white group-hover:text-brand-400 transition-colors">
                {cat.label}
              </h3>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-500">বিষয়ভিত্তিক MCQ</span>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Mock Tests */}
      {activeTab === 'mock' && (
        <div className="space-y-4">
          {MOCK_TESTS.map((test) => (
            <Link key={test.id} to={`/quiz/${test.id}`}
              className="card-hover flex items-center gap-5 p-5 group">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
                <Trophy size={20} className="text-accent-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white group-hover:text-brand-400 transition-colors">
                  {test.titleBn}
                </h3>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Target size={11} /> {test.questions} প্রশ্ন</span>
                  <span className="flex items-center gap-1"><Clock  size={11} /> {test.duration} মিনিট</span>
                  <span className={cn('badge border text-[10px]',
                    test.difficulty === 'hard'   ? 'text-red-400    bg-red-500/10    border-red-500/20'    :
                    test.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                                                   'text-green-400  bg-green-500/10  border-green-500/20'  )}>
                    {test.difficulty === 'hard' ? 'কঠিন' : test.difficulty === 'medium' ? 'মাঝারি' : 'সহজ'}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {/* Score History */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'মোট Quiz',    value: '24',   icon: Target,     color: 'text-brand-400',  bg: 'bg-brand-500/10'  },
              { label: 'গড় স্কোর',  value: '76%',  icon: TrendingUp, color: 'text-green-400',  bg: 'bg-green-500/10'  },
              { label: 'Streak',      value: '5 দিন',icon: Zap,        color: 'text-accent-400', bg: 'bg-accent-500/10' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card p-4 flex flex-col items-center gap-2 text-center">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
                  <Icon size={18} className={color} />
                </div>
                <p className="font-display text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-white mb-4">সাম্প্রতিক ফলাফল</h3>
            <div className="space-y-3">
              {[
                { cat: 'Structural',    score: 8,  total: 10, time: 'আজ'       },
                { cat: 'Geotechnical', score: 7,  total: 10, time: 'গতকাল'    },
                { cat: 'Daily Quiz',   score: 9,  total: 10, time: '২ দিন আগে'},
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                    {r.score}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{r.cat}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', (r.score/r.total) >= 0.7 ? 'bg-green-500' : 'bg-amber-500')}
                          style={{ width: `${(r.score/r.total)*100}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">{r.score}/{r.total}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-600 shrink-0">{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
