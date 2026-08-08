import { useEffect, useState } from 'react'
import { Shield, Users, Bell, ServerCog, Search, UserCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'

const alerts = [
  { name: 'Policy drift', value: '2 alerts', tone: 'rose' },
  { name: 'Model sync', value: 'Healthy', tone: 'emerald' },
  { name: 'API latency', value: '128 ms', tone: 'blue' },
]

function relativeSince(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
}

function AdminPanelPage() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [userSearch, setUserSearch] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const [u, s] = await Promise.all([
          api.get('/api/admin/users'),
          api.get('/api/admin/stats'),
        ])
        setUsers(u.data.users || [])
        setStats(s.data)
      } catch (error) {
        if (error.response?.status === 403) {
          setForbidden(true)
        } else {
          toast.error(error.response?.data?.detail || 'Failed to load admin data')
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const statusTone = (role) =>
    role === 'admin' ? 'bg-violet-500/10 text-violet-300' : 'bg-emerald-500/10 text-emerald-300'

  const kpis = [
    ['Users', loading ? '—' : (stats?.users ?? 0), Users],
    ['Admins', loading ? '—' : (stats?.admins ?? 0), Shield],
    ['Decisions', loading ? '—' : (stats?.decisions ?? 0), Bell],
    ['System status', 'Nominal', ServerCog],
  ]

  const visibleUsers = users.filter((u) =>
    !userSearch || `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(userSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Admin console</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Operations control</h1>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search users" className="bg-transparent outline-none placeholder:text-slate-500" />
          </div>
        </div>

        {forbidden ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-rose-500/30 bg-rose-500/5 text-center text-slate-300">
            <Shield className="mb-3 h-10 w-10 text-rose-300" />
            <div className="text-lg font-semibold text-white">Admin access required</div>
            <p className="mt-2 max-w-sm text-sm text-slate-400">Your account role does not have permission to view the admin console. Sign in as an admin to manage users.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-4">
              {kpis.map(([label, value, Icon]) => (
                <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{label}</span>
                    <Icon className="h-4 w-4 text-violet-200" />
                  </div>
                  <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/70 p-5">
                <div className="mb-5 text-lg font-semibold text-white">User management</div>
                <div className="space-y-4">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
                    ))
                  ) : visibleUsers.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 text-slate-400">No users found.</div>
                  ) : (
                    visibleUsers.map((user) => (
                      <div key={user.email} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                          <UserCircle2 className="h-8 w-8 text-violet-200" />
                          <div>
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="mt-1 text-sm text-slate-400">{user.email} • {relativeSince(user.since)}</div>
                          </div>
                        </div>
                        <div className={`rounded-full px-2 py-1 text-xs capitalize ${statusTone(user.role)}`}>{user.role}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/70 p-5">
                  <div className="mb-4 text-lg font-semibold text-white">Alert management</div>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div>{alert.name}</div>
                        <div className={`rounded-full px-2 py-1 text-xs ${alert.tone === 'rose' ? 'bg-rose-500/10 text-rose-300' : alert.tone === 'emerald' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-blue-500/10 text-blue-300'}`}>{alert.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/70 p-5">
                  <div className="mb-4 text-lg font-semibold text-white">System health</div>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-slate-300">API latency</div>
                      <div className="mt-2 text-3xl font-semibold text-white">128 ms</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-slate-300">Database sync</div>
                      <div className="mt-2 text-3xl font-semibold text-white">Stable</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPanelPage
