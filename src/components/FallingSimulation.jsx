import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Play, Pause, RefreshCw, Camera, Maximize2, Activity, Wind, Gauge, Orbit, Eye, Sparkles, Flame, Droplet, Mountain, Globe, Rocket, Settings, Info } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Stars, Cloud, Sky, PerspectiveCamera, Text3D, Float, SpotLight, Trail, MeshDistortMaterial, MeshReflectorMaterial, Effects, Sparkles as SparklesEffect, Edges } from '@react-three/drei'
import * as THREE from 'three'

// Enhanced environments with atmospheric effects
const environments = [
  { 
    name: 'earth', 
    g: 9.80665, 
    label: '🌍 Earth الأرض',
    color: '#22c55e',
    skyColor: '#87CEEB',
    groundColor: '#8B4513',
    airDensity: 1.225,
    atmosphere: true,
    fogDensity: 0.001,
    particles: 'rain'
  },
  { 
    name: 'moon', 
    g: 1.62, 
    label: '🌙 Moon القمر',
    color: '#cbd5e1',
    skyColor: '#000000',
    groundColor: '#C0C0C0',
    airDensity: 0,
    atmosphere: false,
    fogDensity: 0,
    particles: 'dust'
  },
  { 
    name: 'mars', 
    g: 3.71, 
    label: '🔴 Mars المريخ',
    color: '#ef4444',
    skyColor: '#8B4513',
    groundColor: '#CD5C5C',
    airDensity: 0.020,
    atmosphere: true,
    fogDensity: 0.003,
    particles: 'sandstorm'
  },
  { 
    name: 'jupiter', 
    g: 24.79, 
    label: '🪐 Jupiter المشتري',
    color: '#f59e0b',
    skyColor: '#FFD700',
    groundColor: '#FFA500',
    airDensity: 0.16,
    atmosphere: true,
    fogDensity: 0.005,
    particles: 'storm'
  },
  { 
    name: 'venus', 
    g: 8.87, 
    label: '⭐ Venus الزهرة',
    color: '#facc15',
    skyColor: '#FFE4B5',
    groundColor: '#FFDEAD',
    airDensity: 65,
    atmosphere: true,
    fogDensity: 0.01,
    particles: 'acid'
  },
  { 
    name: 'space', 
    g: 0, 
    label: '🚀 Space الفضاء',
    color: '#a855f7',
    skyColor: '#000033',
    groundColor: '#000000',
    airDensity: 0,
    atmosphere: false,
    fogDensity: 0,
    particles: 'stars'
  },
]

// Enhanced object shapes with materials
const objectShapes = [
  { 
    name: 'sphere', 
    label: '⚪ Sphere كرة', 
    dragCoeff: 0.47, 
    frontalArea: 1,
    material: 'metal',
    complexity: 32
  },
  { 
    name: 'cube', 
    label: '⬜ Cube مكعب', 
    dragCoeff: 1.05, 
    frontalArea: 1,
    material: 'concrete',
    complexity: 1
  },
  { 
    name: 'teardrop', 
    label: '💧 Teardrop انسيابي', 
    dragCoeff: 0.04, 
    frontalArea: 0.5,
    material: 'carbon',
    complexity: 16
  },
  { 
    name: 'parachute', 
    label: '🪂 Parachute مظلة', 
    dragCoeff: 1.35, 
    frontalArea: 28,
    material: 'fabric',
    complexity: 32
  },
  { 
    name: 'human', 
    label: '🧍 Human إنسان', 
    dragCoeff: 0.7, 
    frontalArea: 0.68,
    material: 'organic',
    complexity: 8
  },
  { 
    name: 'feather', 
    label: '🪶 Feather ريشة', 
    dragCoeff: 1.0, 
    frontalArea: 0.1,
    material: 'light',
    complexity: 16
  }
]

// Camera views
const cameraViews = [
  { name: 'orbit', label: '🔄 Orbit', icon: Orbit },
  { name: 'follow', label: '📹 Follow', icon: Camera },
  { name: 'side', label: '👁️ Side', icon: Eye },
  { name: 'top', label: '⬇️ Top', icon: Maximize2 },
  { name: 'cinematic', label: '🎬 Cinematic', icon: Sparkles }
]

