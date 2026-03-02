import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Consulting() {
  const imageRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start']
  })
  
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 60])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

  return (
    <section className="py-24 bg-section-bg relative overflow-hidden">
      {/* Subtle animated background */}
      <motion.div
        className="absolute inset-0 opacity-15"
        animate={{
          background: [
            'radial-gradient(circle at 80% 20%, rgba(201,103,49,0.04) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, rgba(34,211,238,0.04) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(201,103,49,0.04) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image column with enhanced parallax */}
          <motion.div
            ref={imageRef}
            style={{ y: imageY, scale: imageScale }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative group float-soft"
          >
            <motion.div 
              className="aspect-square bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-2xl flex items-center justify-center relative overflow-hidden ring-1 ring-white/5 border-pulse"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              />
              
              <motion.div 
                className="text-8xl relative z-10 filter drop-shadow-lg"
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.6 }
                }}
              >
                <svg className="w-24 h-24 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </motion.div>
              
              {/* Subtle glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl shadow-glow-primary opacity-0 group-hover:opacity-30 transition-all duration-400"
              />
            </motion.div>
          </motion.div>
          
          {/* Text column with staggered fade-in */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold leading-tight text-text-primary mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Consulting & Services
            </motion.h2>
            
            <motion.p 
              className="text-base md:text-lg text-text-body font-normal leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Our team of AI experts works alongside you to design, implement, and optimize 
              solutions tailored to your specific business needs.
            </motion.p>
            
            <motion.p 
              className="text-base md:text-lg text-text-body font-normal leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              From initial strategy to full deployment, we ensure your AI initiatives 
              deliver measurable business value.
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: '0 0 40px rgba(201, 103, 49, 0.5)'
              }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold text-sm tracking-wide transition-all duration-400 overflow-hidden ring-1 ring-white/10"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              />
              <span className="relative z-10">Learn More</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
