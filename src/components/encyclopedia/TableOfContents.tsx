const SECTION_LABELS: Record<string, string> = {
  overview:    '📌 পরিচিতি',
  theory:      '📚 তত্ত্ব',
  concepts:    '💡 মূল ধারণা',
  formulas:    '🔢 সূত্রসমূহ',
  examples:    '✏️ উদাহরণ',
  diagrams:    '🖼️ চিত্র',
  practical:   '🔧 প্রায়োগিক',
  mistakes:    '⚠️ সাধারণ ভুল',
  field:       '🏗️ ফিল্ড নোটস',
  references:  '📖 রেফারেন্স',
  related:     '🔗 সম্পর্কিত',
}

export default function TableOfContents({ availableSections }: { availableSections: string[] }) {
  return (
    <div className="card p-4 sticky top-24">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-3">বিষয়সূচি</p>
      <nav className="space-y-1">
        {availableSections.map((sec) => (
          <a
            key={sec}
            href={`#${sec}`}
            className="block text-sm text-slate-400 hover:text-brand-300 hover:bg-brand-500/5 px-2 py-1.5 rounded-lg transition-all"
          >
            {SECTION_LABELS[sec] ?? sec}
          </a>
        ))}
      </nav>
    </div>
  )
}
