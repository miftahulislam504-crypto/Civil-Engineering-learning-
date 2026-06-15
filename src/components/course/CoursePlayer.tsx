import { useState, useRef } from 'react'
import {
  CheckCircle2, Circle, ChevronDown, ChevronRight,
  PlayCircle, FileText, BookOpen, Download,
  ChevronLeft, ChevronRight as ChevronRightIcon,
} from 'lucide-react'
import type { Lesson, CourseSection } from '@/types/course.types'
import { cn, formatDuration } from '@/utils'

interface Props {
  sections:         CourseSection[]
  allLessons:       Lesson[]
  currentLesson:    Lesson | null
  completedLessons: string[]
  onSelectLesson:   (lesson: Lesson) => void
  onComplete:       (lessonId: string) => void
}

const LESSON_ICONS = {
  video:    PlayCircle,
  pdf:      FileText,
  text:     BookOpen,
  download: Download,
}

export default function CoursePlayer({
  sections, allLessons, currentLesson,
  completedLessons, onSelectLesson, onComplete,
}: Props) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  )

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const currentIdx = allLessons.findIndex((l) => l.id === currentLesson?.id)
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-full min-h-[600px]">

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {currentLesson ? (
          <>
            {/* Video */}
            {currentLesson.type === 'video' && (
              <VideoPlayer lesson={currentLesson} />
            )}

            {/* PDF */}
            {currentLesson.type === 'pdf' && (
              <PDFViewer url={currentLesson.pdfUrl} />
            )}

            {/* Text / Article */}
            {currentLesson.type === 'text' && (
              <TextLesson content={currentLesson.content} />
            )}

            {/* Download */}
            {currentLesson.type === 'download' && (
              <DownloadLesson lesson={currentLesson} />
            )}

            {/* Lesson footer */}
            <div className="p-5 border-t border-slate-800 flex items-center justify-between gap-4">
              {/* Prev */}
              <button
                onClick={() => prevLesson && onSelectLesson(prevLesson)}
                disabled={!prevLesson}
                className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-30"
              >
                <ChevronLeft size={15} /> আগের লেসন
              </button>

              {/* Mark complete */}
              {!completedLessons.includes(currentLesson.id) ? (
                <button
                  onClick={() => onComplete(currentLesson.id)}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 size={15} /> সম্পন্ন চিহ্নিত করো
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-sm text-green-400">
                  <CheckCircle2 size={15} /> সম্পন্ন ✓
                </span>
              )}

              {/* Next */}
              <button
                onClick={() => nextLesson && onSelectLesson(nextLesson)}
                disabled={!nextLesson}
                className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-30"
              >
                পরের লেসন <ChevronRightIcon size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <div>
              <PlayCircle size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">বাম পাশ থেকে লেসন সিলেক্ট করো</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Sidebar curriculum ── */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col max-h-[600px] lg:max-h-full overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <p className="font-display font-semibold text-white text-sm">কোর্স কারিকুলাম</p>
          <p className="text-xs text-slate-500 mt-1">
            {completedLessons.length}/{allLessons.length} লেসন সম্পন্ন
          </p>
          {/* Overall progress */}
          <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all"
              style={{ width: `${Math.round((completedLessons.length / allLessons.length) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
              >
                <span className="text-sm font-medium text-slate-200">
                  {section.titleBn || section.title}
                </span>
                {openSections.has(section.id)
                  ? <ChevronDown  size={15} className="text-slate-500 shrink-0" />
                  : <ChevronRight size={15} className="text-slate-500 shrink-0" />
                }
              </button>

              {/* Lessons list */}
              {openSections.has(section.id) && section.lessons.map((lesson) => {
                const Icon     = LESSON_ICONS[lesson.type] ?? PlayCircle
                const isDone   = completedLessons.includes(lesson.id)
                const isCurrent= currentLesson?.id === lesson.id

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson)}
                    className={cn(
                      'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-slate-800/50',
                      isCurrent
                        ? 'bg-brand-500/10 border-l-2 border-l-brand-500'
                        : 'hover:bg-slate-800/50',
                    )}
                  >
                    {/* Done / current indicator */}
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-brand-400" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-brand-400 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                        </div>
                      ) : (
                        <Circle size={16} className="text-slate-700" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-xs leading-tight',
                        isCurrent ? 'text-brand-400 font-medium' : isDone ? 'text-slate-400' : 'text-slate-300',
                      )}>
                        {lesson.titleBn || lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Icon size={10} className="text-slate-600" />
                        <span className="text-[10px] text-slate-600">
                          {formatDuration(lesson.duration)}
                        </span>
                        {lesson.isFree && (
                          <span className="text-[9px] text-green-500 bg-green-500/10 px-1 rounded">বিনামূল্যে</span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Sub-renderers ──────────────────────────────────────────────────────────────

function VideoPlayer({ lesson }: { lesson: Lesson }) {
  const isYouTube = lesson.videoProvider === 'youtube'

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/)
    return match?.[1] ?? ''
  }

  const embedUrl = isYouTube
    ? `https://www.youtube.com/embed/${getYouTubeId(lesson.videoUrl)}?rel=0&modestbranding=1`
    : lesson.videoUrl

  return (
    <div className="relative aspect-video bg-black">
      {lesson.videoUrl ? (
        <iframe
          src={embedUrl}
          title={lesson.titleBn || lesson.title}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-slate-500">ভিডিও পাওয়া যাচ্ছে না</p>
        </div>
      )}
    </div>
  )
}

function PDFViewer({ url }: { url: string }) {
  return (
    <div className="flex-1 min-h-[500px] bg-slate-950">
      {url ? (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
          className="w-full h-full min-h-[500px]"
          title="PDF Viewer"
        />
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">PDF পাওয়া যাচ্ছে না</p>
        </div>
      )}
    </div>
  )
}

function TextLesson({ content }: { content: string }) {
  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto max-h-[600px]">
      <div
        className="prose prose-invert prose-sm max-w-3xl mx-auto
                   prose-headings:font-display prose-headings:text-white
                   prose-p:text-slate-300 prose-p:leading-relaxed
                   prose-code:text-brand-400 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:rounded
                   prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
                   prose-blockquote:border-brand-500 prose-blockquote:text-slate-400"
        dangerouslySetInnerHTML={{ __html: content || '<p class="text-slate-500">কনটেন্ট পাওয়া যাচ্ছে না</p>' }}
      />
    </div>
  )
}

function DownloadLesson({ lesson }: { lesson: Lesson }) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto">
          <Download size={28} className="text-brand-400" />
        </div>
        <div>
          <p className="font-display font-semibold text-white">{lesson.titleBn || lesson.title}</p>
          <p className="text-slate-500 text-sm mt-1">ফাইলটি ডাউনলোড করো</p>
        </div>
        {lesson.downloadUrl && (
          <a
            href={lesson.downloadUrl}
            download={lesson.downloadName || 'file'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Download size={16} /> ডাউনলোড করো
          </a>
        )}
      </div>
    </div>
  )
}