// Environmental Particles
function EnvironmentParticles({ type, count = 100 }) {
  const particles = useRef([])
  
  useFrame((state) => {
    particles.current.forEach((particle, i) => {
      if (!particle) return
      
      switch(type) {
        case 'rain':
          particle.position.y -= 0.3
          if (particle.position.y < -10) particle.position.y = 10
          break
        case 'snow':
          particle.position.y -= 0.05
          particle.position.x += Math.sin(state.clock.elapsedTime + i) * 0.01
          if (particle.position.y < -10) particle.position.y = 10
          break
        case 'dust':
          particle.position.x += Math.sin(state.clock.elapsedTime + i) * 0.02
          particle.position.y += Math.cos(state.clock.elapsedTime + i) * 0.01
          break
        case 'sandstorm':
          particle.position.x += 0.2
          particle.position.y += Math.sin(state.clock.elapsedTime * 2 + i) * 0.05
          if (particle.position.x > 15) particle.position.x = -15
          break
        case 'storm':
          const angle = state.clock.elapsedTime + i
          particle.position.x = Math.cos(angle * 2) * (5 + Math.sin(angle) * 2)
          particle.position.z = Math.sin(angle * 2) * (5 + Math.sin(angle) * 2)
          particle.position.y += 0.1
          if (particle.position.y > 10) particle.position.y = -10
          break
        case 'acid':
          particle.position.y -= 0.1
          particle.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.2
          if (particle.position.y < -10) particle.position.y = 10
          break
      }
    })
  })
  
  const particleColor = {
    rain: '#4FC3F7',
    snow: '#FFFFFF',
    dust: '#D2691E',
    sandstorm: '#F4A460',
    storm: '#FFD700',
    acid: '#7FFF00',
    stars: '#FFFFFF'
  }[type] || '#FFFFFF'
  
  return (
    <group>
      {[...Array(count)].map((_, i) => (
        <mesh
          key={i}
          ref={el => particles.current[i] = el}
          position={[
            (Math.random() - 0.5) * 30,
            Math.random() * 20 - 10,
            (Math.random() - 0.5) * 30
          ]}
        >
          <sphereGeometry args={[type === 'rain' ? 0.02 : 0.05, 4, 4]} />
          <meshBasicMaterial 
            color={particleColor} 
            transparent 
            opacity={type === 'stars' ? 1 : 0.6}
            emissive={particleColor}
            emissiveIntensity={type === 'stars' ? 1 : 0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

// Advanced Physics Object with trail and effects
function PhysicsObject({ 
  isAnimating, 
  height, 
  gravity, 
  mass,
  shape,
  environment,
  slowMotion,
  onUpdate,
  showTrail,
  airResistance,
  cameraView,
  windForce
}) {
  const meshRef = useRef()
  const trailRef = useRef()
  const groupRef = useRef()
  const [position, setPosition] = useState(new THREE.Vector3(0, 10, 0))
  const [velocity, setVelocity] = useState(new THREE.Vector3(0, 0, 0))
  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0))
  const [time, setTime] = useState(0)
  const startTime = useRef(0)
  const impactRef = useRef(false)
  
  const { camera } = useThree()
  const env = environments.find(e => e.name === environment)
  const obj = objectShapes.find(s => s.name === shape)

  useFrame((state, delta) => {
    if (!isAnimating || !meshRef.current) return

    if (startTime.current === 0) {
      startTime.current = state.clock.elapsedTime
      setTime(0)
      setVelocity(new THREE.Vector3(0, 0, 0))
      setPosition(new THREE.Vector3(0, height / 10, 0))
      impactRef.current = false
    }

    const currentTime = state.clock.elapsedTime - startTime.current
    const timeMultiplier = slowMotion ? 0.2 : 1.0
    const dt = delta * timeMultiplier
    const adjustedTime = currentTime * timeMultiplier
    
    setTime(adjustedTime)

    // Get current state
    let currentVel = velocity.clone()
    let currentPos = position.clone()

    // Check ground collision
    if (currentPos.y <= 0.5 && !impactRef.current) {
      impactRef.current = true
      // Bounce effect
      currentVel.y = -currentVel.y * 0.3
      currentPos.y = 0.5
      
      // Create impact effect
      if (onUpdate) {
        onUpdate({
          height: currentPos.y * 10,
          velocity: currentVel.length(),
          time: adjustedTime,
          acceleration: gravity,
          impact: true
        })
      }
    }

    if (currentPos.y > 0.5) {
      // Calculate forces
      let acceleration = new THREE.Vector3(0, -gravity * 0.1, 0)
      
      // Add wind force
      if (windForce > 0) {
        acceleration.x += windForce * 0.001 * Math.sin(adjustedTime * 2)
        acceleration.z += windForce * 0.0005 * Math.cos(adjustedTime * 3)
      }
      
      // Air resistance
      if (airResistance && env.airDensity > 0 && obj) {
        const speed = currentVel.length()
        if (speed > 0) {
          const dragForce = 0.5 * env.airDensity * speed * speed * obj.dragCoeff * obj.frontalArea * 0.01
          const dragAccel = dragForce / mass
          const dragVector = currentVel.clone().normalize().multiplyScalar(-dragAccel)
          acceleration.add(dragVector)
        }
        
        // Terminal velocity check
        const terminalVel = Math.sqrt((2 * mass * gravity) / (env.airDensity * obj.dragCoeff * obj.frontalArea * 0.01))
        if (currentVel.length() >= terminalVel * 0.99) {
          currentVel.normalize().multiplyScalar(terminalVel * 0.1)
        }
      }

      // Update velocity and position
      currentVel.add(acceleration.multiplyScalar(dt))
      currentPos.add(currentVel.clone().multiplyScalar(dt))
    }

    // Ensure we don't go below ground
    if (currentPos.y < 0.5) {
      currentPos.y = 0.5
      currentVel.multiplyScalar(0.9) // Damping
    }

    setVelocity(currentVel)
    setPosition(currentPos)

    // Update mesh
    meshRef.current.position.copy(currentPos)
    
    // Rotation based on shape
    if (shape !== 'parachute' && shape !== 'human') {
      meshRef.current.rotation.x += dt * 2
      meshRef.current.rotation.y += dt * 0.5
      meshRef.current.rotation.z += dt * 1.5
    } else if (shape === 'parachute') {
      meshRef.current.rotation.y += dt * 0.2
      meshRef.current.position.x += Math.sin(adjustedTime * 2) * 0.02
    }

    // Camera follow for specific views
    if (cameraView === 'follow') {
      camera.position.lerp(new THREE.Vector3(currentPos.x + 5, currentPos.y + 2, currentPos.z + 5), 0.1)
      camera.lookAt(currentPos)
    } else if (cameraView === 'cinematic') {
      const cinematicAngle = adjustedTime * 0.5
      camera.position.set(
        Math.cos(cinematicAngle) * 8,
        currentPos.y + 3,
        Math.sin(cinematicAngle) * 8
      )
      camera.lookAt(currentPos)
    }

    // Send update
    if (onUpdate) {
      onUpdate({
        height: Math.max(0, currentPos.y * 10),
        velocity: currentVel.length() * 10,
        time: adjustedTime,
        acceleration: gravity,
        windSpeed: windForce,
        impact: false
      })
    }
  })

  // Reset when animation stops
  useEffect(() => {
    if (!isAnimating) {
      startTime.current = 0
      setTime(0)
      setVelocity(new THREE.Vector3(0, 0, 0))
      setPosition(new THREE.Vector3(0, height / 10, 0))
      if (meshRef.current) {
        meshRef.current.position.set(0, height / 10, 0)
        meshRef.current.rotation.set(0, 0, 0)
      }
    }
  }, [isAnimating, height])

  // Material selection
  const getMaterial = () => {
    const matProps = {
      metal: { metalness: 0.8, roughness: 0.2, color: env?.color },
      concrete: { metalness: 0.1, roughness: 0.9, color: '#808080' },
      carbon: { metalness: 0.9, roughness: 0.1, color: '#1a1a1a' },
      fabric: { metalness: 0, roughness: 1, color: '#ff0000' },
      organic: { metalness: 0.1, roughness: 0.7, color: '#FDB462' },
      light: { metalness: 0, roughness: 0.5, color: '#FFFFCC' }
    }
    
    const props = matProps[obj?.material] || matProps.metal
    
    return (
      <meshPhysicalMaterial 
        {...props}
        clearcoat={obj?.material === 'carbon' ? 1 : 0}
        clearcoatRoughness={0.1}
        transmission={obj?.material === 'light' ? 0.5 : 0}
        thickness={1}
        envMapIntensity={0.5}
      />
    )
  }

  // Render object based on shape
  const renderObject = () => {
    switch(shape) {
      case 'cube':
        return (
          <group ref={groupRef}>
            <mesh ref={meshRef}>
              <boxGeometry args={[1, 1, 1]} />
              {getMaterial()}
              <Edges color={env?.color} />
            </mesh>
          </group>
        )
        
      case 'teardrop':
        return (
          <group ref={groupRef}>
            <mesh ref={meshRef}>
              <coneGeometry args={[0.5, 2, 16]} />
              {getMaterial()}
            </mesh>
          </group>
        )
        
      case 'parachute':
        return (
          <group ref={meshRef}>
            <mesh position={[0, 1, 0]}>
              <coneGeometry args={[2, 0.5, 16]} />
              <meshPhysicalMaterial 
                color="#FF0000" 
                transparent 
                opacity={0.7}
                transmission={0.3}
                roughness={1}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            {[...Array(8)].map((_, i) => (
              <mesh key={i} position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 1.5]} />
                <meshBasicMaterial color="white" />
              </mesh>
            ))}
          </group>
        )
        
      case 'human':
        return (
          <group ref={meshRef}>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#FDB462" />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.3, 0.25, 1, 16]} />
              <meshStandardMaterial color="#4472C4" />
            </mesh>
            <mesh position={[-0.3, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
              <meshStandardMaterial color="#FDB462" />
            </mesh>
            <mesh position={[0.3, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
              <meshStandardMaterial color="#FDB462" />
            </mesh>
          </group>
        )
        
      case 'feather':
        return (
          <group ref={meshRef}>
            <Float speed={2} rotationIntensity={2} floatIntensity={0.5}>
              <mesh>
                <planeGeometry args={[0.3, 2, 1, 10]} />
                <meshPhysicalMaterial 
                  color="#FFFFCC" 
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.8}
                  transmission={0.2}
                  roughness={0.8}
                />
              </mesh>
            </Float>
          </group>
        )
        
      default: // sphere
        return (
          <group ref={groupRef}>
            <mesh ref={meshRef}>
              <sphereGeometry args={[0.5, 32, 32]} />
              {getMaterial()}
            </mesh>
          </group>
        )
    }
  }

  return (
    <group>
      {showTrail && (
        <Trail
          target={meshRef}
          length={20}
          decay={1}
          local={false}
          stride={0}
          interval={1}
          attenuation={(width) => width}
          color={env?.color || '#ff0000'}
          opacity={0.5}
        />
      )}
      {renderObject()}
      
      {/* Velocity indicator */}
      {velocity.length() > 0.5 && (
        <mesh position={position}>
          <coneGeometry args={[0.1, velocity.length() * 0.5, 8]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  )
}

// Enhanced 3D Grid and Environment
function PhysicsWorld({ height, environment, showGrid, quality }) {
  const env = environments.find(e => e.name === environment)
  
  return (
    <group>
      {/* Sky and atmosphere */}
      {env?.atmosphere && quality !== 'low' && (
        <Sky 
          sunPosition={[100, 20, 100]}
          turbidity={env.name === 'mars' ? 10 : 8}
          rayleigh={env.name === 'venus' ? 4 : 2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
      )}
      
      {/* Stars for space */}
      {environment === 'space' && <Stars radius={100} depth={50} count={5000} factor={4} />}
      
      {/* Ground with reflection */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[0, 0]}
          mixBlur={quality === 'high' ? 0.5 : 0}
          mixStrength={quality === 'high' ? 0.5 : 0.2}
          mixContrast={1}
          resolution={quality === 'high' ? 2048 : 512}
          mirror={0}
          depthScale={0.01}
          minDepthThreshold={0.9}
          maxDepthThreshold={1}
          color={env?.groundColor || '#8B4513'}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Grid */}
      {showGrid && (
        <group>
          <gridHelper args={[50, 50, '#4FC3F7', '#1e40af']} position={[0, 0.01, 0]} />
          
          {/* Height markers */}
          {[...Array(Math.min(10, Math.floor(height / 10)))].map((_, i) => (
            <group key={i}>
              <mesh position={[-8, i + 0.5, 0]}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
        </group>
      )}
      
      {/* Environmental particles */}
      {env?.particles && quality !== 'low' && (
        <EnvironmentParticles type={env.particles} count={quality === 'high' ? 200 : 100} />
      )}
      
      {/* Fog */}
      {env?.fogDensity > 0 && (
        <fog attach="fog" args={[env.skyColor, 1, 100 / (env.fogDensity * 10)]} />
      )}
    </group>
  )
}

// Main Component
export default function Ultimate3DFallingSimulation() {
  const [mass, setMass] = useState(10)
  const [height, setHeight] = useState(100)
  const [gravity, setGravity] = useState(environments[0].g)
  const [environment, setEnvironment] = useState('earth')
  const [shape, setShape] = useState('sphere')
  const [isAnimating, setIsAnimating] = useState(false)
  const [slowMotion, setSlowMotion] = useState(false)
  const [showTrail, setShowTrail] = useState(true)
  const [airResistance, setAirResistance] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [cameraView, setCameraView] = useState('orbit')
  const [quality, setQuality] = useState('high')
  const [windForce, setWindForce] = useState(0)
  
  const [liveData, setLiveData] = useState({
    height: 100,
    velocity: 0,
    time: 0,
    acceleration: 9.80665,
    windSpeed: 0,
    impact: false
  })

  const handleReset = useCallback(() => {
    setIsAnimating(false)
    setLiveData({
      height: height,
      velocity: 0,
      time: 0,
      acceleration: gravity,
      windSpeed: windForce,
      impact: false
    })
  }, [height, gravity, windForce])

  const handleEnvironmentChange = useCallback((value) => {
    const env = environments.find(e => e.name === value)
    if (env) {
      setEnvironment(value)
      setGravity(env.g)
      handleReset()
    }
  }, [handleReset])

  const selectedEnv = environments.find(e => e.name === environment)
  const selectedShape = objectShapes.find(s => s.name === shape)

  // Calculate physics
  const terminalVelocity = useMemo(() => {
    if (!airResistance || !selectedEnv?.airDensity || !selectedShape) return Infinity
    const frontalArea = selectedShape.frontalArea * 0.01
    return Math.sqrt((2 * mass * gravity) / (selectedEnv.airDensity * selectedShape.dragCoeff * frontalArea))
  }, [airResistance, selectedEnv, selectedShape, mass, gravity])

  const theoreticalFallTime = gravity > 0 ? Math.sqrt(2 * height / gravity) : Infinity
  const kineticEnergy = 0.5 * mass * liveData.velocity * liveData.velocity
  const potentialEnergy = mass * gravity * liveData.height

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
      
      <div className="relative z-10 p-6">
        <div className="max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="text-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl" />
            <h1 className="relative text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 tracking-tight">
              ULTIMATE 3D PHYSICS ENGINE
            </h1>
            <p className="text-gray-400 text-lg font-light">
              Real-time Gravitational Dynamics & Atmospheric Simulation
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* 3D Viewport */}
            <div className="xl:col-span-8">
              <Card className="bg-black/40 backdrop-blur-xl border-white/10 overflow-hidden">
                <CardHeader className="pb-2 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      3D Simulation Viewport
                    </CardTitle>
                    <div className="flex gap-2">
                      {cameraViews.map((view) => (
                        <Button
                          key={view.name}
                          size="sm"
                          variant={cameraView === view.name ? "default" : "ghost"}
                          onClick={() => setCameraView(view.name)}
                          className="text-xs"
                        >
                          <view.icon className="w-3 h-3" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative w-full h-[700px] bg-gradient-to-b from-slate-900 to-black">
                    <Canvas 
                      shadows
                      dpr={[1, 2]}
                      camera={{ position: [15, 10, 15], fov: 50 }}
                    >
                      <ambientLight intensity={0.2} />
                      <directionalLight 
                        position={[10, 20, 10]} 
                        intensity={1.5}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                      />
                      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4FC3F7" />
                      <spotLight
                        position={[5, 15, 5]}
                        angle={0.3}
                        penumbra={1}
                        intensity={2}
                        castShadow
                      />
                      
                      <PhysicsWorld 
                        height={height} 
                        environment={environment}
                        showGrid={showGrid}
                        quality={quality}
                      />
                      
                      <PhysicsObject
                        isAnimating={isAnimating}
                        height={height}
                        gravity={gravity}
                        mass={mass}
                        shape={shape}
                        environment={environment}
                        slowMotion={slowMotion}
                        showTrail={showTrail}
                        airResistance={airResistance}
                        cameraView={cameraView}
                        windForce={windForce}
                        onUpdate={setLiveData}
                      />
                      
                      {cameraView === 'orbit' && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />}
                      
                      {quality !== 'low' && <Environment preset="sunset" />}
                    </Canvas>
                    
                    {/* HUD Overlay */}
                    <div className="absolute top-4 left-4 space-y-2">
                      <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: selectedEnv?.color }} />
                          <span className="text-white font-bold text-sm">{selectedEnv?.label}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-gray-400">Gravity:</div>
                          <div className="text-white font-mono">{gravity.toFixed(2)} m/s²</div>
                          <div className="text-gray-400">Air Density:</div>
                          <div className="text-white font-mono">{selectedEnv?.airDensity.toFixed(3)} kg/m³</div>
                        </div>
                      </div>
                      
                      {liveData.impact && (
                        <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-2 border border-red-500/50 animate-pulse">
                          <div className="text-red-400 text-xs font-bold">IMPACT DETECTED!</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Live Stats Overlay */}
                    {showStats && isAnimating && (
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-4 border border-white/10">
                        <div className="space-y-2 font-mono text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400" />
                            <span className="text-gray-400">Height:</span>
                            <span className="text-blue-400 font-bold">{liveData.height.toFixed(1)}m</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-gray-400">Velocity:</span>
                            <span className="text-green-400 font-bold">{liveData.velocity.toFixed(2)}m/s</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <span className="text-gray-400">Time:</span>
                            <span className="text-yellow-400 font-bold">{liveData.time.toFixed(2)}s</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <span className="text-gray-400">Accel:</span>
                            <span className="text-red-400 font-bold">{liveData.acceleration.toFixed(2)}m/s²</span>
                          </div>
                          {windForce > 0 && (
                            <div className="flex items-center gap-2">
                              <Wind className="w-3 h-3 text-cyan-400" />
                              <span className="text-gray-400">Wind:</span>
                              <span className="text-cyan-400 font-bold">{windForce.toFixed(1)}N</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Energy Bar */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">Kinetic Energy</span>
                          <span className="text-xs text-green-400 font-mono">{kineticEnergy.toFixed(0)}J</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                            style={{ width: `${Math.min(100, (kineticEnergy / (mass * gravity * height)) * 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">Potential Energy</span>
                          <span className="text-xs text-blue-400 font-mono">{potentialEnergy.toFixed(0)}J</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
                            style={{ width: `${Math.min(100, (potentialEnergy / (mass * gravity * height)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Control Panel */}
            <div className="xl:col-span-4 space-y-4">
              {/* Environment Selection */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardHeader className="pb-3 border-b border-white/10">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-purple-400" />
                    Environment Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Select onValueChange={handleEnvironmentChange} value={environment}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {environments.map((env) => (
                        <SelectItem key={env.name} value={env.name} className="text-white hover:bg-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: env.color }} />
                            {env.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Object Properties */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardHeader className="pb-3 border-b border-white/10">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-400" />
                    Object Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <Label className="text-gray-300 text-sm mb-2 block">Shape</Label>
                    <Select onValueChange={setShape} value={shape}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        {objectShapes.map((s) => (
                          <SelectItem key={s.name} value={s.name} className="text-white hover:bg-white/10">
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                      <Gauge className="w-3 h-3" />
                      Mass: {mass} kg
                    </Label>
                    <Slider 
                      value={[mass]} 
                      onValueChange={([val]) => setMass(val)} 
                      min={0.1} 
                      max={1000} 
                      step={0.1}
                      className="py-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                      <Mountain className="w-3 h-3" />
                      Height: {height} m
                    </Label>
                    <Slider 
                      value={[height]} 
                      onValueChange={([val]) => setHeight(val)} 
                      min={10} 
                      max={1000} 
                      step={10}
                      className="py-2"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                      <Wind className="w-3 h-3" />
                      Wind Force: {windForce} N
                    </Label>
                    <Slider 
                      value={[windForce]} 
                      onValueChange={([val]) => setWindForce(val)} 
                      min={0} 
                      max={100} 
                      step={1}
                      className="py-2"
                    />
                  </div>

                  {environment !== 'space' && (
                    <div>
                      <Label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                        <Droplet className="w-3 h-3" />
                        Gravity: {gravity.toFixed(2)} m/s²
                      </Label>
                      <Slider 
                        value={[gravity]} 
                        onValueChange={([val]) => setGravity(val)} 
                        min={0} 
                        max={30} 
                        step={0.01}
                        className="py-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Simulation Controls */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardHeader className="pb-3 border-b border-white/10">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    Simulation Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => setIsAnimating(!isAnimating)}
                      className={`relative overflow-hidden ${isAnimating ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      {isAnimating ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          PAUSE
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          DROP
                        </>
                      )}
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      RESET
                    </Button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300 text-sm flex items-center gap-2">
                        <Flame className="w-3 h-3 text-orange-400" />
                        Slow Motion
                      </Label>
                      <Switch 
                        checked={slowMotion} 
                        onCheckedChange={setSlowMotion}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300 text-sm flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        Show Trail
                      </Label>
                      <Switch 
                        checked={showTrail} 
                        onCheckedChange={setShowTrail}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300 text-sm flex items-center gap-2">
                        <Wind className="w-3 h-3 text-cyan-400" />
                        Air Resistance
                      </Label>
                      <Switch 
                        checked={airResistance} 
                        onCheckedChange={setAirResistance}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300 text-sm">Show Grid</Label>
                      <Switch 
                        checked={showGrid} 
                        onCheckedChange={setShowGrid}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300 text-sm">Show Stats</Label>
                      <Switch 
                        checked={showStats} 
                        onCheckedChange={setShowStats}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Label className="text-gray-300 text-sm mb-2 block">Render Quality</Label>
                    <Select onValueChange={setQuality} value={quality}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="low" className="text-white">🔋 Performance</SelectItem>
                        <SelectItem value="medium" className="text-white">⚖️ Balanced</SelectItem>
                        <SelectItem value="high" className="text-white">✨ Ultra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Physics Data */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border-purple-500/20">
                <CardHeader className="pb-3 border-b border-purple-500/20">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Info className="w-4 h-4 text-purple-400" />
                    Physics Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-xs text-purple-300 mb-1">Terminal Velocity</div>
                      <div className="text-white font-bold font-mono">
                        {terminalVelocity === Infinity ? '∞' : `${terminalVelocity.toFixed(1)} m/s`}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-xs text-blue-300 mb-1">Fall Time</div>
                      <div className="text-white font-bold font-mono">
                        {theoreticalFallTime.toFixed(2)}s
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-xs text-green-300 mb-1">Drag Coefficient</div>
                      <div className="text-white font-bold font-mono">
                        {selectedShape?.dragCoeff.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-xs text-yellow-300 mb-1">Reynolds Number</div>
                      <div className="text-white font-bold font-mono">
                        {(liveData.velocity * 0.1 * selectedEnv?.airDensity / 0.0000181).toFixed(0)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-3 border border-white/10">
                    <div className="text-xs text-gray-400 mb-2">Active Equations:</div>
                    <div className="space-y-1 font-mono text-xs">
                      <div className="text-purple-300">F = ma</div>
                      <div className="text-blue-300">F_g = mg = {(mass * gravity).toFixed(1)}N</div>
                      {airResistance && (
                        <div className="text-green-300">F_d = ½ρv²C_dA</div>
                      )}
                      <div className="text-yellow-300">E_total = {(kineticEnergy + potentialEnergy).toFixed(0)}J</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}