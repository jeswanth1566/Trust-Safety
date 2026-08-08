import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import api from '../lib/api'

/**
 * Live system health pill. Pings /api/health and shows whether the API and
 * database are reachable — so users can see the platform is actually running.
 */
function SystemStatus({ className = '' }) {
  const [status, setStatus] = useState('checking') // checking | online | db-down | offline

  useEffect(() => {
    let active = true
    const check = async () => {
      try {
        const res = await api.get('/api/health')
        if (!active) return
        setStatus(res.data?.database === 'connected' ? 'online' : 'db-down')
      } catch {
        if (active) setStatus('offline')
      }
    }
    check()
    const id = setInterval(check, 15000) // re-check every 15s
    return () => { active = false; clearInterval(id) }
  }, [])

  const map = {
    checking: { dot: 'bg-slate-400', text: 'Checking…', tone: 'text-slate-400' },
    online: { dot: 'bg-emerald-400 animate-pulse', text: 'All systems operational', tone: 'text-emerald-300' },
    'db-down': { dot: 'bg-amber-400', text: 'API up · database offline', tone: 'text-amber-300' },
    offline: { dot: 'bg-rose-400', text: 'Backend offline', tone: 'text-rose-300' },
  }
  const s = map[status]

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs ${className}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      <Activity className="h-3.5 w-3.5 text-slate-400" />
      <span className={s.tone}>{s.text}</span>
    </div>
  )
}

export default SystemStatus
