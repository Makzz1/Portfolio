import React, { useRef, useMemo, useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

/* ───────────────────────────────────────────
 * NOISE HELPER
 * ─────────────────────────────────────────── */
function noise2D(x, z) {
  return (
    Math.sin(x * 0.8 + z * 0.6) * 0.5
    + Math.sin(x * 1.3 - z * 0.9) * 0.3
    + Math.sin(x * 0.3 + z * 1.7) * 0.4
    + Math.sin(x * 2.1 + z * 0.4) * 0.15
    + Math.sin(x * 0.5 - z * 2.3) * 0.1
  )
}

/* ───────────────────────────────────────────
 * PARTICLE TERRAIN
 * ─────────────────────────────────────────── */
function ParticleTerrain({ smoothProgress }) {
  const pointsRef = useRef()

  // Restoring the original dense grid (45,600 particles)
  // Since we removed the heavy JavaScript useFrame loop, 
  // 45k static particles will render flawlessly without any CPU lag!
  const gridWidth = 120
  const gridDepth = 380          
  const spacing = 0.55
  const FORWARD_ROWS = 15
  const count = gridWidth * gridDepth

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    for (let iz = 0; iz < gridDepth; iz++) {
      for (let ix = 0; ix < gridWidth; ix++) {
        const idx = iz * gridWidth + ix
        
        const x = (ix - gridWidth / 2) * spacing
        const z = (FORWARD_ROWS - iz) * spacing
        
        // Static massive mountains - calculate noise ONLY ONCE
        const n1 = noise2D(x * 0.08, z * 0.04) * 6.0
        const n2 = noise2D(x * 0.2,  z * 0.1)  * 2.0
        const n3 = noise2D(x * 0.015, z * 0.015) * 16.0
        
        pos[idx * 3]     = x
        pos[idx * 3 + 1] = n1 + n2 + n3 - 2.5
        pos[idx * 3 + 2] = z
        
        // Original dynamic sizing to make mountains look natural
        const centerDist = Math.abs(ix - gridWidth / 2) / (gridWidth / 2)
        siz[idx] = (0.8 + (1 - centerDist) * 0.6) * (0.6 + Math.random() * 0.4)
      }
    }
    return [pos, siz]
  }, [])

  const dotTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32; canvas.height = 32
    const ctx = canvas.getContext('2d')
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.5, 'rgba(255,255,255,0.6)') // Brighter center
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 32, 32)
    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        map={dotTexture}
        color="#8bbdf2"   // Brighter, more electric blue
        size={0.16}       // Slightly larger particles for better visibility
        sizeAttenuation
        transparent
        opacity={0.85}    // Higher opacity to combat the fog
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ───────────────────────────────────────────
 * SKY PARTICLES
 * ─────────────────────────────────────────── */
