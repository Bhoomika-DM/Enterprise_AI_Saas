import { motion } from 'framer-motion'

const cards = [
  {
    title: 'Our Mission',
    description: 'To democratize enterprise AI by making it accessible, reliable, and actionable for businesses of all sizes.',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: 'Our Vision',
    description: 'To translate human intent into decision ready, analytically sound outcomes without requiring deep technical expertise.',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  {
    title: 'Our Values',
    description: 'We prioritize rigor over convenience, build earned confidence, treat clarity as a responsibility, ensure decisions are actionable, and keep human judgment central to values.',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  },
]

export default function MeetUs() {
  return (
    <section id="about" className="py-24 bg-app-bg relative overflow-hidden scroll-mt-16">
      {/* Subtle animated background */}
      <motion.div
        className="absolute inset-0 opacity-15"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(201,103,49,0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 70%, rgba(34,211,238,0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(201,103,49,0.03) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-semibold leading-tight text-text-primary mb-4"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Meet Us
          </motion.h2>
          <motion.p 
            className="text-lg text-text-body font-normal leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Learn about the team and values behind our enterprise AI platform
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.7, 
                delay: 0.2 + index * 0.12,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }}
              className="group relative bg-card-bg border border-border-subtle rounded-xl p-8 shadow-card transition-all duration-400 overflow-hidden float-soft border-pulse"
            >
              {/* Hover gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent-primary/0 to-accent-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                initial={false}
                whileHover={{
                  background: 'radial-gradient(circle at 50% 0%, rgba(201,103,49,0.08) 0%, transparent 70%)',
                }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="mb-4 inline-flex items-center justify-center text-accent-primary"
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.6 }
                  }}
                >
                  {card.icon}
                </motion.div>
                
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-3 transition-colors duration-300 group-hover:text-accent-primary">
                  {card.title}
                </h3>
                
                <motion.p 
                  className="text-base md:text-lg text-text-body font-normal leading-relaxed transition-all duration-300 group-hover:text-text-primary"
                  initial={{ opacity: 0.9 }}
                  whileHover={{ opacity: 1 }}
                >
                  {card.description}
                </motion.p>
              </div>
              
              {/* Enhanced shadow on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl shadow-card-hover opacity-0 group-hover:opacity-100 transition-opacity duration-400 -z-10"
              />
              
              {/* Subtle border glow */}
              <motion.div
                className="absolute inset-0 rounded-xl border border-accent-primary/0 group-hover:border-accent-primary/20 transition-all duration-400"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
