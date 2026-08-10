"use client";

import { useEffect, useRef } from "react";
import { rafTicker } from "@/lib/raf-ticker";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec2 uResolution;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy;
    float noise = hash(uv + uTime);
    // Fully opaque output - no WebGL-level alpha at all. Cross-browser canvas
    // alpha compositing (this used to rely on it) is inconsistent on Safari,
    // where it rendered far more opaque than intended even after switching
    // to premultiplied alpha. The actual subtlety is applied with a plain
    // CSS opacity on the canvas element instead, which every browser
    // composites identically.
    gl_FragColor = vec4(vec3(noise), 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

/**
 * Fullscreen animated film-grain overlay. Low-alpha procedural noise
 * regenerated every other tick of the shared ticker (halves GPU work;
 * imperceptible for grain). Renders one static frame under reduced motion.
 */
export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Single triangle that covers the whole clip space — cheaper than a quad (no diagonal seam to worry about).
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "uResolution");
    const timeLoc = gl.getUniformLocation(program, "uTime");

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function render(time: number) {
      if (!gl) return;
      gl.uniform1f(timeLoc, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    if (reducedMotion) {
      render(0);
      return () => window.removeEventListener("resize", resize);
    }

    let frameCount = 0;
    const unsubscribe = rafTicker.subscribe((time) => {
      frameCount += 1;
      if (frameCount % 2 !== 0) return;
      render(time);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-90"
      style={{ opacity: 0.05 }}
    />
  );
}
