import { motion } from 'framer-motion'

const stages = [
  {
    layer: 'Bronze',
    color: 'amber',
    gradient: 'from-amber-600 to-orange-500',
    icon: '\ud83e\udea8',
    title: 'Raw Data Ingestion',
    items: [
      'PSG recordings from multiple sleep labs',
      'EDF/EDF+ file parsing and validation',
      'Auto-staging with AASM guidelines',
      'Unity Catalog raw data registration',
      'Delta Lake append-only log storage',
    ],
    tech: ['Apache Spark', 'Delta Lake', 'Unity Catalog', 'AASM'],
  },
  {
    layer: 'Silver',
    color: 'slate',
    gradient: 'from-slate-400 to-gray-300',
    icon: '\u26a1',
    title: 'Feature Engineering & Cleaning',
    items: [
      'Band-pass filtering (0.5-45 Hz)',
      'ICA artifact removal',
      'Sleep spindle and slow-wave detection',
      'TDA: Ripser persistent homology computation',
      'PLV functional connectivity matrices',
    ],
    tech: ['MNE-Python', 'Ripser', 'Gudhi', 'DLT'],
  },
  {
    layer: 'Gold',
    color: 'yellow',
    gradient: 'from-yellow-400 to-amber-300',
    icon: '\ud83c\udfc6',
    title: 'Model-Ready Aggregations',
    items: [
      'Subject-level TDA feature vectors',
      'Betti number time series per sleep stage',
      'Memory consolidation score computation',
      'MLflow experiment tracking and model registry',
      'BI-ready summary tables for dashboards',
    ],
    tech: ['MLflow', 'Databricks AutoML', 'Feature Store', 'SQL'],
  },
]

const cicdSteps = [
  { step: '1', title: 'Code Push', desc: 'Developer pushes to feature branch on GitHub' },
  { step: '2', title: 'CI Tests', desc: 'GitHub Actions runs pytest + vitest + linting' },
  { step: '3', title: 'DAB Deploy', desc: 'Databricks Asset Bundles deploy jobs to staging' },
  { step: '4', title: 'Integration', desc: 'End-to-end pipeline test on sample PSG data' },
  { step: '5', title: 'Production', desc: 'Merge to main triggers prod deployment' },
]

export default function Pipeline() {
  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-4">Data Pipeline</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A production-grade Databricks Medallion Architecture for processing Sleep EEG data at scale.
          </p>
        </motion.div>

        {/* Medallion Stages */}
        <div className="space-y-6 mb-20">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.layer}
              className="glass rounded-2xl p-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="flex items-start gap-6">
                <div className={`text-5xl p-4 rounded-xl bg-gradient-to-br ${stage.gradient} bg-opacity-20`}>
                  {stage.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${stage.gradient} text-gray-900`}>
                      {stage.layer} Layer
                    </span>
                    <h3 className="text-xl font-bold">{stage.title}</h3>
                  </div>
                  <ul className="grid md:grid-cols-2 gap-1 mb-4">
                    {stage.items.map(item => (
                      <li key={item} className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="text-cyan-400">\u2192</span> {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {stage.tech.map(t => (
                      <span key={t} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded font-mono">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CI/CD */}
        <h2 className="text-3xl font-bold text-center mb-10">CI/CD with GitHub Actions + DABs</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {cicdSteps.map((s, i) => (
            <motion.div
              key={s.step}
              className="glass rounded-xl p-6 w-44 text-center card-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold mx-auto mb-3">{s.step}</div>
              <h4 className="font-bold text-sm mb-1">{s.title}</h4>
              <p className="text-gray-500 text-xs">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
