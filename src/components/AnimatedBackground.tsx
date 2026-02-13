"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cleanup = () => {}

    const initAnimation = () => {
      // 1. ESCENA LIMPIA
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.z = 18 // Distancia perfecta para ver el detalle

      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, // FONDO TRANSPARENTE (CRUCIAL)
        antialias: true // Bordes suaves, sin dientes de sierra
      })
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      const reactorGroup = new THREE.Group()
      scene.add(reactorGroup)

      // 2. MATERIALES ELEGANTES (Mate y Fino)
      // Azul corporativo serio, no neón
      const techBlue = new THREE.Color(0x00AEEF) 
      const darkBlue = new THREE.Color(0x005577)

      // Material de líneas finas
      const lineMaterial = new THREE.LineBasicMaterial({
        color: techBlue,
        transparent: true,
        opacity: 0.2, // Sutil
      })

      // Material de núcleo sólido pero transparente (Cristal)
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: techBlue,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      })

      // 3. CONSTRUCCIÓN DEL REACTOR (ARQUITECTURA)

      // A. El Núcleo (La Fuente de Energía)
      // Un Icosaedro simple y elegante
      const coreGeo = new THREE.IcosahedronGeometry(2.5, 1)
      const core = new THREE.Mesh(coreGeo, coreMaterial)
      reactorGroup.add(core)

      // Líneas de refuerzo del núcleo (para que se vea técnico)
      const coreEdges = new THREE.EdgesGeometry(coreGeo)
      const coreLines = new THREE.LineSegments(coreEdges, lineMaterial)
      reactorGroup.add(coreLines)


      // B. Anillos de Contención (Estator)
      // Usamos Torus pero muy finos, como aros de precisión
      const ringGeo = new THREE.TorusGeometry(4.5, 0.02, 16, 100) // Tubo de 0.02 (Muy fino)
      const ring1 = new THREE.Mesh(ringGeo, lineMaterial)
      const ring2 = new THREE.Mesh(ringGeo, lineMaterial)
      const ring3 = new THREE.Mesh(ringGeo, lineMaterial)

      // Rotación inicial simétrica (Átomo clásico)
      ring1.rotation.x = Math.PI / 2
      ring2.rotation.x = Math.PI / 2
      ring2.rotation.y = Math.PI / 3
      ring3.rotation.x = Math.PI / 2
      ring3.rotation.y = -Math.PI / 3

      reactorGroup.add(ring1)
      reactorGroup.add(ring2)
      reactorGroup.add(ring3)


      // C. El Anillo Exterior (La Carcasa)
      // Un anillo plano que encierra todo
      const outerRingGeo = new THREE.RingGeometry(5.8, 6.0, 64)
      const outerRingMat = new THREE.MeshBasicMaterial({
        color: darkBlue,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1
      })
      const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat)
      reactorGroup.add(outerRing)

      // Marcadores de "Reloj" en el anillo exterior (Detalle técnico)
      const ticksGroup = new THREE.Group()
      const tickGeo = new THREE.BoxGeometry(0.1, 0.5, 0)
      for (let i = 0; i < 12; i++) {
        const tick = new THREE.Mesh(tickGeo, lineMaterial)
        const angle = (i / 12) * Math.PI * 2
        tick.position.x = Math.cos(angle) * 6.2
        tick.position.y = Math.sin(angle) * 6.2
        tick.rotation.z = angle - Math.PI / 2
        ticksGroup.add(tick)
      }
      reactorGroup.add(ticksGroup)


      // 4. INTERACCIÓN (Suave)
      let mouseX = 0
      let mouseY = 0
      const handleMouseMove = (e: MouseEvent) => {
        // Reducimos sensibilidad para que no "baile"
        mouseX = (e.clientX - window.innerWidth / 2) * 0.0002 
        mouseY = (e.clientY - window.innerHeight / 2) * 0.0002
      }
      document.addEventListener("mousemove", handleMouseMove)


      // 5. ANIMACIÓN (Lenta y Constante)
      const animate = () => {
        requestAnimationFrame(animate)

        // Rotación del núcleo (Energía latente)
        core.rotation.y += 0.002
        coreLines.rotation.y += 0.002
        core.rotation.z -= 0.001

        // Rotación de los anillos (Mecánica de precisión)
        ring1.rotation.x += 0.002
        ring2.rotation.x += 0.002
        ring3.rotation.x += 0.002

        // Rotación del anillo exterior (Lentísima)
        outerRing.rotation.z -= 0.001
        ticksGroup.rotation.z -= 0.001

        // Parallax suave
        reactorGroup.rotation.y += 0.05 * (mouseX - reactorGroup.rotation.y)
        reactorGroup.rotation.x += 0.05 * (mouseY - reactorGroup.rotation.x)

        renderer.render(scene, camera)
      }
      animate()

      // RESIZE
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      cleanup = () => {
        window.removeEventListener("resize", handleResize)
        document.removeEventListener("mousemove", handleMouseMove)
        renderer.dispose()
        coreGeo.dispose(); ringGeo.dispose(); outerRingGeo.dispose();
      }
    }

    initAnimation()
    return () => cleanup()
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 z-0 w-full h-full pointer-events-none"
      // SIN FONDO DE COLOR, solo opacidad sutil
      style={{ opacity: 0.8 }} 
    />
  )
}