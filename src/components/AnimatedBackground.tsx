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
      // CONFIGURACIÓN BÁSICA
      const scene = new THREE.Scene()
      // Fog para dar profundidad y que lo de atrás se vea más lejos
      scene.fog = new THREE.FogExp2(0x000000, 0.02)
      
      const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
      
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true 
      })
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      // GRUPO PRINCIPAL (El Motor Entero)
      const engineGroup = new THREE.Group()
      scene.add(engineGroup)

      // --- MATERIALES ---
      // Azul Tech para la estructura
      const wireMat = new THREE.MeshBasicMaterial({ 
        color: 0x00AEEF, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.15 
      })
      // Blanco brillante para partes activas (aspas)
      const bladeMat = new THREE.MeshBasicMaterial({
        color: 0x44DDFF,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      })
      // Material sólido oscuro para ocultar líneas traseras (opcional, da solidez)
      const solidMat = new THREE.MeshBasicMaterial({
        color: 0x001122,
        transparent: true,
        opacity: 0.5
      })

      // --- CONSTRUCCIÓN DEL MOTOR (POR PARTES) ---
      
      // 1. EL EJE CENTRAL (Rotor Shaft)
      // Pieza fija central
      const shaftGeo = new THREE.CylinderGeometry(1, 1, 15, 16)
      // Rotamos la geometría para que apunte hacia Z (profundidad) en lugar de Y (arriba)
      shaftGeo.rotateX(Math.PI / 2)
      const shaft = new THREE.Mesh(shaftGeo, wireMat)
      engineGroup.add(shaft)

      // 2. ASPAS DEL VENTILADOR FRONTAL (Fan Blades)
      const fanGroup = new THREE.Group()
      const bladeCount = 8
      const bladeGeo = new THREE.BoxGeometry(1.5, 6, 0.2)
      
      for(let i=0; i<bladeCount; i++) {
        const blade = new THREE.Mesh(bladeGeo, bladeMat)
        // Posicionar alrededor del centro
        const angle = (i / bladeCount) * Math.PI * 2
        
        // Matemáticas para colocar las aspas en círculo
        blade.position.x = Math.cos(angle) * 3.5
        blade.position.y = Math.sin(angle) * 3.5
        
        // Rotar cada aspa para que apunte al centro + un poco de inclinación (pitch)
        blade.rotation.z = angle
        blade.rotation.x = 0.5 // Inclinación de la aspa para "cortar" el aire
        
        fanGroup.add(blade)
      }
      // Añadimos el cono de la nariz
      const noseGeo = new THREE.ConeGeometry(2, 3, 16)
      noseGeo.rotateX(Math.PI / 2) // Apuntar al frente
      const nose = new THREE.Mesh(noseGeo, wireMat)
      nose.position.z = 2 // Un poco más adelante
      fanGroup.add(nose)
      
      engineGroup.add(fanGroup)


      // 3. ESTATOR / COMPRESOR (Anillos intermedios)
      // Estos son los discos que comprimen el aire dentro del motor
      const statorGroup = new THREE.Group()
      
      const discGeo = new THREE.CylinderGeometry(5, 5, 0.5, 32, 1, true)
      discGeo.rotateX(Math.PI / 2)
      
      const disc1 = new THREE.Mesh(discGeo, wireMat)
      const disc2 = new THREE.Mesh(discGeo, wireMat)
      const disc3 = new THREE.Mesh(discGeo, wireMat)
      
      statorGroup.add(disc1)
      statorGroup.add(disc2)
      statorGroup.add(disc3)
      
      engineGroup.add(statorGroup)


      // 4. CARCASA TRASERA (Combustión / Escape)
      const exhaustGroup = new THREE.Group()
      const exhaustGeo = new THREE.CylinderGeometry(5, 3, 4, 32, 4, true)
      exhaustGeo.rotateX(Math.PI / 2)
      const exhaust = new THREE.Mesh(exhaustGeo, wireMat)
      exhaustGroup.add(exhaust)
      engineGroup.add(exhaustGroup)


      // 5. ANILLO DE ESCANEO (Diagnóstico)
      const scanRingGeo = new THREE.RingGeometry(5.5, 6, 64)
      const scanRingMat = new THREE.MeshBasicMaterial({ 
        color: 0xFFA500, // Naranja para contraste de "Alerta/Trabajo" o Cyan
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      })
      const scanner = new THREE.Mesh(scanRingGeo, scanRingMat)
      engineGroup.add(scanner)


      // --- PARTICULAS DE FLUJO DE AIRE ---
      const particlesCount = 400
      const particlesGeo = new THREE.BufferGeometry()
      const pPos = new Float32Array(particlesCount * 3)
      const pSpeed = new Float32Array(particlesCount)
      
      for(let i=0; i<particlesCount; i++){
        // Distribución cilíndrica a lo largo del eje Z
        const angle = Math.random() * Math.PI * 2
        const r = 4 + Math.random() * 4 // Radio alrededor del motor
        pPos[i*3] = Math.cos(angle) * r
        pPos[i*3+1] = Math.sin(angle) * r
        pPos[i*3+2] = (Math.random() - 0.5) * 40 // A lo largo del eje Z
        pSpeed[i] = 0.1 + Math.random() * 0.2
      }
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
      const particlesMat = new THREE.PointsMaterial({
        color: 0x00AEEF, size: 0.05, transparent: true, opacity: 0.3
      })
      const particles = new THREE.Points(particlesGeo, particlesMat)
      scene.add(particles) // Las partículas van a la escena, no al grupo, para no rotar con el motor


      // --- POSICIONAMIENTO DE CÁMARA ---
      const updateCamera = () => {
        // Vista lateral-diagonal para apreciar la longitud
        const isMobile = window.innerWidth < 768
        camera.position.set(isMobile ? 15 : 10, isMobile ? 5 : 4, isMobile ? 25 : 18)
        camera.lookAt(0, 0, 0)
      }
      updateCamera()


      // --- LOGICA DE ANIMACIÓN (LOOP) ---
      let time = 0
      let mouseX = 0
      let mouseY = 0

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX - window.innerWidth/2) * 0.001
        mouseY = (e.clientY - window.innerHeight/2) * 0.001
      }
      document.addEventListener("mousemove", handleMouseMove)

      const animate = () => {
        requestAnimationFrame(animate)
        time += 0.01

        // 1. ROTACIÓN DE PARTES (La máquina funcionando)
        // El fan gira rápido
        fanGroup.rotation.z -= 0.05
        // El estator gira lento o contra-rota
        statorGroup.rotation.z += 0.005

        // 2. EFECTO "EXPLODED VIEW" (Mantenimiento)
        // Usamos una función Seno para expandir y contraer las piezas cíclicamente
        const expansion = (Math.sin(time * 0.5) + 1) * 0.5 // Va de 0 a 1 suavemente
        
        // Desplazamos las piezas en el Eje Z según la expansión
        // El Fan se va hacia adelante
        fanGroup.position.z = 6 + (expansion * 5) 
        // Los discos del estator se separan entre sí
        statorGroup.children[0].position.z = 2 + (expansion * 2)
        statorGroup.children[1].position.z = 0 
        statorGroup.children[2].position.z = -2 - (expansion * 2)
        // El escape se va hacia atrás
        exhaustGroup.position.z = -6 - (expansion * 4)

        // 3. EL ESCÁNER
        // Se mueve de adelante hacia atrás recorriendo todo el largo
        scanner.position.z = Math.cos(time * 0.8) * 12

        // 4. PARTICULAS (Flujo continuo hacia atrás)
        const pArr = particlesGeo.attributes.position.array as Float32Array
        for(let i=0; i<particlesCount; i++){
          pArr[i*3+2] -= pSpeed[i] // Mover en Z negativo
          if(pArr[i*3+2] < -20) pArr[i*3+2] = 20 // Reiniciar al frente
        }
        particlesGeo.attributes.position.needsUpdate = true

        // 5. MOVIMIENTO DE CÁMARA/GRUPO (Parallax)
        engineGroup.rotation.y = -0.2 + (mouseX * 0.5)
        engineGroup.rotation.x = 0.1 + (mouseY * 0.5)

        renderer.render(scene, camera)
      }
      
      animate()

      // RESIZE
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        updateCamera()
      }
      window.addEventListener("resize", handleResize)

      cleanup = () => {
        window.removeEventListener("resize", handleResize)
        document.removeEventListener("mousemove", handleMouseMove)
        renderer.dispose()
        // Limpieza básica de geometrías
        shaftGeo.dispose(); bladeGeo.dispose(); noseGeo.dispose();
        discGeo.dispose(); exhaustGeo.dispose(); scanRingGeo.dispose();
      }
    }

    initAnimation()
    return () => cleanup()
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 z-0 w-full h-full opacity-60 pointer-events-none"
      // Gradiente radial sutil en CSS para fondo oscuro tech
      style={{ background: 'radial-gradient(circle at center, #0a192f 0%, #000000 100%)' }}
    />
  )
}