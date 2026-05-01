"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshWobbleMaterial, Points, PointMaterial, Float } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense } from "react";

/* ================= PARTICLES ================= */
function Stars() {
  const ref = useRef<THREE.Points>(null);

  const [positions] = useState(() => {
    const arr = new Float32Array(6000);
    for (let i = 0; i < 6000; i++) {
      arr[i] = (Math.random() - 0.5) * 30;
    }
    return arr;
  });

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0001;
      ref.current.rotation.x += 0.00005;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#00f0ff"
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

/* ================= PLANET ================= */
function Planet() {
  const mesh = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!mesh.current || !group.current) return;

    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.1;
    
    // Smooth Scroll Parallax (Vertical Base Offset)
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollTargetY = -scrollY * 0.002;
    
    // Interactive Mouse Follow (Direct tracking with damping)
    const targetX = state.mouse.x * 4;
    const targetY = (state.mouse.y * 2) + scrollTargetY;
    
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.05);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.05);
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Main Planet */}
        <Sphere ref={mesh} args={[1, 64, 64]} scale={2}>
          <MeshWobbleMaterial
            color="#8a2be2" // Brighter Blue-Violet
            emissive="#4b0082" // Dark Indigo Emissive
            emissiveIntensity={0.5}
            factor={0.4} // Wobble factor
            speed={1} 
            roughness={0.1}
            metalness={0.9}
          />
        </Sphere>

        {/* Atmosphere / Glow Shell */}
        <Sphere args={[1.05, 64, 64]} scale={2}>
          <meshStandardMaterial
            color="#00f0ff"
            transparent
            opacity={0.05}
            wireframe
          />
        </Sphere>

        {/* Orbiting Moon 1 (Cyan) */}
        <mesh position={[3, 1, -2]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </mesh>

        {/* Orbiting Moon 2 (Pink) */}
        <mesh position={[-2.5, -1.5, 1.5]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="#ff00ea" emissive="#ff00ea" emissiveIntensity={2} />
        </mesh>
      </Float>
    </group>
  );
}

/* ================= CURSOR GLOW ================= */
function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-1"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(0, 240, 255, 0.06), transparent 80%)`,
      }}
    />
  );
}

/* ================= CUSTOM CURSOR ================= */
function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x - 6,
        top: pos.y - 6,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "#00f0ff",
        boxShadow: "0 0 20px #00f0ff, 0 0 40px #00f0ff",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

/* ================= GLOBAL BACKGROUND ================= */
export default function EliteUI() {
  return (
    <>
      <CursorGlow />
      <CustomCursor />

      <div className="fixed inset-0 z-[-1] bg-black pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
            <pointLight position={[-10, -10, 10]} intensity={0.5} color="#00f0ff" />
            <Stars />
            <Planet />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
