"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, MeshWobbleMaterial, Float, Stars as DreiStars, Torus } from "@react-three/drei";
import * as THREE from "three";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

function ParticleField({ count = 1500 }) {
  const [points] = useState(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 40;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  });

  const ref = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.015;
      ref.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f0ff"
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.25}
      />
    </Points>
  );
}

const dummy = new THREE.Object3D();

function AsteroidBelt() {
  const count = 200; // Reduced for performance
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particlesRef = useRef<Array<{radius: number, angle: number, y: number, scale: number, speed: number}>>([]);

  useEffect(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        radius: 4 + Math.random() * 2,
        angle: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * 0.5,
        scale: Math.random() * 0.04 + 0.01,
        speed: Math.random() * 0.15 + 0.05,
      });
    }
    particlesRef.current = temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current || particlesRef.current.length === 0) return;
    
    for (let i = 0; i < count; i++) {
      const p = particlesRef.current[i];
      p.angle += delta * p.speed * 0.4;
      const x = Math.cos(p.angle) * p.radius;
      const z = Math.sin(p.angle) * p.radius;
      
      dummy.position.set(x, p.y, z);
      dummy.scale.setScalar(p.scale);
      dummy.rotation.x += delta * p.speed;
      dummy.rotation.y += delta * p.speed;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.rotation.x = Math.PI / 8;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#9d00ff" emissive="#9d00ff" emissiveIntensity={0.5} wireframe />
    </instancedMesh>
  );
}

function OrbitingMoons() {
  const moon1Ref = useRef<THREE.Mesh>(null);
  const moon2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (moon1Ref.current) {
      moon1Ref.current.position.x = Math.cos(time * 0.8) * 3;
      moon1Ref.current.position.z = Math.sin(time * 0.8) * 3;
      moon1Ref.current.position.y = Math.sin(time * 1.5) * 0.5;
    }
    if (moon2Ref.current) {
      moon2Ref.current.position.x = Math.cos(time * 0.5 + Math.PI) * 4.5;
      moon2Ref.current.position.z = Math.sin(time * 0.5 + Math.PI) * 4.5;
      moon2Ref.current.position.y = Math.cos(time * 1.2) * 1;
    }
  });

  return (
    <>
      <mesh ref={moon1Ref}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} />
      </mesh>
      <mesh ref={moon2Ref}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ff00ea" emissive="#ff00ea" emissiveIntensity={1.5} wireframe />
      </mesh>
    </>
  );
}

function InteractivePlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.15;
    
    // Smooth Mouse Follow with Damping
    const targetX = state.mouse.x * 1.5;
    const targetY = state.mouse.y * 1.5;
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
    
    // Fix Parallax Bug: Use absolute scroll position with a dampener, not incremental subtraction
    const parallaxOffset = -scrollY * 0.0015;
    const baseTargetY = targetY + parallaxOffset;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, baseTargetY, 0.05);
    
    // Rotate the whole system based on mouse
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.2, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.2, 0.05);
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        {/* Planet Core - Reduced segments for performance */}
        <Sphere ref={meshRef} args={[1.5, 32, 32]} scale={1.2}>
          <meshStandardMaterial
            color="#111111"
            metalness={0.9}
            roughness={0.1}
            emissive="#00f0ff"
            emissiveIntensity={0.15}
          />
        </Sphere>
        
        {/* Wireframe Grid */}
        <Sphere args={[1.51, 24, 24]} scale={1.2}>
          <meshStandardMaterial
            color="#9d00ff"
            wireframe
            transparent
            opacity={0.1}
          />
        </Sphere>

        {/* Atmospheric Wobble */}
        <Sphere args={[1.55, 32, 32]} scale={1.2}>
          <MeshWobbleMaterial
            color="#00f0ff"
            transparent
            opacity={0.12}
            wireframe
            speed={1.5}
            factor={0.2}
          />
        </Sphere>

        {/* Cyberpunk Planet Rings */}
        <Torus args={[2.5, 0.015, 8, 64]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </Torus>
        <Torus args={[2.8, 0.008, 8, 64]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshStandardMaterial color="#ff00ea" emissive="#ff00ea" emissiveIntensity={1} transparent opacity={0.4} />
        </Torus>

        <OrbitingMoons />
        <AsteroidBelt />
      </Float>
    </group>
  );
}

function CursorGlow() {
  const [moved, setMoved] = useState(false);
  const cursorX = useMotionValue(-1000); // Start off-screen
  const cursorY = useMotionValue(-1000);
  const smoothX = useSpring(cursorX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(cursorY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!moved) setMoved(true);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [cursorX, cursorY, moved]);

  if (!moved) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-0 pointer-events-none w-[800px] h-[800px] rounded-full"
      style={{ 
        x: smoothX, 
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle at center, rgba(0, 240, 255, 0.06) 0%, transparent 60%)"
      }}
    />
  );
}

export default function Global3DBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-black pointer-events-none overflow-hidden">
      <CursorGlow />
      
      {/* Background Nebulas */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 15% 25%, rgba(157, 0, 255, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(0, 240, 255, 0.12) 0%, transparent 45%)
          `,
          filter: "blur(80px)"
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance", 
          alpha: true,
          stencil: false,
          depth: true
        }}
        dpr={[1, 1.5]} // Capped for performance
        shadows={false}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
          <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ff00ea" />
          
          <ParticleField count={1200} />
          <InteractivePlanet />
          
          {/* Deep Starfield */}
          <DreiStars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}

