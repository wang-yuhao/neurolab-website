import { motion } from 'framer-motion'

const topics = [
  {
    title: 'Topological Data Analysis of EEG',
    description: 'We leverage persistent homology to extract topological features from EEG time series during sleep stages (N1, N2, N3, REM). Betti numbers and persistence diagrams capture the multi-scale structure of neural dynamics.',
    tags: ['Persistent Homology', 'Betti Numbers', 'Ripser', 'Gudhi'],
  },
  {
    title: 'Sleep Spindle & Slow Wave Detection',
    description: 'Automated detection of sleep spindles (11-16 Hz) and slow waves (<1 Hz) using deep learning on raw EEG, validated against expert annotations with >95% sensitivity.',
    tags: ['Signal Processing', 'Deep Learning', 'PyTorch', 'ANOVA'],
  },
  {
    title: 'Memory Consolidation Mechanisms',
    description: 'Systems-level consolidation tracked through hippocampal-neocortical dialogue patterns. Sharp wave ripples (SWRs) replay event sequences during NREM sleep.',
    tags: ['Hippocampus', 'SWR', 'Replay', 'fMRI'],
  },
  {
    title: 'Graph Neural Networks on Brain Connectivity',
    description: 'GNNs applied to functional connectivity graphs derived from coherence and phase-locking value (PLV) matrices, predicting memory performance from network topology.',
    tags: ['GNN', 'PyG', 'Connectivity', 'PLV'],
  },
  {
    title: 'Personalized Sleep Medicine',
    description: 'Machine learning models trained on individual sleep architecture to predict cognitive outcomes and tailor interventions — moving toward N-of-1 sleep neuroscience.',
    tags: ['Personalization', 'Longitudinal', 'MLflow', 'AutoML'],
  },
  {
    title: 'Scalable Data Engineering',
    description: 'Our Databricks-based lakehouse handles raw PSG data ingestion (Bronze), feature engineering (Silver), and model-ready aggregations (Gold) via Delta Live Tables.',
    tags: ['Databricks', 'Delta Lake', 'DLT', 'Unity Catalog'],
  },
]

export default function Research() {
  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-4">Research Areas</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our interdisciplinary approach bridges algebraic topology, computational neuroscience, and modern data engineering.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.title}
              className="glass rounded-2xl p-6 card-hover"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-lg font-bold mb-3 text-white">{topic.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{topic.description}</p>
              <div className="flex flex-wrap gap-2">
                {topic.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-md font-mono">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
