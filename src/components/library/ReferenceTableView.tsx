import { useState } from 'react'
import { ArrowUpDown, Copy, Printer } from 'lucide-react'
import type { ReferenceTable } from '@/types/library.types'
import { cn } from '@/utils'
import toast from 'react-hot-toast'

interface Props { table: ReferenceTable }

export default function ReferenceTableView({ table }: Props) {
  const [sortCol, setSortCol]   = useState<string | null>(null)
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('asc')
  const [search,  setSearch]    = useState('')

  function handleSort(col: string) {
    if (sortCol === col) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  let rows = [...table.data]

  // Filter
  if (search) {
    const q = search.toLowerCase()
    rows = rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    )
  }

  // Sort
  if (sortCol) {
    rows.sort((a, b) => {
      const av = a[sortCol]
      const bv = b[sortCol]
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }

  function copyTable() {
    const header = table.headers.join('\t')
    const body   = table.data.map((r) =>
      table.headers.map((h) => r[h] ?? '').join('\t')
    ).join('\n')
    navigator.clipboard.writeText(`${header}\n${body}`)
    toast.success('টেবিল কপি করা হয়েছে')
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 gap-3 flex-wrap">
        <div>
          <h3 className="font-display font-semibold text-white text-sm">
            {table.titleBn || table.title}
          </h3>
          {table.unit && (
            <p className="text-xs text-slate-500 mt-0.5">একক: {table.unit}</p>
          )}
          {table.source && (
            <p className="text-xs text-brand-400 mt-0.5">সূত্র: {table.source}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="খুঁজুন..."
            className="input-field text-xs py-1.5 w-32"
          />
          <button
            onClick={copyTable}
            className="btn-ghost p-2 text-slate-500 hover:text-slate-300"
            title="টেবিল কপি করো"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => window.print()}
            className="btn-ghost p-2 text-slate-500 hover:text-slate-300"
            title="প্রিন্ট করো"
          >
            <Printer size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/50">
              {table.headers.map((h) => (
                <th
                  key={h}
                  onClick={() => handleSort(h)}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                >
                  <span className="flex items-center gap-1.5">
                    {h}
                    <ArrowUpDown
                      size={11}
                      className={cn(
                        'transition-colors',
                        sortCol === h ? 'text-brand-400' : 'text-slate-700',
                      )}
                    />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={table.headers.length} className="px-4 py-6 text-center text-slate-600 text-xs">
                  কোনো ডেটা পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    'border-t border-slate-800/50 transition-colors hover:bg-slate-800/30',
                    i % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/20',
                  )}
                >
                  {table.headers.map((h) => (
                    <td key={h} className="px-4 py-3 text-slate-300 text-xs whitespace-nowrap">
                      {typeof row[h] === 'number'
                        ? <span className="font-mono text-white">{row[h]}</span>
                        : row[h]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[10px] text-slate-600">{rows.length} টি এন্ট্রি</span>
        {search && (
          <button onClick={() => setSearch('')} className="text-[10px] text-brand-400 hover:text-brand-300">
            ফিল্টার মুছো
          </button>
        )}
      </div>
    </div>
  )
}
