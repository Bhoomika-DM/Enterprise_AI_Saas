import { motion } from 'framer-motion'

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    icon: (
      <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO & Co-Founder',
    icon: (
      <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    name: 'Emily Watson',
    role: 'Head of AI Research',
    icon: (
      <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    name: 'David Kim',
    role: 'VP of Engineering',
    icon: (
      <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
]

export default function Team() {
  return (
    <section id="team" className="py-24 bg-section-bg relative overflow-hidden scroll-mt-16">
      {/* Subtle animated background */}
      <motion.div
        className="absolute inset-0 opacity-12"
        animate={{
          background: [
            'radial-gradient(circle at 70% 30%, rgba(201,103,49,0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 70%, rgba(34,211,238,0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 30%, rgba(201,103,49,0.03) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
            Our Team
          </motion.h2>
          <motion.p 
            className="text-lg text-text-body font-normal leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Meet the experts building the future of enterprise AI
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.7, 
                delay: 0.15 + index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{
                y: -10,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }}
              className="group text-center transition-all duration-400 float-soft"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-xl mb-4 bg-card-bg border border-border-subtle aspect-square flex items-center justify-center group-hover:border-accent-primary/30 transition-all duration-400 ring-1 ring-white/5 border-pulse"
              >
                {/* Hover gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-accent-primary/0 to-accent-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  initial={false}
                  whileHover={{
                    background: 'linear-gradient(135deg, rgba(201,103,49,0.08) 0%, rgba(34,211,238,0.08) 100%)',
                  }}
                />
                
                <motion.div 
                  className="relative z-10 filter drop-shadow-lg text-accent-primary"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -3, 3, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {member.icon}
                </motion.div>
                
                {/* Subtle inner glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-xl shadow-glow-primary opacity-0 group-hover:opacity-20 transition-all duration-400"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-text-primary mb-1 transition-colors duration-300 group-hover:text-accent-primary">
                  {member.name}
                </h3>
                <p className="text-sm text-text-muted font-medium tracking-wide transition-colors duration-300 group-hover:text-text-body">
                  {member.role}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
