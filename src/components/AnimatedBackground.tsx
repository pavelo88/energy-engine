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

      // --- 1. COLORES (Mantenemos tu cian tecnológico) ---
      const baseColorHex = 0x00c8ff
      const darkColor = new THREE.Color(baseColorHex)
      const lightColor = new THREE.Color(baseColorHex)

      // --- 2. EL NÚCLEO (Red Geodésica) ---
      // Usamos detail=2 para que tenga más triangulos (parece una red global)
      const coreGeo = new THREE.IcosahedronGeometry(10, 2) 
      const coreMat = new THREE.MeshBasicMaterial({ 
        color: darkColor,
        wireframe: true, // Importante: modo alambre para que se vea "tech"
        transparent: true,
        opacity: 0.15 // Muy sutil, como un holograma
      }) 
      const coreMesh = new THREE.Mesh(coreGeo, coreMat)
      mainGroup.add(coreMesh)

      // Capa externa del núcleo (Aristas brillantes)
      const edgesGeo = new THREE.EdgesGeometry(coreGeo)
      const edgesMat = new THREE.LineBasicMaterial({
        color: darkColor,
        transparent: true,
        opacity: 0.3
      })
      const edgesLines = new THREE.LineSegments(edgesGeo, edgesMat)
      // Lo escalamos un pelín para que brille por fuera
      edgesLines.scale.set(1.01, 1.01, 1.01) 
      mainGroup.add(edgesLines)


      // --- 3. ANILLOS ORBITALES (Giroscopio Tech) ---
      // Creamos 3 anillos con diferentes inclinaciones
      const ringGeo = new THREE.TorusGeometry(14, 0.1, 16, 100) // Radio 14, Tubo muy fino
      const ringMat = new THREE.MeshBasicMaterial({
        color: darkColor,
        transparent: true,
        opacity: 0.6
      })

      const ring1 = new THREE.Mesh(ringGeo, ringMat)
      const ring2 = new THREE.Mesh(ringGeo, ringMat)
      const ring3 = new THREE.Mesh(ringGeo, ringMat)

      // Rotaciones iniciales para que no estén planos
      ring1.rotation.x = Math.PI / 2
      ring2.rotation.x = Math.PI / 4
      ring2.rotation.y = Math.PI / 4
      
      mainGroup.add(ring1)
      mainGroup.add(ring2)
      mainGroup.add(ring3)


      // --- 4. LA ATMÓSFERA (Datos flotantes) ---
      const particleCount = 2000 // Bajamos un poco la cantidad para limpiar la vista
      const particlesGeo = new THREE.BufferGeometry()
      const posArray = new Float32Array(particleCount * 3)
      
      for(let i = 0; i < particleCount * 3; i++) {
        // Esparcimos más en horizontal (ancho) que en vertical para pantallas wide
        posArray[i] = (Math.random() - 0.5) * 140 
      }
      
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      
      const particlesMat = new THREE.PointsMaterial({
        size: 0.2, // Puntos más finos
        color: darkColor, 
        transparent: true,
        opacity: 0.5,
      })
      
      const particlesMesh = new THREE.Points(particlesGeo, particlesMat)
      mainGroup.add(particlesMesh)

      // --- 5. Lógica de Tema ---
      const updateTheme = () => {
        const isLight = document.body.classList.contains('light-mode');
        const newColor = isLight ? lightColor : darkColor;
        
        // Actualizamos todos los materiales
        coreMat.color.set(newColor);
        edgesMat.color.set(newColor);
        ringMat.color.set(newColor);
        particlesMat.color.set(newColor);
        
        canvas.style.opacity = isLight ? '0.8' : '0.6'; // Ajuste de opacidad global
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") updateTheme();
        });
      });
      observer.observe(document.body, { attributes: true });

      // --- 6. Lógica de Cámara ---
      const updateCameraPosition = () => {
        // Ajustamos la distancia: en móvil más lejos para ver todo el sistema
        camera.position.z = window.innerWidth < 768 ? 50 : 35;
      }
      
      updateCameraPosition();
      updateTheme();

      // INTERACCIÓN
      let mouseX = 0
      let mouseY = 0
      
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.0005 // Movimiento más suave
        mouseY = (event.clientY - window.innerHeight / 2) * 0.0005
      }
      document.addEventListener("mousemove", handleMouseMove)

      // ANIMACIÓN
      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        
        // Rotación del núcleo
        coreMesh.rotation.y += 0.002
        edgesLines.rotation.y += 0.002

        // Rotación independiente de los anillos (Efecto Giroscopio)
        ring1.rotation.x += 0.005
        ring1.rotation.y += 0.005
        
        ring2.rotation.x -= 0.003
        ring2.rotation.y += 0.003

        ring3.rotation.x += 0.004
        ring3.rotation.y -= 0.004

        // Partículas flotando lento
        particlesMesh.rotation.y = -performance.now() * 0.00005
        
        // Parallax con el mouse (movimiento de todo el grupo)
        mainGroup.rotation.y += 0.05 * (mouseX - mainGroup.rotation.y)
        mainGroup.rotation.x += 0.05 * (mouseY - mainGroup.rotation.x)

        renderer.render(scene, camera)
      }
      animate()

      // Resize
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
        observer.disconnect() 
        
        // Limpiar geometrías nuevas
        coreGeo.dispose()
        edgesGeo.dispose()
        ringGeo.dispose()
        particlesGeo.dispose()
        
        // Limpiar materiales
        coreMat.dispose()
        edgesMat.dispose()
        ringMat.dispose()
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
      // Opacidad reducida para que no moleste al leer texto
      className="fixed top-0 left-0 z-0 w-full h-full opacity-60 transition-opacity duration-300 pointer-events-none"
    />
  )
}