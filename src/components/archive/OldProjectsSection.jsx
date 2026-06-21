import React, { useRef, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Float, Html } from '@react-three/drei'

gsap.registerPlugin(ScrollTrigger)

function ProjectIconGroup({ position, icons, progressRef, startFadeIn, startFadeOut }) {
  const containerRef = useRef(null)

  useFrame(() => {
    if (!containerRef.current) return
    const p = progressRef.current
    
    let opacity = 0
    let y = 50

    if (p >= startFadeIn && p <= startFadeOut + 0.2) {
      if (p < startFadeIn + 0.2) {
        // Fading in (duration 0.2)
        const progress = (p - startFadeIn) / 0.2
        opacity = progress
        y = 50 * (1 - progress)
      } else if (p >= startFadeIn + 0.2 && p <= startFadeOut) {
        // Fully visible
        opacity = 1
        y = 0
      } else if (p > startFadeOut) {
        // Fading out (duration 0.2)
        const progress = (p - startFadeOut) / 0.2
        opacity = 1 - progress
        y = -50 * progress
      }
    }

    containerRef.current.style.opacity = opacity
    containerRef.current.style.transform = `translateY(${y}px)`
  })

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Html transform center>
          <div ref={containerRef} className="flex gap-8 pointer-events-none" style={{ opacity: 0 }}>
            {icons.map((icon, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center gap-2">
                <img 
                  src={icon.url} 
                  alt={icon.name} 
                  className="w-16 h-16 object-contain"
                  style={{ filter: `drop-shadow(0px 10px 15px rgba(0,0,0,0.5)) ${icon.invert ? 'invert(1) brightness(2)' : ''}` }}
                />
                <div className="text-white text-[10px] md:text-xs font-code-md tracking-wider uppercase whitespace-nowrap text-center opacity-80" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
                  {icon.name}
                </div>
              </div>
            ))}
          </div>
        </Html>
      </Float>
    </group>
  )
}

