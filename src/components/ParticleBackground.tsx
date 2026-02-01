"use client";

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <iframe
        src="/particle-background.html"
        className="w-full h-full border-0"
        style={{
          pointerEvents: "none",
          background: "transparent",
        }}
        title="Particle Background"
      />
    </div>
  );
}
