import React, { useRef, useMemo, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Stars, Environment, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

// --- Shader Definitions ---
const getColorScheme = (scheme) => {
  switch (scheme) {
    case 'cool':
      return {
        color1: new THREE.Color('#00bcd4'),
        color2: new THREE.Color('#3f51b5')
      };
    case 'warm':
      return {
        color1: new THREE.Color('#ff9800'),
        color2: new THREE.Color('#f44336')
      };
    case 'neon':
      return {
        color1: new THREE.Color('#00ff88'),
        color2: new THREE.Color('#ff0080')
      };
    case 'cosmic':
      return {
        color1: new THREE.Color('#9c27b0'),
        color2: new THREE.Color('#673ab7')
      };
    default:
      return {
        color1: new THREE.Color('#4fc3f7'),
        color2: new THREE.Color('#9c27b0')
      };
  }
};

const baseUniforms = {
  time: { value: 0 },
  massPositions: { value: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)] },
  massStrengths: { value: [1.0, 0.0, 0.0] },
  massCount: { value: 1 },
  color1: { value: new THREE.Color('#4fc3f7') },
  color2: { value: new THREE.Color('#9c27b0') },
  gridFrequency: { value: 20.0 },
  waveAmplitude: { value: 0.1 },
  showGrid: { value: true }
};

const spacetimeVertexShader = `
  uniform float time;
  uniform vec3 massPositions[3];
  uniform float massStrengths[3];
  uniform int massCount;
  uniform float waveAmplitude;
  varying float vDistortion;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float totalCurvature = 0.0;
    for(int i = 0; i < massCount; i++) {
      vec3 diff = pos - massPositions[i];
      float distance = length(diff.xz);
      float safeDistSq = max(distance * distance, 0.01);
      float curvature = (massStrengths[i] * 2.0) / safeDistSq;
      totalCurvature += curvature;
    }
    float wave = sin(time * 0.5 + length(pos.xz) * 0.5) * waveAmplitude;
    pos.y = -totalCurvature * 2.0 - wave * totalCurvature;
    vDistortion = totalCurvature;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const spacetimeFragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float gridFrequency;
  uniform bool showGrid;
  varying float vDistortion;
  varying vec2 vUv;

  void main() {
    float gridX = abs(fract(vUv.x * gridFrequency) - 0.5);
    float gridY = abs(fract(vUv.y * gridFrequency) - 0.5);
    float grid = showGrid ? (1.0 - step(0.05, min(gridX, gridY))) : 0.0;
    // Clamp distortion to ensure smooth color mixing
    vec3 color = mix(color1, color2, clamp(vDistortion * 0.5, 0.0, 1.0));
    float alpha = mix(0.2, 0.95, grid);
    gl_FragColor = vec4(color, alpha);
  }
`;

const SpacetimeGridMesh = ({
  massPosition,
  massStrength,
  animationSpeed,
  gridResolution = 150,
  gridFrequency = 20.0,
  waveAmplitude = 0.1,
  colorScheme = 'default',
  showGrid = true,
  additionalMasses = []
}) => {
  const meshRef = useRef(null);
  
  // Memoize material creation
  const material = useMemo(
    () => {
      const colors = getColorScheme(colorScheme);
      const uniforms = THREE.UniformsUtils.clone(baseUniforms);
      uniforms.color1.value = colors.color1;
      uniforms.color2.value = colors.color2;
      uniforms.gridFrequency.value = gridFrequency;
      uniforms.waveAmplitude.value = waveAmplitude;
      uniforms.showGrid.value = showGrid;

      // Set primary mass positions and strengths
      uniforms.massPositions.value[0].fromArray(massPosition);
      uniforms.massStrengths.value[0] = massStrength;
      uniforms.massCount.value = 1; // Will be updated in useFrame for additional masses

      return new THREE.ShaderMaterial({
        uniforms,
        vertexShader: spacetimeVertexShader,
        fragmentShader: spacetimeFragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      });
    },
    [colorScheme, gridFrequency, waveAmplitude, showGrid, massPosition, massStrength]
  );

  useEffect(() => {
    return () => {
      // Clean up material resources when the component unmounts
      material.dispose();
    };
  }, [material]);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(50, 50, gridResolution, gridResolution);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [gridResolution]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const uniforms = material.uniforms;
    uniforms.time.value = clock.elapsedTime * animationSpeed;
    // Update additional masses dynamically without recreating material
    for (let i = 0; i < Math.min(additionalMasses.length, 2); i++) {
      const mass = additionalMasses[i];
      uniforms.massPositions.value[i + 1].set(mass.x, 0, mass.z);
      uniforms.massStrengths.value[i + 1] = mass.strength;
    }
    // Set massCount
    uniforms.massCount.value = 1 + Math.min(additionalMasses.length, 2);
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} position={[0, -2, 0]} />;
};

