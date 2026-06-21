import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function HeroSection() {
  const sectionRef = useRef(null)
  const wordmarkRef = useRef(null)
  const subtitleRef = useRef(null)
  const [utcTime, setUtcTime] = useState('')

  /* UTC Clock */
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setUtcTime(
        now.toUTCString().replace('GMT', 'UTC').slice(0, -4)
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  /* GSAP Animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Wordmark letter stagger entrance */
      gsap.from('.hero-wordmark span', {
        y: 120,
        opacity: 0,
        rotateX: -90,
        stagger: 0.08,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.2,
      })

      /* Subtitle fade in */
      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.8,
      })

      /* Nav links */
      gsap.from('.hero-nav__link', {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5,
      })

      /* Parallax on scroll */
      gsap.to(wordmarkRef.current, {
        yPercent: -30,
        scale: 0.9,
        opacity: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(subtitleRef.current, {
        yPercent: -50,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '60% top',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const letters = 'MAKZ'.split('')

  return (
    <section className="hero" ref={sectionRef} id="hero">
      {/* Navigation */}
      <nav className="hero-nav">
        <div className="hero-nav__logo">MAKZ_SYS</div>
        <ul className="hero-nav__links">
          {['Index', 'About', 'Experience', 'Contact'].map((item) => (
            <li key={item}>
              <a
                className="hero-nav__link"
                href={`#${item.toLowerCase()}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Wordmark */}
      <h1 className="hero-wordmark" ref={wordmarkRef}>
        {letters.map((letter, i) => (
          <span key={i}>{letter}</span>
        ))}
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle" ref={subtitleRef}>
        System Architect &mdash; Backend Engineer
      </p>

      {/* UTC Clock */}
      <div className="hero-time">
        <span className="hero-time__dot" />
        {utcTime}
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator">
        <span className="hero-scroll-indicator__text">Scroll</span>
        <span className="hero-scroll-indicator__line" />
      </div>
    </section>
  )
}
