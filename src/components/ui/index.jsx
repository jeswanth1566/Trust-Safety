/**
 * Reusable, theme-aware UI primitives shared across pages.
 * These wrap the common Tailwind patterns used throughout the app so markup
 * stays consistent and DRY.
 */

// Glassmorphism card container.
export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-[1.6rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl ${className}`} {...props}>
      {children}
    </div>
  )
}

// Gradient primary button (falls back to a subtle variant).
export function Button({ variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-70'
  const variants = {
    primary: 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/30 hover:scale-[1.01]',
    ghost: 'border border-white/15 bg-white/5 text-slate-200 hover:border-violet-400 hover:text-white',
    danger: 'border border-rose-500/30 bg-rose-500/10 text-rose-200 hover:text-white',
  }
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Labelled text input.
export function Field({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm text-slate-300">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400 ${className}`}
        {...props}
      />
    </label>
  )
}

// Loading skeleton block.
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-white/5 ${className}`} />
}

// Small colored status pill.
export function Badge({ tone = 'violet', className = '', children }) {
  const tones = {
    violet: 'bg-violet-500/10 text-violet-300',
    emerald: 'bg-emerald-500/10 text-emerald-300',
    amber: 'bg-amber-500/10 text-amber-300',
    rose: 'bg-rose-500/10 text-rose-300',
    blue: 'bg-blue-500/10 text-blue-300',
  }
  return <span className={`rounded-full px-2 py-1 text-xs ${tones[tone] || tones.violet} ${className}`}>{children}</span>
}
