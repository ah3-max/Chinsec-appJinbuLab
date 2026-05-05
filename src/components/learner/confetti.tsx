"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
}

const EMOJIS = ["🎉", "🎊", "⭐", "✨", "🌟", "💫", "🎈"];
const COUNT = 28;

/**
 * Lightweight confetti — emoji particles spraying outward from center.
 * Self-removes after the animation finishes; safe to mount unconditionally.
 */
export function Confetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const next: Particle[] = Array.from({ length: COUNT }, (_, i) => ({
      id: Date.now() + i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]!,
      // Spray angle: random but biased outward
      x: (Math.random() - 0.5) * 600,
      y: -200 - Math.random() * 250,
      rotate: (Math.random() - 0.5) * 720,
      scale: 0.6 + Math.random() * 0.8,
      delay: Math.random() * 0.2,
    }));
    setParticles(next);
    const t = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(t);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: p.scale }}
          animate={{
            x: p.x,
            y: p.y + 600,        // gravity-like drop
            opacity: [1, 1, 0],
            rotate: p.rotate,
            scale: p.scale,
          }}
          transition={{ duration: 2, delay: p.delay, ease: "easeOut" }}
          className="absolute select-none text-3xl"
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}
