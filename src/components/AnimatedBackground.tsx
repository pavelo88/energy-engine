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
      const scene = new THREE.Scene()
      
      // Cámara ajustada para ver el objeto desde un ángulo técnico
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
      
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true 
      })
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      const engineGroup = new THREE.Group()
      scene.add(engineGroup)

      // --- 1. ESTILO "BLUEPRINT" (Solo Líneas) ---
      // Color azul oscuro técnico, muy sutil
      const lineColor = new THREE.Color(0x1a4b6e) 
      const highlightColor = new THREE.Color(0x00AEEF)

      const lineMaterial = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: 0.2, // MUY BAJA OPACIDAD (Clave para no distraer)
      })

      const highlightMaterial = new THREE.LineBasicMaterial({
        color: highlightColor,
        transparent: true,
        opacity: 0.15, 
      })

      // --- 2. CONSTRUCCIÓN DEL MOTOR (Esquemático) ---
      
      // Cilindro Principal (Carcasa) - Usamos EdgesGeometry para ver solo los bordes
      const mainCylGeo = new THREE.CylinderGeometry(4, 4, 12, 16, 1, true)
      const mainCylEdges = new THREE.EdgesGeometry(mainCylGeo)
      const mainCyl = new THREE.LineSegments(mainCylEdges, lineMaterial)
      // Rotamos para que esté horizontal
      mainCyl.rotation.z = Math.PI / 2
      engineGroup.add(mainCyl)

      // Cilindro Interior (Rotor)
      const rotorGeo = new THREE.CylinderGeometry(2, 2, 12, 12, 1, true)
      const rotorEdges = new THREE.EdgesGeometry(rotorGeo)
      const rotor = new THREE.LineSegments(rotorEdges, lineMaterial)
      rotor.rotation.z = Math.PI / 2
      engineGroup.add(rotor)

      // Cono Frontal
      const coneGeo = new THREE.ConeGeometry(2, 3, 16, 1, true)
      const coneEdges = new THREE.EdgesGeometry(coneGeo)
      const cone = new THREE.LineSegments(coneEdges, highlightMaterial)
      cone.rotation.z = -Math.PI / 2
      cone.position.x = -7.5
      engineGroup.add(cone)

      // Anillos de Sección (Detalles técnicos)
      const ringGeo = new THREE.TorusGeometry(4.2, 0.05, 2, 32)
      // Creamos 3 anillos distribuidos
      for(let i = -1; i <= 1; i++) {
        const ring = new THREE.Mesh(ringGeo, highlightMaterial)
        ring.rotation.y = Math.PI / 2
        ring.position.x = i * 4 // Separación
        engineGroup.add(ring)
      }

      // --- 3. PARTICULAS DE FONDO (Polvo estático) ---
      // Muy pocas, muy lentas, solo para dar profundidad 3D
      const particlesGeo = new THREE.BufferGeometry()
      const pCount = 100
      const pPos = new Float32Array(pCount * 3)
      for(let i=0; i<pCount*3; i++) {
        pPos[i] = (Math.random() - 0.5) * 40
      }
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
      const particlesMat = new THREE.PointsMaterial({
        color: lineColor, size: 0.1, transparent: true, opacity: 0.2
      })
      const particles = new THREE.Points(particlesGeo, particlesMat)
      scene.add(particles)


      // --- 4. POSICIONAMIENTO ESTRATÉGICO ---
      const updateLayout = () => {
        const width = window.innerWidth
        if (width > 768) {
          // PC: Movemos el motor a la DERECHA para dejar texto libre a la izquierda
          engineGroup.position.set(6, 0, 0)
          camera.position.z = 15
        } else {
          // Móvil: Lo ponemos abajo o muy atrás
          engineGroup.position.set(0, 2, 0)
          camera.position.z = 25
        }
      }
      updateLayout()

      // --- ANIMACIÓN ---
      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        
        // Rotación CONSTANTE y LENTA (Estabilidad)
        // Solo rota sobre su eje X (el eje longitudinal del motor)
        mainCyl.rotation.y += 0.001
        rotor.rotation.y += 0.002 // El interior gira un poco más rápido
        cone.rotation.y += 0.002

        // Sutil movimiento flotante (breathing)
        engineGroup.position.y += Math.sin(Date.now() * 0.001) * 0.002

        renderer.render(scene, camera)
      }
      animate()

      // RESIZE
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        updateLayout()
      }
      window.addEventListener("resize", handleResize)

      cleanup = () => {
        cancelAnimationFrame(animationId)
        window.removeEventListener("resize", handleResize)
        renderer.dispose()
        mainCylGeo.dispose(); rotorGeo.dispose(); coneGeo.dispose();
      }
    }

    initAnimation()
    return () => cleanup()
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 z-0 w-full h-full pointer-events-none"
      // Fondo muy oscuro para que resalte la elegancia
      style={{ opacity: 0.6 }} 
    />
  )
}