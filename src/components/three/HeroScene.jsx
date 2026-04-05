import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Text3D, Center, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/** Animated glowing sphere representing a station globe */
function StationGlobe() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <MeshDistortMaterial
          color="#f97316"
          emissive="#7c2d12"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
          distort={0.35}
          speed={2}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Inner glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.04, 8, 120]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0.5, 0]}>
        <torusGeometry args={[2.5, 0.02, 8, 120]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

/** Floating luggage boxes */
function LuggageBox({ position, scale = 1, speed = 1 }) {
  const meshRef = useRef();
  const color = useMemo(
    () => ['#f97316', '#f59e0b', '#c2410c', '#ea580c'][Math.floor(Math.random() * 4)],
    []
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * speed * 0.3;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * speed * 0.2) * 0.2;
      meshRef.current.position.y =
        position[1] + Math.sin(clock.getElapsedTime() * speed * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[0.6, 0.8, 0.4]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

/** Particle field — floating dots */
function Particles({ count = 120 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  const pointsRef = useRef();
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f97316"
        size={0.06}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/** Main exported Canvas scene */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]} // cap pixel ratio for performance
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#f97316" />
        <pointLight position={[-5, -3, -5]} intensity={0.8} color="#f59e0b" />
        <spotLight position={[0, 8, 0]} angle={0.4} intensity={1} color="#fff" />

        {/* Scene elements */}
        <Stars radius={60} depth={50} count={800} factor={3} fade />
        <StationGlobe />
        <Particles count={100} />

        {/* Floating luggage */}
        <LuggageBox position={[-3.5, 1, 1]} scale={0.9} speed={0.8} />
        <LuggageBox position={[3.5, -1, 0.5]} scale={1.1} speed={1.2} />
        <LuggageBox position={[-2, -2, -1]} scale={0.7} speed={0.6} />
        <LuggageBox position={[2.5, 2, -1]} scale={0.8} speed={1.0} />
      </Canvas>
    </div>
  );
}