import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const STACK_TAGS = [
  'Java 17+',
  'Python 3.12',
  'Distributed Systems',
  'Kubernetes',
  'Spring Boot',
  'PostgreSQL',
  'Docker',
  'gRPC',
]

const DETAILS = [
  { label: 'Education', value: 'SSN College of Engineering' },
  { label: 'Discipline', value: 'Software Engineering' },
  { label: 'Focus', value: 'Backend Architecture' },
  { label: 'Location', value: 'Chennai, India' },
]

const NARRATIVE_TEXT =
  'Engineering visual and digital systems that merge technical precision with aesthetic storytelling.'

export default function AboutSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Label fade-in */
      gsap.from('.about__label', {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about__label',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      /* Word-by-word narrative reveal */
      gsap.from('.about__narrative .word-inner', {
        yPercent: 100,
        duration: 0.7,
        stagger: 0.04,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.about__narrative',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      /* Stack tags */
      gsap.from('.about__stack-tag', {
        y: 20,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about__stack',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      /* Detail items */
      gsap.to('.about__detail-item', {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about__details',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /* Split narrative into words */
  const words = NARRATIVE_TEXT.split(' ')

  return (
    <section className="about" ref={sectionRef} id="about">
      <span className="about__label">// 01 — About</span>

      <p className="about__narrative">
        {words.map((word, i) => (
          <span className="word" key={i}>
            <span className="word-inner">{word}</span>
          </span>
        ))}
      </p>

      <div className="about__stack">
        {STACK_TAGS.map((tag) => (
          <span className="about__stack-tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="about__details">
        {DETAILS.map((d, i) => (
          <div className="about__detail-item" key={i}>
            <div className="about__detail-label">{d.label}</div>
            <div className="about__detail-value">{d.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
