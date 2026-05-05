"use client";

import { useEffect, useImperativeHandle, useRef, forwardRef, useState } from "react";
import { RotateCcw } from "lucide-react";

export interface HandwritingCanvasHandle {
  /** Returns null if blank, else PNG data URL of the strokes */
  getDataUrl: () => string | null;
  /** Clear all strokes */
  clear: () => void;
  hasStrokes: () => boolean;
}

interface Props {
  /** Faint character displayed behind the strokes for tracing */
  guide?: string;
  size?: number;
  className?: string;
}

export const HandwritingCanvas = forwardRef<HandwritingCanvasHandle, Props>(
  function HandwritingCanvas({ guide, size = 300, className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef(false);
    const [strokeCount, setStrokeCount] = useState(0);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 4;
      }
    }, [size]);

    function getCoords(e: PointerEvent | React.PointerEvent) {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e as PointerEvent).clientX - rect.left) * (size / rect.width),
        y: ((e as PointerEvent).clientY - rect.top) * (size / rect.height),
      };
    }

    function onPointerDown(e: React.PointerEvent) {
      e.preventDefault();
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      drawingRef.current = true;
      const { x, y } = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      canvasRef.current?.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: React.PointerEvent) {
      if (!drawingRef.current) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const { x, y } = getCoords(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    function onPointerUp() {
      if (drawingRef.current) {
        drawingRef.current = false;
        setStrokeCount((n) => n + 1);
      }
    }

    function clear() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      setStrokeCount(0);
    }

    useImperativeHandle(ref, () => ({
      getDataUrl: () => {
        if (strokeCount === 0) return null;
        return canvasRef.current?.toDataURL("image/png") ?? null;
      },
      clear,
      hasStrokes: () => strokeCount > 0,
    }));

    return (
      <div className={className}>
        <div
          className="relative mx-auto rounded-2xl border-2 bg-white shadow-sm"
          style={{
            width: size,
            height: size,
            borderColor: "var(--aiai-green-100)",
          }}
        >
          {/* Faint guide character */}
          {guide && (
            <span
              className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif select-none"
              style={{
                fontSize: size * 0.7,
                color: "rgba(0,0,0,0.06)",
              }}
            >
              {guide}
            </span>
          )}
          {/* Faint grid lines */}
          <span
            className="pointer-events-none absolute left-0 right-0 top-1/2 border-t border-dashed"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
          />
          <span
            className="pointer-events-none absolute top-0 bottom-0 left-1/2 border-l border-dashed"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
          />

          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{ width: size, height: size, touchAction: "none" }}
            className="relative z-10 cursor-crosshair"
          />
        </div>

        <button
          type="button"
          onClick={clear}
          className="mx-auto mt-2 flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium"
          style={{
            background: "var(--aiai-gray-100)",
            color: "var(--aiai-gray-600)",
          }}
        >
          <RotateCcw className="size-3" />
          เคลียร์ / 清除
        </button>
      </div>
    );
  },
);
