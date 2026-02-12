"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isMobile = window.innerWidth < 768
    let cleanup = () => {}

    const initDesktop = () => {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true 
      })
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      const mainGroup = new THREE.Group()
      scene.add(mainGroup)

      const coreGeo = new THREE.IcosahedronGeometry(10, 1)
      const coreMat = new THREE.MeshBasicMaterial({ 
        color: 0x00f2ff, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.3 
      })
      const coreSphere = new THREE.Mesh(coreGeo, coreMat)
      mainGroup.add(coreSphere)

      const particlesGeo = new THREE.BufferGeometry()
      const particleCount = 700
      const posArray = new Float32Array(particleCount * 3)
      
      for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 35 
      }
      
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      
      const particlesMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.8,
      })
      
      const particlesMesh = new THREE.Points(particlesGeo, particlesMat)
      mainGroup.add(particlesMesh)

      camera.position.z = 22

      let mouseX = 0
      let mouseY = 0
      
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001
      }
      document.addEventListener("mousemove", handleMouseMove)

      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        
        coreSphere.rotation.y += 0.002
        coreSphere.rotation.x += 0.001

        particlesMesh.rotation.y -= 0.0015
        
        mainGroup.rotation.y += 0.05 * (mouseX - mainGroup.rotation.y)
        mainGroup.rotation.x += 0.05 * (mouseY - mainGroup.rotation.x)

        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      cleanup = () => {
        cancelAnimationFrame(animationId)
        window.removeEventListener("resize", handleResize)
        document.removeEventListener("mousemove", handleMouseMove)
        coreGeo.dispose()
        particlesGeo.dispose()
        renderer.dispose()
      }
    }

    const initMobile = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let width = window.innerWidth
      let height = window.innerHeight
      canvas.width = width
      canvas.height = height

      const globeRadius = width * 0.35 
      const rotationSpeed = 0.003
      let angleTicker = 0

      const particles: any[] = []
      const particleCount = 100

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * 2 * Math.PI
        const phi = Math.acos((Math.random() * 2) - 1)
        particles.push({
          baseX: globeRadius * Math.sin(phi) * Math.cos(theta),
          baseY: globeRadius * Math.sin(phi) * Math.sin(theta),
          baseZ: globeRadius * Math.cos(phi)
        })
      }

      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        ctx.clearRect(0, 0, width, height)
        
        const cx = width / 2
        const cy = height / 2
        angleTicker += rotationSpeed

        ctx.strokeStyle = "rgba(0, 242, 255, 0.15)"
        ctx.lineWidth = 0.5

        const projected = particles.map(p => {
          const cosY = Math.cos(angleTicker)
          const sinY = Math.sin(angleTicker)
          let x = p.baseX * cosY - p.baseZ * sinY
          let z = p.baseZ * cosY + p.baseX * sinY
          const perspective = 300 / (300 + z)
          return { x: cx + x * perspective, y: cy + p.baseY * perspective, scale: perspective }
        })

        for (let i = 0; i < particleCount; i++) {
          const p = projected[i]
          const alpha = Math.max(0.1, (p.scale - 0.5) * 1.5)
          ctx.fillStyle = `rgba(0, 242, 255, ${alpha})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.5 * p.scale, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      animate()

      cleanup = () => cancelAnimationFrame(animationId)
    }

    if (isMobile) {
      initMobile()
    } else {
      initDesktop()
    }

    return () => cleanup()
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      id="bg-canvas" 
      className="fixed top-0 left-0 -z-10 w-full h-full opacity-40 pointer-events-none" 
    />
  )
}