"use client";

import Global3DBackground from "./Global3DBackground";
import ParticleBackground from "./ParticleBackground";

export default function BackgroundWrapper() {
  return (
    <>
      <Global3DBackground />
      <ParticleBackground />
    </>
  );
}
