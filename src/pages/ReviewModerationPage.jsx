import { useState } from 'react'
import { Sparkles, MessageSquareText, BadgeCheck } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'

const initialState = {
  reviewer_id: 'REV-772',
  text: 'Amazing product! I love how fast it arrived and the quality is unmatched. Highly recommend this to everyone!',
  stars: 5,
  historical_reviews: 18,
  sentiment_score: 0.91,
}

function ReviewModerationPage() {
  const [payload, setPayload] = useState(initialState)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setPayload((current) => ({ ...current, [name]: value }))
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

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200"><Sparkles className="h-6 w-6" /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">AI Agent</p>
            <h1 className="text-3xl font-semibold text-white">Review Moderation Agent</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Reviewer ID</span>
                <input name="reviewer_id" value={payload.reviewer_id} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Rating</span>
                <input type="number" name="stars" min="1" max="5" value={payload.stars} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Historical reviews</span>
                <input type="number" name="historical_reviews" value={payload.historical_reviews} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Sentiment score</span>
                <input type="number" step="0.01" name="sentiment_score" value={payload.sentiment_score} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-slate-300">Review content</span>
                <textarea name="text" value={payload.text} rows="6" onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
            </div>

            <button type="submit" disabled={loading} className="mt-6 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 font-medium text-white shadow-lg shadow-violet-500/30 disabled:opacity-70">
              {loading ? 'Analyzing...' : 'Moderate review'}
            </button>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-white">Moderation verdict</div>
              <div className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">AI-generated detection</div>
            </div>

            {result ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">
                  <div className="text-sm text-slate-300">Fake review probability</div>
                  <div className="mt-2 text-5xl font-semibold text-white">{result.fake_review_probability}%</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-slate-400">Credibility</div><div className="mt-2 text-xl text-white">{result.credibility_score}</div></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-slate-400">Sentiment</div><div className="mt-2 text-xl text-white">{result.sentiment}</div></div>
                </div>
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
