import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const LINKS = [
  { label: 'GitHub', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Email', href: 'mailto:makz@example.com' },
  { label: 'Resume', href: '#' },
]

export default function ContactSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact__heading', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('.contact__link', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact__links',
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('.contact__label', {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="contact" ref={sectionRef} id="contact">
      <span className="contact__label">// 03 — Connect</span>

      <h2 className="contact__heading">
        Let&apos;s build something precise.
      </h2>

      <div className="contact__links">
        {LINKS.map((link) => (
          <a
            className="contact__link"
            href={link.href}
            key={link.label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{link.label}</span>
          </a>
        ))}
      </div>

      <div className="contact__footer">
        <span className="contact__footer-text">
          &copy; {new Date().getFullYear()} MAKZ — All Systems Reserved
        </span>
        <span className="contact__footer-status">
          <span className="contact__footer-status-dot" />
          System Operational
        </span>
      </div>
    </section>
  )
}
