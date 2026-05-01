"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, motion, useTransform, useSpring } from "framer-motion";

function StarField({ count = 1500 }) {
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
  const { scrollYProgress } = useScroll();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
      
      // Vertical drift based on scroll
      const scrollY = scrollYProgress.get();
      ref.current.position.y = -scrollY * 10;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f0ff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

function FloatingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax values
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -20]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.rotation.z = time * 0.05;
      
      // Subtle mouse follow
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, state.mouse.x * 2, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, (state.mouse.y * 2) + yPos.get(), 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[4, 100, 100]} position={[10, 0, -15]}>
        <MeshDistortMaterial
          color="#050505"
          speed={3}
          distort={0.4}
          radius={1}
          metalness={1}
          roughness={0}
          emissive="#00f0ff"
          emissiveIntensity={0.15}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
}

function CursorAura() {
  const springX = useSpring(0, { stiffness: 40, damping: 25 });
  const springY = useSpring(0, { stiffness: 40, damping: 25 });

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
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: useTransform(
          [springX, springY],
          ([x, y]) => `radial-gradient(800px circle at ${x}px ${y}px, rgba(0, 240, 255, 0.03), transparent 80%)`
        )
      }}
    />
  );
}

export default function NextLevelBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-black pointer-events-none overflow-hidden">
      {/* 1. Deep Base Layer */}
      <div className="absolute inset-0 bg-black" />

      {/* 2. Interactive Cursor Aura */}
      <CursorAura />

      {/* 3. Global Mesh Gradients */}
      <div 
        className="absolute inset-0 opacity-[0.2]"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, var(--color-neon-blue) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, var(--color-neon-purple) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, var(--color-neon-pink) 0%, transparent 30%)
          `,
          filter: "blur(120px)"
        }}
      />

      {/* 4. Three.js Layer (Starfield + Floating Core) */}
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <StarField count={isMobile ? 500 : 2000} />
          {!isMobile && <FloatingCore />}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
        </Suspense>
      </Canvas>

      {/* 5. Cybernetic Perspective Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(800px) rotateX(60deg) translateY(300px) scale(2)",
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, black, transparent 80%)"
        }}
      />

      {/* 6. Static Noise/Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150" />
      
      {/* 7. Dark Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]" />
    </div>
  );
}
