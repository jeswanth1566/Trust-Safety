import { useState } from 'react'
import { ShieldAlert, Gauge, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'

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

function RiskScoringPage() {
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

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200"><Gauge className="h-6 w-6" /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">AI Agent</p>
            <h1 className="text-3xl font-semibold text-white">Risk Scoring Agent</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Order ID</span>
                <input name="order_id" value={payload.order_id} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Customer ID</span>
                <input name="customer_id" value={payload.customer_id} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Order amount</span>
                <input type="number" step="0.01" name="amount" value={payload.amount} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Shipping country</span>
                <input name="shipping_country" value={payload.shipping_country} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Device velocity</span>
                <input type="number" step="0.1" name="device_velocity" value={payload.device_velocity} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Chargeback history</span>
                <input type="number" name="chargeback_history" value={payload.chargeback_history} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Previous orders</span>
                <input type="number" name="previous_orders" value={payload.previous_orders} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-slate-300">
                <input type="checkbox" name="mismatched_billing" checked={payload.mismatched_billing} onChange={handleInputChange} className="h-4 w-4 accent-violet-500" />
                Mismatched billing details
              </label>
            </div>

            <button type="submit" disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 font-medium text-white shadow-lg shadow-violet-500/30 disabled:opacity-70">
              {loading ? 'Evaluating...' : 'Analyze order risk'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-white">Risk assessment</div>
              <div className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-300">AI explanation</div>
            </div>

            {result ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">
                  <div className="text-sm text-slate-300">Risk score</div>
                  <div className="mt-2 text-5xl font-semibold text-white">{result.risk_score}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-slate-400">Confidence</div><div className="mt-2 text-xl text-white">{result.confidence}%</div></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-slate-400">Decision</div><div className="mt-2 text-xl text-white">{result.decision}</div></div>
                </div>
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
