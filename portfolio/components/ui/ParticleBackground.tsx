"use client";

import { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 3000;

  const [[positions, colors]] = useState(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Alternate between neon blue and neon purple
      const t = Math.random();
      if (t < 0.6) {
        // neon blue #00d4ff
        col[i * 3] = 0;
        col[i * 3 + 1] = 0.83;
        col[i * 3 + 2] = 1;
      } else {
        // neon purple #a855f7
        col[i * 3] = 0.66;
        col[i * 3 + 1] = 0.33;
        col[i * 3 + 2] = 0.97;
      }
    }
    return [pos, col];
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.04;
    meshRef.current.rotation.x = t * 0.02;

    // Smooth, game-like mouse parallax using lerp
    const mouseX = (state.mouse.x * Math.PI) / 10;
    const mouseY = (state.mouse.y * Math.PI) / 10;
    
    // Add an extra layer to the overall rotation
    meshRef.current.rotation.y += THREE.MathUtils.lerp(0, mouseX, 0.1);
    meshRef.current.rotation.x += THREE.MathUtils.lerp(0, -mouseY, 0.1);
    
    // Slight camera movement
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 2, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.z = t * 0.15;
    ref.current.position.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <torusGeometry args={[3, 0.015, 16, 200]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.25} />
    </mesh>
  );
}

function FloatingRing2() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.2;
    ref.current.rotation.z = t * 0.1 + 1;
    ref.current.position.y = Math.cos(t * 0.4) * 0.4;
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <torusGeometry args={[4.5, 0.01, 16, 200]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.2} />
    </mesh>
  );
}

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 bg-black pointer-events-none overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 15% 25%, rgba(157, 0, 255, 0.12) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(0, 240, 255, 0.12) 0%, transparent 45%)`,
          filter: "blur(80px)"
        }}
      />
      <Canvas
        dpr={1}
        performance={{ min: 0.5 }}
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <ParticleField />
          <FloatingRing />
          <FloatingRing2 />
        </Suspense>
      </Canvas>
    </div>
  );
}
