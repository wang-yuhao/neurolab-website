import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getMetrics } from '../api'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export default function Home() {
  const { data: metrics } = useQuery({ queryKey: ['metrics'], queryFn: getMetrics })

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/20 to-purple-950/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(6,182,212,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.05) 0%, transparent 50%)'
        }} />
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-mono mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Sleep EEG Research Pipeline · Medallion Architecture
            </span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Decoding Sleep with
            <br />
            <span className="text-gradient">Topological Data Analysis</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            We apply Persistent Homology and TDA to high-density EEG recordings,
            revealing the topological fingerprints of memory consolidation during sleep
            — powered by a scalable Databricks Medallion pipeline.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Link to="/research" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Explore Research
            </Link>
            <Link to="/pipeline" className="px-8 py-3 glass rounded-xl font-semibold hover:bg-white/10 transition-all">
              View Pipeline
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Metrics */}
      {metrics && (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(metrics).map(([key, val]) => (
                <motion.div
                  key={key}
                  className="glass rounded-2xl p-6 text-center card-hover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <p className="text-3xl font-black text-gradient">{String(val)}</p>
                  <p className="text-gray-400 text-sm mt-1 capitalize">{key.replace(/_/g, ' ')}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Research Areas */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Research Focus</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Our work sits at the intersection of computational topology, neuroscience, and big data engineering.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Persistent Homology', icon: '\u29bf', desc: 'Computing Betti numbers and persistence diagrams from EEG signals to characterize brain state topology.', color: 'cyan' },
              { title: 'Memory Consolidation', icon: '\ud83e\udde0', desc: 'Tracking how sleep oscillations (spindles, SWS, REM) sculpt memory traces across hippocampal-cortical networks.', color: 'purple' },
              { title: 'Scalable Pipelines', icon: '\u26a1', desc: 'Databricks Delta Lake medallion architecture processing terabytes of polysomnography data with DLT and MLflow.', color: 'blue' },
            ].map(({ title, icon, desc, color }) => (
              <motion.div
                key={title}
                className="glass rounded-2xl p-8 card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className={`text-4xl mb-4`}>{icon}</div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
