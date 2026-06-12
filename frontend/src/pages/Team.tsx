import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getTeam } from '../api'

export default function Team() {
  const { data: team, isLoading } = useQuery({ queryKey: ['team'], queryFn: getTeam })

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-4">Our Team</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            A multidisciplinary team of neuroscientists, mathematicians, and data engineers.
          </p>
        </motion.div>

        {isLoading && (
          <div className="text-center text-gray-400">Loading team...</div>
        )}

        {team && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member: any, i: number) => (
              <motion.div
                key={member.id}
                className="glass rounded-2xl p-8 card-hover text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {member.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-cyan-400 text-sm font-mono mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{member.bio}</p>
                {member.expertise && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((e: string) => (
                      <span key={e} className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded font-mono">{e}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Join Us */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 glass rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Lab</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            We are always looking for motivated PhD students, postdocs, and research engineers passionate about sleep neuroscience and data engineering.
          </p>
          <a
            href="/contact"
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </div>
  )
}