const proj1Icons = [
  { name: 'Spring Boot', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
  { name: 'PostgreSQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { name: 'REST API', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/json/json-original.svg', invert: true },
]
const proj2Icons = [
  { name: 'PyTorch', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg' },
  { name: 'FastAPI', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg' },
  { name: 'HuggingFace', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
]
const proj3Icons = [
  { name: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  { name: 'Mininet', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
  { name: 'SDN Concepts', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg', invert: true },
]

function Scene({ progressRef }) {
  const group1 = useRef()

  useFrame((state, delta) => {
    const p = progressRef.current
    
    // First 3D object (TorusKnot) is present throughout, rotating slowly in background
    if (group1.current) {
       group1.current.position.z = -5 + p * 5
       group1.current.rotation.x += delta * 0.2
       group1.current.rotation.y += delta * 0.3
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Central Persistent Object */}
      <group ref={group1} position={[0, 0, -5]}>
        <mesh>
          <torusKnotGeometry args={[2, 0.4, 128, 16]} />
          <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.3} />
        </mesh>
      </group>

      <ProjectIconGroup position={[-4, 0, -2]} icons={proj1Icons} progressRef={progressRef} startFadeIn={0.1} startFadeOut={0.35} />
      <ProjectIconGroup position={[4, 0, -2]} icons={proj2Icons} progressRef={progressRef} startFadeIn={0.45} startFadeOut={0.65} />
      <ProjectIconGroup position={[-4, 0, -2]} icons={proj3Icons} progressRef={progressRef} startFadeIn={0.75} startFadeOut={0.95} />
    </>
  )
}

export default function OldProjectsSection() {
  const sectionRef = useRef(null)
  const text0Ref = useRef(null)
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)
  const text3Ref = useRef(null)
  const progressRef = useRef(0)

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=3500', // Reduced from 5000px so it doesn't feel stuck
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress
          }
        }
      })

      gsap.set([text1Ref.current, text2Ref.current, text3Ref.current], { opacity: 0, z: -2000 })
      
      // Project 0 (Title) -> flies past camera immediately
      tl.to(text0Ref.current, { z: 1000, opacity: 0, duration: 0.2, ease: "power2.in" }, 0.0)

      // Project 1 -> text flies past
      tl.to(text1Ref.current, { z: 0, opacity: 1, duration: 0.2, ease: "power2.out" }, 0.1)
      tl.to(text1Ref.current, { z: 1000, opacity: 0, duration: 0.2, ease: "power2.in" }, 0.35)
      
      // Project 2 -> text flies past
      tl.to(text2Ref.current, { z: 0, opacity: 1, duration: 0.2, ease: "power2.out" }, 0.45)
      tl.to(text2Ref.current, { z: 1000, opacity: 0, duration: 0.2, ease: "power2.in" }, 0.65)

      // Project 3 -> text flies past
      tl.to(text3Ref.current, { z: 0, opacity: 1, duration: 0.2, ease: "power2.out" }, 0.75)
      tl.to(text3Ref.current, { z: 1000, opacity: 0, duration: 0.2, ease: "power2.in" }, 0.95)
      
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="projectsSection" className="relative w-full h-screen bg-black text-white overflow-hidden">
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <React.Suspense fallback={null}>
            <Scene progressRef={progressRef} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* HTML Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" style={{ perspective: '1000px' }}>
        
        {/* Project 0 - Title */}
        <div ref={text0Ref} className="absolute w-full h-full flex items-center justify-center pointer-events-none">
          <h1 className="text-6xl md:text-[10vw] leading-none font-headline-xl tracking-tighter text-white">
            PROJECTS
          </h1>
        </div>

        {/* Project 1 */}
        <div ref={text1Ref} className="absolute w-full max-w-6xl px-8 md:pr-32 flex flex-col items-end text-right md:ml-[20vw]">
          <h2 className="text-6xl md:text-[8vw] leading-none font-headline-xl tracking-tighter mb-4 text-white">NAAHUH</h2>
          <h3 className="text-xl md:text-2xl font-label-caps text-accent-green mb-8 uppercase tracking-widest">Food Redistribution System</h3>
          <p className="text-lg md:text-2xl font-body-md leading-relaxed opacity-80 mb-8 max-w-2xl">
            Bridging the gap between surplus and scarcity. Secure JWT authentication, location-based distribution using distance calculations, and smart food posting with automated notifications.
          </p>
          <div className="flex flex-wrap gap-3 justify-end">
            <span className="font-code-md text-xs border border-white/20 px-4 py-2 rounded-full uppercase bg-black/50 backdrop-blur-sm">Spring Boot</span>
            <span className="font-code-md text-xs border border-white/20 px-4 py-2 rounded-full uppercase bg-black/50 backdrop-blur-sm">PostgreSQL</span>
            <span className="font-code-md text-xs border border-white/20 px-4 py-2 rounded-full uppercase bg-black/50 backdrop-blur-sm">REST API</span>
          </div>
        </div>

        {/* Project 2 */}
        <div ref={text2Ref} className="absolute w-full max-w-6xl px-8 md:pl-32 flex flex-col items-start text-left md:mr-[20vw]">
          <h2 className="text-6xl md:text-[8vw] leading-none font-headline-xl tracking-tighter mb-4 text-white">FAKE NEWS<br/>DETECTOR</h2>
          <h3 className="text-xl md:text-2xl font-label-caps text-accent-green mb-8 uppercase tracking-widest">AI Verification Platform</h3>
          <p className="text-lg md:text-2xl font-body-md leading-relaxed opacity-80 mb-8 max-w-2xl">
            Explainable AI with attention-based token highlighting exposing specific words influencing decisions. Gemini-assisted fact verification layer for contextual validation and production-ready inference optimization.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="font-code-md text-xs border border-white/20 px-4 py-2 rounded-full uppercase bg-black/50 backdrop-blur-sm">PyTorch</span>
            <span className="font-code-md text-xs border border-white/20 px-4 py-2 rounded-full uppercase bg-black/50 backdrop-blur-sm">FastAPI</span>
            <span className="font-code-md text-xs border border-white/20 px-4 py-2 rounded-full uppercase bg-black/50 backdrop-blur-sm">Transformers</span>
          </div>
        </div>

        {/* Project 3 */}
        <div ref={text3Ref} className="absolute w-full max-w-6xl px-8 md:pr-32 flex flex-col items-end text-right md:ml-[20vw]">
          <h2 className="text-6xl md:text-[8vw] leading-none font-headline-xl tracking-tighter mb-4 text-white">ADAPTIVE<br/>ECMP</h2>
          <h3 className="text-xl md:text-2xl font-label-caps text-accent-green mb-8 uppercase tracking-widest">Spine-Leaf Topology</h3>
          <p className="text-lg md:text-2xl font-body-md leading-relaxed opacity-80 mb-8 max-w-2xl">
            Dynamic load balancing across equal-cost paths to overcome static hash-based limitations. Congestion detection and hotspot mitigation maximizing link utilization in simulated cloud-scale data centers.
          </p>
          <div className="flex flex-wrap gap-3 justify-end">
            <span className="font-code-md text-xs border border-white/20 px-4 py-2 rounded-full uppercase bg-black/50 backdrop-blur-sm">Python</span>
            <span className="font-code-md text-xs border border-white/20 px-4 py-2 rounded-full uppercase bg-black/50 backdrop-blur-sm">Mininet</span>
            <span className="font-code-md text-xs border border-white/20 px-4 py-2 rounded-full uppercase bg-black/50 backdrop-blur-sm">SDN Concepts</span>
          </div>
        </div>

      </div>
    </section>
  )
}
