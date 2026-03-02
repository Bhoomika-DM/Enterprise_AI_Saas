import { motion } from 'framer-motion'

export default function SCurveRoadmap({ roadmapStages, roadmapInView }) {
  return (
    <div className="relative max-w-6xl mx-auto px-8 py-12">
      
      {/* HORIZONTAL STEPPER WITH CONNECTING LINE */}
      <div className="relative">
        
        {/* Background Connecting Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-700/30" style={{ zIndex: 0 }} />
        
        {/* Animated Progress Line */}
        <motion.div
          className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"
          style={{ zIndex: 1 }}
          initial={{ width: '0%' }}
          animate={roadmapInView ? {
            width: '100%',
            transition: {
              duration: 2,
              delay: 0.3,
              ease: [0.22, 0.61, 0.36, 1]
            }
          } : { width: '0%' }}
        />

        {/* Steps Container */}
        <div className="relative grid grid-cols-3 gap-8" style={{ zIndex: 2 }}>
          
          {/* STEP 1 - IMMEDIATE */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={roadmapInView ? {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 0.4,
                ease: [0.22, 0.61, 0.36, 1]
              }
            } : { opacity: 0, y: 20 }}
          >
            {/* Circle Node */}
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center relative cursor-pointer group"
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 6px 30px rgba(6, 182, 212, 0.6)',
                transition: { duration: 0.2 }
              }}
              animate={{
                boxShadow: [
                  '0 4px 20px rgba(6, 182, 212, 0.4)',
                  '0 4px 25px rgba(6, 182, 212, 0.6)',
                  '0 4px 20px rgba(6, 182, 212, 0.4)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Icon - Chip/Sensor */}
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </motion.div>
            
            {/* Label */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold text-white mb-1">
                {roadmapStages[0].title}
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                {roadmapStages[0].timeline}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {roadmapStages[0].description}
              </p>
            </div>
          </motion.div>

          {/* STEP 2 - 90 DAYS */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={roadmapInView ? {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 1.2,
                ease: [0.22, 0.61, 0.36, 1]
              }
            } : { opacity: 0, y: 20 }}
          >
            {/* Circle Node */}
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center relative cursor-pointer group"
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 6px 30px rgba(6, 182, 212, 0.6)',
                transition: { duration: 0.2 }
              }}
              animate={{
                boxShadow: [
                  '0 4px 20px rgba(6, 182, 212, 0.4)',
                  '0 4px 25px rgba(6, 182, 212, 0.6)',
                  '0 4px 20px rgba(6, 182, 212, 0.4)'
                ]
              }}
              transition={{
                duration: 2,
                delay: 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Icon - Light Bulb/Intelligence */}
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </motion.div>
            
            {/* Label */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold text-white mb-1">
                {roadmapStages[1].title}
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                {roadmapStages[1].timeline}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {roadmapStages[1].description}
              </p>
            </div>
          </motion.div>

          {/* STEP 3 - ONGOING */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={roadmapInView ? {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 2.0,
                ease: [0.22, 0.61, 0.36, 1]
              }
            } : { opacity: 0, y: 20 }}
          >
            {/* Circle Node */}
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center relative cursor-pointer group"
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 6px 30px rgba(6, 182, 212, 0.6)',
                transition: { duration: 0.2 }
              }}
              animate={{
                boxShadow: [
                  '0 4px 20px rgba(6, 182, 212, 0.4)',
                  '0 4px 25px rgba(6, 182, 212, 0.6)',
                  '0 4px 20px rgba(6, 182, 212, 0.4)'
                ]
              }}
              transition={{
                duration: 2,
                delay: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Icon - Refresh/Optimization */}
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.div>
            
            {/* Label */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold text-white mb-1">
                {roadmapStages[2].title}
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                {roadmapStages[2].timeline}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {roadmapStages[2].description}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
