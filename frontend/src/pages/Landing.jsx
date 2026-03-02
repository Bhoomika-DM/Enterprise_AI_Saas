import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from '../components/Header'
import Hero from '../components/Hero'
import DataMeetsAI from '../components/DataMeetsAI'
import CoreValues from '../components/CoreValues'
import IndustryFocus from '../components/IndustryFocus'
import Consulting from '../components/Consulting'
import MeetUs from '../components/MeetUs'
import Team from '../components/Team'
import Contact from '../components/Contact'
import DotFieldBackground from '../components/DotFieldBackground'

gsap.registerPlugin(ScrollTrigger)

export default function Landing() {
  useEffect(() => {
    // Configure global ScrollTrigger settings
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
    })
    
    // Smooth scroll behavior
    ScrollTrigger.normalizeScroll(true)
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.9, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }}
      className="min-h-screen bg-app-bg overflow-x-hidden relative"
    >
      {/* Animated gradient background with Minimal Dot Field */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 aurora-flow"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 103, 49, 0.08) 0%, rgba(2, 6, 23, 0) 40%, rgba(34, 211, 238, 0.06) 100%)',
            backgroundSize: '200% 200%',
          }}
        />
        
        {/* Animated Dot Field Background - Ultra Minimal */}
        <DotFieldBackground
          density={3}
          dotSize={1.5}
          linkDistance={40}
          speed={0.08}
          mode="drift"
          interaction="repel"
          tracking="global"
          dotColor="#38bdf8"
          linkColor="#0ea5e9"
          dotAlpha={0.2}
          linkAlpha={0.08}
          cursorEase={30}
          cursorRadius={150}
        />
        
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(201,103,49,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(34,211,238,0.12) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(201,103,49,0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(201,103,49,0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute inset-0 noise-overlay opacity-[0.015] pointer-events-none" />
      
      <div className="relative z-10">
        <Header />
        <Hero />
        <DataMeetsAI />
        <CoreValues />
        <IndustryFocus />
        <Consulting />
        <MeetUs />
        <Team />
        <Contact />
      </div>
    </motion.div>
  )
}
