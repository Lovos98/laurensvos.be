"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Perlin-like noise using layered sine waves
function noise2D(x: number, y: number, seed: number = 0): number {
  const n = Math.sin(x * 1.2 + seed) * Math.cos(y * 0.9 + seed * 0.7) +
            Math.sin(x * 0.5 + y * 0.8 + seed * 1.3) * 0.5 +
            Math.cos(x * 2.1 - y * 0.3 + seed * 0.4) * 0.25 +
            Math.sin(x * 0.3 - y * 1.1 + seed * 0.9) * 0.35;
  return n / 2.1;
}

function noise3D(x: number, y: number, z: number, seed: number = 0): number {
  return noise2D(x + z * 0.4, y + z * 0.6, seed);
}

// Animated UML Box with strong noise
function UMLBox({
  basePosition,
  width,
  height,
  isInterface = false,
  noiseOffset,
  time,
}: {
  basePosition: [number, number, number];
  width: number;
  height: number;
  isInterface?: boolean;
  noiseOffset: number;
  time: number;
}) {
  const opacity = isInterface ? 0.45 : 0.32;

  // Subtle noise with depth
  const noiseScale = 0.002;
  const noiseAmount = 50;
  const timeScale = 0.12;

  const position: [number, number, number] = [
    basePosition[0] + noise3D(basePosition[0] * noiseScale, basePosition[1] * noiseScale, time * timeScale, noiseOffset) * noiseAmount,
    basePosition[1] + noise3D(basePosition[0] * noiseScale + 100, basePosition[1] * noiseScale + 100, time * timeScale, noiseOffset + 50) * noiseAmount,
    basePosition[2] + noise3D(basePosition[0] * noiseScale + 200, basePosition[1] * noiseScale + 200, time * timeScale, noiseOffset + 100) * noiseAmount * 0.4,
  ];

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={0.55} />
      </mesh>

      <lineSegments position={[0, 0, 0.5]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial color="#d4a855" transparent opacity={opacity} />
      </lineSegments>

      <mesh position={[0, height * 0.22, 1]}>
        <planeGeometry args={[width * 0.9, 2]} />
        <meshBasicMaterial color="#d4a855" transparent opacity={opacity * 0.6} />
      </mesh>

      <mesh position={[0, height * 0.32, 1]}>
        <planeGeometry args={[width * 0.5, height * 0.06]} />
        <meshBasicMaterial color="#d4a855" transparent opacity={opacity * 0.8} />
      </mesh>

      {isInterface && (
        <mesh position={[0, height * 0.38, 1]}>
          <planeGeometry args={[width * 0.3, height * 0.04]} />
          <meshBasicMaterial color="#d4a855" transparent opacity={opacity * 0.5} />
        </mesh>
      )}

      {[0.08, -0.02, -0.12, -0.25, -0.35].map((yOff, i) => (
        <mesh key={i} position={[-width * 0.1, height * yOff, 1]}>
          <planeGeometry args={[width * (0.6 - i * 0.05), height * 0.03]} />
          <meshBasicMaterial color="#d4a855" transparent opacity={opacity * 0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Animated curved connection
function Connection({
  startBase,
  endBase,
  dashed = false,
  noiseOffsetStart,
  noiseOffsetEnd,
  time,
}: {
  startBase: [number, number, number];
  endBase: [number, number, number];
  dashed?: boolean;
  noiseOffsetStart: number;
  noiseOffsetEnd: number;
  time: number;
}) {
  const noiseScale = 0.002;
  const noiseAmount = 50;
  const timeScale = 0.12;

  const start: [number, number, number] = [
    startBase[0] + noise3D(startBase[0] * noiseScale, startBase[1] * noiseScale, time * timeScale, noiseOffsetStart) * noiseAmount,
    startBase[1] + noise3D(startBase[0] * noiseScale + 100, startBase[1] * noiseScale + 100, time * timeScale, noiseOffsetStart + 50) * noiseAmount,
    startBase[2] + noise3D(startBase[0] * noiseScale + 200, startBase[1] * noiseScale + 200, time * timeScale, noiseOffsetStart + 100) * noiseAmount * 0.4,
  ];

  const end: [number, number, number] = [
    endBase[0] + noise3D(endBase[0] * noiseScale, endBase[1] * noiseScale, time * timeScale, noiseOffsetEnd) * noiseAmount,
    endBase[1] + noise3D(endBase[0] * noiseScale + 100, endBase[1] * noiseScale + 100, time * timeScale, noiseOffsetEnd + 50) * noiseAmount,
    endBase[2] + noise3D(endBase[0] * noiseScale + 200, endBase[1] * noiseScale + 200, time * timeScale, noiseOffsetEnd + 100) * noiseAmount * 0.4,
  ];

  const { points, arrowAngle } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);

    const midY = (s.y + e.y) / 2;
    const midZ = (s.z + e.z) / 2;
    const c1 = new THREE.Vector3(s.x, s.y - Math.abs(s.y - midY) * 0.6, s.z + (midZ - s.z) * 0.3);
    const c2 = new THREE.Vector3(e.x, e.y + Math.abs(e.y - midY) * 0.6, e.z - (e.z - midZ) * 0.3);

    const curve = new THREE.CubicBezierCurve3(s, c1, c2, e);
    const pts = curve.getPoints(40);
    const tangent = curve.getTangent(1);

    return { points: pts, arrowAngle: Math.atan2(tangent.y, tangent.x) };
  }, [start[0], start[1], start[2], end[0], end[1], end[2]]);

  const geometry = useMemo(() => {
    if (dashed) {
      const dashedPts: THREE.Vector3[] = [];
      for (let i = 0; i < points.length; i++) {
        if (Math.floor(i / 4) % 2 === 0) dashedPts.push(points[i]);
      }
      return new THREE.BufferGeometry().setFromPoints(dashedPts);
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points, dashed]);

  return (
    <group>
      <line geometry={geometry}>
        <lineBasicMaterial color="#d4a855" transparent opacity={dashed ? 0.18 : 0.12} />
      </line>
      <mesh position={end} rotation={[0, 0, arrowAngle - Math.PI / 2]}>
        <coneGeometry args={[6, 12, 3]} />
        <meshBasicMaterial color="#d4a855" transparent opacity={0.18} wireframe={dashed} />
      </mesh>
    </group>
  );
}

// All nodes in a single flat structure - no pattern grouping
interface NodeDef {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  isInterface: boolean;
  id: number;
}

interface ConnectionDef {
  from: number;
  to: number;
  dashed: boolean;
}

// Create all nodes spread organically across the space
function createNodes(): { nodes: NodeDef[]; connections: ConnectionDef[] } {
  const nodes: NodeDef[] = [];
  const connections: ConnectionDef[] = [];
  let id = 0;

  const scale = 50; // Bigger spacing between nodes

  // Cluster 1 - Factory-ish (top left area) - pushed back
  const c1x = -900, c1y = 600, c1z = -30;
  nodes.push({ x: c1x, y: c1y + 5 * scale, z: c1z, w: 5, h: 3, isInterface: true, id: id++ });
  nodes.push({ x: c1x - 5 * scale, y: c1y, z: c1z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  nodes.push({ x: c1x + 5 * scale, y: c1y - 1 * scale, z: c1z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  nodes.push({ x: c1x - 7 * scale, y: c1y - 6 * scale, z: c1z, w: 4, h: 2.5, isInterface: true, id: id++ });
  nodes.push({ x: c1x - 2 * scale, y: c1y - 7 * scale, z: c1z, w: 4, h: 2.5, isInterface: false, id: id++ });
  nodes.push({ x: c1x + 6 * scale, y: c1y - 8 * scale, z: c1z, w: 4, h: 2.5, isInterface: false, id: id++ });
  connections.push({ from: 0, to: 1, dashed: true }, { from: 0, to: 2, dashed: true });
  connections.push({ from: 1, to: 3, dashed: false }, { from: 1, to: 4, dashed: false });
  connections.push({ from: 2, to: 5, dashed: false });

  // Cluster 2 - Observer-ish (right area) - pushed forward
  const c2x = 700, c2y = 400, c2z = 25;
  nodes.push({ x: c2x, y: c2y + 4 * scale, z: c2z, w: 5, h: 3, isInterface: true, id: id++ });
  nodes.push({ x: c2x - 6 * scale, y: c2y - 1 * scale, z: c2z, w: 4.5, h: 3, isInterface: false, id: id++ });
  nodes.push({ x: c2x + 4 * scale, y: c2y, z: c2z, w: 4.5, h: 2.8, isInterface: true, id: id++ });
  nodes.push({ x: c2x + 2 * scale, y: c2y - 6 * scale, z: c2z, w: 4, h: 2.5, isInterface: false, id: id++ });
  nodes.push({ x: c2x + 8 * scale, y: c2y - 5 * scale, z: c2z, w: 4, h: 2.5, isInterface: false, id: id++ });
  connections.push({ from: 6, to: 7, dashed: false }, { from: 6, to: 8, dashed: true });
  connections.push({ from: 8, to: 9, dashed: false }, { from: 8, to: 10, dashed: false });

  // Cluster 3 - Strategy-ish (center) - neutral depth
  const c3x = -100, c3y = -200, c3z = 0;
  nodes.push({ x: c3x, y: c3y + 5 * scale, z: c3z, w: 5, h: 3, isInterface: false, id: id++ });
  nodes.push({ x: c3x + 2 * scale, y: c3y, z: c3z, w: 5, h: 2.8, isInterface: true, id: id++ });
  nodes.push({ x: c3x - 5 * scale, y: c3y - 5 * scale, z: c3z, w: 4, h: 2.5, isInterface: false, id: id++ });
  nodes.push({ x: c3x + 1 * scale, y: c3y - 6 * scale, z: c3z, w: 4, h: 2.5, isInterface: false, id: id++ });
  nodes.push({ x: c3x + 7 * scale, y: c3y - 5 * scale, z: c3z, w: 4, h: 2.5, isInterface: false, id: id++ });
  connections.push({ from: 11, to: 12, dashed: true });
  connections.push({ from: 12, to: 13, dashed: false }, { from: 12, to: 14, dashed: false }, { from: 12, to: 15, dashed: false });

  // Cluster 4 - Decorator-ish (bottom left) - pushed far back
  const c4x = -600, c4y = -500, c4z = -50;
  nodes.push({ x: c4x, y: c4y + 4 * scale, z: c4z, w: 5, h: 3, isInterface: true, id: id++ });
  nodes.push({ x: c4x - 5 * scale, y: c4y - 1 * scale, z: c4z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  nodes.push({ x: c4x + 5 * scale, y: c4y, z: c4z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  nodes.push({ x: c4x + 3 * scale, y: c4y - 6 * scale, z: c4z, w: 4, h: 2.5, isInterface: false, id: id++ });
  nodes.push({ x: c4x + 9 * scale, y: c4y - 5 * scale, z: c4z, w: 4, h: 2.5, isInterface: false, id: id++ });
  connections.push({ from: 16, to: 17, dashed: false }, { from: 16, to: 18, dashed: false });
  connections.push({ from: 18, to: 19, dashed: false }, { from: 18, to: 20, dashed: false });

  // Cluster 5 - Builder-ish (top right) - pushed forward
  const c5x = 500, c5y = -100, c5z = 40;
  nodes.push({ x: c5x - 2 * scale, y: c5y + 5 * scale, z: c5z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  nodes.push({ x: c5x, y: c5y + 1 * scale, z: c5z, w: 5, h: 3, isInterface: true, id: id++ });
  nodes.push({ x: c5x - 6 * scale, y: c5y - 4 * scale, z: c5z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  nodes.push({ x: c5x + 5 * scale, y: c5y - 5 * scale, z: c5z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  connections.push({ from: 21, to: 22, dashed: true });
  connections.push({ from: 22, to: 23, dashed: false }, { from: 22, to: 24, dashed: false });

  // Cluster 6 - Adapter-ish (bottom right) - pushed back
  const c6x = 400, c6y = -700, c6z = -25;
  nodes.push({ x: c6x - 4 * scale, y: c6y + 3 * scale, z: c6z, w: 4.5, h: 2.8, isInterface: true, id: id++ });
  nodes.push({ x: c6x - 4 * scale, y: c6y - 2 * scale, z: c6z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  nodes.push({ x: c6x + 5 * scale, y: c6y - 1 * scale, z: c6z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  connections.push({ from: 25, to: 26, dashed: false }, { from: 26, to: 27, dashed: true });

  // Cluster 7 - Singleton-ish (far top) - pushed far forward
  const c7x = -200, c7y = 800, c7z = 50;
  nodes.push({ x: c7x, y: c7y, z: c7z, w: 5.5, h: 4, isInterface: false, id: id++ });

  // Cluster 8 - Facade-ish (far left) - neutral depth
  const c8x = -1200, c8y = -100, c8z = 10;
  nodes.push({ x: c8x, y: c8y + 4 * scale, z: c8z, w: 5.5, h: 3.5, isInterface: false, id: id++ });
  nodes.push({ x: c8x - 5 * scale, y: c8y - 2 * scale, z: c8z, w: 4, h: 2.5, isInterface: false, id: id++ });
  nodes.push({ x: c8x, y: c8y - 3 * scale, z: c8z, w: 4, h: 2.5, isInterface: false, id: id++ });
  nodes.push({ x: c8x + 5 * scale, y: c8y - 2 * scale, z: c8z, w: 4, h: 2.5, isInterface: false, id: id++ });
  connections.push({ from: 29, to: 30, dashed: true }, { from: 29, to: 31, dashed: true }, { from: 29, to: 32, dashed: true });

  // Cluster 9 - Composite-ish (bottom center) - pushed far back
  const c9x = -50, c9y = -900, c9z = -45;
  nodes.push({ x: c9x, y: c9y + 5 * scale, z: c9z, w: 5, h: 3, isInterface: true, id: id++ });
  nodes.push({ x: c9x - 6 * scale, y: c9y, z: c9z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  nodes.push({ x: c9x + 6 * scale, y: c9y - 1 * scale, z: c9z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  connections.push({ from: 33, to: 34, dashed: false }, { from: 33, to: 35, dashed: false });

  // Cluster 10 - Proxy-ish (far right) - pushed forward
  const c10x = 1000, c10y = -400, c10z = 35;
  nodes.push({ x: c10x, y: c10y + 5 * scale, z: c10z, w: 5, h: 3, isInterface: true, id: id++ });
  nodes.push({ x: c10x - 5 * scale, y: c10y, z: c10z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  nodes.push({ x: c10x + 5 * scale, y: c10y - 1 * scale, z: c10z, w: 4.5, h: 2.8, isInterface: false, id: id++ });
  connections.push({ from: 36, to: 37, dashed: false }, { from: 36, to: 38, dashed: false });
  connections.push({ from: 38, to: 37, dashed: true });

  // Inter-cluster connections
  connections.push({ from: 2, to: 6, dashed: true });   // Cluster 1 to 2
  connections.push({ from: 5, to: 11, dashed: true });  // Cluster 1 to 3
  connections.push({ from: 10, to: 21, dashed: true }); // Cluster 2 to 5
  connections.push({ from: 15, to: 19, dashed: true }); // Cluster 3 to 4
  connections.push({ from: 24, to: 27, dashed: true }); // Cluster 5 to 6
  connections.push({ from: 17, to: 30, dashed: true }); // Cluster 4 to 8
  connections.push({ from: 20, to: 33, dashed: true }); // Cluster 4 to 9
  connections.push({ from: 27, to: 36, dashed: true }); // Cluster 6 to 10
  connections.push({ from: 28, to: 0, dashed: true });  // Singleton to Factory
  connections.push({ from: 35, to: 26, dashed: true }); // Cluster 9 to 6

  return { nodes, connections };
}

const { nodes: allNodes, connections: allConnections } = createNodes();

// Main Scene
function UMLScene() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.x = -0.05 + Math.sin(state.clock.elapsedTime * 0.006) * 0.004;
    }
  });

  const scale = 50;

  return (
    <group ref={groupRef}>
      {allNodes.map((node, i) => (
        <UMLBox
          key={i}
          basePosition={[node.x, node.y, node.z]}
          width={node.w * scale}
          height={node.h * scale}
          isInterface={node.isInterface}
          noiseOffset={i * 137}
          time={timeRef.current}
        />
      ))}
      {allConnections.map((conn, i) => {
        const fromNode = allNodes[conn.from];
        const toNode = allNodes[conn.to];
        return (
          <Connection
            key={i}
            startBase={[fromNode.x, fromNode.y - fromNode.h * scale / 2, fromNode.z + 2]}
            endBase={[toNode.x, toNode.y + toNode.h * scale / 2, toNode.z + 2]}
            dashed={conn.dashed}
            noiseOffsetStart={conn.from * 137}
            noiseOffsetEnd={conn.to * 137}
            time={timeRef.current}
          />
        );
      })}
    </group>
  );
}

// Camera - Lissajous curve panning
function CameraController() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Lissajous curve: x = sin(at), y = cos(bt) with different frequency ratios
    const freqX = 0.03;
    const freqY = 0.02;
    const phase = Math.PI / 4;

    camera.position.x = Math.sin(t * freqX + phase) * 900;
    camera.position.y = Math.cos(t * freqY) * 600;
    camera.position.z = 900;

    // Look at center with slight offset following camera
    camera.lookAt(
      Math.sin(t * freqX + phase) * 150,
      Math.cos(t * freqY) * 100,
      0
    );
  });

  return null;
}

export default function MeshBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 900], fov: 50, near: 1, far: 5000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CameraController />
        <UMLScene />
      </Canvas>
    </div>
  );
}
