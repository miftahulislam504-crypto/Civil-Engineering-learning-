import { Microscope, ChevronRight, ExternalLink } from 'lucide-react'

const RESEARCH_TOPICS = [
  { emoji: '🏗️', title: 'BIM (Building Information Modeling)', desc: 'LOD, IFC, Clash detection, 4D/5D BIM' },
  { emoji: '🌐', title: 'Digital Twin',                        desc: 'Concept, Applications, Tools' },
  { emoji: '🏙️', title: 'Smart Cities',                       desc: 'Infrastructure, IoT in Civil Engineering' },
  { emoji: '🌿', title: 'Green Building',                     desc: 'LEED, BNBC Green, Passive design' },
  { emoji: '♻️', title: 'Sustainable Construction',           desc: 'Materials, Methods, Carbon footprint' },
  { emoji: '🤖', title: 'AI in Civil Engineering',           desc: 'Structural health monitoring, Predictive maintenance' },
  { emoji: '🚁', title: 'Drone in Construction',             desc: 'Survey, Inspection, Progress monitoring' },
  { emoji: '📊', title: 'Data-Driven Engineering',           desc: 'Sensors, Analytics, Decision making' },
]

const RESEARCH_GUIDES = [
  { title: 'Research Methodology',   titleBn: 'গবেষণা পদ্ধতি',           steps: 6  },
  { title: 'Thesis Writing Guide',   titleBn: 'থিসিস লেখার গাইড',       steps: 8  },
  { title: 'Journal Paper Writing',  titleBn: 'জার্নাল পেপার লেখা',      steps: 7  },
  { title: 'Citation Styles',        titleBn: 'Citation পদ্ধতি (APA, IEEE)', steps: 3 },
]

export default function ResearchPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center">
            <Microscope size={22} className="text-pink-400" />
          </div>
          Research & Innovation Hub
        </h1>
        <p className="text-slate-400 mt-2 text-sm">আধুনিক প্রযুক্তি, গবেষণা পদ্ধতি ও Innovation</p>
      </div>

      {/* Modern Topics */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">🚀 আধুনিক বিষয়সমূহ</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RESEARCH_TOPICS.map((t) => (
            <div key={t.title} className="card-hover p-5 flex flex-col gap-3 group cursor-pointer">
              <span className="text-2xl">{t.emoji}</span>
              <h3 className="font-medium text-white text-sm leading-tight group-hover:text-pink-400 transition-colors">{t.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
              <div className="flex items-center gap-1 text-xs text-pink-400 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={11} /> পড়ো
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Research Guides */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">📚 গবেষণা গাইড</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {RESEARCH_GUIDES.map((g) => (
            <div key={g.title} className="card-hover p-5 flex items-start gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-lg shrink-0">📖</div>
              <div className="flex-1">
                <h3 className="font-medium text-white text-sm group-hover:text-pink-400 transition-colors">{g.titleBn}</h3>
                <p className="text-xs text-slate-500 mt-1">{g.steps} ধাপ</p>
              </div>
              <ChevronRight size={14} className="text-slate-600 group-hover:text-pink-400 transition-colors mt-1 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Research databases */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">🔗 গবেষণা ডেটাবেস</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: 'Google Scholar', url: 'https://scholar.google.com', desc: 'বিনামূল্যে academic papers' },
            { name: 'ResearchGate',   url: 'https://researchgate.net',   desc: 'Research sharing platform' },
            { name: 'ASCE Library',   url: 'https://ascelibrary.org',    desc: 'Civil Engineering journals' },
          ].map((db) => (
            <a key={db.name} href={db.url} target="_blank" rel="noopener noreferrer"
              className="card-hover p-5 flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0">🌐</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors">{db.name}</p>
                <p className="text-xs text-slate-500">{db.desc}</p>
              </div>
              <ExternalLink size={13} className="text-slate-600 group-hover:text-brand-400 transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
