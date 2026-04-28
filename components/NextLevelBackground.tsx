"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo, useEffect, useState } from "react";

// ⭐ PARTICLES
function Stars() {
  const ref = useRef<any>();

  const positions = useMemo(() => {
    const arr = new Float32Array(5000);
    for (let i = 0; i < 5000; i++) {
      arr[i] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0005;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#00f0ff"
        size={0.01}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

// 🪐 PLANET
function Planet() {
  const mesh = useRef<any>();

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += 0.002;
    mesh.current.rotation.x = state.mouse.y * 0.3;
  });

  return (
    <Sphere ref={mesh} args={[1, 128, 128]} scale={2.5}>
      <MeshDistortMaterial
        color="#9d00ff"
        emissive="#00f0ff"
        emissiveIntensity={1.5}
        distort={0.4}
        speed={2}
        roughness={0}
      />
    </Sphere>
  );
}

// 🎯 CURSOR GLOW
function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: any) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x - 150,
        top: pos.y - 150,
        width: 300,
        height: 300,
        background: "radial-gradient(circle, rgba(0,240,255,0.2), transparent 60%)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

// 🖱 CUSTOM CURSOR
function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: any) => {
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

// 🌌 MAIN BACKGROUND
export default function NextLevelBackground() {
  return (
    <>
      {/* Glow following cursor */}
      <CursorGlow />

      {/* Custom cursor */}
      <CustomCursor />

      {/* 3D Scene */}
      <div className="fixed inset-0 -z-10 bg-black">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <Stars />
          <Planet />
        </Canvas>
      </div>
    </>
  );
}
