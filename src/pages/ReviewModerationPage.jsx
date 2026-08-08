import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, MessageSquareText, ArrowLeft, RotateCcw, Star, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'

const initialState = {
  reviewer_id: 'REV-772',
  text: 'Amazing product! I love how fast it arrived and the quality is unmatched. Highly recommend this to everyone!',
  stars: 5,
  historical_reviews: 18,
  sentiment_score: 0.91,
}

const verdictStyle = (prob) => {
  if (prob >= 70) return { ring: 'border-rose-500/40 bg-rose-500/10', text: 'text-rose-300', bar: 'from-rose-500 to-orange-500', Icon: XCircle, label: 'Likely fake' }
  if (prob >= 40) return { ring: 'border-amber-500/40 bg-amber-500/10', text: 'text-amber-300', bar: 'from-amber-400 to-yellow-500', Icon: AlertTriangle, label: 'Needs review' }
  return { ring: 'border-emerald-500/40 bg-emerald-500/10', text: 'text-emerald-300', bar: 'from-emerald-400 to-teal-500', Icon: CheckCircle2, label: 'Likely genuine' }
}

function ReviewModerationPage() {
  const navigate = useNavigate()
  const [payload, setPayload] = useState(initialState)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setPayload((current) => ({ ...current, [name]: value }))
  }

  const handleReset = () => {
    setPayload(initialState)
    setResult(null)
    toast.info('Form reset to defaults')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/api/agents/review-moderation', {
        ...payload,
        stars: Number(payload.stars),
        historical_reviews: Number(payload.historical_reviews),
        sentiment_score: Number(payload.sentiment_score),
      })
      setResult(response.data)
      toast.success('Review moderation complete')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Review analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const wordCount = payload.text.trim().split(/\s+/).filter(Boolean).length
  const vs = result ? verdictStyle(result.fake_review_probability) : null

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <button onClick={() => navigate('/dashboard')} className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200"><Sparkles className="h-6 w-6" /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">AI Agent</p>
            <h1 className="text-3xl font-semibold text-white">Review Moderation Agent</h1>
            <p className="mt-1 text-sm text-slate-400">Sentiment scoring, AI-content detection, and spam filtering.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Reviewer ID</span>
                <input name="reviewer_id" value={payload.reviewer_id} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Rating (1–5)</span>
                <input type="number" name="stars" min="1" max="5" value={payload.stars} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Historical reviews</span>
                <input type="number" name="historical_reviews" value={payload.historical_reviews} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Sentiment score (−1 to 1)</span>
                <input type="number" step="0.01" min="-1" max="1" name="sentiment_score" value={payload.sentiment_score} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>Review content</span>
                  <span className="text-xs text-slate-500">{wordCount} words</span>
                </span>
                <textarea name="text" value={payload.text} rows="6" onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 font-medium text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.01] disabled:opacity-70">
                {loading ? 'Analyzing…' : 'Moderate review'}
              </button>
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:text-white">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-white">Moderation verdict</div>
              <div className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">AI-generated detection</div>
            </div>

            {loading ? (
              <div className="mt-6 space-y-4">
                <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
              </div>
            ) : result ? (
              <div className="mt-6 space-y-5">
                <div className={`flex items-center gap-4 rounded-2xl border p-4 ${vs.ring}`}>
                  <vs.Icon className={`h-8 w-8 ${vs.text}`} />
                  <div>
                    <div className="text-sm text-slate-300">Assessment</div>
                    <div className={`text-2xl font-semibold ${vs.text}`}>{vs.label}</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">
                  <div className="flex items-end justify-between">
                    <div className="text-sm text-slate-300">Fake review probability</div>
                    <div className="text-5xl font-semibold text-white">{result.fake_review_probability}<span className="text-lg text-slate-400">%</span></div>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-slate-800">
                    <div className={`h-full rounded-full bg-gradient-to-r ${vs.bar}`} style={{ width: `${result.fake_review_probability}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-slate-400">Credibility</div><div className="mt-2 text-xl text-white">{result.credibility_score}</div></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-slate-400">Sentiment</div><div className="mt-2 text-xl text-white">{result.sentiment}</div></div>
                </div>

                {result.ai_generated && (
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-200"><Sparkles className="h-4 w-4" /> AI-content signal</div>
                    <p className="text-sm leading-6 text-slate-300">{result.ai_generated}</p>
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">{result.explanation}</div>
              </div>
            ) : (
              <div className="mt-10 flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/50 text-center text-slate-400">
                <MessageSquareText className="mb-3 h-10 w-10 text-violet-200" />
                No moderation result yet. Submit a review to classify it.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewModerationPage
