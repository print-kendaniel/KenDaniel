"use client";

import { Component, type ReactNode } from "react";

interface ModelErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches a failed/missing .glb load (useGLTF rejects -> Suspense throws)
 * and swaps to the procedural fallback instead of crashing the hero.
 * Renders `children` again on every mount, so once a real model file
 * exists at the expected path this starts succeeding automatically —
 * no code change needed beyond dropping the file in.
 */
export class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Intentionally silent — a missing macbook.glb is the expected,
    // documented state until a real model is provided, not a bug.
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
