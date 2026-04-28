"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, motion, useSpring, useTransform } from "framer-motion";

function Particles({ count = 2000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  const { scrollYProgress } = useScroll();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.03;
      ref.current.rotation.x += delta * 0.01;
      const scrollY = scrollYProgress.get();
      ref.current.position.y = -scrollY * 5;
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
        opacity={0.25}
      />
    </Points>
  );
}

function GlobalPlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -15]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.1;
      
      // Mouse Parallax
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, state.mouse.x * 2, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, (state.mouse.y * 2) + yPos.get(), 0.05);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[3, 64, 64]} position={[8, 0, -10]}>
        <MeshDistortMaterial
          color="#111"
          speed={2}
          distort={0.3}
          radius={1}
          metalness={0.9}
          roughness={0.1}
          emissive="#00f0ff"
          emissiveIntensity={0.1}
          transparent
          opacity={0.4}
        />
      </Sphere>
      {/* Outer Glow Shell */}
      <Sphere args={[3.2, 32, 32]} position={[8, 0, -10]}>
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.03} />
      </Sphere>
    </Float>
  );
}

function CursorGlow() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const springX = useSpring(0, { stiffness: 50, damping: 20 });
  const springY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [springX, springY]);

  return (
    <motion.div 
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
      style={{
        background: useTransform(
          [springX, springY],
          ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(0, 240, 255, 0.05), transparent 80%)`
        )
      }}
    />
  );
}

export default function GlobalBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-black overflow-hidden pointer-events-none">
      {/* Ambient Gradient Mesh */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          background: `
            radial-gradient(circle at 10% 10%, var(--color-neon-blue) 0%, transparent 40%),
            radial-gradient(circle at 90% 90%, var(--color-neon-purple) 0%, transparent 40%),
            radial-gradient(circle at 50% 10%, var(--color-neon-pink) 0%, transparent 30%)
          `,
          filter: "blur(140px)"
        }}
      />

      <CursorGlow />

      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Particles count={isMobile ? 600 : 2500} />
          {!isMobile && <GlobalPlanet />}
        </Suspense>
      </Canvas>

      {/* Grid Floor */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          transform: "perspective(1000px) rotateX(60deg) translateY(200px) scale(2.5)",
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, black 20%, transparent 80%)"
        }}
      />
      
      {/* Heavy Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
