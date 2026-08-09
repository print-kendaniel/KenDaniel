"use client";

import { useEffect, useRef } from "react";

interface LiquidRevealProps {
  /** Always-visible base image (the LCP image). */
  beforeSrc: string;
  /** Image painted onto the canvas along the cursor trail. */
  afterSrc: string;
  alt: string;
}

const BRUSH_RADIUS = 70;
const DECAY = 0.016;
const IDLE_FADE_FRAMES = 120;

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
  const drawWidth = img.naturalWidth * scale;
  const drawHeight = img.naturalHeight * scale;
  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

/** Cursor-driven "liquid" reveal: moving the pointer paints a soft brush trail of `afterSrc` over `beforeSrc`. */
export function LiquidReveal({ beforeSrc, afterSrc, alt }: LiquidRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const radius = BRUSH_RADIUS * dpr;
    const diameter = Math.ceil(radius * 2);

    const coverCanvas = document.createElement("canvas");
    const coverCtx = coverCanvas.getContext("2d");
    const brushCanvas = document.createElement("canvas");
    brushCanvas.width = diameter;
    brushCanvas.height = diameter;
    const brushCtx = brushCanvas.getContext("2d");

    let canvasWidth = 0;
    let canvasHeight = 0;
    let afterImage: HTMLImageElement | null = null;
    let last: { x: number; y: number } | null = null;
    let queue: { x: number; y: number }[] = [];
    let idle = 0;
    let rafId = 0;
    let destroyed = false;

    function resize() {
      if (!container || !canvas || !coverCtx) return;
      const rect = container.getBoundingClientRect();
      canvasWidth = Math.max(1, Math.round(rect.width * dpr));
      canvasHeight = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      coverCanvas.width = canvasWidth;
      coverCanvas.height = canvasHeight;
      if (afterImage) {
        coverCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawCover(coverCtx, afterImage, canvasWidth, canvasHeight);
      }
    }

    function stamp(x: number, y: number) {
      if (!brushCtx || !ctx) return;

      brushCtx.clearRect(0, 0, diameter, diameter);
      brushCtx.globalCompositeOperation = "source-over";
      const gradient = brushCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.55, "rgba(255,255,255,0.82)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      brushCtx.fillStyle = gradient;
      brushCtx.fillRect(0, 0, diameter, diameter);

      brushCtx.globalCompositeOperation = "source-in";
      brushCtx.drawImage(coverCanvas, x - radius, y - radius, diameter, diameter, 0, 0, diameter, diameter);

      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(brushCanvas, x - radius, y - radius);
    }

    function tick() {
      if (destroyed || !ctx) return;

      const drawing = queue.length > 0;
      if (drawing) {
        idle = 0;
      } else {
        idle += 1;
        if (idle > IDLE_FADE_FRAMES) {
          rafId = requestAnimationFrame(tick);
          return;
        }
      }

      const fade = drawing ? DECAY : Math.min(DECAY + idle * 0.004, 0.5);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      if (drawing) {
        for (const point of queue) stamp(point.x, point.y);
        queue = [];
      }

      if (idle === IDLE_FADE_FRAMES) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      }

      rafId = requestAnimationFrame(tick);
    }

    function onPointerMove(event: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) * dpr;
      const y = (event.clientY - rect.top) * dpr;

      if (x < -radius || x > canvasWidth + radius || y < -radius || y > canvasHeight + radius) {
        last = null;
        return;
      }

      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const step = Math.max(radius * 0.3, 1);
        const n = Math.min(Math.ceil(dist / step), 60);
        for (let i = 1; i <= n; i += 1) {
          queue.push({ x: last.x + (dx * i) / n, y: last.y + (dy * i) / n });
        }
      } else {
        queue.push({ x, y });
      }

      last = { x, y };
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    afterImage = new Image();
    afterImage.src = afterSrc;
    afterImage.onload = () => {
      if (destroyed || !coverCtx) return;
      coverCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawCover(coverCtx, afterImage!, canvasWidth, canvasHeight);
    };

    window.addEventListener("pointermove", onPointerMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
    };
  }, [afterSrc]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- always-visible base layer under a canvas overlay; painted via drawImage, not next/image's responsive pipeline */}
      <img src={beforeSrc} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}
