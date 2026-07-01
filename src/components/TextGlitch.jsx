import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export function TextGlitch({ text, hoverText, href, className = "", delay = 0, onClick }) {
  const textRef = useRef(null)
  const spanRef = useRef(null)
  const [displayText, setDisplayText] = useState(text)
  const [displayHoverText, setDisplayHoverText] = useState(hoverText || text)
  const intervalRef = useRef(null)
  const hoverIntervalRef = useRef(null)

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  useEffect(() => {
    if (textRef.current) {
      gsap.set(textRef.current, {
        backgroundSize: "0%",
        scale: 0.95,
        opacity: 0.7,
      })

      const tl = gsap.timeline({ delay: delay })

      tl.to(textRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      }).to(
        textRef.current,
        {
          backgroundSize: "100%",
          duration: 2,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.3",
      )
    }
  }, [delay])

  const handleMouseEnter = () => {
    if (hoverText) {
      let iteration = 0

      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current)
      }

      hoverIntervalRef.current = setInterval(() => {
        setDisplayHoverText(
          hoverText
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return hoverText[index]
              }
              return letters[Math.floor(Math.random() * 26)]
            })
            .join(""),
        )

        if (iteration >= hoverText.length) {
          clearInterval(hoverIntervalRef.current)
        }

        iteration += 1 / 3
      }, 30)
    }

    if (spanRef.current) {
      spanRef.current.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
    }
  }

  const handleMouseLeave = () => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current)
    }
    setDisplayHoverText(hoverText || text)

    if (spanRef.current) {
      spanRef.current.style.clipPath = "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)"
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current)
      }
    }
  }, [])

  const spanContent = hoverText ? (
    href ? (
      <a href={href} target="_blank" rel="noreferrer" className="no-underline text-inherit" onClick={onClick}>
        {displayHoverText}
      </a>
    ) : (
      <span onClick={onClick}>{displayHoverText}</span>
    )
  ) : (
    <span onClick={onClick}>{text}</span>
  )

  return (
    <h1
      ref={textRef}
      className={`
        text-[10vw] font-normal leading-none tracking-tight m-0 
        text-white/20
        bg-gradient-to-r from-white to-neutral-300 bg-clip-text bg-no-repeat
        flex flex-col items-start justify-center relative
        transition-all duration-500 ease-out
        cursor-pointer
        overflow-hidden
        ${className}
      `}
      style={{
        backgroundSize: "0%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        width: "100%",
        maxWidth: "100vw",
        wordBreak: "break-word",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {displayText}
      <span
        ref={spanRef}
        className="
          absolute w-full h-full 
          text-black font-normal
          flex flex-col justify-center
          transition-all duration-400 ease-out
          pointer-events-none
          overflow-hidden
        "
        style={{
          clipPath: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
          transformOrigin: "center",
          backgroundColor: "#FFFFFF",
          maxWidth: "100%",
          whiteSpace: "nowrap",
        }}
      >
        {spanContent}
      </span>
    </h1>
  )
}
