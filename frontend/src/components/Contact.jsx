import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Contact() {
  const [glowPulse, setGlowPulse] = useState(false)
  
  useEffect(() => {
    // Single pulse on mount
    const timer = setTimeout(() => setGlowPulse(true), 1500)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <section id="contact" className="py-24 bg-app-bg relative overflow-hidden scroll-mt-16">
      {/* Calm animated background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(201,103,49,0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(201,103,49,0.03) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-semibold leading-tight text-text-primary mb-6"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Get in Touch
          </motion.h2>
          
          <motion.p 
            className="text-base md:text-lg text-text-body font-normal leading-relaxed mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Ready to transform your business with enterprise AI? 
            Our team is here to help you get started.
          </motion.p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            {[
              { 
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ), 
                label: 'EMAIL', 
                value: 'contact@intellectus.com', 
                href: 'mailto:contact@intelectus.com' 
              },
              { 
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ), 
                label: 'PHONE', 
                value: '9535745457', 
                href: 'tel:+1234567890' 
              },
              { 
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ), 
                label: 'LOCATION', 
                value: 'Banglore', 
                href: null 
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="text-center group"
              >
                <motion.div 
                  className="mb-2 inline-flex items-center justify-center text-accent-primary"
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {item.icon}
                </motion.div>
                <p className="text-text-body text-sm font-medium tracking-wide mb-1 transition-colors duration-300 group-hover:text-text-primary">
                  {item.label}
                </p>
                {item.href ? (
                  <a 
                    href={item.href} 
                    className="text-accent-primary hover:text-accent-primary/80 transition-all duration-300 relative group/link"
                  >
                    {item.value}
                    <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-accent-primary transition-all duration-300 group-hover/link:w-full group-hover/link:left-0" />
                  </a>
                ) : (
                  <p className="text-text-primary transition-colors duration-300 group-hover:text-accent-primary">
                    {item.value}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: '0 0 50px rgba(201, 103, 49, 0.6)'
            }}
            whileTap={{ scale: 0.97 }}
            animate={glowPulse ? {
              boxShadow: [
                '0 0 20px rgba(201, 103, 49, 0.3)',
                '0 0 50px rgba(201, 103, 49, 0.5)',
                '0 0 20px rgba(201, 103, 49, 0.3)'
              ],
              transition: { duration: 2, ease: "easeInOut" }
            } : {}}
            onAnimationComplete={() => setGlowPulse(false)}
            className="group relative px-8 py-4 bg-accent-primary text-white text-lg font-semibold tracking-wide rounded-lg shadow-glow-primary transition-all duration-400 overflow-hidden ring-1 ring-white/10"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            />
            <span className="relative z-10">Schedule a Demo</span>
          </motion.button>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-16 pt-8 border-t border-border-subtle text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="text-text-muted text-sm font-normal">
          © 2024 Intellectus AI Labs. All rights reserved.
        </p>
      </motion.div>
    </section>
  )
}
