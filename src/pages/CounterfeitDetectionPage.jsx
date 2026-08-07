import { useState } from 'react'
import { ScanFace, UploadCloud, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'

const initialState = {
  product_name: 'Aether Smartwatch Pro',
  msrp: 299.0,
  selling_price: 179.0,
  logo_match_score: 84,
  package_score: 76,
  image_quality: 90,
}

function CounterfeitDetectionPage() {
  const [payload, setPayload] = useState(initialState)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setPayload((current) => ({ ...current, [name]: Number(value) || value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/api/agents/counterfeit-detection', {
        ...payload,
        msrp: Number(payload.msrp),
        selling_price: Number(payload.selling_price),
        logo_match_score: Number(payload.logo_match_score),
        package_score: Number(payload.package_score),
        image_quality: Number(payload.image_quality),
      })
      setResult(response.data)
      toast.success('Counterfeit assessment complete')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Assessment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200"><ScanFace className="h-6 w-6" /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">AI Agent</p>
            <h1 className="text-3xl font-semibold text-white">Counterfeit Detection Agent</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
              <div className="flex items-center gap-2"><UploadCloud className="h-4 w-4 text-violet-200" /> Upload product image</div>
              <button type="button" className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-violet-200">Select file</button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-slate-300">Product name</span>
                <input name="product_name" value={payload.product_name} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">MSRP</span>
                <input type="number" step="0.01" name="msrp" value={payload.msrp} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Selling price</span>
                <input type="number" step="0.01" name="selling_price" value={payload.selling_price} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Logo match score</span>
                <input type="number" name="logo_match_score" value={payload.logo_match_score} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Package score</span>
                <input type="number" name="package_score" value={payload.package_score} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-slate-300">Image quality</span>
                <input type="number" name="image_quality" value={payload.image_quality} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none" />
              </label>
            </div>

            <button type="submit" disabled={loading} className="mt-6 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 font-medium text-white shadow-lg shadow-violet-500/30 disabled:opacity-70">
              {loading ? 'Scanning...' : 'Analyze authenticity'}
            </button>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-white">Authenticity report</div>
              <div className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Image + price review</div>
            </div>

            {result ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">
                  <div className="text-sm text-slate-300">Counterfeit probability</div>
                  <div className="mt-2 text-5xl font-semibold text-white">{result.counterfeit_probability}%</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-slate-400">Authenticity</div><div className="mt-2 text-xl text-white">{result.authenticity_score}</div></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-slate-400">Decision</div><div className="mt-2 text-xl text-white">{result.decision}</div></div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">{result.explanation}</div>
              </div>
            ) : (
              <div className="mt-10 flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/50 text-center text-slate-400">
                <ShieldCheck className="mb-3 h-10 w-10 text-violet-200" />
                No detection yet. Submit a listing to assess authenticity.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CounterfeitDetectionPage
