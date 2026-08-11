"use client";

import type { RefObject } from "react";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { ScreenCrossfade } from "./screen-crossfade";

// ---------------------------------------------------------------------------
// 1) ADD YOUR OWN MODEL HERE: drop a MacBook .glb at public/models/macbook.glb.
//    A few places to find a free, downloadable one:
//      - Sketchfab, filtered to Downloadable + Free license:
//        https://sketchfab.com/search?features=downloadable&q=macbook&type=models
//      - Kenney.nl free asset packs (low-poly, very cheap to render)
//      - Poly Pizza (formerly Google Poly mirror): https://poly.pizza
//    Once the file exists at that path, this component starts rendering it
//    automatically — no other code changes needed (see model-error-boundary.tsx
//    and hero-macbook.tsx for how the fallback wiring works).
// ---------------------------------------------------------------------------
const MODEL_PATH = "/models/macbook.glb";

export interface GLTFMacBookProps {
  progress: RefObject<number>;
  screenImages: string[];
}

export function GLTFMacBook({ progress, screenImages }: GLTFMacBookProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const cloned = useRef(scene.clone()).current;

  // 2) TUNE THIS: once your real model is visible, adjust position/rotation/
  //    width/height so the crossfade planes line up with its actual screen
  //    panel — every model's proportions and origin are different, these
  //    numbers are just a reasonable guess for a laptop centered at the
  //    origin, roughly life-sized (in meters).
  const screenTransform = {
    position: [0, 1.0, 0.05] as [number, number, number],
    rotation: [-0.06, 0, 0] as [number, number, number],
    width: 2.9,
    height: 1.8,
  };

  return (
    <group position={[0, -0.35, 0]}>
      <primitive object={cloned} />
      <ScreenCrossfade
        images={screenImages}
        progress={progress}
        width={screenTransform.width}
        height={screenTransform.height}
        position={screenTransform.position}
        rotation={screenTransform.rotation}
      />
    </group>
  );
}