const OrbitPath = ({ radius, centralPosition, color = '#ffffff' }) => {
  const points = useMemo(() => {
    const segments = 96;
    const result = [];
    for (let i = 0; i <= segments; i += 1) {
      const theta = (i / segments) * Math.PI * 2;
      const x = centralPosition[0] + radius * Math.cos(theta);
      const z = centralPosition[2] + radius * Math.sin(theta);
      result.push(new THREE.Vector3(x, centralPosition[1], z));
    }
    return result;
  }, [radius, centralPosition]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.35}
      dashed
      dashScale={3}
      dashSize={0.15}
      gapSize={0.15}
    />
  );
};


const Planet = ({
  index,
  size = 0.5,
  color = '#ff6b35',
  name = 'Planet',
  orbitRadius,
  orbitSpeed,
  centralMassPosition,
  isPlaying
}) => {
  const meshRef = useRef(null);
  const atmosphereRef = useRef(null);
  const textRef = useRef(null);
  
  // Use refs to store mutable state that affects animation
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const currentPositionRef = useRef(new THREE.Vector3(
    centralMassPosition[0] + orbitRadius, 
    centralMassPosition[1], 
    centralMassPosition[2]
  ));

  // Initialize position based on orbitRadius
  useEffect(() => {
    currentPositionRef.current.set(
      centralMassPosition[0] + orbitRadius, 
      centralMassPosition[1], 
      centralMassPosition[2]
    );
  }, [orbitRadius, centralMassPosition]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    if (isPlaying) {
      angleRef.current += delta * orbitSpeed;
    }
    const angle = angleRef.current;
    const x = centralMassPosition[0] + orbitRadius * Math.cos(angle);
    const z = centralMassPosition[2] + orbitRadius * Math.sin(angle);
    
    const wobble = Math.sin(state.clock.elapsedTime * 2 + index) * 0.04 * Math.max(orbitRadius / 3, 0.5);
    const target = new THREE.Vector3(x, centralMassPosition[1] + wobble, z);

    currentPositionRef.current.lerp(target, 0.15);
    
    meshRef.current.position.copy(currentPositionRef.current);
    meshRef.current.rotation.y += delta * 0.4;
    
    if (atmosphereRef.current) {
      atmosphereRef.current.position.copy(meshRef.current.position);
      atmosphereRef.current.rotation.y += delta * 0.45;
    }
    if (textRef.current) {
      textRef.current.position.set(x, centralMassPosition[1] + size + 0.9, z);
      textRef.current.quaternion.copy(state.camera.quaternion); // Face camera
    }
  });

  return (
    <group>
      {orbitRadius > 0 && <OrbitPath radius={orbitRadius} centralPosition={centralMassPosition} color={color} />}
      <Sphere ref={meshRef} args={[size, 64, 64]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.12 + orbitRadius * 0.02}
          roughness={0.65}
          metalness={0.25}
          envMapIntensity={0.8}
        />
      </Sphere>
      <Sphere ref={atmosphereRef} args={[size * 1.2, 32, 32]}>
        <meshStandardMaterial color={color} transparent opacity={0.08} envMapIntensity={0.4} />
      </Sphere>
      <Text
        ref={textRef}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  );
};

