import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await api.post('/api/auth/forgot-password', null, { params: { email } })
      toast.success('Reset instructions sent to your email')
    } catch (error) {
      toast.error('Unable to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-violet-300"><ArrowLeft className="h-4 w-4" /> Back to login</Link>

        <h1 className="text-3xl font-semibold text-white">Reset password</h1>
        <p className="mt-2 text-sm text-slate-400">Enter your email to receive a secure reset link.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-transparent text-white outline-none" placeholder="name@company.com" required />
            </div>
          </label>

          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-3 font-medium text-white transition hover:scale-[1.01] disabled:opacity-70">
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordPage
