import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2,
  PlayCircle, FileDown, Eye, AlertTriangle,
  Wrench, Link2, BookOpen, Tag,
} from 'lucide-react'
import { useTopic, useRelatedTopics, useSaveArticle } from '@/hooks/useEncyclopedia'
import { useAuthStore } from '@/stores/authStore'
import FormulaBlock from '@/components/encyclopedia/FormulaBlock'
import WorkedExampleBlock from '@/components/encyclopedia/WorkedExampleBlock'
import TableOfContents from '@/components/encyclopedia/TableOfContents'
import TopicCard from '@/components/encyclopedia/TopicCard'
import {
  ENC_CATEGORY_LABELS, ENC_CATEGORY_COLORS, ENC_CATEGORY_ICONS,
} from '@/types/encyclopedia.types'
import { cn } from '@/utils'

export default function TopicPage() {
  const { slug }   = useParams<{ slug: string }>()
  const user       = useAuthStore((s) => s.user)

  const { data: topic, isLoading } = useTopic(slug)
  const { data: related = [] }     = useRelatedTopics(topic?.relatedTopics)
  const { mutate: toggleSave }     = useSaveArticle()

  if (isLoading) return <TopicSkeleton />
  if (!topic)    return <NotFound />

  const isSaved   = user?.savedArticles?.includes(topic.id) ?? false
  const color     = ENC_CATEGORY_COLORS[topic.category]
  const catIcon   = ENC_CATEGORY_ICONS[topic.category]

  // Which sections exist
  const available = [
    'overview',
    topic.theory              && 'theory',
    topic.concepts            && 'concepts',
    topic.formulas?.length    && 'formulas',
    topic.workedExamples?.length && 'examples',
    topic.diagrams?.length    && 'diagrams',
    topic.practicalApplication && 'practical',
    topic.commonMistakes?.length && 'mistakes',
    topic.fieldNotes          && 'field',
    topic.codeReferences?.length && 'references',
    related.length            && 'related',
  ].filter(Boolean) as string[]

  function share() {
    navigator.share?.({ title: topic!.titleBn, url: window.location.href })
      ?? navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">

      {/* Back */}
      <Link
        to="/encyclopedia"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Encyclopedia-এ ফিরে যাও
      </Link>

      <div className="grid xl:grid-cols-4 gap-8">

        {/* ── Main Content ── */}
        <div className="xl:col-span-3 space-y-10">

          {/* ── Article Header ── */}
          <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full border', color.bg, color.border, color.text)}>
                <span>{catIcon}</span>
                {ENC_CATEGORY_LABELS[topic.category]}
              </span>
              {topic.subcategory && (
                <>
                  <span>/</span>
                  <span className="text-slate-400">{topic.subcategory}</span>
                </>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
                {topic.titleBn || topic.title}
              </h1>
              {topic.titleBn && (
                <p className="text-slate-500 mt-1 text-sm">{topic.title}</p>
              )}
            </div>

            {/* Meta + actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {topic.viewCount.toLocaleString()} বার দেখা হয়েছে
                </span>
                {topic.videoUrl && (
                  <span className="flex items-center gap-1 text-brand-400">
                    <PlayCircle size={12} /> ভিডিও আছে
                  </span>
                )}
                {topic.formulas?.length > 0 && (
                  <span>{topic.formulas.length} টি সূত্র</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {topic.videoUrl && (
                  <a
                    href={topic.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 text-xs py-1.5 px-3"
                  >
                    <PlayCircle size={13} /> ভিডিও দেখো
                  </a>
                )}
                {topic.pdfUrl && (
                  <a
                    href={topic.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 text-xs py-1.5 px-3"
                  >
                    <FileDown size={13} /> PDF
                  </a>
                )}
                {user && (
                  <button
                    onClick={() => toggleSave({ topicId: topic.id, saved: isSaved })}
                    className={cn(
                      'flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg border transition-all',
                      isSaved
                        ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300',
                    )}
                  >
                    {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                    {isSaved ? 'সেভ হয়েছে' : 'সেভ করো'}
                  </button>
                )}
                <button
                  onClick={share}
                  className="btn-ghost p-2 text-slate-500 hover:text-slate-300"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* ── 1. Overview ── */}
          <Section id="overview" icon="📌" title="সংক্ষিপ্ত পরিচিতি">
            <div className="card p-5 border-l-4 border-l-brand-500">
              <p className="text-slate-300 leading-relaxed text-base">
                {topic.overviewBn || topic.overview}
              </p>
            </div>
          </Section>

          {/* ── 2. Theory ── */}
          {topic.theory && (
            <Section id="theory" icon="📚" title="তত্ত্ব">
              <div
                className="prose prose-invert max-w-none
                           prose-headings:font-display prose-headings:text-white
                           prose-h2:text-xl prose-h3:text-lg
                           prose-p:text-slate-300 prose-p:leading-relaxed
                           prose-li:text-slate-300
                           prose-code:text-brand-400 prose-code:bg-brand-500/10 prose-code:px-1.5 prose-code:rounded
                           prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
                           prose-blockquote:border-l-brand-500 prose-blockquote:text-slate-400
                           prose-strong:text-white prose-a:text-brand-400"
                dangerouslySetInnerHTML={{ __html: topic.theory }}
              />
            </Section>
          )}

          {/* ── 3. Key Concepts ── */}
          {topic.concepts && (
            <Section id="concepts" icon="💡" title="মূল ধারণা">
              <div
                className="prose prose-invert max-w-none prose-p:text-slate-300 prose-li:text-slate-300 prose-headings:text-white prose-strong:text-white prose-code:text-brand-400 prose-code:bg-brand-500/10 prose-code:px-1.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: topic.concepts }}
              />
            </Section>
          )}

          {/* ── 4. Formulas ── */}
          {topic.formulas?.length > 0 && (
            <Section id="formulas" icon="🔢" title="সূত্রসমূহ">
              <div className="space-y-4">
                {topic.formulas.map((formula, i) => (
                  <FormulaBlock key={formula.id} formula={formula} index={i} />
                ))}
              </div>
            </Section>
          )}

          {/* ── 5. Worked Examples ── */}
          {topic.workedExamples?.length > 0 && (
            <Section id="examples" icon="✏️" title="উদাহরণ সমস্যা">
              <div className="space-y-4">
                {topic.workedExamples.map((ex, i) => (
                  <WorkedExampleBlock key={ex.id} example={ex} index={i} />
                ))}
              </div>
            </Section>
          )}

          {/* ── 6. Diagrams ── */}
          {topic.diagrams?.length > 0 && (
            <Section id="diagrams" icon="🖼️" title="চিত্র ও ডায়াগ্রাম">
              <div className="grid sm:grid-cols-2 gap-4">
                {topic.diagrams.map((url, i) => (
                  <div key={i} className="card overflow-hidden">
                    <img
                      src={url}
                      alt={`ডায়াগ্রাম ${i + 1}`}
                      className="w-full object-contain max-h-64 bg-white p-2"
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── 7. Practical Application ── */}
          {topic.practicalApplication && (
            <Section id="practical" icon="🔧" title="প্রায়োগিক ব্যবহার">
              <div className="card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0 mt-1">
                  <Wrench size={18} className="text-accent-400" />
                </div>
                <p className="text-slate-300 leading-relaxed">{topic.practicalApplication}</p>
              </div>
            </Section>
          )}

          {/* ── 8. Common Mistakes ── */}
          {topic.commonMistakes?.length > 0 && (
            <Section id="mistakes" icon="⚠️" title="সাধারণ ভুল">
              <div className="space-y-2">
                {topic.commonMistakes.map((mistake, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5"
                  >
                    <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300">{mistake}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── 9. Field Notes ── */}
          {topic.fieldNotes && (
            <Section id="field" icon="🏗️" title="ফিল্ড নোটস">
              <div className="card p-5 border-l-4 border-l-green-500">
                <p className="text-slate-300 leading-relaxed">{topic.fieldNotes}</p>
              </div>
            </Section>
          )}

          {/* ── 10. Code References ── */}
          {topic.codeReferences?.length > 0 && (
            <Section id="references" icon="📖" title="কোড রেফারেন্স">
              <div className="grid sm:grid-cols-2 gap-3">
                {topic.codeReferences.map((ref, i) => (
                  <div key={i} className="card p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-brand-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge-brand text-[10px]">{ref.code}</span>
                        <span className="text-[10px] text-slate-500">{ref.clause}</span>
                      </div>
                      <p className="text-sm text-slate-300">{ref.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── Tags ── */}
          {topic.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
              <Tag size={13} className="text-slate-600" />
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-slate-800 text-slate-400 rounded-full border border-slate-700 hover:border-brand-500/40 hover:text-brand-400 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* ── 11. Related Topics ── */}
          {related.length > 0 && (
            <Section id="related" icon="🔗" title="সম্পর্কিত বিষয়">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((t) => (
                  <TopicCard key={t.id} topic={t} view="grid" />
                ))}
              </div>
            </Section>
          )}

        </div>

        {/* ── TOC Sidebar ── */}
        <div className="hidden xl:block xl:col-span-1">
          <TableOfContents availableSections={available} />
        </div>

      </div>
    </div>
  )
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({
  id, icon, title, children,
}: {
  id:       string
  icon:     string
  title:    string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <h2 className="font-display text-xl font-bold text-white flex items-center gap-2.5">
        <span className="text-2xl leading-none">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function TopicSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6 animate-pulse space-y-6">
      <div className="h-4 bg-slate-800 rounded w-40" />
      <div className="grid xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="h-8 bg-slate-800 rounded w-2/3" />
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-4 bg-slate-800 rounded" />)}
          </div>
        </div>
        <div className="hidden xl:block">
          <div className="card p-4 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-3 bg-slate-800 rounded w-4/5" />)}
          </div>
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <p className="text-4xl">📚</p>
        <p className="text-slate-400 text-lg">বিষয়টি পাওয়া যায়নি</p>
        <Link to="/encyclopedia" className="btn-primary">Encyclopedia-এ ফিরে যাও</Link>
      </div>
    </div>
  )
}
