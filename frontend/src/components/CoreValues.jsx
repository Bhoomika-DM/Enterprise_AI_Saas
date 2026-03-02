import { motion } from 'framer-motion'

const values = [
  {
    title: 'No Hallucinations',
    description: 'Our AI models are rigorously tested and validated to ensure factual accuracy. Every insight is grounded in your actual data.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Pre-Built Models',
    description: 'Deploy industry-specific AI models instantly. No training required. Start generating insights from day one.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: 'Enterprise Integration',
    description: 'Seamlessly integrate with your existing tech stack. Support for all major databases, APIs, and data warehouses.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  },
  {
    title: 'Dynamic Visual Insights',
    description: 'Transform complex data into beautiful, interactive visualizations that tell compelling stories.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    )
  },
]

export default function CoreValues() {
  return (
    <section className="py-24 bg-app-bg relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 10% 20%, rgba(201,103,49,0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 90% 80%, rgba(34,211,238,0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 10% 20%, rgba(201,103,49,0.05) 0%, transparent 50%)',
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
            Built for Enterprise Excellence
          </motion.h2>
          <motion.p 
            className="text-lg text-text-body font-normal leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            The features that set us apart in the enterprise AI landscape
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
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
                y: -10,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }}
              className="group relative bg-card-bg border border-border-subtle rounded-xl p-8 shadow-card transition-all duration-400 overflow-hidden float-soft border-pulse"
            >
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,103,49,0.1), rgba(34,211,238,0.1))',
                  border: '1px solid rgba(201,103,49,0.3)'
                }}
              />
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-primary/0 to-accent-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                initial={false}
                whileHover={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(201,103,49,0.08) 0%, transparent 70%)',
                }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="mb-4 inline-flex items-center justify-center text-accent-primary"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {value.icon}
                </motion.div>
                
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-3 transition-colors duration-300 group-hover:text-accent-primary">
                  {value.title}
                </h3>
                
                <motion.p 
                  className="text-base md:text-lg text-text-body font-normal leading-relaxed transition-all duration-300 group-hover:text-text-primary"
                  initial={{ opacity: 0.9 }}
                  whileHover={{ opacity: 1 }}
                >
                  {value.description}
                </motion.p>
              </div>
              
              {/* Subtle shadow enhancement on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl shadow-glow-primary opacity-0 group-hover:opacity-100 transition-opacity duration-400 -z-10"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
