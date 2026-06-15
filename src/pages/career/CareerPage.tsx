import { Briefcase, ChevronRight, TrendingUp } from 'lucide-react'
import { cn } from '@/utils'
import { useState } from 'react'
import type { UserRole } from '@/types'

const ROADMAPS: Record<string, { title: string; steps: { level: string; title: string; skills: string[]; salary: string }[] }> = {
  site: {
    title: 'Site Engineer → Project Manager',
    steps: [
      { level: 'শুরু',      title: 'Junior Site Engineer',  skills: ['Site safety', 'DPR writing', 'Basic QC'],          salary: '৳৲৫-৮ লক্ষ' },
      { level: 'মধ্যম',    title: 'Site Engineer',         skills: ['RCC supervision', 'Formwork', 'Team management'],   salary: '৳৲৮-১৪ লক্ষ' },
      { level: 'উন্নত',    title: 'Senior Site Engineer',  skills: ['Multi-story', 'Scheduling', 'Subcontractor mgmt'],  salary: '৳৲১৪-২২ লক্ষ' },
      { level: 'বিশেষজ্ঞ', title: 'Project Engineer',      skills: ['Planning', 'Cost control', 'Client relations'],     salary: '৳৲২২-৩৫ লক্ষ' },
      { level: 'শীর্ষ',    title: 'Project Manager',       skills: ['Program mgmt', 'Risk', 'Stakeholder mgmt'],         salary: '৳৲৩৫+ লক্ষ' },
    ],
  },
  structural: {
    title: 'Design Engineer → Lead Structural Engineer',
    steps: [
      { level: 'শুরু',      title: 'Junior Design Engineer',    skills: ['AutoCAD', 'Basic RCC', 'ETABS basics'],              salary: '৳৲৫-৮ লক্ষ' },
      { level: 'মধ্যম',    title: 'Design Engineer',            skills: ['ETABS/SAFE', 'Foundation', 'BNBC codes'],            salary: '৳৲৮-১৫ লক্ষ' },
      { level: 'উন্নত',    title: 'Senior Design Engineer',    skills: ['High-rise', 'Seismic design', 'Peer review'],        salary: '৳৲১৫-২৫ লক্ষ' },
      { level: 'শীর্ষ',    title: 'Lead Structural Engineer',  skills: ['Complex structures', 'Team lead', 'Project delivery'],salary: '৳৲২৫+ লক্ষ' },
    ],
  },
}

const FREELANCE_SERVICES = [
  { emoji: '📋', title: 'BOQ Preparation',    desc: 'প্রতিটি আইটেমের পরিমাণ ও মূল্য' },
  { emoji: '📐', title: 'Structural Design',  desc: 'RCC Beam, Column, Slab design' },
  { emoji: '💰', title: 'Cost Estimation',    desc: 'প্রজেক্টের সম্পূর্ণ খরচ নির্ধারণ' },
  { emoji: '📊', title: 'Project Planning',   desc: 'Gantt Chart, Schedule তৈরি' },
  { emoji: '🎨', title: 'AutoCAD Drafting',   desc: 'Floor plan, Section, Detail drawing' },
  { emoji: '🔍', title: 'QA/QC Consulting',  desc: 'Quality inspection ও reporting' },
]

export default function CareerPage() {
  const [activeRole, setActiveRole] = useState<'site' | 'structural'>('site')
  const roadmap = ROADMAPS[activeRole]

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center">
            <Briefcase size={22} className="text-yellow-400" />
          </div>
          Career Development Center
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Career Roadmap, Freelancing ও Professional Skills</p>
      </div>

      {/* Career Roadmap */}
      <section className="space-y-5">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp size={18} className="text-yellow-400" /> Career Roadmap
        </h2>

        {/* Role selector */}
        <div className="flex gap-2">
          {[['site', '🏗️ Site Engineer'], ['structural', '📐 Design Engineer']] .map(([key, label]) => (
            <button key={key} onClick={() => setActiveRole(key as 'site' | 'structural')}
              className={cn('text-sm px-4 py-2 rounded-xl border transition-all',
                activeRole === key ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
              {label}
            </button>
          ))}
        </div>

        <p className="text-brand-400 font-medium">{roadmap.title}</p>

        <div className="space-y-0">
          {roadmap.steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 bg-slate-800 border-2 border-brand-500/40 text-brand-400 text-xs font-bold">
                  {i + 1}
                </div>
                {i < roadmap.steps.length - 1 && <div className="w-0.5 flex-1 bg-slate-800 my-1" />}
              </div>
              <div className={cn('pb-5 flex-1', i === roadmap.steps.length - 1 && 'pb-0')}>
                <div className="card p-4 hover:border-brand-500/30 transition-colors">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">{step.level}</span>
                      <h3 className="font-display font-semibold text-white text-sm">{step.title}</h3>
                    </div>
                    <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full font-medium">{step.salary}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {step.skills.map((s) => (
                      <span key={s} className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Freelancing */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">💻 Freelancing for Civil Engineers</h2>
        <p className="text-slate-400 text-sm">Civil Engineering দিয়ে Upwork, Fiverr ও local market-এ কাজ করো</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FREELANCE_SERVICES.map((s) => (
            <div key={s.title} className="card-hover p-5 flex items-start gap-3 group cursor-pointer">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div>
                <h3 className="font-medium text-white text-sm group-hover:text-yellow-400 transition-colors">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="card p-5 flex items-start gap-4">
          <span className="text-2xl">🎯</span>
          <div>
            <h3 className="font-medium text-white">Freelancing শেখার Roadmap</h3>
            <p className="text-sm text-slate-400 mt-1">Profile তৈরি → Proposal লেখা → প্রথম কাজ পাওয়া → Rating বাড়ানো</p>
            <button className="btn-primary text-sm mt-3 flex items-center gap-2">
              গাইড পড়ো <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Professional Skills */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">🎓 Professional Skills</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { emoji: '📝', title: 'Technical Report Writing', desc: 'Format, language, structure' },
            { emoji: '🎤', title: 'Presentation Skills',      desc: 'Engineering presentations' },
            { emoji: '🤝', title: 'Client Communication',     desc: 'Meeting, email, proposal' },
            { emoji: '⚖️', title: 'Engineering Ethics',       desc: 'Professional responsibility' },
          ].map((skill) => (
            <div key={skill.title} className="card-hover flex items-center gap-4 p-4 group cursor-pointer">
              <span className="text-2xl shrink-0">{skill.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">{skill.title}</p>
                <p className="text-xs text-slate-500">{skill.desc}</p>
              </div>
              <ChevronRight size={14} className="text-slate-600 group-hover:text-yellow-400 transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
