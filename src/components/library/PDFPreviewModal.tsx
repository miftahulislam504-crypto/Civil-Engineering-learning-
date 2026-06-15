import { X, Download, ExternalLink } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  url:      string
  title:    string
  onClose:  () => void
  onDownload?: () => void
}

export default function PDFPreviewModal({ url, title, onClose, onDownload }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const embedUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl bg-surface-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <h3 className="font-display font-semibold text-white text-sm truncate pr-4">{title}</h3>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost p-2 text-slate-500 hover:text-slate-300"
              title="নতুন ট্যাবে খুলুন"
            >
              <ExternalLink size={15} />
            </a>
            {onDownload && (
              <button onClick={onDownload} className="btn-secondary flex items-center gap-2 text-xs py-1.5 px-3">
                <Download size={13} /> ডাউনলোড
              </button>
            )}
            <button onClick={onClose} className="btn-ghost p-2 text-slate-500 hover:text-slate-300">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 min-h-0 bg-slate-950">
          <iframe
            src={embedUrl}
            className="w-full h-full min-h-[65vh]"
            title={title}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  )
}
