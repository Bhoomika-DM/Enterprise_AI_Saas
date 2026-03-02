import { motion } from 'framer-motion'

const features = [
  {
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Precision Analytics',
    description: 'Advanced algorithms that deliver accurate insights from your data with zero hallucinations.'
  },
  {
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Real-Time Processing',
    description: 'Process and analyze data streams in real-time with enterprise-grade performance.'
  },
  {
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Enterprise Security',
    description: 'Bank-level security with end-to-end encryption and compliance certifications.'
  },
]

export default function DataMeetsAI() {
  return (
    <section id="features" className="py-24 bg-section-bg relative overflow-hidden scroll-mt-16">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-secondary/[0.03] to-transparent pointer-events-none" />
      
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
            Your Data Meets Our AI
          </motion.h2>
          <motion.p 
            className="text-lg text-text-body font-normal leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Harness the power of artificial intelligence to unlock insights hidden in your data
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.7, 
                delay: 0.2 + index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="group text-center relative float-soft"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.08, 
                  rotate: [0, -3, 3, 0],
                  y: -4
                }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="mb-4 inline-flex items-center justify-center text-accent-primary filter drop-shadow-lg"
              >
                {feature.icon}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
              >
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-3 transition-colors duration-300 group-hover:text-accent-primary">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg text-text-body font-normal leading-relaxed transition-all duration-300 group-hover:text-text-primary">
                  {feature.description}
                </p>
              </motion.div>
              
              {/* Subtle glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                initial={false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
