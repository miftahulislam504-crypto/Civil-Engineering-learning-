import { useState, useRef } from 'react'
import { Award, Download, Share2, CheckCircle2, ExternalLink, Shield } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/utils'
import toast from 'react-hot-toast'

interface Certificate {
  id:         string
  uniqueId:   string
  courseId:   string
  courseName: string
  type:       'completion' | 'skill'
  issuedAt:   Date
}

// Demo data
const DEMO_CERTS: Certificate[] = [
  {
    id: 'cert1', uniqueId: 'EL-2025-001234',
    courseId: 'rcc-basics', courseName: 'RCC Design Fundamentals',
    type: 'completion', issuedAt: new Date('2025-06-01'),
  },
]

export default function CertificatesPage() {
  const user   = useAuthStore((s) => s.user)
  const [selected, setSelected] = useState<Certificate | null>(null)
  const certRef = useRef<HTMLDivElement>(null)

  async function downloadCert(cert: Certificate) {
    if (!user) return
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')
      if (!certRef.current) return

      const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: '#0f172a' })
      const img    = canvas.toDataURL('image/png')
      const pdf    = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      pdf.addImage(img, 'PNG', 0, 0, 297, 210)
      pdf.save(`${cert.uniqueId}.pdf`)
      toast.success('Certificate ডাউনলোড হয়েছে ✓')
    } catch {
      toast.error('ডাউনলোড ব্যর্থ হয়েছে')
    }
  }

  function shareCert(cert: Certificate) {
    const url = `${window.location.origin}/verify/${cert.uniqueId}`
    navigator.clipboard.writeText(url)
    toast.success('Certificate লিঙ্ক কপি হয়েছে')
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center">
            <Award size={22} className="text-yellow-400" />
          </div>
          আমার Certificates
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          কোর্স সম্পন্ন করে অর্জিত Certificate সমূহ
        </p>
      </div>

      {DEMO_CERTS.length === 0 ? (
        <div className="text-center py-20">
          <Award size={48} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-medium mb-2">এখনো কোনো Certificate নেই</p>
          <p className="text-slate-600 text-sm">কোর্স সম্পন্ন করলে Certificate পাবে</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Certificate list */}
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-white">সকল Certificate</h2>
            {DEMO_CERTS.map((cert) => (
              <button
                key={cert.id}
                onClick={() => setSelected(cert)}
                className={cn(
                  'w-full card-hover p-5 flex items-center gap-4 text-left transition-all',
                  selected?.id === cert.id && 'border-brand-500/40 bg-brand-500/5',
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                  <Award size={22} className="text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{cert.courseName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {cert.type === 'completion' ? 'Completion Certificate' : 'Skill Certificate'}
                  </p>
                  <p className="text-xs text-brand-400 mt-0.5 font-mono">{cert.uniqueId}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); downloadCert(cert) }}
                    className="p-2 btn-ghost text-slate-500 hover:text-slate-300">
                    <Download size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); shareCert(cert) }}
                    className="p-2 btn-ghost text-slate-500 hover:text-slate-300">
                    <Share2 size={14} />
                  </button>
                </div>
              </button>
            ))}
          </div>

          {/* Certificate preview */}
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-white">Preview</h2>
            {selected ? (
              <div className="space-y-4">
                <CertificateTemplate ref={certRef} cert={selected} userName={user?.displayName ?? ''} />
                <div className="flex gap-3">
                  <button onClick={() => downloadCert(selected)}
                    className="btn-primary flex items-center gap-2 flex-1 justify-center">
                    <Download size={15} /> Download PDF
                  </button>
                  <button onClick={() => shareCert(selected)}
                    className="btn-secondary flex items-center gap-2">
                    <Share2 size={15} /> শেয়ার
                  </button>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/8 border border-green-500/20">
                  <Shield size={14} className="text-green-400 shrink-0" />
                  <p className="text-xs text-green-300">
                    Verification URL:{' '}
                    <a href={`/verify/${selected.uniqueId}`} target="_blank" className="underline">
                      enginexlearn.vercel.app/verify/{selected.uniqueId}
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="card p-12 flex items-center justify-center text-center">
                <div>
                  <Award size={36} className="text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Certificate সিলেক্ট করো</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Certificate Template ───────────────────────────────────────────────────────
import { forwardRef } from 'react'

const CertificateTemplate = forwardRef<HTMLDivElement, {
  cert:     Certificate
  userName: string
}>(({ cert, userName }, ref) => (
  <div
    ref={ref}
    className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 p-8 aspect-[1.414/1]"
    style={{ minHeight: '260px' }}
  >
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-500/5 rounded-full blur-2xl" />
    <div className="absolute inset-0 border-[12px] border-yellow-500/10 rounded-2xl pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center justify-between h-full text-center gap-4">
      {/* Top */}
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm">E</span>
          </div>
          <span className="font-display font-bold text-white text-base tracking-tight">Enginex Learn</span>
        </div>
        <p className="text-[10px] text-yellow-400 tracking-widest uppercase">Certificate of Completion</p>
      </div>

      {/* Main content */}
      <div className="space-y-3">
        <p className="text-slate-400 text-xs">এই সনদপত্র প্রদান করা হচ্ছে</p>
        <h2 className="font-display text-2xl font-bold text-white">{userName}</h2>
        <p className="text-slate-300 text-xs">সফলভাবে সম্পন্ন করেছেন</p>
        <div className="px-6 py-2 bg-brand-500/10 border border-brand-500/20 rounded-xl">
          <h3 className="font-display font-bold text-brand-300 text-sm">{cert.courseName}</h3>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex items-center justify-between text-[10px] text-slate-600">
        <span>তারিখ: {cert.issuedAt.toLocaleDateString('bn-BD')}</span>
        <div className="flex items-center gap-1">
          <CheckCircle2 size={10} className="text-green-500" />
          <span className="font-mono text-green-600">{cert.uniqueId}</span>
        </div>
        <span>enginexlearn.vercel.app</span>
      </div>
    </div>
  </div>
))
CertificateTemplate.displayName = 'CertificateTemplate'
