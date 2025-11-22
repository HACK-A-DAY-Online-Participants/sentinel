"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import type * as THREE from "three"

// Main rotating data sphere
function DataSphere() {
  const sphereRef = useRef<THREE.Mesh>(null)
  const dotsRef = useRef<THREE.Points>(null)

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.0008
      sphereRef.current.rotation.y += 0.0012
    }
    if (dotsRef.current) {
      dotsRef.current.rotation.x += 0.0005
      dotsRef.current.rotation.y += 0.0008
    }
  })

  // Create wireframe sphere data points
  const dotCount = 800
  const positions = new Float32Array(dotCount * 3)
  const phi = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < dotCount; i++) {
    const y = 1 - (i / (dotCount - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = phi * i

    positions[i * 3] = Math.cos(theta) * radius * 5.5
    positions[i * 3 + 1] = y * 5.5
    positions[i * 3 + 2] = Math.sin(theta) * radius * 5.5
  }

  return (
    <group>
      {/* Main sphere wireframe - increased size from 3 to 5.5 */}
      <mesh ref={sphereRef} castShadow receiveShadow>
        <icosahedronGeometry args={[5.5, 4]} />
        <meshStandardMaterial color="#ffffff" wireframe metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Solid inner sphere with low opacity - scaled to match new size */}
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[5.1, 4]} />
        <meshStandardMaterial
          color="#000000"
          wireframe={false}
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Data point dots around sphere */}
      <points ref={dotsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={dotCount} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
      </points>

      {/* Outer rotating ring - increased size from 3.2 to 5.8 */}
      <mesh rotation={[0.4, 0.3, 0.2]}>
        <torusGeometry args={[5.8, 0.12, 16, 128]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Secondary ring perpendicular - increased size from 3.1 to 5.7 */}
      <mesh rotation={[1.2, 0, 0.5]}>
        <torusGeometry args={[5.7, 0.1, 16, 128]} />
        <meshStandardMaterial color="#ffffff" metalness={0.85} roughness={0.15} opacity={0.6} transparent />
      </mesh>
    </group>
  )
}

// Grid background lines
function GridBackground() {
  const gridRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.z += 0.0001
    }
  })

  const gridLines = []
  const gridSize = 20
  const gridSpacing = 1

  // Create grid lines
  for (let i = -gridSize; i <= gridSize; i++) {
    // Horizontal lines
    gridLines.push(
      <lineSegments key={`h-${i}`} position={[0, i * gridSpacing, -15]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([-gridSize * gridSpacing, 0, 0, gridSize * gridSpacing, 0, 0])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#000000" opacity={0.15} transparent linewidth={1} />
      </lineSegments>,
    )

    // Vertical lines
    gridLines.push(
      <lineSegments key={`v-${i}`} position={[i * gridSpacing, 0, -15]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, -gridSize * gridSpacing, 0, 0, gridSize * gridSpacing, 0])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#000000" opacity={0.15} transparent linewidth={1} />
      </lineSegments>,
    )
  }

  return <group ref={gridRef}>{gridLines}</group>
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />

      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow color="#ffffff" />
      <pointLight position={[-10, -10, 5]} intensity={0.5} color="#ffffff" />

      <GridBackground />
      <DataSphere />
    </>
  )
}

export default function SentinelEmblem() {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <Scene />
      </Canvas>
    </div>
  )
}
