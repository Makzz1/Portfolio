import React, { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

const experienceData = {
  isro: {
    title: 'ISRO IPRC',
    role: 'Research Intern / Jun 2024',
    description: 'Designed a Python-based log management tool using Pandas to parse and analyze 10GB+ of daily network logs, reducing diagnostic lookup time by 40% for propulsion control networks.',
    tags: ['Python_3.11', 'Pandas', 'Log_Analysis'],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070"
  },
  woowlocal: {
    title: 'WoowLocal',
    role: 'Flutter Developer / Past',
    description: 'Developed mobile features for the "Adugalam" turf booking application. Focused on industry-scale mobile architecture and operational performance optimization.',
    tags: ['Flutter', 'Dart', 'Mobile_Arch'],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070"
  },
  nokia: {
    title: 'NOKIA CONNECT',
    role: '2025',
    description: '• Presented a research paper on SDN-based Adaptive ECMP Traffic Balancing, proposing dynamic load distribution techniques for modern spine-leaf data center networks.\n\n• Engaged with Nokia infrastructure engineers and researchers, discussing real-world challenges in large-scale networking, SDN deployment, and 5G infrastructure systems.',
    tags: ['SDN', 'Networking', '5G_Infra'],
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070"
  }
}

export default function ExperienceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const imageRef = useRef(null)
  const contentRef = useRef(null)
  
  const data = experienceData[id?.toLowerCase()]

  useEffect(() => {
    // Scroll to top automatically
    window.scrollTo(0, 0)

    // Entrance Animation
    const ctx = gsap.context(() => {
      // Fade in the whole page
      gsap.fromTo(pageRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, ease: 'power2.out' }
      )
      
      // Zoom in the image slightly (cinematic feel)
      gsap.fromTo(imageRef.current,
        { scale: 1.1 },
        { scale: 1, duration: 2, ease: 'power3.out' }
      )
      
      // Stagger in the text content
      gsap.fromTo('.reveal-text', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const handleBack = () => {
    // Exit animation before navigating back
    gsap.to(pageRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/')
      }
    })
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-code-md">
        <h2>404 - Experience not found</h2>
        <button onClick={() => navigate('/')} className="mt-8 border border-white/20 px-6 py-2 hover:bg-white hover:text-black transition-colors">
          RETURN
        </button>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#f4f4f4] text-black overflow-hidden relative">
      
      {/* Top Nav (Minimal) */}
      <nav className="absolute top-0 left-0 w-full p-6 md:p-12 z-50 flex justify-between items-center mix-blend-difference text-white">
        <button 
          onClick={handleBack}
          className="font-label-caps uppercase tracking-widest text-sm hover:opacity-50 transition-opacity"
        >
          [ ← BACK ]
        </button>
        <div className="font-code-md text-xs opacity-50 tracking-widest">
          SYS.LOG // {id.toUpperCase()}
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row min-h-screen w-full">
        
        {/* Left Side: Image / Visuals */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden bg-black flex items-center justify-center">
          <div 
            ref={imageRef}
            className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-80"
            style={{ backgroundImage: `url(${data.image})` }}
          />
          {/* Brutalist overlay elements */}
          <div className="absolute top-4 left-4 text-white text-sm font-code-md opacity-50">+</div>
          <div className="absolute bottom-4 right-4 text-white text-sm font-code-md opacity-50">+</div>
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Right Side: Information */}
        <div ref={contentRef} className="w-full md:w-1/2 min-h-[50vh] md:h-screen flex flex-col justify-center px-8 md:px-24 py-16">
          <div className="max-w-xl">
            <h3 className="reveal-text font-code-md text-xs text-black/40 uppercase tracking-[0.3em] mb-6">
              [ROLE_DETAILS]
            </h3>
            
            <h1 className="reveal-text font-headline-xl text-[12vw] md:text-[6vw] leading-[0.8] tracking-tighter uppercase mb-8">
              {data.title}
            </h1>
            
            <h4 className="reveal-text font-label-caps text-sm text-black/60 mb-12 uppercase tracking-widest border-l-2 border-black/20 pl-4">
              {data.role}
            </h4>
            
            <p className="reveal-text font-headline-lg text-2xl md:text-3xl leading-snug text-[#111] mb-12 whitespace-pre-line">
              {data.description}
            </p>
            
            <div className="reveal-text flex flex-wrap gap-3">
              {data.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="font-code-md text-xs border border-black/20 px-4 py-2 rounded-full uppercase text-black/80 hover:bg-black hover:text-white transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
