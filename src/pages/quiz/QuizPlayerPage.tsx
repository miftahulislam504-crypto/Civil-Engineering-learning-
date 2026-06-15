import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Clock, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Flag, Trophy } from 'lucide-react'
import { cn } from '@/utils'

interface Question {
  id:       string
  question: string
  options:  string[]
  correct:  number
  explanation: string
}

// Demo questions — real data will come from Firestore
const DEMO_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'RCC বিম ডিজাইনে Limit State Method অনুযায়ী কংক্রিটের সর্বোচ্চ সংকোচন স্ট্রেইন কত?',
    options: ['0.002', '0.0035', '0.003', '0.0025'],
    correct: 1,
    explanation: 'IS 456 ও BNBC অনুযায়ী কংক্রিটের সর্বোচ্চ সংকোচন স্ট্রেইন 0.0035।',
  },
  {
    id: 'q2',
    question: 'Terzaghi-র bearing capacity equation অনুযায়ী strip footing-এর জন্য কোন সূত্র প্রযোজ্য?',
    options: ['qu = cNc + qNq + 0.5γBNγ', 'qu = 1.3cNc + qNq + 0.4γBNγ', 'qu = 1.3cNc + qNq + 0.3γBNγ', 'qu = cNc + 0.5γBNγ'],
    correct: 0,
    explanation: 'Strip footing-এর জন্য Terzaghi সূত্র: qu = cNc + qNq + 0.5γBNγ।',
  },
  {
    id: 'q3',
    question: 'Slump Test-এ সর্বোচ্চ গ্রহণযোগ্য Slump মান কত (General RCC)?',
    options: ['25-50 mm', '50-100 mm', '25-125 mm', '75-150 mm'],
    correct: 1,
    explanation: 'সাধারণ RCC কাজের জন্য Slump 50-100 mm গ্রহণযোগ্য (ASTM C143)।',
  },
  {
    id: 'q4',
    question: 'BNBC 2020 অনুযায়ী ঢাকার Seismic Zone কী?',
    options: ['Zone I', 'Zone II', 'Zone III', 'Zone IV'],
    correct: 1,
    explanation: 'BNBC 2020 অনুযায়ী ঢাকা Seismic Zone II-তে অবস্থিত।',
  },
  {
    id: 'q5',
    question: 'CBR Test কোন বিষয়ে ব্যবহৃত হয়?',
    options: ['Concrete strength', 'Pavement design', 'Pile capacity', 'Beam design'],
    correct: 1,
    explanation: 'California Bearing Ratio (CBR) Test মূলত Flexible Pavement Design-এ subgrade strength মূল্যায়নে ব্যবহৃত হয়।',
  },
]

type Phase = 'ready' | 'playing' | 'finished'

