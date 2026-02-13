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
      // Cámara un poco más lejos para ver la estructura completa
      const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
      
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true 
      })
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      const mainGroup = new THREE.Group()
      scene.add(mainGroup)

      // --- 1. COLORES INDUSTRIALES ---
      // Usamos un Azul "Ingeniería" (más serio que el cian neón)
      const baseColor = new THREE.Color(0x00AEEF) 
      const secondaryColor = new THREE.Color(0x005577)

      // --- 2. EL ACTIVO CRÍTICO (La Turbina / Estator) ---
      // CylinderGeometry(radioTop, radioBottom, height, segmentosRadiales, segmentosAltura, openEnded)
      const turbineGeo = new THREE.CylinderGeometry(6, 6, 16, 24, 6, true)
      const turbineMat = new THREE.MeshBasicMaterial({ 
        color: baseColor,
        wireframe: true, // Estilo plano técnico / Blueprint
        transparent: true,
        opacity: 0.15,
      })
      const turbineMesh = new THREE.Mesh(turbineGeo, turbineMat)
      // Lo rotamos 90 grados si quisieras que fuera horizontal, pero vertical impone más "estabilidad"
      mainGroup.add(turbineMesh)

      // --- 3. EL NÚCLEO (El Eje / Rotor) ---
      // Un cilindro más pequeño adentro para dar densidad mecánica
      const shaftGeo = new THREE.CylinderGeometry(2, 2, 16, 12, 2, false)
      const shaftMat = new THREE.MeshBasicMaterial({
        color: secondaryColor,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      })
      const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat)
      mainGroup.add(shaftMesh)

      // --- 4. ANILLOS DE ESCANEO (Simula Monitoreo/Mantenimiento) ---
      // Estos anillos subirán y bajarán "escaneando" la turbina
      const scannerGeo = new THREE.TorusGeometry(6.2, 0.05, 16, 100)
      const scannerMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.8
      })
      
      const scanner1 = new THREE.Mesh(scannerGeo, scannerMat)
      const scanner2 = new THREE.Mesh(scannerGeo, scannerMat)
      
      // Rotamos 90 grados en X para que queden planos horizontalmente
      scanner1.rotation.x = Math.PI / 2
      scanner2.rotation.x = Math.PI / 2
      
      mainGroup.add(scanner1)
      mainGroup.add(scanner2)

      // --- 5. FLUJO DE ENERGÍA (Partículas verticales) ---
      // Simula el gas, vapor o electricidad pasando por la máquina
      const particleCount = 600
      const particlesGeo = new THREE.BufferGeometry()
      const posArray = new Float32Array(particleCount * 3)
      // Array extra para guardar la velocidad aleatoria de cada partícula
      const speeds = new Float32Array(particleCount) 

      for(let i = 0; i < particleCount; i++) {
        // X y Z en un radio alrededor de la turbina
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 12 // Esparcidos alrededor
        
        posArray[i * 3] = Math.cos(angle) * radius // x
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 40 // y (altura extendida)
        posArray[i * 3 + 2] = Math.sin(angle) * radius // z
        
        speeds[i] = 0.02 + Math.random() * 0.05 // Velocidad vertical
      }
      
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      
      const particlesMat = new THREE.PointsMaterial({
        size: 0.1,
        color: baseColor, 
        transparent: true,
        opacity: 0.4,
      })
      
      const particlesMesh = new THREE.Points(particlesGeo, particlesMat)
      mainGroup.add(particlesMesh)


      // --- 6. Responsive y Cámara ---
      const updateCameraPosition = () => {
        // En móvil alejamos más la cámara para que quepa la turbina
        const isMobile = window.innerWidth < 768
        camera.position.z = isMobile ? 45 : 30
        camera.position.y = isMobile ? 0 : 0
      }
      
      updateCameraPosition();

      // INTERACCIÓN MOUSE (Para rotar la vista de la máquina)
      let mouseX = 0
      let mouseY = 0
      
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.0005
        mouseY = (event.clientY - window.innerHeight / 2) * 0.0005
      }
      document.addEventListener("mousemove", handleMouseMove)

      // ANIMACIÓN
      let time = 0
      let animationId: number
      
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        time += 0.01

        // 1. Rotación lenta y técnica de la turbina (Estabilidad)
        turbineMesh.rotation.y += 0.002
        shaftMesh.rotation.y -= 0.002 // Contrarrotación

        // 2. Animación de los Escáneres (Seno para subir y bajar)
        // El scanner 1 sube y baja
        scanner1.position.y = Math.sin(time * 0.5) * 7 
        // El scanner 2 va a destiempo
        scanner2.position.y = Math.sin(time * 0.5 + Math.PI) * 7 
        
        // Efecto visual: Cambiar opacidad según la altura para que se desvanezcan en los bordes
        // (Opcional, pero se ve cool)

        // 3. Flujo de partículas (Bucle infinito hacia arriba)
        const positions = particlesGeo.attributes.position.array as Float32Array
        for(let i = 0; i < particleCount; i++) {
            // Mover en Y
            positions[i * 3 + 1] += speeds[i]
            
            // Si sube demasiado (20), reiniciamos abajo (-20)
            if (positions[i * 3 + 1] > 20) {
                positions[i * 3 + 1] = -20
            }
        }
        particlesGeo.attributes.position.needsUpdate = true

        // 4. Movimiento suave con el mouse (Tilt)
        mainGroup.rotation.y += 0.05 * (mouseX - mainGroup.rotation.y)
        // Limitamos la rotación en X para que no se voltee la máquina
        mainGroup.rotation.x += 0.05 * (mouseY - mainGroup.rotation.x)
        mainGroup.rotation.z = -0.1 // Una leve inclinación estética

        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        updateCameraPosition();
      }
      window.addEventListener("resize", handleResize)

      cleanup = () => {
        cancelAnimationFrame(animationId)
        window.removeEventListener("resize", handleResize)
        document.removeEventListener("mousemove", handleMouseMove)
        
        turbineGeo.dispose()
        shaftGeo.dispose()
        scannerGeo.dispose()
        particlesGeo.dispose()
        turbineMat.dispose()
        shaftMat.dispose()
        scannerMat.dispose()
        particlesMat.dispose()
        renderer.dispose()
      }
    }

    initAnimation()

    return () => cleanup()
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      id="bg-canvas" 
      className="fixed top-0 left-0 z-0 w-full h-full opacity-50 pointer-events-none"
    />
  )
}