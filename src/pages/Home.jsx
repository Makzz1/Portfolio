import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useProgress } from '@react-three/drei'
import ProjectsSection from '../components/ProjectsSection'
import { TextGlitch } from '../components/TextGlitch'
import { useNavigate } from 'react-router-dom'
gsap.registerPlugin(ScrollTrigger)
// Force GPU-composited layers for ALL GSAP animations site-wide
gsap.config({ force3D: true })

// Images to preload so they're in cache before animations run
const PRELOAD_IMAGES = [
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
]

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve  // don't block on network fail
    img.src = src
  })
}

export default function Home() {
  const navigate = useNavigate()
  const [timeStr, setTimeStr] = useState('')
  const topNavRef = useRef(null)
  const appRef = useRef(null)
  const { progress, total } = useProgress()
  // null = still loading | true = fully loaded
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadPct, setLoadPct] = useState(0)   // 0-100 visual progress
  const loadDoneRef = useRef(false)

  // ─── Master preloader ───────────────────────────────────────────────
  useEffect(() => {
    const MIN_MS = 1800   // always show the logo for at least 1.8 s
    const startTime = Date.now()

    const run = async () => {
      // 1. Preload images
      setLoadPct(10)
      await Promise.all(PRELOAD_IMAGES.map(preloadImage))
      setLoadPct(50)

      // 2. Wait for fonts
      try { await document.fonts.ready } catch (_) {}
      setLoadPct(75)

      // 3. Wait for 3-D canvas (useProgress) — resolved by the watcher below
      // (we just need fonts + images to be done here; 3-D is small)
      setLoadPct(90)

      // 4. Enforce minimum display time so the reveal feels intentional
      const elapsed = Date.now() - startTime
      if (elapsed < MIN_MS) {
        await new Promise(r => setTimeout(r, MIN_MS - elapsed))
      }
      setLoadPct(100)

      // Small pause so the user sees 100% before the reveal
      await new Promise(r => setTimeout(r, 200))

      if (loadDoneRef.current) return
      loadDoneRef.current = true
      setIsLoaded(true)
    }

    run()
  }, [])   // run once on mount

  // Also accept the 3-D fallback path (in case images preloaded faster)
  useEffect(() => {
    if ((progress === 100 || total === 0) && loadPct >= 90 && !loadDoneRef.current) {
      loadDoneRef.current = true
      setTimeout(() => setIsLoaded(true), 300)
    }
  }, [progress, total, loadPct])

  // ─── Reveal sequence on load complete ───────────────────────────────
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      // Beautiful staged reveal: very slow 4.8s fade (3x slower)
      gsap.to('#centerLogo', {
        filter: 'blur(0px)', opacity: 1,
        duration: 4.8, ease: 'power2.inOut',
        onComplete: () => {
          document.body.style.overflow = 'auto'
          ScrollTrigger.sort()
          ScrollTrigger.refresh()
        }
      })

      // Smoothly fade out the dots
      gsap.to('#loadingDots', {
        opacity: 0,
        duration: 4.8,
        ease: 'power2.inOut'
      })
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [isLoaded])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }
      const ts = now.toLocaleTimeString('en-US', options) + ' (IST)'
      setTimeStr(ts)
    }
    const id = setInterval(updateTime, 1000)
    updateTime()
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Header Visibility (Only after 1st screen)
      ScrollTrigger.create({
        trigger: '#aboutSection',
        start: 'top top',
        onEnter: () => topNavRef.current?.classList.add('visible'),
        onLeaveBack: () => topNavRef.current?.classList.remove('visible'),
      })

      // 2. Hero Section Fade/Scale
      gsap.to('#hero-scroll-wrapper', {
        y: window.innerHeight * 0.3,
        scale: 0.5,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#heroSection',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })

      // 3. Reveal elements in about
      const revealElements = gsap.utils.toArray('.reveal-element:not(#parallax-wrapper)')
      revealElements.forEach(el => {
        gsap.fromTo(el, 
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        )
      })

      // 3b. MISSION Text: Fade in and Fade out smoothly as we scroll past it
      const introParagraph = document.getElementById('intro-paragraph')
      if (introParagraph) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: introParagraph,
            start: 'top 80%', // Starts fading in when top hits 80% (near bottom)
            end: 'bottom 10%', // Ends fading out when bottom hits 10% (near top)
            scrub: 1.5,
          }
        })

        tl.fromTo(introParagraph, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        )
        .to(introParagraph, { opacity: 1, duration: 0.2 }) // Hold for a much shorter time
        .to(introParagraph, { opacity: 0, x: 150, duration: 1.8, ease: 'power2.inOut' }) // Start sliding right much earlier
      }

      // 4. MAKZ Text Slide Left & Fade Out
      const parallaxWrapper = document.getElementById('parallax-wrapper')
      const parallaxInner = document.getElementById('parallax-inner')
      if (parallaxWrapper && parallaxInner) {
        gsap.to(parallaxInner, {
          xPercent: -100,
          opacity: 0,
          ease: 'none',         // linear movement feels more direct with scroll
          force3D: true,
          scrollTrigger: {
            trigger: parallaxWrapper,
            start: 'center center',
            end: '+=100%',
            pin: true,
            scrub: true,        // instant sync with scroll to prevent lagging sensation
            anticipatePin: 1,
          }
        })
      }

      // 5. About Section Pin & Sequential Reveal
      const aboutContent = document.getElementById('about-content')
      const aboutPoint2 = document.getElementById('about-point-2')
      if (aboutContent && aboutPoint2) {
        // Initially hide the second point
        gsap.set(aboutPoint2, { opacity: 0, y: 30 })

        const aboutTl = gsap.timeline({
          scrollTrigger: {
            trigger: aboutContent,
            start: 'center center',
            end: '+=150vh', // Increase scroll time (approx 1.5 times screen height)
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          }
        })

        // Fade in point 2 much slower (3x duration)
        aboutTl.to(aboutPoint2, {
          opacity: 1,
          y: 0,
          duration: 3,
          ease: 'power2.inOut'
        })
        
        // Pause at the end to allow reading before the pin releases
        aboutTl.to({}, { duration: 1 })
        
        // Removed the artificial fade-out so the section scrolls up naturally, 
        // eliminating the empty space after the pin.
      }

      // 6. Portal Zoom (Black Text scaling to fill screen)
      const portalSection = document.getElementById('portalSection')
      const zoomText = document.getElementById('zoom-text')
      const topNav = document.getElementById('topNav')
      
      if (portalSection && zoomText) {
        const portalTl = gsap.timeline({
          scrollTrigger: {
            trigger: portalSection,
            start: 'top top',
            end: '+=4000',
            pin: true,
            scrub: true,          // true keeps it directly bound to scroll
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress > 0.8 && topNav) {
                topNav.classList.add('dark-mode')
              } else if (topNav) {
                topNav.classList.remove('dark-mode')
              }
            }
          }
        })

        // Fade in the black overlay instead of animating the backgroundColor property (GPU accelerated)
        portalTl.to('#portal-bg-overlay', {
          opacity: 1,
          duration: 1,
          ease: 'none',
        }, 0)

        portalTl.to(zoomText, {
          scale: 100, // Reduced from 300 to 100 to prevent catastrophic CPU text rasterization lag
          ease: 'power2.in', // power2.in is smoother for continuous scaling than power3
          duration: 1,
          force3D: true,
          transformOrigin: 'center center',
        }, 0)
      }

      // Experience section links fade in handled if needed, currently static layout

      // 6. Experience Links Hover and click handled separately below

      // 7. Contact Section Circular Reveal
      const contactWrapper = document.getElementById('contact-wrapper')
      const contactReveal = document.getElementById('contact-circle-reveal')
      const contactHeading = document.querySelector('.contact-heading')
      const contactItems = gsap.utils.toArray('.contact-item')

      if (contactWrapper && contactReveal) {
        // Start with a 0% circle at the exact center of the viewport to feel like we are traveling "into" it
        gsap.set(contactReveal, { clipPath: 'circle(0% at 50% 50%)' })
        // Set heading to fly in from the right
        gsap.set(contactHeading, { opacity: 0, x: '30vw', rotation: 2, transformOrigin: 'left bottom' })

        const contactTl = gsap.timeline({
          scrollTrigger: {
            trigger: contactWrapper,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              if (self.progress > 0.1 && topNav) {
                topNav.classList.remove('dark-mode')
              } else if (topNav) {
                topNav.classList.add('dark-mode')
              }
            }
          }
        })

        // Expand the white circle
        contactTl.to(contactReveal, {
          clipPath: 'circle(150% at 50% 50%)',
          duration: 2,
          ease: 'power2.inOut'
        })
        
        // Fly in the huge heading from the right
        contactTl.to(contactHeading, {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 1.5,
          ease: 'power3.out'
        }, 0.5)
        
        // Apply scroll parallax to the other items as you scroll down
        contactItems.forEach((item, i) => {
           gsap.fromTo(item, 
             { opacity: 0, y: 150 + (i * 40), scale: 0.95, rotation: i % 2 === 0 ? -3 : 3 }, 
             {
               opacity: 1,
               y: 0,
               scale: 1,
               rotation: 0,
               scrollTrigger: {
                 trigger: item,
                 pinnedContainer: contactWrapper,
                 start: 'top 100%', 
                 end: 'top 50%',   
                 scrub: 1.5,
               }
             }
           )
        });
      }

      // 8. Global Scroll Tracker (Vertical Line Sidebar)
      const scrollTracker = document.getElementById('scroll-tracker')
      const scrollThumb = document.getElementById('scroll-thumb')
      const sectionName = document.getElementById('scroll-section-name')

      if (scrollTracker) {
        // Reveal slider after hero section
        gsap.to(scrollTracker, {
          opacity: 1,
          scrollTrigger: {
            trigger: '#aboutSection',
            start: 'top center',
            toggleActions: 'play none none reverse'
          }
        })

        // Update thumb position based on scroll progress
        ScrollTrigger.create({
          start: 0,
          end: 'max', // Use absolute maximum scroll of the page
          refreshPriority: -100, // Calculate this LAST, after all pins have expanded the page
          onUpdate: (self) => {
            if (scrollThumb) {
              gsap.to(scrollThumb, { top: `${self.progress * 80}%`, duration: 0.1, ease: 'none', overwrite: 'auto' })
            }
          }
        })

        // Update Text based on section smoothly
        const sections = [
          { id: '#aboutSection', name: 'Intro' },
          { id: '#experience-wrapper', name: 'Experience' },
          { id: '#projects-wrapper', name: 'Projects' },
          { id: '#contact-wrapper', name: 'Contact' }
        ]

        const updateSectionName = (name) => {
          if (sectionName && sectionName.innerText !== name) {
            gsap.to(sectionName, { 
              opacity: 0, 
              y: 10,
              duration: 0.2, 
              onComplete: () => {
                sectionName.innerText = name
                gsap.to(sectionName, { opacity: 1, y: 0, duration: 0.2 })
              }
            })
          }
        }

        sections.forEach(sec => {
          ScrollTrigger.create({
            trigger: sec.id,
            start: 'top center',
            end: 'bottom center',
            refreshPriority: -10, // Ensure calculated after all pins add their height!
            onEnter: () => updateSectionName(sec.name),
            onEnterBack: () => updateSectionName(sec.name)
          })
        })
      }

    }, appRef)

    return () => ctx.revert()
  }, [])

  const handleNavClick = (e, targetId, startParam = 'top top') => {
    e.preventDefault()

    const targetElement = document.querySelector(targetId)
    if (!targetElement) return

    // GSAP modifies the DOM heavily when pinning elements (adding pin-spacers).
    // Creating a temporary ScrollTrigger on an element that is ALREADY pinned 
    // calculates the wrong start offset. We must find the existing ScrollTrigger.
    const allTriggers = ScrollTrigger.getAll()
    const existingSt = allTriggers.find(st => st.trigger === targetElement || `#${st.trigger?.id}` === targetId)

    let targetY = 0

    if (existingSt) {
      if (targetId === '#contact-wrapper') {
        // The contact section is pinned for 3000px.
        // The circular clipPath opens over this duration. To land perfectly on the "front"
        // (the massive heading) without scrolling past the pin, we scroll 80% through the pin duration.
        const pinDuration = existingSt.end - existingSt.start
        targetY = existingSt.start + (pinDuration * 0.8)
      } else {
        // For standard pins (About, Experience), the 'start' value is the exact moment the pin begins.
        targetY = existingSt.start
      }
    } else {
      // Fallback for unpinned sections
      const st = ScrollTrigger.create({
        trigger: targetElement,
        start: startParam
      })
      targetY = st.start
      st.kill()
    }

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    })
  }

  return (
    <div ref={appRef}>
      <nav ref={topNavRef} className="fixed-nav flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4" id="topNav">
        {/* Left Side */}
        <div className="flex-1 flex justify-start">
          <div className="font-bold uppercase tracking-widest text-body-md font-label-caps cursor-pointer" onClick={(e) => handleNavClick(e, '#heroSection')}>MAKZ™</div>
        </div>
        
        {/* Center Links */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          <a className="font-label-caps text-label-caps hover:opacity-50 transition-opacity cursor-pointer" onClick={(e) => handleNavClick(e, '#heroSection')}>Index</a>
          <a className="font-label-caps text-label-caps hover:opacity-50 transition-opacity cursor-pointer" onClick={(e) => handleNavClick(e, '#about-content', 'center center')}>About</a>
          <a className="font-label-caps text-label-caps hover:opacity-50 transition-opacity cursor-pointer" onClick={(e) => handleNavClick(e, '#portalSection')}>Experience</a>
          <a className="font-label-caps text-label-caps hover:opacity-50 transition-opacity cursor-pointer" onClick={(e) => handleNavClick(e, '#projectsSection')}>Projects</a>
          <a className="font-label-caps text-label-caps hover:opacity-50 transition-opacity cursor-pointer" onClick={(e) => handleNavClick(e, '#contact-wrapper')}>Contact</a>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-end font-label-caps text-label-caps live-time">
          {timeStr}
        </div>
      </nav>

      {/* Global Scroll Tracker (Vertical Line Slider) */}
      <div id="scroll-tracker" className="fixed top-0 right-4 md:right-12 h-screen w-8 z-50 pointer-events-none opacity-0 hidden md:flex flex-col items-center justify-center mix-blend-difference">
         <div className="relative h-[40vh] w-full flex flex-col justify-end items-center">
            {/* The Track Line */}
            <div className="w-[1px] h-full bg-white/30 absolute left-1/2 -translate-x-1/2 top-0"></div>
            
            {/* The Moving Thumb */}
            <div id="scroll-thumb" className="w-[2px] h-[20%] bg-white absolute left-1/2 -translate-x-1/2 top-0"></div>
            
            {/* Dynamic Section Name placed right below the vertical line */}
            <div id="scroll-section-name" className="text-white text-center font-headline-lg text-sm tracking-widest uppercase absolute left-1/2 -translate-x-1/2 -bottom-12 whitespace-nowrap">Intro</div>
         </div>
      </div>

      <div id="scroll-container">
        {/* Hero Section — stays misty/blurred until fully loaded */}
        <section className="relative h-screen flex flex-col items-center justify-center bg-white overflow-hidden" id="heroSection">
          <div className="z-10 text-center w-full relative flex flex-col items-center" id="hero-scroll-wrapper">
            {/* MAKZ logo — GSAP controls blur/opacity during reveal */}
            <div
              id="centerLogo"
              style={{
                filter: 'blur(16px)',
                opacity: 0.4,
                willChange: 'filter, opacity',
              }}
            >
              <h1 className="font-headline-xl text-primary tracking-tight text-[84px]">
                MAKZ<sup className="text-3xl -top-8 relative ml-1">™</sup>
              </h1>
            </div>

            {/* Subtle loading pulse dots — fades out smoothly */}
            <div id="loadingDots" className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2 justify-center items-center">
              {[0,1,2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-black/30"
                  style={{
                    animation: `loadPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="relative z-20 bg-white px-margin-mobile md:px-margin-desktop py-32 flex flex-col" id="aboutSection">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-40 overflow-hidden">
            <div className="md:col-start-2 max-w-2xl" id="intro-paragraph">
              <div className="mb-6 text-primary font-label-caps text-label-caps opacity-50">(01) MISSION</div>
              <p className="font-headline-lg text-primary leading-[1.1] font-normal text-[2.25rem]">
                Engineering visual and digital systems that merge technical precision with aesthetic storytelling. Specializing in high-performance backend architecture and data-driven research.
              </p>
            </div>
          </div>

          {/* Parallax Identity Section (Moved below MISSION text) */}
          <div className="w-full flex justify-center items-center py-32 bg-white overflow-hidden" id="parallax-wrapper">
            <div className="relative w-full" id="parallax-inner">
              <div className="absolute left-0 bottom-8 md:bottom-16 text-primary font-label-caps text-label-caps opacity-50 hidden md:block pl-margin-desktop">(02) IDENTITY</div>
              <h1 className="massive-text text-primary font-headline-xl w-full text-center tracking-tighter" id="parallax-wordmark">
                MAKZ<sup className="text-4xl md:text-7xl -top-[0.45em] relative ml-2">™</sup>
              </h1>
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full pt-32 pb-32" id="about-content">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-3">
                <div className="md:sticky top-32">
                  <span className="font-label-caps text-label-caps text-secondary opacity-50 block mb-4">PROFILE_01</span>
                  <h2 className="font-headline-xl text-primary text-5xl md:text-6xl tracking-tight">About</h2>
                </div>
              </div>
              <div className="md:col-span-8 md:col-start-5 flex flex-col gap-24">
                <div className="reveal-element" id="about-point-1">
                  <h3 className="font-label-caps text-label-caps mb-6 opacity-50">01 / INTRODUCTION</h3>
                  <p className="font-headline-lg text-3xl leading-snug text-primary mb-8 font-normal">
                    Final-year Software Engineering undergraduate at SSN Chennai, specializing in high-performance backend architecture. Versatile, adaptive, and focused on building resilient digital infrastructure.
                  </p>
                </div>
                <div className="reveal-element" id="about-point-2">
                  <h3 className="font-label-caps text-label-caps mb-6 opacity-50">02 / ARCHITECTURE</h3>
                  <p className="font-body-md text-xl leading-relaxed text-on-surface-variant max-w-2xl">
                    Focusing on Distributed Systems and microservices architecture. I believe in &quot;Industrial Logic&quot;—clean, efficient, and unvarnished code that prioritizes performance and structural honesty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section Wrapper (for scroll tracking) */}
        <div id="experience-wrapper">
          {/* Portal Section */}
          <div id="portalSection" className="h-screen w-full relative overflow-hidden bg-white flex items-center justify-center">
            {/* GPU-accelerated background overlay */}
            <div id="portal-bg-overlay" className="absolute inset-0 bg-black opacity-0 pointer-events-none z-10"></div>
            <h1 id="zoom-text" className="experience-text relative z-20">EXPERIENCE</h1>
          </div>

          {/* Experience Terminal */}
          <section className="black-environment relative z-30 min-h-screen py-32 overflow-hidden flex flex-col justify-between" id="experienceContent">
            
            <div className="max-w-7xl w-full mx-auto px-margin-mobile md:px-margin-desktop relative z-10 flex-grow flex flex-col justify-between">
              
              {/* Center: Aesthetic Difference Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] md:w-[45%] aspect-[16/9] opacity-40 mix-blend-difference pointer-events-none -z-10">
                <img 
                  src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" 
                  alt="Abstract Structure" 
                  className="w-full h-full object-cover grayscale contrast-150"
                />
              </div>

              {/* Top Left: Title */}
              <div className="w-full flex justify-start items-start">
                <div className="w-full md:w-1/2">
                  <h1 className="font-headline-xl text-3xl md:text-5xl tracking-tighter text-white">
                    EXPERIENCE
                  </h1>
                  <div className="h-[1px] w-full max-w-xs bg-white/20 mt-6 mb-6"></div>
                  <p className="font-code-md text-[10px] text-white/40 uppercase tracking-widest leading-relaxed max-w-xs">
                    SELECT A LOG ENTRY TO INITIATE FULL DIAGNOSTIC REVIEW OF THE SYSTEM ARCHITECTURE AND OPERATIONAL METRICS.
                  </p>
                </div>
              </div>

              {/* Bottom Right: Links */}
              <div className="w-full flex justify-end items-end mt-24 md:mt-0">
                <div className="w-full md:w-1/2 flex flex-col items-end gap-12 md:gap-16 text-right">
                  
                  <div className="group w-full flex flex-col items-end relative">
                    <div className="flex justify-end items-center w-full mb-4">
                      <h3 className="font-code-md text-xs text-white/40 uppercase tracking-[0.3em] group-hover:text-accent-green transition-colors">[ROLE_01]</h3>
                    </div>
                    <TextGlitch 
                      text="ISRO IPRC"
                      hoverText="ISRO IPRC"
                      onClick={() => navigate('/experience/isro')}
                      className="!text-2xl md:!text-4xl !font-headline-xl !tracking-tighter !w-auto"
                    />
                  </div>

                  <div className="group w-full flex flex-col items-end relative">
                    <div className="flex justify-end items-center w-full mb-4">
                      <h3 className="font-code-md text-xs text-white/40 uppercase tracking-[0.3em] group-hover:text-accent-green transition-colors">[ROLE_02]</h3>
                    </div>
                    <TextGlitch 
                      text="WOOWLOCAL"
                      hoverText="WOOWLOCAL"
                      onClick={() => navigate('/experience/woowlocal')}
                      className="!text-2xl md:!text-4xl !font-headline-xl !tracking-tighter !w-auto"
                      delay={0.2}
                    />
                  </div>

                  <div className="group w-full flex flex-col items-end relative">
                    <div className="flex justify-end items-center w-full mb-4">
                      <h3 className="font-code-md text-xs text-white/40 uppercase tracking-[0.3em] group-hover:text-accent-green transition-colors">[ROLE_03]</h3>
                    </div>
                    <TextGlitch 
                      text="NOKIA CONNECT"
                      hoverText="NOKIA CONNECT"
                      onClick={() => navigate('/experience/nokia')}
                      className="!text-2xl md:!text-4xl !font-headline-xl !tracking-tighter !w-auto"
                      delay={0.4}
                    />
                  </div>

                </div>
              </div>

            </div>
          </section>
        </div>

        {/* 3D Projects Tunnel Section */}
        <div className="w-full bg-black" id="projects-wrapper">
          <ProjectsSection />
        </div>

        {/* Contact Section Circular Reveal Transition */}
        <section id="contact-wrapper" className="w-full bg-black relative z-30 overflow-hidden">
          <div id="contact-circle-reveal" className="w-full bg-[#f4f4f4] text-black relative pt-[10vh] md:pt-[15vh] pb-[10vh] px-[5vw]">
            
            {/* Top Row */}
            <div className="flex flex-col md:flex-row justify-between items-start w-full relative z-10 mb-[15vh] md:mb-[25vh] gap-8 md:gap-0">
              
              {/* Left: Contact Heading */}
              <div className="contact-heading w-full md:w-5/12">
                <h2 className="font-headline-xl text-[25vw] md:text-[18vw] leading-[0.75] tracking-tighter font-black uppercase text-[#111]">
                  Contact
                </h2>
              </div>

              {/* Center Right: Paragraph */}
              <div className="contact-item w-full md:w-3/12 md:mt-[16vw]">
                <p className="font-headline-lg text-xl md:text-[1.35vw] leading-snug text-[#111] pr-4">
                  Looking for a <span className="italic">Software Engineering</span> role. Eager to join an innovative team and contribute to ambitious digital projects.
                </p>
              </div>

              {/* Far Right: Image */}
              <div className="contact-item hidden md:block w-3/12 aspect-[3/4] md:mt-[12vw] bg-neutral-300 overflow-hidden shadow-2xl relative transform-gpu">
                 <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')] bg-cover bg-center grayscale opacity-90 scale-105 hover:scale-100 transition-transform duration-700 transform-gpu"></div>
                 <div className="absolute top-4 left-4 text-white text-sm font-code-md">+</div>
                 <div className="absolute bottom-4 right-4 text-white text-sm font-code-md">+</div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row justify-between items-end w-full relative z-10 gap-16 md:gap-0">
              
              {/* Far Left: Links */}
              <div className="contact-item w-full md:w-3/12 flex flex-col gap-10">
                <div className="flex flex-col gap-1 font-headline-lg text-3xl md:text-[2.5vw] leading-none font-bold tracking-tight text-[#111]">
                  <a href="https://github.com/Makzz1" target="_blank" rel="noreferrer" className="hover:italic hover:opacity-50 transition-all origin-left">GitHub</a>
                  <a href="https://linkedin.com/in/maghizh1" target="_blank" rel="noreferrer" className="hover:italic hover:opacity-50 transition-all origin-left">LinkedIn</a>
                  <a href="https://makzz1.github.io/Portfolio/" target="_blank" rel="noreferrer" className="hover:italic hover:opacity-50 transition-all origin-left">Portfolio</a>
                </div>
                <div className="flex flex-col gap-2">
                  <a href="mailto:connectwithme@makzz.dev" className="font-code-md text-lg md:text-[1vw] text-[#111] hover:opacity-50 transition-opacity">
                    connectwithme@makzz.dev
                  </a>
                  <a href="tel:+919486307067" className="font-code-md text-lg md:text-[1vw] text-[#111] hover:opacity-50 transition-opacity">
                    +91 94863 07067
                  </a>
                </div>
              </div>

              {/* Center: Image */}
              <div className="contact-item hidden md:block w-4/12 aspect-video bg-neutral-300 overflow-hidden shadow-2xl relative md:-ml-[5vw]">
                 <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070')] bg-cover bg-center mix-blend-luminosity opacity-90 scale-105 hover:scale-100 transition-transform duration-700"></div>
                 <div className="absolute top-4 left-4 text-white text-sm font-code-md">+</div>
                 <div className="absolute bottom-4 right-4 text-white text-sm font-code-md">+</div>
              </div>

              {/* Far Right: Text */}
              <div className="contact-item w-full md:w-3/12 md:mb-[15vh]">
                <p className="font-headline-lg text-xl md:text-[1.25vw] leading-snug text-[#111]">
                  I'm available for <span className="italic">full-time opportunities</span> worldwide, on your ambitious projects and <span className="italic">backend engineering</span> collaborations.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-24 bg-black text-white border-t border-white/10 relative z-40">
          <div className="font-code-md text-xs mb-6 md:mb-0 opacity-40 uppercase tracking-widest">
            ARCH: X86-64 | PROTOCOL: HTTPS | © {new Date().getFullYear()} MAKZ™
          </div>
          <div className="flex gap-12">
            <a className="font-code-md text-sm hover:text-accent-green transition-colors" href="#">GITHUB</a>
            <a className="font-code-md text-sm hover:text-accent-green transition-colors" href="#">LINKEDIN</a>
            <a className="font-code-md text-sm hover:text-accent-green transition-colors" href="#">RESUME</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
