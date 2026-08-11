"use client";

import type { RefObject } from "react";
import { RoundedBox } from "@react-three/drei";
import { ScreenCrossfade } from "./screen-crossfade";

export interface ProceduralMacBookProps {
  progress: RefObject<number>;
  screenImages: string[];
}

/**
 * Primitive-built laptop used whenever no real .glb is available at
 * /public/models/macbook.glb (see gltf-macbook.tsx) — a thin base slab, a
 * lid tilted open on a static hinge angle, and a screen plane inset into
 * the lid's front face that ScreenCrossfade can texture. Not meant to be
 * photoreal, just a believable placeholder silhouette that still sells the
 * scroll-rotation and screen-crossfade effects.
 */
export function ProceduralMacBook({ progress, screenImages }: ProceduralMacBookProps) {
  const bodyMaterial = <meshStandardMaterial color="#c4c7cf" metalness={0.7} roughness={0.32} />;

  return (
    <group position={[0, -0.35, 0]}>
      {/* Base / keyboard deck */}
      <RoundedBox args={[3.2, 0.14, 2.2]} radius={0.06} smoothness={4} position={[0, 0, 0]}>
        {bodyMaterial}
      </RoundedBox>

      {/* Lid, pivoted from the back hinge edge and tilted open ~15deg past vertical */}
      <group position={[0, 0.07, -1.1]} rotation={[-1.4, 0, 0]}>
        <RoundedBox args={[3.2, 2.0, 0.1]} radius={0.06} smoothness={4} position={[0, 1.0, -0.02]}>
          {bodyMaterial}
        </RoundedBox>
        <ScreenCrossfade images={screenImages} progress={progress} width={2.9} height={1.78} position={[0, 1.0, 0.035]} />
      </group>
    </group>
  );
}
