import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, Gauge, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'
import SystemStatus from '../components/SystemStatus'

const initialState = {
  order_id: 'ORD-10284',
  customer_id: 'CUST-988',
  amount: 428.5,
  shipping_country: 'US',
  device_velocity: 2.4,
  chargeback_history: 3,
  previous_orders: 5,
  mismatched_billing: true,
}

// Verdict → color + icon mapping for professional, at-a-glance styling.
const verdictStyle = (decision) => {
  switch (decision) {
    case 'Block':
      return { ring: 'border-rose-500/40 bg-rose-500/10', text: 'text-rose-300', bar: 'from-rose-500 to-orange-500', Icon: XCircle }
    case 'Review':
      return { ring: 'border-amber-500/40 bg-amber-500/10', text: 'text-amber-300', bar: 'from-amber-400 to-yellow-500', Icon: AlertTriangle }
    default:
      return { ring: 'border-emerald-500/40 bg-emerald-500/10', text: 'text-emerald-300', bar: 'from-emerald-400 to-teal-500', Icon: CheckCircle2 }
  }
}

function RiskScoringPage() {
  const navigate = useNavigate()
  const [payload, setPayload] = useState(initialState)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    setPayload((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
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
      const response = await api.post('/api/agents/risk-score', {
        ...payload,
        amount: Number(payload.amount),
        device_velocity: Number(payload.device_velocity),
        chargeback_history: Number(payload.chargeback_history),
        previous_orders: Number(payload.previous_orders),
      })
      setResult(response.data)
      toast.success('Risk analysis completed')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to score order')
    } finally {
      setLoading(false)
    }
  }

  const vs = result ? verdictStyle(result.decision) : null

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        {/* Header with back navigation */}
        <button onClick={() => navigate('/dashboard')} className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>

        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200"><Gauge className="h-6 w-6" /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">AI Agent</p>
            <h1 className="text-3xl font-semibold text-white">Risk Scoring Agent</h1>
            <p className="mt-1 text-sm text-slate-400">Behavioral profiling and transaction-anomaly detection for order fraud.</p>
          </div>
        </div>
          <SystemStatus className="hidden sm:inline-flex" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Order ID</span>
                <input name="order_id" value={payload.order_id} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Customer ID</span>
                <input name="customer_id" value={payload.customer_id} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Order amount ($)</span>
                <input type="number" step="0.01" name="amount" value={payload.amount} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Shipping country</span>
                <input name="shipping_country" value={payload.shipping_country} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Device velocity <span className="text-slate-500" title="Sessions/logins per hour from this device">ⓘ</span></span>
                <input type="number" step="0.1" name="device_velocity" value={payload.device_velocity} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Chargeback history</span>
                <input type="number" name="chargeback_history" value={payload.chargeback_history} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Previous orders</span>
                <input type="number" name="previous_orders" value={payload.previous_orders} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-slate-300">
                <input type="checkbox" name="mismatched_billing" checked={payload.mismatched_billing} onChange={handleInputChange} className="h-4 w-4 accent-violet-500" />
                Mismatched billing details
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 font-medium text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.01] disabled:opacity-70">
                {loading ? 'Evaluating…' : 'Analyze order risk'}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:text-white">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-white">Risk assessment</div>
              <div className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-300">AI explanation</div>
            </div>

            {loading ? (
              <div className="mt-6 space-y-4">
                <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
              </div>
            ) : result ? (
              <div className="mt-6 space-y-5">
                {/* Verdict banner */}
                <div className={`flex items-center gap-4 rounded-2xl border p-4 ${vs.ring}`}>
                  <vs.Icon className={`h-8 w-8 ${vs.text}`} />
                  <div>
                    <div className="text-sm text-slate-300">Decision</div>
                    <div className={`text-2xl font-semibold ${vs.text}`}>{result.decision}</div>
                  </div>
                </div>

                {/* Risk score with visual bar */}
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">
                  <div className="flex items-end justify-between">
                    <div className="text-sm text-slate-300">Risk score</div>
                    <div className="text-5xl font-semibold text-white">{result.risk_score}<span className="text-lg text-slate-400">/100</span></div>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-slate-800">
                    <div className={`h-full rounded-full bg-gradient-to-r ${vs.bar} transition-all`} style={{ width: `${result.risk_score}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-500"><span>Approve</span><span>Review</span><span>Block</span></div>
                </div>

                {/* Confidence */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Model confidence</span>
                    <span className="font-medium text-white">{result.confidence}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${result.confidence}%` }} />
                  </div>
                </div>

                {/* Signal breakdown */}
                {result.signals && (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <div className="mb-3 text-sm font-medium text-white">Contributing signals</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-400">Chargeback history</span><span className="text-white">{result.signals.chargeback_history}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Device velocity</span><span className="text-white">{result.signals.device_velocity}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Order amount</span><span className="text-white">${result.signals.amount}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Mismatched billing</span><span className={result.signals.mismatched_billing ? 'text-rose-300' : 'text-emerald-300'}>{result.signals.mismatched_billing ? 'Yes' : 'No'}</span></div>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
                  {result.explanation}
                </div>
              </div>
            ) : (
              <div className="mt-10 flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/50 text-center text-slate-400">
                <ShieldAlert className="mb-3 h-10 w-10 text-violet-200" />
                No analysis yet. Submit an order to receive a risk verdict.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskScoringPage
