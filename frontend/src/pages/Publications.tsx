import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getPublications } from '../api'

export default function Publications() {
  const { data: pubs, isLoading } = useQuery({ queryKey: ['publications'], queryFn: getPublications })

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-4">Publications</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Peer-reviewed research from the NeuroLab on sleep EEG, TDA, and memory consolidation.
          </p>
        </motion.div>

        {isLoading && <div className="text-center text-gray-400">Loading publications...</div>}

        {pubs && (
          <div className="space-y-6">
            {pubs.map((pub: any, i: number) => (
              <motion.div
                key={pub.id}
                className="glass rounded-2xl p-8 card-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 hover:text-cyan-400 transition-colors">
                      {pub.doi ? (
                        <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">
                          {pub.title}
                        </a>
                      ) : pub.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {pub.authors?.join(', ')}
                    </p>
                    <p className="text-cyan-400 text-sm font-mono">
                      {pub.journal} &middot; {pub.year}
                    </p>
                    {pub.abstract && (
                      <p className="text-gray-500 text-sm mt-3 leading-relaxed line-clamp-3">{pub.abstract}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {pub.type && (
                      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full font-mono">{pub.type}</span>
                    )}
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-cyan-400 text-xs transition-colors"
                      >
                        DOI: {pub.doi}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