const BlackHole = ({ position, size = 1, name = 'Black Hole', isPlaying }) => {
  const diskRef = useRef(null);

  useFrame((_, delta) => {
    if (!diskRef.current || !isPlaying) return;
    diskRef.current.rotation.z += delta * 0.35;
  });

  return (
    <group position={position}>
      <Sphere args={[size, 64, 64]}>
        <meshStandardMaterial color="black" roughness={0} metalness={0} />
      </Sphere>

      <mesh ref={diskRef} rotation-x={Math.PI / 2}>
        <Torus args={[size * 2.5, size * 0.8, 2, 120]}>
          <meshStandardMaterial
            color="#ffb300"
            emissive="#ff6f00"
            emissiveIntensity={1.1}
            side={THREE.DoubleSide}
            roughness={0.25}
            metalness={0.1}
          />
        </Torus>
      </mesh>

      <Text
        position={[0, size + 2.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  );
};

const AdditionalMass = ({ position, strength, name, isPlaying }) => {
  const meshRef = useRef(null);

  useFrame((_, delta) => {
    if (!meshRef.current || !isPlaying) return;
    meshRef.current.rotation.y += delta * 0.5;
  });

  const size = Math.max(0.3, strength * 0.3);

  return (
    <group position={[position[0], 0, position[1]]}>
      <Sphere ref={meshRef} args={[size, 32, 32]}>
        <meshStandardMaterial
          color="#ff5722"
          emissive="#ff5722"
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.6}
        />
      </Sphere>
      <Text
        position={[0, size + 0.8, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  );
};

const FallingObject = ({ startPosition, targetPosition, isAnimating, onComplete, timeSpeed }) => {
  const meshRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = 0;
    if (meshRef.current) {
      meshRef.current.position.set(...startPosition);
    }
  }, [isAnimating, startPosition]);

  useFrame((_, delta) => {
    if (!isAnimating || !meshRef.current) return;

    progressRef.current += delta * 0.5 * timeSpeed;
    const progress = Math.min(progressRef.current, 1);
    // Parabolic fall (ease-in, looks like gravity pull)
    const eased = 1 - Math.pow(1 - progress, 2);

    const newPos = [
      THREE.MathUtils.lerp(startPosition[0], targetPosition[0], progress),
      THREE.MathUtils.lerp(startPosition[1], targetPosition[1], eased),
      THREE.MathUtils.lerp(startPosition[2], targetPosition[2], progress)
    ];
    meshRef.current.position.set(...newPos);

    if (progress >= 1) {
      onComplete?.();
      progressRef.current = 0;
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.18, 18, 18]} position={startPosition}>
      <meshStandardMaterial color="#ffeb3b" emissive="#ffd600" emissiveIntensity={0.55} />
    </Sphere>
  );
};

const SpacetimeScene = ({
  showFallingDemo,
  massStrength,
  planetCount,
  isPlaying,
  timeSpeed,
  onFallingDemoComplete,
  centralMassPosition,
  planetColors,
  planetNamesAR,
  planetNamesFR,
  visualizationType,
  gridResolution = 150,
  gridFrequency = 20.0,
  waveAmplitude = 0.1,
  colorScheme = 'default',
  showGrid = true,
  starCount = 6500,
  bloomIntensity = 0.8,
  chromaticAberration = 0.0004,
  additionalMasses = []
}) => {
  // ⚠️ Here's the fix! Remove the TypeScript <any> notation
  const controlsRef = useRef(null);
  const { camera } = useThree();

  useEffect(() => {
    const target = new THREE.Vector3(...centralMassPosition);
    camera.lookAt(target);
    if (controlsRef.current) {
      controlsRef.current.target.copy(target);
      controlsRef.current.update();
    }
  }, [camera, centralMassPosition]);

  const handleFallingDemoComplete = useCallback(() => {
    onFallingDemoComplete?.();
  }, [onFallingDemoComplete]);

  return (
    <>
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.45} luminanceSmoothing={0.85} height={240} intensity={bloomIntensity} />
        <ChromaticAberration offset={[chromaticAberration, chromaticAberration]} />
      </EffectComposer>

      {/* Environment & Lighting */}
      <Environment preset="sunset" background={false} blur={0.8} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.4}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-8, 4, -8]} intensity={0.75} color="#4fc3f7" distance={22} decay={2} />
      <pointLight position={[0, -5, 0]} intensity={0.25} color="#ffeb3b" distance={18} decay={2} />
      <ambientLight intensity={0.25} />
      <Stars radius={110} depth={60} count={starCount} factor={3.8} saturation={0.45} fade speed={0.35} />

      {/* Spacetime Grid */}
      <SpacetimeGridMesh
        massPosition={centralMassPosition}
        massStrength={massStrength}
        animationSpeed={timeSpeed}
        gridResolution={gridResolution}
        gridFrequency={gridFrequency}
        waveAmplitude={waveAmplitude}
        colorScheme={colorScheme}
        showGrid={showGrid}
        additionalMasses={additionalMasses}
      />
      
      {/* Central Mass */}
      {visualizationType === 'blackhole' ? (
        <BlackHole position={centralMassPosition} name="ثقب أسود / Black Hole" isPlaying={isPlaying} />
      ) : (
        <Planet
          index={-99} // Unique index for central object
          size={1.2}
          color="#4caf50"
          name="الأرض / Earth"
          orbitRadius={0}
          orbitSpeed={0}
          centralMassPosition={centralMassPosition}
          isPlaying={false}
        />
      )}

      {/* Additional Masses */}
      {additionalMasses.map((mass, index) => (
        <AdditionalMass
          key={index}
          position={[mass.x, mass.z]}
          strength={mass.strength}
          name={`جسم إضافي ${index + 1} / Additional Mass ${index + 1}`}
          isPlaying={isPlaying}
        />
      ))}
      
      {/* Orbiting Planets */}
      {visualizationType !== 'blackhole' && Array.from({ length: planetCount }).map((_, i) => {
        const orbitRadius = 3 + i * 2;
        const orbitSpeed = (0.5 / (i + 1)) * timeSpeed;
        const color = planetColors[i % planetColors.length];
        return (
          <Planet 
            key={i}
            index={i}
            size={0.32 + i * 0.12} 
            color={color} 
            name={`${planetNamesAR[i]} / ${planetNamesFR[i]}`}
            orbitRadius={orbitRadius}
            orbitSpeed={orbitSpeed}
            centralMassPosition={centralMassPosition}
            isPlaying={isPlaying}
          />
        );
      })}
      
      {/* Falling Object Demo */}
      {showFallingDemo && (
        <FallingObject
          startPosition={[5, 5, 5]}
          targetPosition={[centralMassPosition[0], centralMassPosition[1] + 0.4, centralMassPosition[2]]}
          isAnimating={showFallingDemo}
          onComplete={handleFallingDemoComplete}
          timeSpeed={timeSpeed}
        />
      )}
      
      {/* Controls */}
      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={28}
        minDistance={3}
        dampingFactor={0.08}
        enableDamping
        target={new THREE.Vector3(...centralMassPosition)}
      />
    </>
  );
};

