"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";

function AnimatedSphere({ 
  radius = 1, 
  widthSegments = 64, 
  heightSegments = 64, 
  scale = 2.5,
  color = "#00f0ff",
  emissive = "#00f0ff",
  emissiveIntensity = 1.5,
  distort = 0.4,
  speed = 2,
  roughness = 0 
}) {
  const mesh = useRef();

  useFrame((state) => {
    if (!mesh.current) return;

    // slow rotation
    mesh.current.rotation.y += 0.002;

    // mouse interaction with smoothing
    mesh.current.rotation.x = state.mouse.y * 0.3;
    mesh.current.rotation.y += state.mouse.x * 0.002;
  });

  return (
    <Sphere ref={mesh} args={[radius, widthSegments, heightSegments]} scale={scale}>
      <MeshDistortMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        attach="material"
        distort={distort}
        speed={speed}
        roughness={roughness}
      />
    </Sphere>
  );
}

export default function Planet() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5] }} style={{ zIndex: -1 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <AnimatedSphere 
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1.5}
        />
      </Canvas>
    </div>
  );
}