"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text, Float } from "@react-three/drei";
import * as THREE from "three";

// Tech items with colors
const techItems = [
  { name: "C#", color: "#68217a" },
  { name: "Python", color: "#3776ab" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#ffffff" },
  { name: ".NET", color: "#512bd4" },
  { name: "Docker", color: "#2496ed" },
  { name: "Git", color: "#f05032" },
];

function TechCube({ position, tech, isActive, onClick }: {
  position: [number, number, number];
  tech: { name: string; color: string };
  isActive: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Gentle floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    // Slow rotation
    meshRef.current.rotation.y += 0.005;
    if (isActive) {
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        <RoundedBox
          ref={meshRef}
          args={[1, 1, 1]}
          radius={0.1}
          smoothness={4}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={hovered || isActive ? tech.color : "#1a1a1a"}
            emissive={tech.color}
            emissiveIntensity={hovered || isActive ? 0.5 : 0.1}
            metalness={0.8}
            roughness={0.2}
          />
        </RoundedBox>
        {/* Tech name floating above */}
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.25}
          color={hovered || isActive ? tech.color : "#666666"}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-medium.woff"
        >
          {tech.name}
        </Text>
        {/* Glow effect when active */}
        {(hovered || isActive) && (
          <pointLight
            position={[0, 0, 0]}
            color={tech.color}
            intensity={2}
            distance={3}
          />
        )}
      </group>
    </Float>
  );
}

function Scene() {
  const [activeTech, setActiveTech] = useState<number | null>(null);

  // Arrange cubes in a grid
  const positions: [number, number, number][] = [
    [-2.5, 0.5, 0],
    [-0.8, 0.5, 0],
    [0.8, 0.5, 0],
    [2.5, 0.5, 0],
    [-2.5, -1, 0],
    [-0.8, -1, 0],
    [0.8, -1, 0],
    [2.5, -1, 0],
  ];

  return (
    <>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4a855" />

      {/* Tech cubes */}
      {techItems.map((tech, i) => (
        <TechCube
          key={tech.name}
          position={positions[i]}
          tech={tech}
          isActive={activeTech === i}
          onClick={() => setActiveTech(activeTech === i ? null : i)}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function TechStack3D() {
  return (
    <div className="relative w-full h-[500px] rounded-2xl border border-border bg-bg-node/30 backdrop-blur-sm overflow-hidden">
      {/* Gradient overlay at edges */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bg-primary/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg-primary/80 to-transparent" />
      </div>

      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-text-tertiary">Loading 3D scene...</div>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-text-tertiary z-20">
        Drag to rotate • Click cubes to highlight
      </div>
    </div>
  );
}
