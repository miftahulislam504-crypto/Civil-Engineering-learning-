import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { type WorkedExample } from '@/types/encyclopedia.types'

export default function WorkedExampleBlock({ example, index }: { example: WorkedExample; index: number }) {
  const [open, setOpen] = useState(index === 0)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div>
            <p className="font-semibold text-white text-sm">{example.title}</p>
            {example.titleBn && <p className="text-xs text-slate-500">{example.titleBn}</p>}
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-800">
          <div className="pt-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">সমস্যা</p>
            <p className="text-slate-300 text-sm leading-relaxed">{example.problem}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">সমাধান</p>
            <div
              className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:text-sm prose-code:text-brand-400 prose-code:bg-brand-500/10 prose-code:px-1.5 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: example.solution }}
            />
          </div>
          {example.answer && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
              <span className="text-xs text-slate-500 uppercase font-medium">উত্তর:</span>
              <code className="text-green-300 font-mono text-sm font-bold">{example.answer}</code>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
