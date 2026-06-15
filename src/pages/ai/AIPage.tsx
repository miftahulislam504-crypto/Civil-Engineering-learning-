import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Mic, Image, Plus, Copy, BookOpen, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/utils'
import toast from 'react-hot-toast'

interface Message {
  id:      string
  role:    'user' | 'assistant'
  content: string
  time:    Date
}

const SYSTEM_PROMPT = `তুমি Enginex Learn-এর AI Civil Engineering Assistant।
তুমি সবসময় বাংলায় উত্তর দেবে।
তুমি একজন অভিজ্ঞ Civil Engineer এবং শিক্ষক।
প্রতিটি প্রযুক্তিগত উত্তরে অন্তর্ভুক্ত করো:
1. সংক্ষিপ্ত তত্ত্ব
2. প্রযোজ্য সূত্র (যদি থাকে)
3. ব্যবহারিক উদাহরণ
4. BNBC/ACI/ASTM রেফারেন্স (যদি প্রযোজ্য হয়)
5. ব্যবহারিক টিপস

উত্তর স্পষ্ট, সহজবোধ্য এবং বাংলায় লেখো।
Technical terms ইংরেজিতে রেখে বাংলায় ব্যাখ্যা করো।`

const SUGGESTED_QUESTIONS = [
  'RCC বিম ডিজাইনের ধাপগুলো কী?',
  'ফুটিং ডিজাইন কিভাবে করি?',
  'BNBC 2020 অনুযায়ী Seismic load কিভাবে হিসাব করবো?',
  'Slump Test কিভাবে করতে হয়?',
  'কংক্রিটের Water-Cement Ratio কত হওয়া উচিত?',
  'Pile Foundation কখন ব্যবহার করা হয়?',
]

export default function AIPage() {
  const user        = useAuthStore((s) => s.user)
  const [messages,  setMessages]  = useState<Message[]>([])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const bottomRef   = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = {
      id:      crypto.randomUUID(),
      role:    'user',
      content,
      time:    new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map((m) => ({
        role:    m.role,
        content: m.content,
      }))

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system:     SYSTEM_PROMPT,
          messages:   [...history, { role: 'user', content }],
        }),
      })

      const data = await response.json()
      const reply = data.content
        ?.filter((b: { type: string }) => b.type === 'text')
        .map((b: { text: string }) => b.text)
        .join('\n') ?? 'উত্তর পাওয়া যায়নি।'

      const aiMsg: Message = {
        id:      crypto.randomUUID(),
        role:    'assistant',
        content: reply,
        time:    new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      toast.error('AI উত্তর দিতে পারেনি, আবার চেষ্টা করো')
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  function copyMessage(content: string) {
    navigator.clipboard.writeText(content)
    toast.success('কপি হয়েছে')
  }

  function clearChat() {
    setMessages([])
    toast.success('চ্যাট পরিষ্কার হয়েছে')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white">AI Civil Tutor</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-xs text-slate-500">অনলাইন • বাংলায় উত্তর দেয়</p>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="btn-ghost p-2 text-slate-500 hover:text-red-400 transition-colors"
            title="চ্যাট পরিষ্কার করো"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

        {/* Welcome / empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
                <Bot size={36} className="text-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 blur-xl opacity-30 animate-pulse-slow" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">AI Civil Tutor</h2>
              <p className="text-slate-400 mt-2 max-w-md leading-relaxed">
                Civil Engineering-এর যেকোনো প্রশ্ন করো — Theory, Formula,
                Design, Site Problem — সব বাংলায় উত্তর পাবে।
              </p>
            </div>

            {/* Suggested questions */}
            <div className="w-full max-w-lg space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">জনপ্রিয় প্রশ্ন</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-brand-500/40 hover:bg-brand-500/5 text-sm text-slate-300 hover:text-white transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onCopy={() => copyMessage(msg.content)}
          />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={14} className="text-white" />
            </div>
            <div className="card px-4 py-3">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-brand-500 rounded-full"
                    style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
                <span className="text-xs text-slate-500 ml-2">উত্তর তৈরি হচ্ছে...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input Area ── */}
      <div className="px-4 pb-4 shrink-0">
        <div className="card p-3 flex items-end gap-3">
          {/* Suggested quick buttons */}
          {messages.length > 0 && (
            <button
              onClick={() => {
                const q = SUGGESTED_QUESTIONS[Math.floor(Math.random() * SUGGESTED_QUESTIONS.length)]
                setInput(q)
                inputRef.current?.focus()
              }}
              className="btn-ghost p-2 text-slate-500 hover:text-slate-300 shrink-0 self-center"
              title="নতুন প্রশ্ন সাজেস্ট করো"
            >
              <Plus size={18} />
            </button>
          )}

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Civil Engineering প্রশ্ন লেখো... (Enter = পাঠাও, Shift+Enter = নতুন লাইন)"
            rows={1}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 text-sm resize-none focus:outline-none leading-relaxed max-h-32 overflow-y-auto font-body"
            style={{ minHeight: '24px' }}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement
              t.style.height = 'auto'
              t.style.height = `${Math.min(t.scrollHeight, 128)}px`
            }}
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95 shrink-0"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-700 mt-2">
          AI ভুল করতে পারে। গুরুত্বপূর্ণ সিদ্ধান্তে বিশেষজ্ঞ পরামর্শ নিন।
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  )
}

// ── Message Bubble ─────────────────────────────────────────────────────────────
function MessageBubble({ message, onCopy }: { message: Message; onCopy: () => void }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex items-start gap-3 group', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
        isUser
          ? 'bg-brand-600 text-white text-xs font-bold'
          : 'bg-gradient-to-br from-brand-500 to-accent-500',
      )}>
        {isUser ? 'আ' : <Bot size={14} className="text-white" />}
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[85%] space-y-1', isUser && 'items-end flex flex-col')}>
        <div className={cn(
          'px-4 py-3 rounded-2xl text-sm leading-relaxed relative',
          isUser
            ? 'bg-brand-600 text-white rounded-tr-sm'
            : 'card text-slate-200 rounded-tl-sm',
        )}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div
              className="prose prose-invert prose-sm max-w-none
                         prose-p:leading-relaxed prose-p:my-1
                         prose-headings:text-white prose-headings:font-display prose-headings:my-2
                         prose-strong:text-white prose-code:text-brand-300
                         prose-code:bg-slate-800 prose-code:px-1.5 prose-code:rounded
                         prose-li:my-0.5 prose-ul:my-2 prose-ol:my-2"
              dangerouslySetInnerHTML={{
                __html: formatAIResponse(message.content),
              }}
            />
          )}
        </div>

        {/* Actions */}
        <div className={cn(
          'flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity',
          isUser ? 'flex-row-reverse' : '',
        )}>
          <span className="text-[10px] text-slate-600">
            {message.time.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && (
            <button
              onClick={onCopy}
              className="text-slate-600 hover:text-slate-400 transition-colors"
            >
              <Copy size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Format AI response markdown → HTML ────────────────────────────────────────
function formatAIResponse(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/^### (.+)$/gm,   '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,    '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,     '<h1>$1</h1>')
    .replace(/`([^`]+)`/g,     '<code>$1</code>')
    .replace(/^[\*\-] (.+)$/gm,'<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm,'<li>$2</li>')
    .replace(/(<li>[\s\S]*?<\/li>)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g,          '</p><p>')
    .replace(/^(?!<[h|u|l|p])(.+)/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g,      '')
}
