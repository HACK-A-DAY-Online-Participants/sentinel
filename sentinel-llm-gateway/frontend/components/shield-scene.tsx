"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ShieldScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 2.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Create shield geometry
    const geometry = new THREE.IcosahedronGeometry(1, 32)
    const material = new THREE.MeshPhongMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      wireframe: true,
      wireframeLinewidth: 2,
    })

    const shield = new THREE.Mesh(geometry, material)
    scene.add(shield)

    // Add particles
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 4
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.01,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Lighting
    const light = new THREE.PointLight(0x8b5cf6, 2, 100)
    light.position.set(5, 5, 5)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      shield.rotation.x += 0.001
      shield.rotation.y += 0.002

      particles.rotation.x += 0.0005
      particles.rotation.y += 0.0008

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