export default function QuizPlayerPage() {
  const { quizId }  = useParams<{ quizId: string }>()
  const navigate    = useNavigate()

  const [phase,    setPhase]    = useState<Phase>('ready')
  const [current,  setCurrent]  = useState(0)
  const [answers,  setAnswers]  = useState<(number | null)[]>(Array(DEMO_QUESTIONS.length).fill(null))
  const [timeLeft, setTimeLeft] = useState(600) // 10 min
  const [showExp,  setShowExp]  = useState(false)

  const isDailyOrMock = quizId === 'daily' || quizId?.startsWith('mock')
  const questions = DEMO_QUESTIONS

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return
    if (timeLeft <= 0) { setPhase('finished'); return }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft])

  const score = answers.filter((a, i) => a === questions[i].correct).length

  function selectAnswer(opt: number) {
    if (phase !== 'playing') return
    const next = [...answers]
    next[current] = opt
    setAnswers(next)
    setShowExp(true)
  }

  function nextQuestion() {
    setShowExp(false)
    if (current < questions.length - 1) {
      setCurrent((p) => p + 1)
    } else {
      setPhase('finished')
    }
  }

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const pct = Math.round((score / questions.length) * 100)

  // ── Ready screen ──────────────────────────────────────────────────────────
  if (phase === 'ready') {
    return (
      <div className="max-w-2xl mx-auto p-6 animate-fade-in">
        <Link to="/quiz" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8">
          <ArrowLeft size={15} /> Quiz তালিকায় ফিরে যাও
        </Link>
        <div className="card p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/15 flex items-center justify-center mx-auto">
            <Trophy size={30} className="text-brand-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              {quizId === 'daily' ? 'আজকের Daily Quiz' : 'Topic Quiz'}
            </h1>
            <p className="text-slate-400 mt-2">{questions.length} টি প্রশ্ন • {Math.ceil(questions.length) * 2} মিনিট</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'প্রশ্ন',   value: questions.length },
              { label: 'সময়',     value: `${Math.ceil(questions.length * 1.2)} মিনিট` },
              { label: 'পাস মার্ক', value: '৬০%' },
            ].map(({ label, value }) => (
              <div key={label} className="card p-3">
                <p className="font-display text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setPhase('playing')} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
            <Flag size={18} /> Quiz শুরু করো
          </button>
        </div>
      </div>
    )
  }

  // ── Finished screen ───────────────────────────────────────────────────────
  if (phase === 'finished') {
    const passed = pct >= 60
    return (
      <div className="max-w-3xl mx-auto p-6 animate-fade-in space-y-6">
        {/* Result card */}
        <div className={cn('card p-8 text-center', passed ? 'border-green-500/30' : 'border-red-500/30')}>
          <div className={cn('w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
            passed ? 'bg-green-500/15' : 'bg-red-500/15')}>
            {passed
              ? <Trophy  size={36} className="text-green-400" />
              : <XCircle size={36} className="text-red-400"   />}
          </div>
          <h2 className="font-display text-3xl font-bold text-white">{score}/{questions.length}</h2>
          <p className={cn('text-4xl font-bold mt-1', passed ? 'text-green-400' : 'text-red-400')}>{pct}%</p>
          <p className="text-slate-400 mt-2">{passed ? '🎉 অভিনন্দন! Quiz পাস হয়েছে।' : '😔 পাস হয়নি। আবার চেষ্টা করো।'}</p>
          {passed && <p className="text-brand-400 text-sm mt-1">+{pct >= 80 ? 15 : 10} পয়েন্ট অর্জিত!</p>}
        </div>

        {/* Answer review */}
        <div className="card p-5 space-y-4">
          <h3 className="font-display font-semibold text-white">উত্তর পর্যালোচনা</h3>
          {questions.map((q, i) => {
            const userAns  = answers[i]
            const isRight  = userAns === q.correct
            return (
              <div key={q.id} className={cn('p-4 rounded-xl border', isRight ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5')}>
                <div className="flex items-start gap-2 mb-2">
                  {isRight
                    ? <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                    : <XCircle      size={16} className="text-red-400 shrink-0 mt-0.5"   />}
                  <p className="text-sm text-white">{q.question}</p>
                </div>
                {!isRight && (
                  <p className="text-xs text-slate-400 ml-6">
                    সঠিক উত্তর: <span className="text-green-400 font-medium">{q.options[q.correct]}</span>
                  </p>
                )}
                <p className="text-xs text-slate-500 ml-6 mt-1">{q.explanation}</p>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setPhase('ready'); setCurrent(0); setAnswers(Array(questions.length).fill(null)); setTimeLeft(600) }}
            className="btn-secondary flex-1 py-3">আবার চেষ্টা করো</button>
          <Link to="/quiz" className="btn-primary flex-1 py-3 flex items-center justify-center">Quiz তালিকায় যাও</Link>
        </div>
      </div>
    )
  }

  // ── Playing screen ────────────────────────────────────────────────────────
  const q          = questions[current]
  const userAnswer = answers[current]
  const answered   = userAnswer !== null

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in space-y-6">
      {/* Progress bar + timer */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{current + 1}/{questions.length}</span>
            <span>{Math.round(((current) / questions.length) * 100)}% সম্পন্ন</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all"
              style={{ width: `${((current) / questions.length) * 100}%` }} />
          </div>
        </div>
        <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono font-bold',
          timeLeft <= 60 ? 'text-red-400 bg-red-500/10' : 'text-slate-300 bg-slate-800')}>
          <Clock size={14} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question card */}
      <div className="card p-6 space-y-5">
        <div>
          <span className="text-xs text-brand-400 font-medium uppercase tracking-wide">প্রশ্ন {current + 1}</span>
          <p className="font-display text-lg font-semibold text-white mt-2 leading-relaxed">{q.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let style = 'border-slate-700 bg-slate-800/30 hover:border-brand-500/50 hover:bg-brand-500/5'
            if (answered) {
              if      (i === q.correct)  style = 'border-green-500/50 bg-green-500/10 text-green-300'
              else if (i === userAnswer) style = 'border-red-500/50 bg-red-500/10 text-red-300'
              else                       style = 'border-slate-800 bg-slate-800/20 opacity-50'
            } else if (userAnswer === i) {
              style = 'border-brand-500 bg-brand-500/15'
            }

            return (
              <button key={i} onClick={() => selectAnswer(i)} disabled={answered}
                className={cn('w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-sm', style)}>
                <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
                  answered && i === q.correct  ? 'bg-green-500 text-white' :
                  answered && i === userAnswer ? 'bg-red-500 text-white'   :
                                                 'bg-slate-700 text-slate-400')}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExp && answered && (
          <div className={cn('p-4 rounded-xl border text-sm', userAnswer === q.correct
            ? 'border-green-500/20 bg-green-500/8 text-green-300'
            : 'border-red-500/20   bg-red-500/8   text-red-300')}>
            <p className="font-medium mb-1">{userAnswer === q.correct ? '✓ সঠিক!' : '✗ ভুল!'}</p>
            <p className="text-slate-300 text-xs leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={() => { if (current > 0) { setCurrent((p) => p - 1); setShowExp(false) } }}
          disabled={current === 0}
          className="btn-secondary flex items-center gap-2 disabled:opacity-30">
          <ArrowLeft size={15} /> আগের
        </button>
        {answered ? (
          <button onClick={nextQuestion} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {current === questions.length - 1 ? <><Flag size={15} /> ফলাফল দেখো</> : <>পরের প্রশ্ন <ArrowRight size={15} /></>}
          </button>
        ) : (
          <button onClick={() => setPhase('finished')} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-slate-500">
            <Flag size={15} /> Quiz শেষ করো
          </button>
        )}
      </div>
    </div>
  )
}
