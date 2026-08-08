import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, Eye, EyeOff, UserCircle2, X, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'
import SystemStatus from '../components/SystemStatus'

const ACCOUNTS_KEY = 'savedAccounts'

// Read the list of previously used accounts (emails + names only — never passwords).
function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || []
  } catch {
    return []
  }
}

function saveAccount(user) {
  const list = loadAccounts().filter((a) => a.email !== user.email)
  list.unshift({ email: user.email, name: user.name })
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list.slice(0, 6)))
}

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@trustsafe.ai')
  const [password, setPassword] = useState('Admin@123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [showAccounts, setShowAccounts] = useState(false)

  useEffect(() => {
    setAccounts(loadAccounts())
  }, [])

  // Accounts matching what's typed so far (or all of them when the field is empty).
  const suggestions = accounts.filter((a) =>
    !email || a.email.toLowerCase().includes(email.toLowerCase()) || (a.name || '').toLowerCase().includes(email.toLowerCase())
  )

  const pickAccount = (acc) => {
    setEmail(acc.email)
    setShowAccounts(false)
  }

  const removeAccount = (e, targetEmail) => {
    e.stopPropagation()
    const list = accounts.filter((a) => a.email !== targetEmail)
    setAccounts(list)
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { token_type, access_token, user } = response.data
      localStorage.setItem('token', access_token)
      localStorage.setItem('authUser', JSON.stringify(user))
      localStorage.setItem('tokenType', token_type)
      saveAccount(user) // remember this account (email + name only)
      toast.success(`Welcome back, ${user.name}`)
      navigate('/dashboard')
    } catch (error) {
      const d = error.response?.data?.detail
      const msg = Array.isArray(d) ? d.map((x) => x.msg).join(', ')
        : typeof d === 'string' ? d : 'Login failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.25),_transparent_30%)]" />
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-semibold text-white">TrustSafe AI</div>
            <div className="text-xs text-slate-400">Secure marketplace operations</div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to continue monitoring trust and safety operations.</p>
          <div className="mt-4 flex justify-center">
            <SystemStatus />
          </div>
        </div>

        {/* Saved account chips — quick pick of previously used accounts */}
        {accounts.length > 0 && (
          <div className="mb-6">
            <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Recent accounts</div>
            <div className="flex flex-wrap gap-2">
              {accounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => pickAccount(acc)}
                  className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${email === acc.email ? 'border-violet-500/50 bg-violet-500/10 text-violet-200' : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'}`}
                >
                  <UserCircle2 className="h-3.5 w-3.5" />
                  <span>{acc.name || acc.email}</span>
                  <span onClick={(e) => removeAccount(e, acc.email)} className="ml-1 rounded-full p-0.5 text-slate-500 opacity-0 transition group-hover:opacity-100 hover:text-rose-300"><X className="h-3 w-3" /></span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <div className="relative">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setShowAccounts(true) }}
                  onFocus={() => setShowAccounts(true)}
                  onBlur={() => setTimeout(() => setShowAccounts(false), 150)}
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                  placeholder="name@company.com"
                  type="email"
                  autoComplete="off"
                  required
                />
                {accounts.length > 0 && (
                  <button type="button" onMouseDown={(e) => { e.preventDefault(); setShowAccounts((v) => !v) }} className="text-slate-400 transition hover:text-white" title="Show saved accounts">
                    <ChevronDown className={`h-4 w-4 transition ${showAccounts ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              {/* Live account suggestions as you type */}
              {showAccounts && suggestions.length > 0 && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
                  {suggestions.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onMouseDown={() => pickAccount(acc)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/5"
                    >
                      <UserCircle2 className="h-5 w-5 text-violet-200" />
                      <span className="flex-1">
                        <span className="block text-sm text-white">{acc.name || acc.email}</span>
                        <span className="block text-xs text-slate-400">{acc.email}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
              <Lock className="h-4 w-4 text-slate-400" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent text-white outline-none placeholder:text-slate-500" placeholder="••••••••" type={showPassword ? 'text' : 'password'} required />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-400 transition hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </label>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <label className="inline-flex items-center gap-2"><input type="checkbox" className="accent-violet-500" /> Remember me</label>
            <Link to="/forgot-password" className="text-violet-300 hover:text-violet-200">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-3 font-medium text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Signing in…' : 'Sign in'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          No account yet? <Link to="/register" className="font-medium text-violet-300 hover:text-violet-200">Create one</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
