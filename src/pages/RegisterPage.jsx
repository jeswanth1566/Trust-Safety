import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'analyst' })
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/api/auth/register', form)
      const { access_token, user } = response.data
      localStorage.setItem('token', access_token)
      localStorage.setItem('authUser', JSON.stringify(user))
      toast.success(`Account created for ${user.name}`)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-semibold text-white">Create account</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Full name</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
              <User className="h-4 w-4 text-slate-400" />
              <input name="name" value={form.name} onChange={handleChange} className="w-full bg-transparent text-white outline-none" placeholder="Jane Doe" required />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full bg-transparent text-white outline-none" placeholder="name@company.com" required />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
              <Lock className="h-4 w-4 text-slate-400" />
              <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full bg-transparent text-white outline-none" placeholder="Create password" required />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Role</span>
            <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none">
              <option value="analyst">Analyst</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-3 font-medium text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.01] disabled:opacity-70">
            {loading ? 'Creating account...' : 'Create account'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="font-medium text-violet-300">Sign in</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
