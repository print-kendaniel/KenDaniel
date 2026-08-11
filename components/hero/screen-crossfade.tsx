"use client";

import { Suspense, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import type { Mesh, MeshBasicMaterial } from "three";

export interface ScreenCrossfadeProps {
  /** Image paths for the screen slideshow — see HeroMacBook's `screenImages` prop. */
  images: string[];
  /** Shared 0..1 scroll progress, written by HeroMacBook's ScrollTrigger onUpdate. */
  progress: RefObject<number>;
  width: number;
  height: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Two overlapping planes (base + a slightly-forward transparent overlay)
 * crossfading between `images` as `progress` advances — a plain opacity
 * swap on a single texture would hard-cut, this blends smoothly. Falls
 * back to a flat dark panel if no images were provided, instead of
 * crashing or rendering nothing.
 */
export function ScreenCrossfade(props: ScreenCrossfadeProps) {
  if (props.images.length === 0) {
    return (
      <mesh position={props.position} rotation={props.rotation}>
        <planeGeometry args={[props.width, props.height]} />
        <meshBasicMaterial color="#0a0a0f" />
      </mesh>
    );
  }

  return (
    <Suspense
      fallback={
        <mesh position={props.position} rotation={props.rotation}>
          <planeGeometry args={[props.width, props.height]} />
          <meshBasicMaterial color="#0a0a0f" />
        </mesh>
      }
    >
      <ScreenCrossfadeLoaded {...props} />
    </Suspense>
  );
}

function ScreenCrossfadeLoaded({ images, progress, width, height, position = [0, 0, 0], rotation = [0, 0, 0] }: ScreenCrossfadeProps) {
  const loaded = useTexture(images);
  const textures = Array.isArray(loaded) ? loaded : [loaded];

  const baseMeshRef = useRef<Mesh>(null);
  const baseMatRef = useRef<MeshBasicMaterial>(null);
  const overlayMatRef = useRef<MeshBasicMaterial>(null);

  useFrame(() => {
    const baseMat = baseMatRef.current;
    const overlayMat = overlayMatRef.current;
    if (!baseMat || !overlayMat || textures.length === 0) return;

    const p = Math.min(0.999, Math.max(0, progress.current ?? 0));
    const segment = 1 / textures.length;
    const raw = p / segment;
    const currentIndex = Math.min(textures.length - 1, Math.floor(raw));
    const nextIndex = Math.min(textures.length - 1, currentIndex + 1);
    const localT = raw - currentIndex;

    if (baseMat.map !== textures[currentIndex]) {
      baseMat.map = textures[currentIndex];
      baseMat.needsUpdate = true;
    }
    const nextTexture = textures[nextIndex];
    if (overlayMat.map !== nextTexture) {
      overlayMat.map = nextTexture;
      overlayMat.needsUpdate = true;
    }
    overlayMat.opacity = nextIndex === currentIndex ? 0 : localT;
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={baseMeshRef}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial ref={baseMatRef} map={textures[0]} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={overlayMatRef}
          map={textures[1] ?? textures[0]}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
