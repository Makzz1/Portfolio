import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const BOOT_LINES = [
  { prefix: '[SYS]', text: 'Initializing system architecture...' },
  { prefix: '[LOAD]', text: 'Loading design modules — Industrial Logic v2.4' },
  { prefix: '[AUTH]', text: 'Authenticating session — MAKZ_TERMINAL' },
  { prefix: '[SYNC]', text: 'Syncing UTC clock — connection established' },
  { prefix: '[KERN]', text: 'Mounting visual subsystem — renderer:GSAP' },
  { prefix: '[NET]', text: 'Resolving portfolio manifest...' },
  { prefix: '[DONE]', text: 'All systems operational. Welcome.' },
]

export default function BootLoader({ onComplete }) {
  const containerRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          /* Fade out the whole loader */
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete,
          })
        },
      })

      /* Animate each boot line in */
      tl.to('.boot-line', {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.25,
        ease: 'power2.out',
      })

      /* Pause briefly */
      tl.to({}, { duration: 0.4 })

      /* Show the MAKZ logo */
      tl.to(logoRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      })

      /* Pause to let the user see it */
      tl.to({}, { duration: 0.6 })
    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div className="boot-loader" ref={containerRef}>
      {BOOT_LINES.map((line, i) => (
        <div className="boot-line" key={i}>
          <span className="prefix">{line.prefix}</span>
          {line.text}
          {i === BOOT_LINES.length - 1 && <span className="boot-cursor" />}
        </div>
      ))}
      <div className="boot-logo" ref={logoRef}>
        MAKZ
      </div>
    </div>
  )
}
