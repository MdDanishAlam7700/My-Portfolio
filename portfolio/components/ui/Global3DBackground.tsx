"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, MeshWobbleMaterial, Float, Stars as DreiStars, Torus } from "@react-three/drei";
import * as THREE from "three";
import { motion, useSpring, useTransform } from "framer-motion";

function ParticleField({ count = 2000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 40;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.02;
      ref.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f0ff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

function AsteroidBelt() {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 0.5;
      const scale = Math.random() * 0.05 + 0.01;
      const speed = Math.random() * 0.2 + 0.1;
      temp.push({ x, y, z, scale, angle, speed, radius });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      particles.forEach((p, i) => {
        p.angle += delta * p.speed * 0.5;
        p.x = Math.cos(p.angle) * p.radius;
        p.z = Math.sin(p.angle) * p.radius;
        
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.rotation.x += delta * p.speed;
        dummy.rotation.y += delta * p.speed;
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.rotation.x = Math.PI / 8; // Tilt the belt
    }
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
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
      </mesh>
      <mesh ref={moon2Ref}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#ff00ea" emissive="#ff00ea" emissiveIntensity={1.5} wireframe />
      </mesh>
    </>
  );
}

function InteractivePlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.15;
    
    // Smooth Mouse Follow with Damping
    const targetX = state.mouse.x * 3;
    const targetY = state.mouse.y * 3;
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
    
    // Rotate the whole system based on mouse
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.5, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.5, 0.05);

    // Parallax on Scroll
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    groupRef.current.position.y -= scrollY * 0.002;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Planet Core */}
        <Sphere ref={meshRef} args={[1.5, 64, 64]} scale={1.2}>
          <meshStandardMaterial
            color="#050505"
            metalness={0.8}
            roughness={0.2}
            emissive="#000000"
          />
        </Sphere>
        
        {/* Wireframe City/Grid on Planet */}
        <Sphere args={[1.51, 32, 32]} scale={1.2}>
          <meshStandardMaterial
            color="#9d00ff"
            wireframe
            transparent
            opacity={0.15}
          />
        </Sphere>

        {/* Atmospheric Wobble */}
        <Sphere args={[1.55, 64, 64]} scale={1.2}>
          <MeshWobbleMaterial
            color="#00f0ff"
            transparent
            opacity={0.15}
            wireframe
            speed={2}
            factor={0.3}
          />
        </Sphere>

        {/* Cyberpunk Planet Rings */}
        <Torus args={[2.5, 0.02, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </Torus>
        <Torus args={[2.8, 0.01, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshStandardMaterial color="#ff00ea" emissive="#ff00ea" emissiveIntensity={1} transparent opacity={0.5} />
        </Torus>

        <OrbitingMoons />
        <AsteroidBelt />
      </Float>
    </group>
  );
}

function CursorGlow() {
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: useTransform(
          [mouseX, mouseY],
          ([x, y]) => `radial-gradient(800px circle at ${x}px ${y}px, rgba(0, 240, 255, 0.08), transparent 60%)`
        )
      }}
    />
  );
}

export default function Global3DBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-black pointer-events-none">
      <CursorGlow />
      
      {/* Background Nebulas */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 10% 20%, rgba(157, 0, 255, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(0, 240, 255, 0.15) 0%, transparent 40%)
          `,
          filter: "blur(60px)"
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={3} color="#00f0ff" />
          <pointLight position={[-10, -10, -10]} intensity={2} color="#ff00ea" />
          <directionalLight position={[0, 5, 5]} intensity={1} color="#ffffff" />
          
          <ParticleField count={3000} />
          <InteractivePlanet />
          
          {/* Deep Starfield */}
          <DreiStars radius={100} depth={50} count={7000} factor={6} saturation={0.5} fade speed={1.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
