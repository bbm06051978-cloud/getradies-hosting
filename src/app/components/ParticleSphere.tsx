"use client";

import { useEffect, useRef } from "react";

export function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 220;
    const H = 220;
    canvas.width = W;
    canvas.height = H;
    const cx = W / 2;
    const cy = H / 2;
    const R = 85; // sphere radius

    // Generate particles on sphere surface using Fibonacci lattice
    const COUNT = 180;
    type Particle = {
      ox: number; oy: number; oz: number; // original position on sphere
      x: number; y: number; z: number;    // rotated position
      sx: number; sy: number;             // screen position
      size: number;
      speed: number;
    };

    const particles: Particle[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      particles.push({
        ox: x, oy: y, oz: z,
        x, y, z,
        sx: 0, sy: 0,
        size: Math.random() * 1.5 + 0.8,
        speed: Math.random() * 0.0004 + 0.0002,
      });
    }

    let angleY = 0;
    let angleX = 0.3;
    let raf = 0;
    let t = 0;

    const CONNECTION_DIST = 0.55; // max distance to draw connection line

    const draw = () => {
      t += 0.005;
      angleY += 0.004;
      angleX = 0.3 + Math.sin(t * 0.4) * 0.08;

      ctx.clearRect(0, 0, W, H);

      // Rotate all particles
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      for (const p of particles) {
        // Rotate Y
        const x1 = p.ox * cosY + p.oz * sinY;
        const z1 = -p.ox * sinY + p.oz * cosY;
        // Rotate X
        const y2 = p.oy * cosX - z1 * sinX;
        const z2 = p.oy * sinX + z1 * cosX;

        p.x = x1;
        p.y = y2;
        p.z = z2;

        // Perspective projection
        const fov = 3.5;
        const scale = fov / (fov + p.z + 1);
        p.sx = cx + p.x * R * scale;
        p.sy = cy + p.y * R * scale;
      }

      // Sort by Z for depth
      const sorted = [...particles].sort((a, b) => a.z - b.z);

      // Draw connections first
      for (let i = 0; i < sorted.length; i++) {
        const a = sorted[i];
        if (a.z < -0.2) continue; // skip back-facing
        for (let j = i + 1; j < sorted.length; j++) {
          const b = sorted[j];
          if (b.z < -0.2) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < CONNECTION_DIST) {
            const depth = ((a.z + b.z) / 2 + 1) / 2;
            const alpha = (1 - dist / CONNECTION_DIST) * depth * 0.55;

            // Blue-to-cyan gradient lines
            const gradient = ctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy);
            gradient.addColorStop(0, `rgba(96,165,250,${alpha})`);
            gradient.addColorStop(0.5, `rgba(147,197,253,${alpha * 0.8})`);
            gradient.addColorStop(1, `rgba(59,130,246,${alpha})`);

            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = depth * 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particles on top
      for (const p of sorted) {
        const depth = (p.z + 1) / 2;
        if (depth < 0.1) continue;

        const size = p.size * (0.5 + depth * 0.8);
        const alpha = 0.4 + depth * 0.6;

        // Glowing dot
        const glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, size * 3);
        glow.addColorStop(0, `rgba(200,220,255,${alpha})`);
        glow.addColorStop(0.3, `rgba(147,197,253,${alpha * 0.8})`);
        glow.addColorStop(0.7, `rgba(96,165,250,${alpha * 0.3})`);
        glow.addColorStop(1, `rgba(59,130,246,0)`);

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,235,255,${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute hidden lg:block pointer-events-none"
      style={{
        top: "20px",
        right: "40px",
        width: "220px",
        height: "220px",
        opacity: 0.85,
      }}
    />
  );
}
