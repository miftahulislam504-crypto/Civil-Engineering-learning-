import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { type Formula } from '@/types/encyclopedia.types'

export default function FormulaBlock({ formula, index }: { formula: Formula; index: number }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(formula.expression)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs text-slate-500 font-mono">#{index + 1}</span>
          <h4 className="font-semibold text-white text-sm mt-0.5">{formula.name}</h4>
          {formula.nameBn && <p className="text-xs text-slate-500">{formula.nameBn}</p>}
        </div>
        <button onClick={copy} className="p-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors">
          {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
        </button>
      </div>
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
        <code className="text-brand-300 font-mono text-base">{formula.expression}</code>
      </div>
      {formula.variables?.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">চলক</p>
          {formula.variables.map((v, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <code className="text-brand-400 font-mono bg-brand-500/10 px-1.5 py-0.5 rounded shrink-0">{v.symbol}</code>
              <span className="text-slate-400">{v.name}</span>
              {v.unit && <span className="text-slate-600 ml-auto shrink-0">({v.unit})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
