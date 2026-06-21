import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const LETTERS = 'EXPERIENCE'.split('')
const PORTAL_INDEX = 4 // The "R" in EXPERIENCE (index 4 = 'R' — E-X-P-E-R)

export default function PortalSection() {
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const textRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray('.portal__letter')
      const portalLetter = letters[PORTAL_INDEX]

      /* Master timeline scrubbed to scroll */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          pin: false,
        },
      })

      /* Phase 1: Scale up the entire word slightly */
      tl.to(textRef.current, {
        scale: 1.15,
        duration: 0.2,
        ease: 'none',
      })

      /* Phase 2: Fade out non-portal letters, scale portal letter massively */
      tl.to(
        letters.filter((_, i) => i !== PORTAL_INDEX),
        {
          opacity: 0,
          scale: 0.5,
          duration: 0.3,
          ease: 'none',
        },
        0.15
      )

      tl.to(
        portalLetter,
        {
          scale: 80,
          duration: 0.6,
          ease: 'none',
        },
        0.2
      )

      /* Phase 3: Background morph to black */
      tl.to(
        bgRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'none',
        },
        0.35
      )

      /* Phase 4: Fade out the portal letter itself */
      tl.to(
        portalLetter,
        {
          opacity: 0,
          duration: 0.15,
          ease: 'none',
        },
        0.6
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="portal" ref={sectionRef} id="portal">
      <div className="portal__sticky" ref={stickyRef}>
        {/* Background morph layer */}
        <div className="portal__bg-morph" ref={bgRef} />

        <div className="portal__text" ref={textRef}>
          {LETTERS.map((letter, i) => (
            <span
              className={`portal__letter${
                i === PORTAL_INDEX ? ' portal__letter--portal' : ''
              }`}
              key={i}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
