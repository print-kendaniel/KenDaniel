"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { ProceduralMacBook } from "./procedural-macbook";
import { GLTFMacBook } from "./gltf-macbook";
import { ModelErrorBoundary } from "./model-error-boundary";

export interface MacBookSceneProps {
  progress: RefObject<number>;
  screenImages: string[];
}

/** Applies the scroll-driven rotation/scale to the whole model each frame, reading `progress` directly so this never re-renders. */
function ScrollRig({ progress, children }: { progress: RefObject<number>; children: React.ReactNode }) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    const group = ref.current;
    if (!group) return;
    const p = Math.min(1, Math.max(0, progress.current ?? 0));
    group.rotation.y = p * 0.5;
    group.rotation.x = p * 0.1;
    const scale = 0.9 + p * 0.1;
    group.scale.setScalar(scale);
  });

  return <group ref={ref}>{children}</group>;
}

export function MacBookScene({ progress, screenImages }: MacBookSceneProps) {
  const fallback = <ProceduralMacBook progress={progress} screenImages={screenImages} />;

  return (
    <Canvas camera={{ position: [0, 0.7, 5.4], fov: 32 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <pointLight position={[-4, -1, -3]} intensity={0.5} color="#80011f" />
      <ScrollRig progress={progress}>
        <Suspense fallback={fallback}>
          <ModelErrorBoundary fallback={fallback}>
            <GLTFMacBook progress={progress} screenImages={screenImages} />
          </ModelErrorBoundary>
        </Suspense>
      </ScrollRig>
    </Canvas>
  );
}
