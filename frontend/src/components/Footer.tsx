import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-gradient mb-2">NeuroLab</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Computational Neuroscience Laboratory specializing in Sleep EEG analysis
              using Topological Data Analysis, Persistent Homology, and scalable
              Databricks-powered pipelines.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Research</h4>
            <ul className="space-y-2">
              {[['Research', '/research'], ['Pipeline', '/pipeline'], ['Publications', '/publications']].map(([label, path]) => (
                <li key={path}><Link to={path} className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Lab</h4>
            <ul className="space-y-2">
              {[['Team', '/team'], ['Contact', '/contact']].map(([label, path]) => (
                <li key={path}><Link to={path} className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">{label}</Link></li>
              ))}
              <li><a href="https://github.com/wang-yuhao" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} NeuroLab. All rights reserved.</p>
          <p className="text-gray-600 text-xs font-mono">Sleep EEG · TDA · Persistent Homology · Databricks</p>
        </div>
      </div>
    </footer>
  )
}