export default function SpacetimeVisualization({
  showFallingDemo,
  massStrength: initialMassStrength = 2.0,
  planetCount = 2,
  isPlaying = true,
  timeSpeed = 1.0,
  onFallingDemoComplete,
  visualizationType = 'planet',
  gridResolution = 150,
  gridFrequency = 20.0,
  waveAmplitude = 0.1,
  colorScheme = 'default',
  showGrid = true,
  starCount = 6500,
  bloomIntensity = 0.8,
  chromaticAberration = 0.0004,
  additionalMasses = []
}) {
  const centralMassPosition = useMemo(() => [0, -1.5, 0], []);
  const planetColors = useMemo(() => ['#ff9800', '#e91e63', '#2196f3', '#8bc34a', '#ffc107'], []);
  const planetNamesAR = useMemo(() => ['كوكب 1', 'كوكب 2', 'كوكب 3', 'كوكب 4', 'كوكب 5'], []);
  const planetNamesFR = useMemo(() => ['Planète 1', 'Planète 2', 'Planète 3', 'Planète 4', 'Planète 5'], []);

  const massStrength = visualizationType === 'blackhole' ? Math.max(initialMassStrength, 8.0) : initialMassStrength;

  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-indigo-900 via-purple-900 to-black rounded-lg overflow-hidden relative">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 55 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          outputEncoding: THREE.sRGBEncoding
        }}
        shadows
      >
        <Suspense fallback={null}>
          <SpacetimeScene
            showFallingDemo={showFallingDemo}
            massStrength={massStrength}
            planetCount={planetCount}
            isPlaying={isPlaying}
            timeSpeed={timeSpeed}
            onFallingDemoComplete={onFallingDemoComplete}
            centralMassPosition={centralMassPosition}
            planetColors={planetColors}
            planetNamesAR={planetNamesAR}
            planetNamesFR={planetNamesFR}
            visualizationType={visualizationType}
            gridResolution={gridResolution}
            gridFrequency={gridFrequency}
            waveAmplitude={waveAmplitude}
            colorScheme={colorScheme}
            showGrid={showGrid}
            starCount={starCount}
            bloomIntensity={bloomIntensity}
            chromaticAberration={chromaticAberration}
            additionalMasses={additionalMasses}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}