function SkyParticles() {
  const pointsRef = useRef()
  const count = 3000

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100
      pos[i * 3 + 1] = Math.random() * 20 - 2
      pos[i * 3 + 2] = -Math.random() * 150
    }
    return [pos]
  }, [])

  const dotTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 16; canvas.height = 16
    const ctx = canvas.getContext('2d')
    const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
    g.addColorStop(0, 'rgba(255,255,255,0.8)')
    g.addColorStop(0.5, 'rgba(255,255,255,0.2)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 16, 16)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    // Transform the whole group rather than looping 3000 vertices per frame. ZERO CPU load!
    pointsRef.current.position.y = Math.sin(time * 0.5) * 1.5
    pointsRef.current.position.x = Math.cos(time * 0.3) * 1.5
    pointsRef.current.rotation.z = Math.sin(time * 0.1) * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={dotTexture}
        color="#a8c6e2"
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ───────────────────────────────────────────
 * SCROLL SEGMENTATION
 *
 * scroll 0→1 is split as:
 *   [0, INTRO_FRAC]                      → intro travel: camera flies forward
 *   Then N chunks of equal size, each:
 *     chunk[i] first TRAVEL_FRAC         → travel to project i
 *     chunk[i] next  PAUSE_FRAC          → pause & reveal project i
 *
 * Returns:
 *   ct      – camera path t [0..1]
 *   reveals – [r0, r1, r2, r3] each 0..1 (typewriter progress)
 * ─────────────────────────────────────────── */
const NUM_PROJECTS = 4
const TRAVEL_FRAC = 0.30   // 30% of each chunk = travel
const PAUSE_FRAC = 0.70    // 70% of each chunk = reveal
const INTRO_FRAC = 0.04    // first 4% = intro fly-in
const OUTRO_FRAC = 0.15    // last 15% = reading buffer for the final project

const CT_STOPS = [0, 0.10, 0.37, 0.63, 0.90]   // ct positions for camera at each project stop

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function getMappedProgress(p) {
  const reveals = new Array(NUM_PROJECTS).fill(0)
  let ct = 0

  const projectFrac = (1 - INTRO_FRAC - OUTRO_FRAC) / NUM_PROJECTS

  if (p <= INTRO_FRAC) {
    // Intro: camera flies from ct=0 to ct=CT_STOPS[0]
    const t = p / INTRO_FRAC
    ct = CT_STOPS[0] * easeInOut(t)
    return { ct, reveals }
  }

  const afterIntro = p - INTRO_FRAC

  for (let i = 0; i < NUM_PROJECTS; i++) {
    const segStart = i * projectFrac
    const travelEnd = segStart + projectFrac * TRAVEL_FRAC
    const segEnd = segStart + projectFrac

    if (afterIntro < segStart) break

    const fromCt = i === 0 ? CT_STOPS[0] : CT_STOPS[i]
    const toCt = CT_STOPS[i + 1]

    if (afterIntro <= travelEnd) {
      // Travel phase
      const t = (afterIntro - segStart) / (projectFrac * TRAVEL_FRAC)
      ct = fromCt + (toCt - fromCt) * easeInOut(Math.min(t, 1))
    } else if (afterIntro <= segEnd) {
      // Pause/Reveal phase
      ct = toCt
      const revT = (afterIntro - travelEnd) / (projectFrac * PAUSE_FRAC)
      reveals[i] = Math.min(Math.max(revT, 0), 1)
    } else {
      // Past this segment
      ct = toCt
      reveals[i] = 1
    }
  }

  return { ct, reveals }
}

/* ───────────────────────────────────────────
 * CAMERA RIG
 * ─────────────────────────────────────────── */
function CameraRig({ scrollProgress, smoothProgress }) {
  const { camera } = useThree()

  useLayoutEffect(() => {
    camera.position.set(0, 2.5, 5)
    camera.userData.currentLook = new THREE.Vector3(0, 2, -5)
  }, [camera])

  const getPathPosition = useCallback((t) => {
    const totalDepth = 130
    const z = 5 - t * totalDepth    // z goes from 5 to -125
    const x = Math.sin(t * Math.PI * 4) * 8
    const y = 2.5 + Math.sin(t * Math.PI * 2.5) * 0.8 + Math.cos(t * Math.PI * 1.2) * 0.4
    return { x, y, z }
  }, [])

  useFrame(() => {
    smoothProgress.current += (scrollProgress.current - smoothProgress.current) * 0.045

    const p = smoothProgress.current
    const { ct } = getMappedProgress(p)
    const pos = getPathPosition(ct)

    camera.position.x += (pos.x - camera.position.x) * 0.1
    camera.position.y += (pos.y - camera.position.y) * 0.1
    camera.position.z += (pos.z - camera.position.z) * 0.1

    const nextCt = Math.min(ct + 0.03, 1)
    const look = getPathPosition(nextCt)

    if (!camera.userData.currentLook) {
      camera.userData.currentLook = new THREE.Vector3(look.x * 0.6, look.y * 0.85, look.z)
    }
    camera.userData.currentLook.x += (look.x * 0.6 - camera.userData.currentLook.x) * 0.1
    camera.userData.currentLook.y += (look.y * 0.85 - camera.userData.currentLook.y) * 0.1
    camera.userData.currentLook.z += (look.z - camera.userData.currentLook.z) * 0.1

    camera.lookAt(camera.userData.currentLook)
  })

  return null
}

/* ───────────────────────────────────────────
 * SCENE (pure 3D)
 * ─────────────────────────────────────────── */
function Scene({ scrollProgress, smoothProgress }) {
  return (
    <>
      <fog attach="fog" args={['#040608', 12, 110]} />
      <CameraRig scrollProgress={scrollProgress} smoothProgress={smoothProgress} />
      <ParticleTerrain smoothProgress={smoothProgress} />
      <SkyParticles />
    </>
  )
}

/* ───────────────────────────────────────────
 * PROJECTS DATA
 * ─────────────────────────────────────────── */
const projects = [
  {
    title: 'Naahuh',
    subtitle: 'Food Redistribution System',
    description: 'India\'s two biggest problems — food waste and starvation — are complements of each other. I knew projects existed, but I genuinely wanted to solve this by addressing the weaknesses others missed. Built with secure JWT auth, location-based matching, and smart notifications.',
    tags: ['Spring Boot', 'PostgreSQL', 'REST API'],
    side: 'left',
  },
  {
    title: 'Fake News\nDetector',
    subtitle: 'AI Verification Platform',
    description: 'Fake news is everywhere and I wanted to do something about it. Even if it doesn\'t make a dent in the research, I wanted to understand what people are working on — and how I, as an engineer, can contribute. Built explainable AI with attention-based highlighting and Gemini-assisted fact verification.',
    tags: ['PyTorch', 'FastAPI', 'Transformers'],
    side: 'right',
  },
  {
    title: 'Adaptive\nECMP',
    subtitle: 'Spine-Leaf Topology',
    description: 'While working on a network project using ECMP, I noticed the flaws. Instead of just thinking "what if they did it differently" — I started building. The engineering behind SDN was fascinating, and I proved that adaptive ECMP performs significantly better during congestion.',
    tags: ['Python', 'Mininet', 'SDN Concepts'],
    side: 'left',
  },
  {
    title: 'Central\nRepository',
    subtitle: 'Academic Data Platform',
    description: 'Every semester, students dig through scattered resources trying to find what they need. I built a centralized knowledge repository with intelligent search and summarization — because the information already exists, it just needs a better home.',
    tags: ['Web Platform', 'Search Engine', 'Role-Based Access'],
    side: 'right',
  },
]

/* ───────────────────────────────────────────
 * PROJECT CARD OVERLAY (pure DOM, no R3F Html)
 * One card per project, absolutely positioned over the canvas.
 * Driven by smoothProgress ref via rAF.
 * ─────────────────────────────────────────── */
function ProjectCardOverlay({ project, index, smoothProgress }) {
  const cardRef = useRef(null)
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const descRef = useRef(null)
  const tagsRef = useRef(null)
  const rafRef = useRef(null)
  const lastReveal = useRef(-1)

  useEffect(() => {
    function tick() {
      if (!cardRef.current) { rafRef.current = requestAnimationFrame(tick); return }

      const { reveals } = getMappedProgress(smoothProgress.current)
      const reveal = reveals[index]
      const nextReveal = index < NUM_PROJECTS - 1 ? reveals[index + 1] : 0

      // Card container opacity: show during this project's pause phase
      let cardOp = 0
      if (reveal > 0 && nextReveal < 0.05) {
        cardOp = Math.min(1, reveal / 0.12)
      } else if (reveal > 0 && nextReveal >= 0.05) {
        cardOp = Math.max(0, 1 - (nextReveal - 0.05) / 0.12)
      }

      cardRef.current.style.opacity = cardOp
      cardRef.current.style.pointerEvents = cardOp > 0.3 ? 'auto' : 'none'

      // Reset desc on backward scroll
      if (reveal < lastReveal.current - 0.05 && descRef.current) {
        descRef.current.textContent = ''
      }
      lastReveal.current = reveal

      if (reveal <= 0) { rafRef.current = requestAnimationFrame(tick); return }

      // Sequence: title (0-0.2) → subtitle (0.2-0.35) → typewriter (0.35-0.9) → tags (0.9-1.0)
      const tRev = Math.min(Math.max(reveal / 0.2, 0), 1)
      const sRev = Math.min(Math.max((reveal - 0.2) / 0.15, 0), 1)
      const dRev = Math.min(Math.max((reveal - 0.35) / 0.55, 0), 1)
      const tagsRev = Math.min(Math.max((reveal - 0.9) / 0.1, 0), 1)

      if (titleRef.current) {
        titleRef.current.style.opacity = tRev
        titleRef.current.style.transform = `translateY(${(1 - tRev) * 24}px)`
      }
      if (subRef.current) {
        subRef.current.style.opacity = sRev
        subRef.current.style.transform = `translateY(${(1 - sRev) * 14}px)`
      }
      if (descRef.current) {
        const dLen = project.description.length
        descRef.current.textContent = project.description.substring(0, Math.round(dRev * dLen))
      }
      if (tagsRef.current) {
        tagsRef.current.style.opacity = tagsRev
        tagsRef.current.style.transform = `translateY(${(1 - tagsRev) * 10}px)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [index, project, smoothProgress])

  const isLeft = project.side === 'left'

  return (
    <div
      ref={cardRef}
      className="project-card-overlay"
      style={{
        position: 'absolute',
        top: '50%',
        left: isLeft ? '6%' : 'auto',
        right: isLeft ? 'auto' : '6%',
        transform: 'translateY(-50%)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 15,
        textAlign: isLeft ? 'left' : 'left',
        maxWidth: '500px',
        width: '90%',
      }}
    >
      <h2
        ref={titleRef}
        className="project-title"
        style={{ whiteSpace: 'pre-line', opacity: 0, transform: 'translateY(24px)' }}
      >
        {project.title}
      </h2>
      <h3
        ref={subRef}
        className="project-subtitle"
        style={{ opacity: 0, transform: 'translateY(14px)' }}
      >
        {project.subtitle}
      </h3>
      <p
        ref={descRef}
        className="project-description"
      />
      <div
        ref={tagsRef}
        className="project-tags-row"
        style={{ opacity: 0, transform: 'translateY(10px)' }}
      >
        {project.tags.map((tag, tIdx) => (
          <span key={tIdx} className="project-tag">{tag}</span>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────
 * SECTION WRAPPER
 * ─────────────────────────────────────────── */
export default function ProjectsSection() {
  const sectionRef = useRef(null)
  const scrollProgress = useRef(0)
  const smoothProgress = useRef(0)
  const [activeIndex, setActiveIndex] = useState(-1)
  const overlayRef = useRef(null)
  const [isInView, setIsInView] = useState(false)

  // Performance Optimization: Pause the WebGL render loop when out of viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        rootMargin: '1200px 0px 1200px 0px', // Massive buffer zone to wake up the 3D canvas long before it enters view
        threshold: 0
      }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=22000',
        pin: true,
        scrub: 2,
        onUpdate: (self) => {
          scrollProgress.current = self.progress

          // Dynamic thresholds based on the new INTRO, TRAVEL, and OUTRO fractions
          const projectFrac = (1 - 0.04 - 0.15) / 4 // (1 - INTRO_FRAC - OUTRO_FRAC) / NUM_PROJECTS
          const thresholds = [
            0.04, 
            0.04 + projectFrac * 1, 
            0.04 + projectFrac * 2, 
            0.04 + projectFrac * 3
          ]
          let idx = -1
          for (let i = thresholds.length - 1; i >= 0; i--) {
            if (self.progress >= thresholds[i]) { idx = i; break }
          }
          setActiveIndex(idx)

          if (overlayRef.current) {
            const op = Math.max(0, 1 - self.progress / 0.035)
            overlayRef.current.style.opacity = op
          }
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projectsSection"
      className="relative w-full h-screen overflow-hidden"
      style={{ background: '#040608' }}
    >
      {/* Full-screen 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          frameloop={isInView ? "always" : "demand"}
          camera={{ position: [0, 2.5, 5], fov: 65, near: 0.1, far: 300 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: '#040608' }}
        >
          <React.Suspense fallback={null}>
            <Scene scrollProgress={scrollProgress} smoothProgress={smoothProgress} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Project Card Overlays — pure DOM driven by rAF */}
      {projects.map((proj, i) => (
        <ProjectCardOverlay
          key={i}
          project={proj}
          index={i}
          smoothProgress={smoothProgress}
        />
      ))}

      {/* Intro Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
        style={{ opacity: 1 }}
      >
        <div className="project-section-label">Featured Work</div>
        <h2 className="project-section-title">PROJECTS</h2>
        <div className="project-section-line" />
      </div>

      {/* Removed the local project-sidebar to prevent overlap with the global scroll tracker */}

      {/* Counter */}
      <div className="project-counter z-20">
        <span className="project-counter-current">
          {activeIndex >= 0 ? String(activeIndex + 1).padStart(2, '0') : '—'}
        </span>
        <span className="project-counter-divider">/</span>
        <span className="project-counter-total">
          {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      {/* Bottom-right label */}
      <div className="project-label-br z-20">PROJECT</div>

      {/* Ambient Glow */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="project-glow-orb project-glow-orb-1" />
        <div className="project-glow-orb project-glow-orb-2" />
      </div>

      {/* Outro gradient — fades the section into the contact section below */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
        style={{
          height: '180px',
          background: 'linear-gradient(to bottom, transparent 0%, #040608 60%, #000000 100%)',
        }}
      />
    </section>
  )
}
