import { useState } from 'react'
import { FlaskConical, ChevronRight, Calculator, BookOpen } from 'lucide-react'
import { cn } from '@/utils'

// ── Calculator Definitions ─────────────────────────────────────────────────────
interface CalcInput {
  id:          string
  label:       string
  symbol:      string
  unit:        string
  placeholder: string
  hint?:       string
}

interface CalcResult {
  label:  string
  value:  string
  unit:   string
  note?:  string
}

interface Calculator {
  id:        string
  title:     string
  titleBn:   string
  category:  string
  icon:      string
  desc:      string
  inputs:    CalcInput[]
  codeRef:   string
  compute:   (inputs: Record<string, number>) => CalcResult[]
}

const CALCULATORS: Calculator[] = [
  {
    id: 'rcc-beam', title: 'RCC Beam Design', titleBn: 'RCC বিম ডিজাইন',
    category: 'Structural', icon: '🏗️',
    desc:    'সিঙ্গেলি রিইনফোর্সড RCC বিমের Ast নির্ণয়',
    codeRef: 'BNBC 2020 / ACI 318-19',
    inputs: [
      { id: 'Mu',  label: 'Design Moment',      symbol: 'Mu',  unit: 'kN·m', placeholder: '150',  hint: 'ফ্যাক্টর্ড মোমেন্ট' },
      { id: 'b',   label: 'Beam Width',          symbol: 'b',   unit: 'mm',   placeholder: '250'  },
      { id: 'd',   label: 'Effective Depth',     symbol: 'd',   unit: 'mm',   placeholder: '450'  },
      { id: 'fck', label: "Concrete Grade f'c",  symbol: "f'c", unit: 'MPa',  placeholder: '25'   },
      { id: 'fy',  label: 'Steel Grade fy',      symbol: 'fy',  unit: 'MPa',  placeholder: '415'  },
    ],
    compute({ Mu, b, d, fck, fy }) {
      const MuNmm = Mu * 1e6
      const Rn    = MuNmm / (b * d * d)
      const rho   = (0.85 * fck / fy) * (1 - Math.sqrt(1 - (2 * Rn) / (0.85 * fck)))
      const Ast   = rho * b * d
      const rhoMin = Math.max(0.25 * Math.sqrt(fck) / fy, 1.4 / fy)
      const rhoMax = 0.75 * 0.85 * (fck / fy) * (600 / (600 + fy))
      const status = rho < rhoMin ? '⚠️ রিইনফোর্সমেন্ট বাড়াও (min ρ নয়)' :
                     rho > rhoMax ? '❌ বিম সাইজ বাড়াও (over-reinforced)' : '✅ OK'
      return [
        { label: 'Required Ast', value: Ast.toFixed(0),          unit: 'mm²', note: status },
        { label: 'ρ (provided)',  value: (rho * 100).toFixed(4),  unit: '%'              },
        { label: 'ρ_min',        value: (rhoMin * 100).toFixed(4),unit: '%'              },
        { label: 'ρ_max',        value: (rhoMax * 100).toFixed(4),unit: '%'              },
        { label: 'Rn',           value: Rn.toFixed(2),            unit: 'MPa'            },
      ]
    },
  },
  {
    id: 'footing', title: 'Isolated Footing Design', titleBn: 'আইসোলেটেড ফুটিং ডিজাইন',
    category: 'Structural', icon: '🏛️',
    desc:    'কলামের ভার থেকে ফুটিং সাইজ নির্ণয়',
    codeRef: 'BNBC 2020 / ACI 318-19',
    inputs: [
      { id: 'P',   label: 'Column Load',    symbol: 'P',   unit: 'kN',  placeholder: '800',  hint: 'সার্ভিস লোড' },
      { id: 'SBC', label: 'Safe Bearing Capacity', symbol: 'SBC', unit: 'kN/m²', placeholder: '150' },
      { id: 'fck', label: "Concrete f'c",   symbol: "f'c", unit: 'MPa', placeholder: '25'  },
      { id: 'fy',  label: 'Steel fy',       symbol: 'fy',  unit: 'MPa', placeholder: '415' },
    ],
    compute({ P, SBC, fck, fy }) {
      const Areq    = (P * 1.1) / SBC   // 10% self-weight
      const B       = Math.ceil(Math.sqrt(Areq) * 100) / 100
      const Pu      = 1.5 * P
      const d_est   = Math.ceil(B * 1000 / 8)   // rough estimate
      const Ast_est = (0.0018 * B * 1000 * d_est)
      return [
        { label: 'Min Footing Size B', value: B.toFixed(2),     unit: 'm'   },
        { label: 'Area Required',      value: Areq.toFixed(2),  unit: 'm²'  },
        { label: 'Factored Load Pu',   value: Pu.toFixed(0),    unit: 'kN'  },
        { label: 'Est. Depth d',       value: d_est.toFixed(0), unit: 'mm'  },
        { label: 'Min Ast (temp)',      value: Ast_est.toFixed(0), unit: 'mm²' },
      ]
    },
  },
  {
    id: 'bearing', title: 'Bearing Capacity', titleBn: 'বেয়ারিং ক্যাপাসিটি (Terzaghi)',
    category: 'Geotechnical', icon: '🌍',
    desc:    'মাটির চাপ বহন ক্ষমতা নির্ণয় (Terzaghi)',
    codeRef: 'BNBC 2020, Terzaghi 1943',
    inputs: [
      { id: 'c',   label: 'Cohesion c',     symbol: 'c',   unit: 'kN/m²', placeholder: '20'  },
      { id: 'phi', label: 'Friction Angle', symbol: 'φ',   unit: '°',     placeholder: '30'  },
      { id: 'gamma',label: 'Unit Weight γ', symbol: 'γ',   unit: 'kN/m³', placeholder: '18'  },
      { id: 'Df',  label: 'Depth Df',       symbol: 'Df',  unit: 'm',     placeholder: '1.5' },
      { id: 'B',   label: 'Footing Width',  symbol: 'B',   unit: 'm',     placeholder: '2.0' },
      { id: 'FOS', label: 'Factor of Safety',symbol:'FOS', unit: '',      placeholder: '3'   },
    ],
    compute({ c, phi, gamma, Df, B, FOS }) {
      const φr   = (phi * Math.PI) / 180
      const Nq   = Math.exp(Math.PI * Math.tan(φr)) * Math.pow(Math.tan(Math.PI / 4 + φr / 2), 2)
      const Nc   = (Nq - 1) / Math.tan(φr)
      const Ngamma = 2 * (Nq + 1) * Math.tan(φr)
      const qu   = c * Nc + gamma * Df * Nq + 0.5 * gamma * B * Ngamma
      const qa   = qu / FOS
      return [
        { label: 'Ultimate Capacity qu', value: qu.toFixed(1), unit: 'kN/m²'                    },
        { label: 'Allowable Capacity qa',value: qa.toFixed(1), unit: 'kN/m²', note: `FOS = ${FOS}` },
        { label: 'Nc',                   value: Nc.toFixed(2), unit: ''                          },
        { label: 'Nq',                   value: Nq.toFixed(2), unit: ''                          },
        { label: 'Nγ',                   value: Ngamma.toFixed(2), unit: ''                      },
      ]
    },
  },
  {
    id: 'settlement', title: 'Immediate Settlement', titleBn: 'তাৎক্ষণিক সেটেলমেন্ট',
    category: 'Geotechnical', icon: '📉',
    desc:    'Elastic theory অনুযায়ী তাৎক্ষণিক সেটেলমেন্ট',
    codeRef: 'Bowles (1996)',
    inputs: [
      { id: 'q',  label: 'Net Foundation Pressure', symbol: 'q',  unit: 'kN/m²', placeholder: '150' },
      { id: 'B',  label: 'Footing Width B',          symbol: 'B',  unit: 'm',     placeholder: '2.0' },
      { id: 'Es', label: 'Elastic Modulus Es',       symbol: 'Es', unit: 'MPa',   placeholder: '15'  },
      { id: 'mu', label: "Poisson's Ratio μ",        symbol: 'μ',  unit: '',      placeholder: '0.4' },
      { id: 'Ip', label: 'Influence Factor Ip',      symbol: 'Ip', unit: '',      placeholder: '0.82', hint: 'Square: 0.82' },
    ],
    compute({ q, B, Es, mu, Ip }) {
      const Si = q * B * (1 - mu * mu) * Ip / Es
      const Si_mm = Si * 1000
      return [
        { label: 'Immediate Settlement Si', value: Si_mm.toFixed(1), unit: 'mm' },
        { label: '(in meters)',              value: Si.toFixed(4),    unit: 'm'  },
      ]
    },
  },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function DesignLabPage() {
  const [activeCalc, setActiveCalc] = useState<string | null>(null)
  const [inputs,     setInputs]     = useState<Record<string, string>>({})
  const [results,    setResults]    = useState<CalcResult[] | null>(null)
  const [error,      setError]      = useState('')

  const calc = CALCULATORS.find((c) => c.id === activeCalc)

  function runCalc() {
    if (!calc) return
    setError('')
    const vals: Record<string, number> = {}
    for (const inp of calc.inputs) {
      const v = parseFloat(inputs[inp.id] ?? '')
      if (isNaN(v) || v <= 0) { setError(`${inp.label} সঠিকভাবে দিন`); return }
      vals[inp.id] = v
    }
    try {
      setResults(calc.compute(vals))
    } catch (e) {
      setError('হিসাব ব্যর্থ হয়েছে, ইনপুট চেক করুন')
    }
  }

  function openCalc(id: string) {
    setActiveCalc(id); setInputs({}); setResults(null); setError('')
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center">
            <FlaskConical size={22} className="text-accent-400" />
          </div>
          Design Lab
        </h1>
        <p className="text-slate-400 mt-2 text-sm">ইন্টারেক্টিভ Civil Engineering ক্যালকুলেটর</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calculator list */}
        <div className="space-y-3">
          {['Structural', 'Geotechnical'].map((cat) => (
            <div key={cat}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{cat}</p>
              <div className="space-y-2">
                {CALCULATORS.filter((c) => c.category === cat).map((c) => (
                  <button key={c.id} onClick={() => openCalc(c.id)}
                    className={cn('w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                      activeCalc === c.id
                        ? 'border-brand-500/40 bg-brand-500/10'
                        : 'card hover:border-brand-500/30')}>
                    <span className="text-2xl shrink-0">{c.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium', activeCalc === c.id ? 'text-brand-400' : 'text-white')}>
                        {c.titleBn}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{c.desc}</p>
                    </div>
                    <ChevronRight size={14} className={cn('shrink-0 transition-colors', activeCalc === c.id ? 'text-brand-400' : 'text-slate-600')} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Calculator panel */}
        <div className="lg:col-span-2">
          {!calc ? (
            <div className="card p-12 flex flex-col items-center justify-center text-center gap-4 h-full min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
                <Calculator size={28} className="text-slate-600" />
              </div>
              <p className="text-slate-400">বাম দিক থেকে একটি Calculator সিলেক্ট করো</p>
            </div>
          ) : (
            <div className="card p-6 space-y-6">
              {/* Calc header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                    <span>{calc.icon}</span> {calc.titleBn}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">{calc.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-lg shrink-0">
                  <BookOpen size={11} /> {calc.codeRef}
                </div>
              </div>

              {/* Inputs */}
              <div className="grid sm:grid-cols-2 gap-4">
                {calc.inputs.map((inp) => (
                  <div key={inp.id}>
                    <label className="label">
                      <span className="font-mono text-brand-400 mr-1">{inp.symbol}</span>
                      {inp.label}
                      {inp.unit && <span className="text-slate-600 ml-1">({inp.unit})</span>}
                    </label>
                    <input
                      type="number"
                      value={inputs[inp.id] ?? ''}
                      onChange={(e) => { setInputs({ ...inputs, [inp.id]: e.target.value }); setResults(null) }}
                      placeholder={inp.placeholder}
                      className="input-field"
                    />
                    {inp.hint && <p className="text-xs text-slate-600 mt-1">{inp.hint}</p>}
                  </div>
                ))}
              </div>

              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2">⚠️ {error}</p>
              )}

              <button onClick={runCalc} className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base">
                <Calculator size={18} /> হিসাব করো
              </button>

              {/* Results */}
              {results && (
                <div className="space-y-3 animate-fade-in">
                  <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
                    ✅ ফলাফল
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {results.map((r, i) => (
                      <div key={i} className={cn('p-4 rounded-xl border',
                        i === 0 ? 'border-brand-500/30 bg-brand-500/8' : 'border-slate-700 bg-slate-800/30')}>
                        <p className="text-xs text-slate-500 mb-1">{r.label}</p>
                        <p className="font-display text-xl font-bold text-white">
                          {r.value}
                          {r.unit && <span className="text-sm text-slate-400 ml-1">{r.unit}</span>}
                        </p>
                        {r.note && <p className="text-xs mt-1 text-slate-400">{r.note}</p>}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <BookOpen size={10} /> রেফারেন্স: {calc.codeRef}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
