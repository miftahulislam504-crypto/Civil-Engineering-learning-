import { Link } from 'react-router-dom'
import { HardHat, ChevronRight, FileDown, PlayCircle } from 'lucide-react'

const SITE_TOPICS = [
  { emoji: '🏗️', title: 'মাটি খনন (Excavation)',       desc: 'পদ্ধতি, নিরাপত্তা, যন্ত্রপাতি' },
  { emoji: '🧱', title: 'ফাউন্ডেশন কাজ',               desc: 'Blinding, Waterproofing, Sequence' },
  { emoji: '🔩', title: 'রিইনফোর্সমেন্ট',              desc: 'বার কাটা, বাঁকানো, বাঁধাই' },
  { emoji: '🪵', title: 'ফর্মওয়ার্ক',                  desc: 'ধরন, ডিজাইন, Stripping সময়' },
  { emoji: '🪣', title: 'কংক্রিট ঢালাই',               desc: 'Mix, Batching, Placing, Curing' },
  { emoji: '🧱', title: 'মেসনারি কাজ',                 desc: 'Brick work, Mortar, Bond patterns' },
  { emoji: '🎨', title: 'ফিনিশিং কাজ',                 desc: 'Plaster, Paint, Flooring' },
]

const QC_TESTS = [
  { id: 'slump',   title: 'Slump Test',      titleBn: 'স্লাম্প টেস্ট',       code: 'ASTM C143', steps: 5 },
  { id: 'cube',    title: 'Cube Test',        titleBn: 'কিউব টেস্ট',          code: 'BS EN 12390', steps: 4 },
  { id: 'sieve',   title: 'Sieve Analysis',   titleBn: 'চালনি বিশ্লেষণ',      code: 'ASTM C136', steps: 6 },
  { id: 'proctor', title: 'Proctor Test',     titleBn: 'প্রক্টর টেস্ট',       code: 'ASTM D698', steps: 5 },
  { id: 'cbr',     title: 'CBR Test',         titleBn: 'CBR টেস্ট',           code: 'ASTM D1883', steps: 7 },
  { id: 'atterberg',title: 'Atterberg Limits',titleBn: 'অ্যাটারবার্গ সীমা',   code: 'ASTM D4318', steps: 4 },
]

const TEMPLATES = [
  { title: 'Daily Progress Report (DPR)',     titleBn: 'দৈনিক অগ্রগতি রিপোর্ট'  },
  { title: 'Site Inspection Report',          titleBn: 'সাইট পরিদর্শন রিপোর্ট'  },
  { title: 'Concrete Pouring Record',         titleBn: 'কংক্রিট ঢালাই রেকর্ড'   },
  { title: 'Material Inspection Report',      titleBn: 'উপকরণ পরিদর্শন রিপোর্ট' },
  { title: 'Quality Control Checklist',       titleBn: 'মান নিয়ন্ত্রণ চেকলিস্ট' },
  { title: 'Non-Conformance Report (NCR)',     titleBn: 'NCR ফর্ম'                },
]

export default function ConstructionPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
            <HardHat size={22} className="text-orange-400" />
          </div>
          Construction Learning Hub
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          সাইট ইঞ্জিনিয়ারিং, মান নিয়ন্ত্রণ ও সাইট ডকুমেন্টেশন
        </p>
      </div>

      {/* Site Engineering */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">🏗️ সাইট ইঞ্জিনিয়ারিং</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SITE_TOPICS.map((t) => (
            <div key={t.title} className="card-hover p-5 flex flex-col gap-3 group cursor-pointer">
              <span className="text-2xl">{t.emoji}</span>
              <div>
                <h3 className="font-medium text-white text-sm group-hover:text-orange-400 transition-colors">{t.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-orange-400 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle size={12} /> ভিডিও দেখো
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QC Tests */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">🔬 Quality Control Tests</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QC_TESTS.map((test) => (
            <div key={test.id} className="card-hover p-5 flex flex-col gap-3 group cursor-pointer">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white text-sm group-hover:text-brand-400 transition-colors">
                  {test.titleBn}
                </h3>
                <span className="badge-brand text-[10px]">{test.code}</span>
              </div>
              <p className="text-xs text-slate-500">{test.steps} ধাপে সম্পন্ন</p>
              <div className="flex items-center gap-1 text-xs text-brand-400 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={12} /> বিস্তারিত দেখো
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Documentation Templates */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">📋 সাইট ডকুমেন্টেশন টেমপ্লেট</h2>
        <p className="text-slate-400 text-sm">সরাসরি ডাউনলোড করে ব্যবহার করো</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <div key={t.title} className="card-hover flex items-center gap-4 p-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{t.titleBn}</p>
                <p className="text-xs text-slate-500 truncate">{t.title}</p>
              </div>
              <button className="p-2 btn-ghost text-slate-500 hover:text-brand-400 transition-colors shrink-0">
                <FileDown size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">📸 Case Studies</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { emoji: '🏢', title: 'আবাসিক ভবন (G+5)', desc: 'ফাউন্ডেশন থেকে ফিনিশিং পর্যন্ত সম্পূর্ণ প্রক্রিয়া' },
            { emoji: '🌉', title: 'ব্রিজ প্রজেক্ট',    desc: 'ফাউন্ডেশন, Substructure ও Superstructure' },
            { emoji: '🛣️', title: 'রোড প্রজেক্ট',      desc: 'Earthwork থেকে Surface পর্যন্ত' },
            { emoji: '🏗️', title: 'কমার্শিয়াল ভবন',  desc: 'RCC Frame construction বিস্তারিত' },
          ].map((cs) => (
            <div key={cs.title} className="card-hover p-5 flex items-start gap-4 group cursor-pointer">
              <span className="text-3xl shrink-0">{cs.emoji}</span>
              <div>
                <h3 className="font-medium text-white group-hover:text-orange-400 transition-colors">{cs.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{cs.desc}</p>
                <p className="text-xs text-orange-400 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={11} /> Case Study দেখো
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
