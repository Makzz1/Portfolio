import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    /* Only on non-touch devices */
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      /* Dot follows immediately */
      gsap.set(dot, { x: mouseX - 4, y: mouseY - 4 })
    }

    /* Ring follows with lag for fluid feel */
    const tick = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      gsap.set(ring, { x: ringX - 18, y: ringY - 18 })
      requestAnimationFrame(tick)
    }

    /* Hover effects on interactive elements */
    const onEnterInteractive = () => {
      gsap.to(dot, { scale: 0, duration: 0.3 })
      gsap.to(ring, {
        width: 64,
        height: 64,
        borderColor: 'rgba(255,255,255,0.6)',
        duration: 0.4,
        ease: 'power3.out',
      })
    }

    const onLeaveInteractive = () => {
      gsap.to(dot, { scale: 1, duration: 0.3 })
      gsap.to(ring, {
        width: 36,
        height: 36,
        borderColor: 'rgba(255,255,255,0.5)',
        duration: 0.4,
        ease: 'power3.out',
      })
    }

    window.addEventListener('mousemove', onMove)
    requestAnimationFrame(tick)

    /* Attach to all interactive elements */
    const interactives = document.querySelectorAll(
      'a, button, .about__stack-tag, .contact__link'
    )
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnterInteractive)
      el.addEventListener('mouseleave', onLeaveInteractive)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive)
        el.removeEventListener('mouseleave', onLeaveInteractive)
      })
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}
