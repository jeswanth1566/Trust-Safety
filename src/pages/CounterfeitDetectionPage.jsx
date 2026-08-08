import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanFace, UploadCloud, ShieldCheck, ArrowLeft, RotateCcw, X, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'
import SystemStatus from '../components/SystemStatus'

const initialState = {
  product_name: 'Aether Smartwatch Pro',
  msrp: 299.0,
  selling_price: 179.0,
  logo_match_score: 84,
  package_score: 76,
  image_quality: 90,
}

const verdictStyle = (decision) => {
  switch (decision) {
    case 'Counterfeit':
      return { ring: 'border-rose-500/40 bg-rose-500/10', text: 'text-rose-300', bar: 'from-rose-500 to-orange-500', Icon: XCircle }
    case 'Review':
      return { ring: 'border-amber-500/40 bg-amber-500/10', text: 'text-amber-300', bar: 'from-amber-400 to-yellow-500', Icon: AlertTriangle }
    default:
      return { ring: 'border-emerald-500/40 bg-emerald-500/10', text: 'text-emerald-300', bar: 'from-emerald-400 to-teal-500', Icon: CheckCircle2 }
  }
}

function CounterfeitDetectionPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [payload, setPayload] = useState(initialState)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageName, setImageName] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setPayload((current) => ({ ...current, [name]: Number(value) || value }))
  }

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB')
      return
    }
    setImagePreview(URL.createObjectURL(file))
    setImageName(file.name)
    toast.success(`Attached ${file.name}`)
  }

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setImageName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleReset = () => {
    setPayload(initialState)
    setResult(null)
    clearImage()
    toast.info('Form reset to defaults')
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

  const vs = result ? verdictStyle(result.decision) : null

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <button onClick={() => navigate('/dashboard')} className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>

        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200"><ScanFace className="h-6 w-6" /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">AI Agent</p>
            <h1 className="text-3xl font-semibold text-white">Counterfeit Detection Agent</h1>
            <p className="mt-1 text-sm text-slate-400">Image analysis, MSRP comparison, and packaging authentication.</p>
          </div>
        </div>
          <SystemStatus className="hidden sm:inline-flex" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            {/* Working image upload */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            {imagePreview ? (
              <div className="mb-5 flex items-center gap-4 rounded-2xl border border-violet-500/20 bg-slate-950/50 p-3">
                <img src={imagePreview} alt="Product preview" className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1 truncate text-sm text-slate-300">{imageName}</div>
                <button type="button" onClick={clearImage} className="rounded-full p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mb-5 flex w-full items-center justify-between rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300 transition hover:border-violet-400/50"
              >
                <span className="flex items-center gap-2"><UploadCloud className="h-4 w-4 text-violet-200" /> Upload product image</span>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-violet-200">Select file</span>
              </button>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-slate-300">Product name</span>
                <input name="product_name" value={payload.product_name} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">MSRP ($)</span>
                <input type="number" step="0.01" name="msrp" value={payload.msrp} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Selling price ($)</span>
                <input type="number" step="0.01" name="selling_price" value={payload.selling_price} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Logo match score (0–100)</span>
                <input type="number" name="logo_match_score" value={payload.logo_match_score} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Package score (0–100)</span>
                <input type="number" name="package_score" value={payload.package_score} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-slate-300">Image quality (0–100)</span>
                <input type="number" name="image_quality" value={payload.image_quality} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 font-medium text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.01] disabled:opacity-70">
                {loading ? 'Scanning…' : 'Analyze authenticity'}
              </button>
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:text-white">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-white">Authenticity report</div>
              <div className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Image + price review</div>
            </div>

            {loading ? (
              <div className="mt-6 space-y-4">
                <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
              </div>
            ) : result ? (
              <div className="mt-6 space-y-5">
                <div className={`flex items-center gap-4 rounded-2xl border p-4 ${vs.ring}`}>
                  <vs.Icon className={`h-8 w-8 ${vs.text}`} />
                  <div>
                    <div className="text-sm text-slate-300">Verdict</div>
                    <div className={`text-2xl font-semibold ${vs.text}`}>{result.decision}</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">
                  <div className="flex items-end justify-between">
                    <div className="text-sm text-slate-300">Counterfeit probability</div>
                    <div className="text-5xl font-semibold text-white">{result.counterfeit_probability}<span className="text-lg text-slate-400">%</span></div>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-slate-800">
                    <div className={`h-full rounded-full bg-gradient-to-r ${vs.bar}`} style={{ width: `${result.counterfeit_probability}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-slate-400">Authenticity score</div><div className="mt-2 text-xl text-white">{result.authenticity_score}</div></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-slate-400">Price gap</div><div className="mt-2 text-xl text-white">{result.risk_factors?.price_gap_percent}%</div></div>
                </div>

                {result.risk_factors && (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <div className="mb-3 text-sm font-medium text-white">Risk factors</div>
                    {[
                      ['Logo match', result.risk_factors.logo_match_score],
                      ['Packaging', result.risk_factors.package_score],
                      ['Image quality', result.risk_factors.image_quality],
                    ].map(([label, val]) => (
                      <div key={label} className="mb-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-400">{label}</span><span className="text-white">{val}</span></div>
                        <div className="mt-1 h-1.5 rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${val}%` }} /></div>
                      </div>
                    ))}
                  </div>
                )}

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
