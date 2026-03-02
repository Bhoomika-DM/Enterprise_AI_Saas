import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('')

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'industries', 'about', 'team', 'contact']
      const scrollPosition = window.scrollY + 100 // Offset for header height

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll to section
  const scrollToSection = (e, sectionId) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 72 // Height of fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const navItems = [
    { label: 'Features', id: 'features' },
    { label: 'Industries', id: 'industries' },
    { label: 'About', id: 'about' },
    { label: 'Team', id: 'team' },
    { label: 'Contact', id: 'contact' }
  ]
  
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        background: 'linear-gradient(90deg, #0B0B0F 0%, #111118 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: '72px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="max-w-full mx-auto px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <motion.div 
            className="flex items-center h-full cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <img 
              src="/assets/Intellectus-logo-2D.jpeg" 
              alt="Intellectus AI Labs" 
              style={{ height: '72px', width: 'auto' }}
              className="object-contain"
            />
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-3" role="navigation" aria-label="Main navigation">
            {navItems.map((item, i) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`px-[18px] py-2 text-[13px] font-medium rounded-[20px] transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-[#00D4FF]'
                    : 'text-white/75 hover:bg-white/5'
                }`}
                style={
                  activeSection === item.id
                    ? {
                        background: '#1C1C28',
                        border: '1px solid rgba(0, 200, 255, 0.4)'
                      }
                    : {
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }
                }
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <motion.button 
              onClick={() => navigate('/signin')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="px-[18px] py-2 text-[13px] font-medium rounded-[20px] transition-all duration-300 text-white/75 hover:bg-white/5"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              aria-label="Sign in to your account"
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={() => navigate('/signup')}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: '0 0 30px rgba(201, 103, 49, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="px-6 py-2 bg-accent-primary text-white rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 shadow-lg hover:shadow-glow-primary ring-1 ring-white/10"
              aria-label="Sign up for an account"
            >
              Sign Up
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
