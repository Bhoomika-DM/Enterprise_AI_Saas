import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const industries = [
  {
    name: 'Banking',
    description: 'Risk assessment, fraud detection, and customer insights',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    )
  },
  {
    name: 'Insurance',
    description: 'Claims processing, underwriting automation, and risk modeling',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    name: 'Retail',
    description: 'Demand forecasting, inventory optimization, and personalization',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
  {
    name: 'Telecom',
    description: 'Network optimization, churn prediction, and customer analytics',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    )
  },
]

export default function IndustryFocus() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -150])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])

  return (
    <section ref={sectionRef} id="industries" className="relative py-24 overflow-hidden scroll-mt-16">
      {/* Multi-layer parallax background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 via-accent-secondary/3 to-transparent pointer-events-none"
      />
      
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]) }}
        className="absolute inset-0 bg-gradient-to-br from-transparent via-accent-primary/[0.02] to-transparent pointer-events-none"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
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
            Industry Focus
          </motion.h2>
          <motion.p 
            className="text-lg text-text-body font-normal leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Specialized solutions tailored for your industry's unique challenges
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.6, 
                delay: 0.15 + index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="group relative bg-card-bg border border-border-subtle rounded-lg p-6 text-center transition-all duration-400 overflow-hidden float-soft border-pulse"
            >
              {/* Hover gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent-primary/0 to-accent-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                initial={false}
                whileHover={{
                  background: 'linear-gradient(135deg, rgba(201,103,49,0.05) 0%, rgba(34,211,238,0.05) 100%)',
                }}
              />
              
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
              >
                <motion.div 
                  className="mb-4 inline-flex items-center justify-center text-accent-primary"
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -8, 8, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {industry.icon}
                </motion.div>
                
                <h3 className="text-xl font-semibold text-text-primary mb-2 transition-colors duration-300 group-hover:text-accent-primary">
                  {industry.name}
                </h3>
                
                <motion.p 
                  className="text-sm text-text-body font-normal leading-relaxed transition-all duration-300"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1, y: -2 }}
                >
                  {industry.description}
                </motion.p>
              </motion.div>
              
              {/* Border glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-lg border border-accent-primary/0 group-hover:border-accent-primary/30 transition-all duration-400"
              />
              
              {/* Subtle shadow on hover */}
              <motion.div
                className="absolute inset-0 rounded-lg shadow-glow-primary opacity-0 group-hover:opacity-50 transition-all duration-400 -z-10"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
