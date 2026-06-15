import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Bot, FlaskConical, Library, BookMarked, Award, ChevronRight, Star } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function HomePage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-500/8 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            <span className="text-brand-400 text-sm font-medium">বাংলার সেরা Civil Engineering Platform</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Civil Engineering<br />
            <span className="gradient-text">বাংলায় শেখো</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            শিক্ষার্থী থেকে Professional Engineer — সব শেখার রিসোর্স,
            ডিজাইন টুল, AI সহায়তা এবং Knowledge Base বাংলায়।
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 text-base">
                ড্যাশবোর্ডে যাও <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/auth/register" className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 text-base">
                  বিনামূল্যে শুরু করো <ArrowRight size={18} />
                </Link>
                <Link to="/encyclopedia" className="btn-secondary flex items-center justify-center gap-2 px-8 py-3.5 text-base">
                  Encyclopedia দেখো
                </Link>
              </>
            )}
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              বিনামূল্যে শুরু
            </span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>কোনো ক্রেডিট কার্ড দরকার নেই</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>সম্পূর্ণ বাংলায়</span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-6 py-12 border-y border-slate-800 bg-surface-900/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '১০,০০০+', label: 'আর্টিকেল' },
            { value: '৫০০+',   label: 'ভিডিও লেসন' },
            { value: '৫০+',    label: 'Design Calculator' },
            { value: '১২টি',   label: 'Engineering বিভাগ' },
          ].map(({ value, label }) => (
            <div key={label} className="space-y-1">
              <p className="font-display text-3xl font-bold gradient-text">{value}</p>
              <p className="text-slate-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Core Features ── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              একটি Platform, সব কিছু
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              শুধু কোর্স নয় — এটা একটি পূর্ণাঙ্গ Civil Engineering Knowledge Ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color, bg, to }) => (
              <Link
                key={title}
                to={to}
                className="card-hover p-6 group flex flex-col gap-4"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white group-hover:text-brand-400 transition-colors mb-1">
                    {title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
                <div className="flex items-center gap-1 text-brand-400 text-sm font-medium mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  দেখো <ChevronRight size={15} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who is it for ── */}
      <section className="px-6 py-20 bg-surface-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white mb-3">কাদের জন্য?</h2>
            <p className="text-slate-400">সব স্তরের Civil Engineer-দের জন্য</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {audiences.map(({ emoji, title, desc }) => (
              <div key={title} className="card p-5 text-center hover:border-brand-500/30 transition-colors">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-display font-semibold text-white text-sm mb-1">{title}</h3>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900/60 to-surface-800 border border-brand-500/20 p-10">
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/15 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl font-bold text-white mb-4">
                আজই শুরু করো
              </h2>
              <p className="text-slate-400 mb-8">
                বিনামূল্যে রেজিস্ট্রেশন করো এবং হাজার হাজার রিসোর্সে প্রবেশ করো
              </p>
              {!user && (
                <Link
                  to="/auth/register"
                  className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base"
                >
                  এখনই শুরু করো <ArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <span className="font-display font-bold text-white text-xs">E</span>
            </div>
            <span className="font-display font-bold text-white">Enginex Learn</span>
          </div>
          <p className="text-slate-600 text-sm">© 2025 Enginex Learn. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>

    </div>
  )
}

const features = [
  {
    icon: BookOpen, title: 'Learning Center',
    desc: 'ভিডিও, PDF ও টেক্সট কোর্স। Civil Engineering-এর সব বিষয় বাংলায়।',
    color: 'text-brand-400', bg: 'bg-brand-500/10', to: '/courses',
  },
  {
    icon: BookMarked, title: 'Civil Encyclopedia',
    desc: 'হাজার হাজার Topic। Theory, Formula, Diagram, Example — সব একসাথে।',
    color: 'text-purple-400', bg: 'bg-purple-500/10', to: '/encyclopedia',
  },
  {
    icon: Library, title: 'Engineering Library',
    desc: 'Notes, Handbooks, Standards (BNBC, ACI) ও Reference Tables।',
    color: 'text-green-400', bg: 'bg-green-500/10', to: '/library',
  },
  {
    icon: FlaskConical, title: 'Design Lab',
    desc: 'RCC, Footing, Slab ডিজাইন ক্যালকুলেটর। Step-by-step result।',
    color: 'text-accent-400', bg: 'bg-accent-500/10', to: '/design-lab',
  },
  {
    icon: Bot, title: 'AI Civil Tutor',
    desc: 'বাংলায় যেকোনো Civil Engineering প্রশ্ন করো। AI সাথে সাথে উত্তর দেবে।',
    color: 'text-cyan-400', bg: 'bg-cyan-500/10', to: '/ai',
  },
  {
    icon: Award, title: 'Certificate System',
    desc: 'কোর্স শেষে Certificate পাও। LinkedIn-এ শেয়ার করো।',
    color: 'text-yellow-400', bg: 'bg-yellow-500/10', to: '/certificates',
  },
]

const audiences = [
  { emoji: '🎓', title: 'শিক্ষার্থী',      desc: '১ম বর্ষ থেকে Final Year পর্যন্ত সব রিসোর্স' },
  { emoji: '🏗️', title: 'সাইট ইঞ্জিনিয়ার', desc: 'Site কাজের গাইড, QC, Documentation' },
  { emoji: '📐', title: 'ডিজাইন ইঞ্জিনিয়ার', desc: 'RCC, Steel, Foundation Design Learning' },
  { emoji: '🔬', title: 'গবেষক',           desc: 'Research Hub, Modern Topics, Innovation' },
]
