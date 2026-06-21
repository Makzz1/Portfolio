import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const EXPERIENCES = [
  {
    index: '01',
    org: 'ISRO-IPRC',
    role: 'Research Intern — Propulsion Division',
    desc: 'Architected a real-time propulsion network log analysis pipeline processing 10GB+ daily telemetry data. Built diagnostic dashboards for anomaly detection across distributed sensor networks in launch vehicle systems.',
    stats: [
      { label: 'Daily Data Throughput', value: '10GB+' },
      { label: 'Sensor Nodes', value: '2,400+' },
    ],
    tech: ['Python', 'Pandas', 'Network Analysis', 'Log Parsing', 'Data Viz'],
  },
  {
    index: '02',
    org: 'WoowLocal',
    role: 'Full-Stack Engineer — Platform Lead',
    desc: 'Designed and developed large-scale community sports infrastructure connecting players to local turfs. Built RESTful APIs, booking systems, and real-time availability tracking serving thousands of daily users.',
    stats: [
      { label: 'Active Users', value: '5K+' },
      { label: 'Venues Managed', value: '120+' },
    ],
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'Flutter', 'Docker'],
  },
]

export default function ExperienceSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header reveal */
      gsap.from('.experience__title', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.experience__header',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('.experience__label', {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.experience__header',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      /* Cards slide up */
      gsap.utils.toArray('.experience__card').forEach((card, i) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          delay: i * 0.1,
        })

        /* Stat value count-up effect */
        const statValues = card.querySelectorAll('.experience__card-stat-value')
        statValues.forEach((el) => {
          gsap.from(el, {
            textContent: 0,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          })
        })

        /* Tech tags stagger */
        const techItems = card.querySelectorAll('.experience__card-tech-item')
        gsap.from(techItems, {
          y: 15,
          opacity: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="experience" ref={sectionRef} id="experience">
      <div className="experience__header">
        <span className="experience__label">// 02 — The Logs</span>
        <h2 className="experience__title">
          System<br />Manifest
        </h2>
      </div>

      {EXPERIENCES.map((exp) => (
        <article className="experience__card" key={exp.index}>
          <div>
            <div className="experience__card-index">LOG_{exp.index}</div>
            <h3 className="experience__card-org">{exp.org}</h3>
            <div className="experience__card-role">{exp.role}</div>
            <p className="experience__card-desc">{exp.desc}</p>
            <div className="experience__card-tech">
              {exp.tech.map((t) => (
                <span className="experience__card-tech-item" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="experience__card-meta">
            {exp.stats.map((stat) => (
              <div className="experience__card-stat" key={stat.label}>
                <span className="experience__card-stat-label">
                  {stat.label}
                </span>
                <span className="experience__card-stat-value">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}
