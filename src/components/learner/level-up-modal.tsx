"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Particle {
  id: number;
  x: number;
  y: number;
  rot: number;
  delay: number;
  color: string;
}

const COLORS = [
  "#fbbf24",
  "#f472b6",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#fb7185",
];

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: -(Math.random() * 100 + 80),
    rot: Math.random() * 360,
    delay: Math.random() * 0.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#fbbf24",
  }));
}

export function LevelUpModal({
  newLevelLabel,
  onClose,
}: {
  newLevelLabel: string;
  onClose: () => void;
}) {
  const t = useTranslations("learn.levelUp");
  const [open, setOpen] = useState(true);
  const particles = useMemo(() => buildParticles(40), []);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(onClose, 250);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 五彩紙花 */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute left-1/2 top-1/2 size-2 rounded-sm"
                style={{ backgroundColor: p.color }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x: p.x * 5,
                  y: p.y * 4,
                  rotate: p.rot,
                  opacity: 0,
                }}
                transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
              />
            ))}
          </div>

          <motion.div
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-pink-400 text-white shadow-lg">
              <Sparkles className="size-8" />
            </div>
            <h2 className="text-2xl font-bold">{t("title")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("subtitle")}
            </p>
            <div className="mt-4 rounded-lg bg-muted/40 px-4 py-3 text-lg font-semibold">
              {newLevelLabel}
            </div>
            <Button
              className="mt-5 w-full"
              size="lg"
              onClick={() => setOpen(false)}
            >
              {t("continue")}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
