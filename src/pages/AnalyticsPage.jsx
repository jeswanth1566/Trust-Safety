import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, BarChart, Bar, Cell, LabelList, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'
import SystemStatus from '../components/SystemStatus'

const DECISION_COLORS = {
  Block: '#f43f5e', Blocked: '#f43f5e', Counterfeit: '#f43f5e', Removed: '#f43f5e',
  Review: '#f59e0b',
  Approve: '#22c55e', Approved: '#22c55e', Authentic: '#22c55e',
}

const barColor = (name) => DECISION_COLORS[name] || '#3b82f6'


function AnalyticsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get('/api/audit/analytics')
        setData(res.data)
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Transform API shapes into chart-friendly arrays.
  const trend = data
    ? Object.entries(data.trend || {}).map(([month, count]) => ({ month, decisions: count }))
    : []
  const byDecision = data
    ? Object.entries(data.by_decision || {}).map(([name, count]) => ({ name, count }))
    : []

  const total = data?.total ?? 0
  const blocked = byDecision
    .filter((d) => ['Block', 'Blocked', 'Counterfeit', 'Removed'].includes(d.name))
    .reduce((s, d) => s + d.count, 0)
  const approved = byDecision
    .filter((d) => ['Approve', 'Approved', 'Authentic'].includes(d.name))
    .reduce((s, d) => s + d.count, 0)
  const reviewRate = total ? Math.round(((total - blocked - approved) / total) * 100) : 0

  const kpis = [
    ['Total decisions', loading ? '—' : total.toLocaleString()],
    ['Blocked / removed', loading ? '—' : blocked.toLocaleString()],
    ['Approved', loading ? '—' : approved.toLocaleString()],
    ['Review rate', loading ? '—' : `${reviewRate}%`],
  ]

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <button onClick={() => navigate('/dashboard')} className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>
        <div className="mb-8 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Insights</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Analytics overview</h1>
          </div>
          <SystemStatus className="hidden md:inline-flex" />
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {kpis.map(([label, value]) => (
            <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-slate-300">{label}</div>
              <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/70 p-5">
            <div className="mb-5 text-lg font-semibold text-white">Decision volume — flow (6-month trend)</div>
            <div className="h-72">
              {loading ? (
                <div className="h-full w-full animate-pulse rounded-2xl bg-white/5" />
              ) : trend.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-400">No data yet — run some agent analyses.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                    <defs>
                      {/* Horizontal flowing gradient along the stroke */}
                      <linearGradient id="flowStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                      {/* Soft flowing area beneath the line */}
                      <linearGradient id="flowFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#293548" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={{ stroke: '#334155' }} />
                    <YAxis stroke="#94a3b8" allowDecimals={false} tickLine={false} axisLine={false} width={32} />
                    <Tooltip cursor={{ stroke: '#22d3ee', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} />
                    <Area
                      type="natural"
                      dataKey="decisions"
                      stroke="url(#flowStroke)"
                      fill="url(#flowFill)"
                      strokeWidth={4}
                      dot={{ r: 4, fill: '#22d3ee', stroke: '#fff', strokeWidth: 1 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive
                      animationDuration={1400}
                      animationEasing="ease-in-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/70 p-5">
            <div className="mb-5 text-lg font-semibold text-white">Decisions by outcome</div>
            <div className="h-72">
              {loading ? (
                <div className="h-full w-full animate-pulse rounded-2xl bg-white/5" />
              ) : byDecision.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-400">No decisions recorded yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byDecision} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#293548" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={{ stroke: '#334155' }} />
                    <YAxis stroke="#94a3b8" allowDecimals={false} tickLine={false} axisLine={false} width={32} />
                    <Tooltip cursor={{ fill: 'rgba(148,163,184,0.12)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {byDecision.map((entry) => (
                        <Cell key={entry.name} fill={barColor(entry.name)} />
                      ))}
                      <LabelList dataKey="count" position="top" fill="#e2e8f0" fontSize={12} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            {!loading && byDecision.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#22c55e' }} /> Approved / Authentic</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#f59e0b' }} /> Review</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#f43f5e' }} /> Blocked / Counterfeit / Removed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
