import { useEffect, useRef } from 'react'

export default function DotFieldBackground({
  density = 50,
  dotSize = 2,
  linkDistance = 150,
  speed = 0.3,
  mode = 'drift', // 'drift' or 'orbit'
  interaction = 'repel', // 'off', 'repel', 'attract'
  tracking = 'global', // 'off', 'global', 'local'
  dotColor = '#38bdf8',
  linkColor = '#0ea5e9',
  dotAlpha = 0.6,
  linkAlpha = 0.3,
  cursorEase = 40,
  cursorRadius = 150
}) {
  const canvasRef = useRef(null)
  const dotsRef = useRef([])
  const mouseRef = useRef({ x: null, y: null })
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = canvas.width = canvas.offsetWidth
    let height = canvas.height = canvas.offsetHeight

    // Initialize dots
    const initDots = () => {
      dotsRef.current = []
      const area = width * height
      const count = Math.floor(area / (10000 / density))

      for (let i = 0; i < count; i++) {
        dotsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          originalX: 0,
          originalY: 0,
          angle: Math.random() * Math.PI * 2
        })
      }

      // Store original positions for orbit mode
      dotsRef.current.forEach(dot => {
        dot.originalX = dot.x
        dot.originalY = dot.y
      })
    }

    // Handle resize
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      initDots()
    }

    // Handle mouse move
    const handleMouseMove = (e) => {
      if (tracking === 'off') return
      
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouseRef.current.x = null
      mouseRef.current.y = null
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      const dots = dotsRef.current
      const mouse = mouseRef.current

      // Update and draw dots
      dots.forEach((dot, i) => {
        // Apply cursor interaction
        if (interaction !== 'off' && mouse.x !== null && mouse.y !== null) {
          const dx = dot.x - mouse.x
          const dy = dot.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < cursorRadius) {
            const force = (cursorRadius - distance) / cursorRadius
            const angle = Math.atan2(dy, dx)
            
            if (interaction === 'repel') {
              dot.x += Math.cos(angle) * force * cursorEase * 0.1
              dot.y += Math.sin(angle) * force * cursorEase * 0.1
            } else if (interaction === 'attract') {
              dot.x -= Math.cos(angle) * force * cursorEase * 0.1
              dot.y -= Math.sin(angle) * force * cursorEase * 0.1
            }
          }
        }

        // Update position based on mode
        if (mode === 'drift') {
          dot.x += dot.vx
          dot.y += dot.vy

          // Bounce off edges
          if (dot.x < 0 || dot.x > width) dot.vx *= -1
          if (dot.y < 0 || dot.y > height) dot.vy *= -1

          // Keep within bounds
          dot.x = Math.max(0, Math.min(width, dot.x))
          dot.y = Math.max(0, Math.min(height, dot.y))
        } else if (mode === 'orbit') {
          dot.angle += speed * 0.01
          dot.x = dot.originalX + Math.cos(dot.angle) * 30
          dot.y = dot.originalY + Math.sin(dot.angle) * 30
        }

        // Draw dot
        ctx.fillStyle = `${dotColor}${Math.round(dotAlpha * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2)
        ctx.fill()

        // Draw links to nearby dots
        for (let j = i + 1; j < dots.length; j++) {
          const other = dots[j]
          const dx = dot.x - other.x
          const dy = dot.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < linkDistance) {
            const alpha = (1 - distance / linkDistance) * linkAlpha
            ctx.strokeStyle = `${linkColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(dot.x, dot.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize
    initDots()
    animate()

    // Event listeners
    window.addEventListener('resize', handleResize)
    if (tracking === 'global') {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)
    } else if (tracking === 'local') {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [density, dotSize, linkDistance, speed, mode, interaction, tracking, dotColor, linkColor, dotAlpha, linkAlpha, cursorEase, cursorRadius])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        pointerEvents: tracking === 'global' ? 'none' : 'auto'
      }}
    />
  )
}
