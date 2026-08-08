import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Download, Filter, ShieldCheck, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'
import SystemStatus from '../components/SystemStatus'

// Format an ISO timestamp into a friendly relative-ish label.
function formatTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const decisionTone = (decision) => {
  const blocked = ['Block', 'Blocked', 'Counterfeit', 'Removed']
  const review = ['Review']
  if (blocked.includes(decision)) return 'bg-rose-500/10 text-rose-300'
  if (review.includes(decision)) return 'bg-amber-500/10 text-amber-300'
  return 'bg-emerald-500/10 text-emerald-300'
}

function AuditLogsPage() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [decisionFilter, setDecisionFilter] = useState('all')

  // Debounced fetch whenever the search query changes.
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await api.get('/api/audit/logs', {
          params: query ? { q: query } : {},
          signal: controller.signal,
        })
        setRecords(res.data.records || [])
      } catch (error) {
        if (error.name !== 'CanceledError') {
          toast.error(error.response?.data?.detail || 'Failed to load audit logs')
        }
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const handleExport = () => {
    if (!records.length) return toast.info('Nothing to export yet')
    const header = 'id,agent,decision,reason,actor,time\n'
    const rows = records.map((r) =>
      [r.id, r.agent, r.decision, `"${(r.reason || '').replace(/"/g, '""')}"`, r.actor, r.time].join(',')
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Audit logs exported')
  }

  const visibleRecords = records.filter((r) => {
    if (decisionFilter === 'all') return true
    if (decisionFilter === 'blocked') return ['Block', 'Blocked', 'Counterfeit', 'Removed'].includes(r.decision)
    if (decisionFilter === 'review') return r.decision === 'Review'
    if (decisionFilter === 'approved') return ['Approve', 'Approved', 'Authentic'].includes(r.decision)
    return true
  })

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <button onClick={() => navigate('/dashboard')} className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Governance</p>
            <h1 className="text-3xl font-semibold text-white">Audit logs</h1>
          </div>
          <div className="flex items-center gap-3">
            <SystemStatus className="hidden md:inline-flex" />
            <div className="relative">
              <button onClick={() => setShowFilters((v) => !v)} className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition ${decisionFilter !== 'all' ? 'border-violet-500/40 bg-violet-500/10 text-violet-200' : 'border-white/10 bg-white/5 text-slate-200 hover:text-white'}`}><Filter className="h-4 w-4" /> Filters{decisionFilter !== 'all' ? ' (1)' : ''}</button>
              {showFilters && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl">
                  <div className="px-2 py-1 text-xs uppercase tracking-wide text-slate-500">Decision</div>
                  {[['all', 'All decisions'], ['blocked', 'Blocked / removed'], ['review', 'Review'], ['approved', 'Approved']].map(([val, label]) => (
                    <button key={val} onClick={() => { setDecisionFilter(val); setShowFilters(false) }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/5 ${decisionFilter === val ? 'text-violet-300' : 'text-slate-300'}`}>
                      {label}{decisionFilter === val && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleExport} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-medium text-white"><Download className="h-4 w-4" /> Export</button>
          </div>
        </div>

        <div className="mb-8 rounded-[1.8rem] border border-white/10 bg-slate-900/70 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by agent, actor, or reason"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-lg font-semibold text-white">Decision timeline</div>
              {!loading && <div className="text-sm text-violet-300">{visibleRecords.length} records</div>}
            </div>

            <div className="space-y-4">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="h-4 w-40 rounded bg-white/10" />
                    <div className="mt-3 h-3 w-64 rounded bg-white/10" />
                    <div className="mt-3 h-3 w-28 rounded bg-white/5" />
                  </div>
                ))
              ) : visibleRecords.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-slate-400">
                  <ShieldCheck className="mb-3 h-8 w-8 text-violet-200" />
                  No decisions logged yet. Run an agent analysis to populate the timeline.
                </div>
              ) : (
                visibleRecords.map((record) => (
                  <div key={record.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-white">{record.agent}</div>
                        <div className="mt-1 text-xs text-slate-400">{formatTime(record.time)}</div>
                      </div>
                      <div className={`rounded-full px-2 py-1 text-xs ${decisionTone(record.decision)}`}>{record.decision}</div>
                    </div>
                    <div className="mt-3 text-sm text-slate-300">{record.reason}</div>
                    <div className="mt-3 text-xs text-slate-500">Actor: {record.actor}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
            <div className="mb-5 text-lg font-semibold text-white">Explainability</div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
                <div className="flex items-center gap-2 text-violet-200"><ShieldCheck className="h-4 w-4" /> Signal summary</div>
                <div className="mt-3 text-sm leading-6 text-slate-300">Chargeback velocity, device anomaly, and policy mismatch are the highest-weight risk factors across recent decisions.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="text-sm text-slate-400">Decisions logged</div>
                <div className="mt-2 text-3xl font-semibold text-white">{loading ? '—' : records.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="text-sm text-slate-400">Escalation status</div>
                <div className="mt-2 text-lg font-medium text-white">Queued for analyst review</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuditLogsPage
