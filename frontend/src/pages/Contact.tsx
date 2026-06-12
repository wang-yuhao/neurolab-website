import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { submitContact } from '../api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => setSent(true),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-4">Contact Us</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Interested in collaboration, PhD positions, or our research? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            {[
              { label: 'Email', value: 'neurolab@university.edu', icon: '\u2709\ufe0f' },
              { label: 'Location', value: 'Institute of Computational Neuroscience', icon: '\ud83c\udfe2' },
              { label: 'GitHub', value: 'github.com/wang-yuhao', icon: '\ud83d\udcbb' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-start gap-4 mb-6">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-gray-500 text-sm">{label}</p>
                  <p className="text-white font-medium">{value}</p>
                </div>
              </div>
            ))}

            <div className="glass rounded-xl p-6 mt-8">
              <h3 className="font-bold mb-2">Open Positions</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-400">\u2022</span> PhD Student — Sleep EEG & TDA</li>
                <li className="flex items-center gap-2"><span className="text-green-400">\u2022</span> Research Engineer — Databricks/MLflow</li>
                <li className="flex items-center gap-2"><span className="text-yellow-400">\u2022</span> Postdoc — Computational Neuroscience</li>
              </ul>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {sent ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">\u2705</div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-400">We'll get back to you within 2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[{ id: 'name', label: 'Name', type: 'text' }, { id: 'email', label: 'Email', type: 'email' }, { id: 'subject', label: 'Subject', type: 'text' }].map(({ id, label, type }) => (
                  <div key={id}>
                    <label className="block text-sm text-gray-400 mb-1">{label}</label>
                    <input
                      type={type}
                      required
                      value={form[id as keyof typeof form]}
                      onChange={e => setForm({ ...form, [id]: e.target.value })}
                      className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {mutation.isPending ? 'Sending...' : 'Send Message'}
                </button>
                {mutation.isError && (
                  <p className="text-red-400 text-sm text-center">Failed to send. Please try again.</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
