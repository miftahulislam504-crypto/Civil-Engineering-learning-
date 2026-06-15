import { Monitor, ChevronRight, PlayCircle, FileDown } from 'lucide-react'
import { cn } from '@/utils'
import { useState } from 'react'

const SOFTWARE_LIST = [
  {
    id: 'autocad', name: 'AutoCAD', category: 'CAD', icon: '📐',
    desc: '2D Drafting, Plotting, Civil commands',
    color: 'text-red-400 bg-red-500/10 border-red-500/20',
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Real Project'],
    free: true,
  },
  {
    id: 'etabs', name: 'ETABS', category: 'Structural', icon: '🏗️',
    desc: 'Building modeling, Analysis, Design',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Real Project'],
    free: false,
  },
  {
    id: 'safe', name: 'SAFE', category: 'Structural', icon: '🏛️',
    desc: 'Slab and mat foundation design',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    free: false,
  },
  {
    id: 'revit', name: 'Revit', category: 'BIM', icon: '🏢',
    desc: 'Architecture, Structure, MEP basics',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Real Project'],
    free: false,
  },
  {
    id: 'primavera', name: 'Primavera P6', category: 'Project Mgmt', icon: '📊',
    desc: 'Scheduling, Resource, S-curve',
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    free: false,
  },
  {
    id: 'staad', name: 'STAAD Pro', category: 'Structural', icon: '⚙️',
    desc: 'General structural analysis',
    color: 'text-green-400 bg-green-500/10 border-green-500/20',
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    free: false,
  },
  {
    id: 'qgis', name: 'QGIS', category: 'GIS', icon: '🗺️',
    desc: 'Free GIS alternative to ArcGIS',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    levels: ['Beginner', 'Intermediate'],
    free: true,
  },
  {
    id: 'civil3d', name: 'Civil 3D', category: 'CAD', icon: '🛣️',
    desc: 'Survey, Surface, Corridor, Pipe network',
    color: 'text-red-400 bg-red-500/10 border-red-500/20',
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    free: false,
  },
]

const CATEGORIES = ['সব', 'CAD', 'Structural', 'BIM', 'Project Mgmt', 'GIS']

export default function SoftwarePage() {
  const [activeCategory, setActiveCategory] = useState('সব')
  const [activeSoftware, setActiveSoftware] = useState<string | null>(null)

  const filtered = activeCategory === 'সব'
    ? SOFTWARE_LIST
    : SOFTWARE_LIST.filter((s) => s.category === activeCategory)

  const sw = SOFTWARE_LIST.find((s) => s.id === activeSoftware)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <Monitor size={22} className="text-cyan-400" />
          </div>
          Software Learning Hub
        </h1>
        <p className="text-slate-400 mt-2 text-sm">AutoCAD, ETABS, Revit, Primavera ও আরো অনেক কিছু</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={cn('text-sm px-4 py-2 rounded-xl border transition-all',
              activeCategory === cat
                ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Software grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:col-span-1">
          {filtered.map((s) => (
            <button key={s.id} onClick={() => setActiveSoftware(s.id)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all',
                activeSoftware === s.id
                  ? 'border-brand-500/40 bg-brand-500/10'
                  : 'card hover:border-slate-600',
              )}>
              <span className="text-2xl shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn('text-sm font-medium', activeSoftware === s.id ? 'text-brand-400' : 'text-white')}>
                    {s.name}
                  </p>
                  {s.free && <span className="text-[9px] text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">Free</span>}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{s.desc}</p>
              </div>
              <ChevronRight size={14} className={cn('shrink-0', activeSoftware === s.id ? 'text-brand-400' : 'text-slate-600')} />
            </button>
          ))}
        </div>

        {/* Software detail */}
        <div className="lg:col-span-2">
          {!sw ? (
            <div className="card p-12 flex items-center justify-center text-center h-full min-h-[400px]">
              <div>
                <Monitor size={36} className="text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">বাম দিক থেকে একটি Software সিলেক্ট করো</p>
              </div>
            </div>
          ) : (
            <div className="card p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <span className="text-4xl">{sw.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-display text-2xl font-bold text-white">{sw.name}</h2>
                    <span className={cn('badge border text-xs', sw.color)}>{sw.category}</span>
                    {sw.free && <span className="badge text-xs text-green-400 bg-green-500/10 border border-green-500/20">Free Software</span>}
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{sw.desc}</p>
                </div>
              </div>

              {/* Levels */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-white text-sm">শেখার ধাপ</h3>
                <div className="space-y-3">
                  {sw.levels.map((level, i) => (
                    <div key={level} className="card-hover p-4 flex items-center gap-4 group cursor-pointer">
                      <div className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0',
                        i === 0 ? 'bg-green-500/15 text-green-400' :
                        i === 1 ? 'bg-yellow-500/15 text-yellow-400' :
                        i === 2 ? 'bg-red-500/15 text-red-400' :
                                  'bg-brand-500/15 text-brand-400',
                      )}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors">
                          {level === 'Beginner'    ? 'শিক্ষানবিস (Beginner)' :
                           level === 'Intermediate' ? 'মধ্যবর্তী (Intermediate)' :
                           level === 'Advanced'     ? 'উন্নত (Advanced)' :
                                                      'বাস্তব প্রজেক্ট (Real Project)'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {level === 'Beginner'    ? 'Interface, Basic commands, Simple example' :
                           level === 'Intermediate' ? 'Advanced tools, Real problems' :
                           level === 'Advanced'     ? 'Complex models, Code check, Optimization' :
                                                      'Project setup to completion, Report generation'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <PlayCircle size={14} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                        <FileDown   size={14} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coming soon note */}
              <div className="p-4 rounded-xl bg-brand-500/8 border border-brand-500/20">
                <p className="text-sm text-brand-300">
                  📢 {sw.name} কোর্স কনটেন্ট শীঘ্রই যোগ হবে। নোটিফিকেশন পেতে Subscribe করো।
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
