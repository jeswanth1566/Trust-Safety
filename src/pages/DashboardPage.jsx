import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { ArrowUpRight, Bell, Sparkles, Search, UserCircle2, LayoutDashboard, ShieldCheck, Activity, Gauge, ScanSearch, TrendingUp, Settings, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { modelMetrics, sellers } from '../data/dashboard'
import api from '../lib/api'
import ThemeToggle from '../components/ThemeToggle'
import SystemStatus from '../components/SystemStatus'

const COLORS = ['#8b5cf6', '#22c55e', '#3b82f6', '#f59e0b']

const currency = (n) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K`
  : `$${n}`

function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('authUser')
    if (!savedUser) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(savedUser))
  }, [navigate])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get('/api/audit/dashboard')
        setData(res.data)
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const k = data?.kpis || {}
  const stats = [
    { label: 'Revenue Saved', value: loading ? '—' : currency(k.revenue_saved || 0) },
    { label: 'Total Decisions', value: loading ? '—' : (k.total_decisions || 0).toLocaleString() },
    { label: 'Counterfeit Blocked', value: loading ? '—' : (k.counterfeit_blocked || 0).toLocaleString() },
    { label: 'Fake Reviews Removed', value: loading ? '—' : (k.fake_reviews_removed || 0).toLocaleString() },
  ]
  const trendData = data?.trend || []
  const alerts = data?.alerts || []

  // Live client-side filtering of alerts by the search box.
  const filteredAlerts = alerts.filter((a) =>
    !search || `${a.title} ${a.detail} ${a.severity}`.toLowerCase().includes(search.toLowerCase())
  )

  const severityDot = (s) =>
    s === 'critical' ? 'bg-rose-400' : s === 'high' ? 'bg-amber-400' : s === 'medium' ? 'bg-cyan-400' : 'bg-emerald-400'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-white/10 bg-slate-900/75 px-6 py-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <div className="text-lg font-semibold text-white">TrustSafe</div>
              <div className="text-xs text-slate-400">AI Operations</div>
            </div>
          </div>

          <nav className="mt-10 space-y-2 text-sm text-slate-300">
            {[
              ['Dashboard', LayoutDashboard, '/dashboard'],
              ['Risk Scoring', Gauge, '/risk-scoring'],
              ['Counterfeit', ScanSearch, '/counterfeit-detection'],
              ['Review Moderation', Sparkles, '/review-moderation'],
              ['Audit Logs', Activity, '/audit-logs'],
              ['Analytics', TrendingUp, '/analytics'],
              ['Admin', Settings, '/admin'],
            ].map(([label, Icon, path]) => (
              <button key={label} onClick={() => navigate(path)} className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-left transition hover:border-violet-500/30 hover:bg-white/5 hover:text-white">
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-[1.5rem] border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-violet-200">System health</p>
            <SystemStatus className="w-full justify-center" />
          </div>

          <button onClick={handleLogout} className="mt-10 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm text-slate-300 transition hover:border-rose-500/30 hover:text-white">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Operations dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Trust & Safety overview</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search alerts" className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none" />
              </div>
              <div className="relative">
                <button onClick={() => setShowNotifications((v) => !v)} className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:text-white">
                  <Bell className="h-4 w-4" />
                  {alerts.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">{alerts.length}</span>}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="mb-2 px-1 text-sm font-semibold text-white">Notifications</div>
                    {alerts.length === 0 ? (
                      <div className="px-1 py-4 text-center text-sm text-slate-400">No recent alerts.</div>
                    ) : (
                      alerts.slice(0, 5).map((a) => (
                        <button key={a.id} onClick={() => { setShowNotifications(false); navigate('/audit-logs') }} className="flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/5">
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot(a.severity)}`} />
                          <span className="flex-1">
                            <span className="block text-sm text-white">{a.title}</span>
                            <span className="block text-xs text-slate-400">{a.detail}</span>
                          </span>
                        </button>
                      ))
                    )}
                    <button onClick={() => { setShowNotifications(false); navigate('/audit-logs') }} className="mt-2 w-full rounded-xl bg-white/5 py-2 text-center text-xs text-violet-300 transition hover:text-violet-200">View all in audit logs</button>
                  </div>
                )}
              </div>
              <button onClick={() => navigate('/admin')} className="flex items-center gap-3 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-white transition hover:bg-violet-500/20">
                <UserCircle2 className="h-5 w-5 text-violet-200" />
                {user?.name || 'Admin'}
              </button>
            </div>
          </header>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-300">{stat.label}</div>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                    <ArrowUpRight className="h-3.5 w-3.5" /> live
                  </div>
                </div>
                <div className="mt-6 text-3xl font-semibold text-white">{stat.value}</div>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
            <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/75 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-white">Fraud &amp; trust trends</div>
                  <div className="text-sm text-slate-400">Last 6 months</div>
                </div>
                <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">Live data</div>
              </div>
              <div className="h-72">
                {loading ? (
                  <div className="h-full w-full animate-pulse rounded-2xl bg-white/5" />
                ) : trendData.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-slate-400">No decisions logged yet — run some agent analyses.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid stroke="#293548" strokeDasharray="3 3" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} />
                      <Line type="monotone" dataKey="fraud" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} name="Decisions" />
                      <Line type="monotone" dataKey="blocked" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} name="Blocked" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/75 p-5">
              <div className="mb-5 text-lg font-semibold text-white">Model performance</div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={modelMetrics} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                      {modelMetrics.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {modelMetrics.map((metric, index) => (
                  <div key={metric.name} className="flex items-center justify-between text-sm text-slate-300">
                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} /> {metric.name}</div>
                    <span className="font-medium text-white">{metric.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/75 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="text-lg font-semibold text-white">Live notifications</div>
                <div className="text-sm text-violet-300">{filteredAlerts.length} recent</div>
              </div>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
                  ))
                ) : filteredAlerts.length === 0 ? (
                  <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-slate-400">
                    No recent decisions. Run an agent to generate activity.
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className={`mt-1 h-2.5 w-2.5 rounded-full ${severityDot(alert.severity)}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium text-white">{alert.title}</div>
                          <span className="text-xs uppercase tracking-[0.14em] text-slate-400">{alert.severity}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-300">{alert.detail}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/75 p-5">
              <div className="mb-5 text-lg font-semibold text-white">Seller health</div>
              <div className="space-y-4">
                {sellers.map((seller) => (
                  <div key={seller.name} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between">
                      <div>{seller.name}</div>
                      <div className="text-sm text-violet-200">{seller.score}/100</div>
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${seller.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
