"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

export default function Planet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.15;
      
      // Mouse Interaction
      const targetRotationX = (state.mouse.y * Math.PI) / 10;
      const targetRotationY = (state.mouse.x * Math.PI) / 10;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY + (time * 0.1), 0.05);
    }
    
    if (glowRef.current) {
      const time = state.clock.getElapsedTime();
      glowRef.current.scale.setScalar(1.1 + Math.sin(time * 2) * 0.02);
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Core Planet */}
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.4}>
          <MeshDistortMaterial
            color="#050505"
            speed={2}
            distort={0.2}
            radius={1}
            metalness={1}
            roughness={0.1}
            emissive="#00f0ff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.9}
          />
        </Sphere>
        
        {/* Atmospheric Glow Shell */}
        <Sphere ref={glowRef} args={[1, 32, 32]} scale={2.6}>
          <meshBasicMaterial 
            color="#00f0ff" 
            wireframe 
            transparent 
            opacity={0.05} 
            side={THREE.DoubleSide}
          />
        </Sphere>

        {/* Outer Rim Light */}
        <Sphere args={[1, 32, 32]} scale={2.45}>
          <meshPhongMaterial
            color="#00f0ff"
            transparent
            opacity={0.1}
            shininess={100}
            specular="#ffffff"
            emissive="#00f0ff"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>

      {/* Internal Core Glow */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#00f0ff" distance={5} />
    </group>
  );
}
