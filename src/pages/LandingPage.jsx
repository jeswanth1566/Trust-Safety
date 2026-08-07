import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Sparkles, ScanFace, TrendingUp, Zap, Check, Globe, ChevronRight, Layers3, Activity, Cpu, BellRing } from 'lucide-react'
import { featureCards, aiAgents, stats, workflowSteps } from '../data/landing'
import ThemeToggle from '../components/ThemeToggle'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function LandingPage() {
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute left-0 top-40 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-60 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold">TrustSafe AI</div>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#agents" className="transition hover:text-white">Agents</a>
            <a href="#workflow" className="transition hover:text-white">Workflow</a>
            <a href="#architecture" className="transition hover:text-white">Architecture</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400 hover:text-white">Login</a>
            <a href="/dashboard" className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/40 transition hover:scale-[1.02]">Book demo</a>
          </div>
        </nav>
      </header>

      <main className="relative">
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
                <Sparkles className="h-4 w-4" />
                AI-powered marketplace trust operations
              </div>
              <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
                Guard every order,
                <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent"> review every risk.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-slate-300">
                Detect fraud, counterfeit listings, and harmful reviews before they impact revenue with an enterprise-grade AI trust and safety platform built for global commerce.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-medium text-white shadow-xl shadow-violet-500/30 transition hover:scale-[1.02]">
                  Launch dashboard
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-slate-200 transition hover:border-blue-400 hover:text-white">
                  Explore platform
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-8 text-sm text-slate-300">
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> SOC 2 ready</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 24/7 monitoring</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Human + AI review</div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      Live trust operations
                    </div>
                    <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">92.4% model confidence</div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Marketplace risk</span>
                        <span className="text-emerald-300">Low</span>
                      </div>
                      <div className="mt-3 h-2.5 rounded-full bg-slate-700">
                        <div className="h-full w-[28%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
                        <div className="text-sm text-slate-300">Fraud flagged</div>
                        <div className="mt-3 text-3xl font-semibold text-white">1,482</div>
                        <div className="mt-2 text-xs text-emerald-300">+18.6% this week</div>
                      </div>
                      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                        <div className="text-sm text-slate-300">Counterfeit</div>
                        <div className="mt-3 text-3xl font-semibold text-white">326</div>
                        <div className="mt-2 text-xs text-violet-300">11.2% below target</div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                        <div className="flex items-center gap-2"><BellRing className="h-4 w-4 text-violet-300" /> Alerts</div>
                        <span className="text-xs text-violet-200">Live</span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"><span>Chargeback spike</span><span className="text-rose-300">High</span></div>
                        <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"><span>Review spam cluster</span><span className="text-amber-300">Medium</span></div>
                        <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"><span>Brand impersonation</span><span className="text-emerald-300">Resolved</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-300">Platform capabilities</p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Built for marketplace trust at scale.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => (
              <motion.div key={feature.title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} transition={{ duration: 0.4 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-blue-500/30">
                  {feature.icon === 'shield' && <ShieldCheck className="h-5 w-5 text-violet-200" />}
                  {feature.icon === 'scan' && <ScanFace className="h-5 w-5 text-violet-200" />}
                  {feature.icon === 'sparkles' && <Sparkles className="h-5 w-5 text-violet-200" />}
                  {feature.icon === 'bolt' && <Zap className="h-5 w-5 text-violet-200" />}
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="agents" className="border-y border-white/10 bg-slate-900/60">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">AI agents</p>
                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Specialized enforcement layers</h2>
              </div>
              <a href="/risk-scoring" className="hidden items-center gap-2 text-sm text-violet-200 md:inline-flex">View agent console <ChevronRight className="h-4 w-4" /></a>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {aiAgents.map((agent, index) => (
                <motion.div key={agent.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-200">
                    {index === 0 && <ShieldCheck className="h-5 w-5" />}
                    {index === 1 && <ScanFace className="h-5 w-5" />}
                    {index === 2 && <Layers3 className="h-5 w-5" />}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{agent.detail}</p>
                  <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                    <span>Confidence</span>
                    <span className="text-white">{88 + index * 4}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center">
                <div className="text-3xl font-semibold text-white">{item.value}</div>
                <div className="mt-3 text-sm text-slate-300">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-300">Workflow</p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">From signal intake to action.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div key={step} className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-sm font-semibold text-white">{index + 1}</div>
                <p className="text-base text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-900/70">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">Technology stack</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Built for performance, observability, and scale.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {['React + Vite', 'FastAPI', 'MongoDB Atlas', 'JWT auth', 'Tailwind', 'Framer Motion', 'Recharts', 'Lucide'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center text-sm font-medium text-slate-200">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-300">Testimonials</p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Trusted by trust &amp; safety teams.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { quote: 'We cut chargeback losses by nearly half in the first quarter. The explainable risk scores made analyst reviews dramatically faster.', name: 'Priya Nair', role: 'Head of Risk, NovaMart' },
              { quote: 'Counterfeit takedowns that used to take days now happen in minutes. The packaging and price signals are remarkably accurate.', name: 'Daniel Osei', role: 'Brand Protection Lead, Lumen' },
              { quote: 'Review integrity finally feels solved. Synthetic-review detection caught patterns our old rules never could.', name: 'Sara Lindqvist', role: 'Marketplace Ops, Harbor' },
            ].map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 text-2xl text-violet-300">&ldquo;</div>
                <p className="text-sm leading-6 text-slate-200">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-semibold text-white">{t.name.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Architecture overview */}
        <section id="architecture" className="border-y border-white/10 bg-slate-900/60">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">Architecture</p>
              <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">How the platform fits together.</h2>
            </div>
            <div className="grid items-center gap-6 lg:grid-cols-3">
              {[
                { icon: <Cpu className="h-5 w-5" />, title: 'React + Vite frontend', desc: 'Premium dashboard with JWT-guarded routes, live charts, and a shared API client.' },
                { icon: <Activity className="h-5 w-5" />, title: 'FastAPI services', desc: 'REST endpoints for auth and three AI agents, with Pydantic validation and role guards.' },
                { icon: <Globe className="h-5 w-5" />, title: 'MongoDB Atlas', desc: 'Persists users and an audit trail of every AI decision powering analytics.' },
              ].map((layer, i) => (
                <div key={layer.title} className="flex items-center gap-4">
                  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex-1 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 text-violet-200">{layer.icon}</div>
                    <h3 className="text-lg font-semibold text-white">{layer.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{layer.desc}</p>
                  </motion.div>
                  {i < 2 && <ChevronRight className="hidden h-6 w-6 shrink-0 text-slate-600 lg:block" />}
                </div>
              ))}
            </div>
          </div>
        </section>


        <section id="contact" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-[2rem] border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-blue-500/10 p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-200">Get started</p>
                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">See how your marketplace can stop abuse before it spreads.</h2>
                <p className="mt-4 max-w-md text-slate-300">Tell us about your marketplace and we'll show you a tailored trust &amp; safety workflow.</p>
                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Response within one business day</div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> No credit card required</div>
                </div>
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); const f = e.target; f.reset(); setSent(true) }}
                className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl"
              >
                {sent ? (
                  <div className="flex h-64 flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300"><Check className="h-6 w-6" /></div>
                    <div className="text-lg font-semibold text-white">Thanks — we'll be in touch!</div>
                    <p className="mt-2 text-sm text-slate-400">Our team will reach out shortly.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input required placeholder="Full name" className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
                    <input required type="email" placeholder="Work email" className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
                    <input placeholder="Company" className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
                    <textarea rows="3" placeholder="What are you trying to solve?" className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-violet-400" />
                    <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-3 font-medium text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.01]">Request a demo <ArrowRight className="h-4 w-4" /></button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/90">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 text-sm text-slate-300 md:grid-cols-4 lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500"><ShieldCheck className="h-4 w-4" /></div>
              <div className="font-medium text-white">TrustSafe AI</div>
            </div>
            <p className="leading-6">AI governance for modern commerce.</p>
          </div>
          <div>
            <h3 className="mb-4 font-medium text-white">Platform</h3>
            <ul className="space-y-3">
              <li>Risk scoring</li>
              <li>Counterfeit detection</li>
              <li>Moderation</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-medium text-white">Company</h3>
            <ul className="space-y-3">
              <li>About</li>
              <li>Customers</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-medium text-white">Resources</h3>
            <ul className="space-y-3">
              <li>Documentation</li>
              <li>Privacy</li>
              <li>Security</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
