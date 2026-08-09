export type TickCallback = (time: number, deltaMs: number) => void;

/**
 * One requestAnimationFrame loop shared by every per-frame interaction system
 * (grain regeneration, magnetic cursor, scroll-focus blur, chromatic
 * aberration decay, hero character rotation) instead of each running its own
 * independent rAF loop. Only runs while something is subscribed.
 */
class RafTicker {
  private callbacks = new Set<TickCallback>();
  private rafId: number | null = null;
  private lastTime = 0;

  subscribe(callback: TickCallback): () => void {
    this.callbacks.add(callback);
    this.ensureRunning();
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: TickCallback): void {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0 && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private ensureRunning() {
    if (this.rafId !== null || typeof window === "undefined") return;
    this.lastTime = performance.now();
    const loop = (time: number) => {
      const deltaMs = time - this.lastTime;
      this.lastTime = time;
      for (const callback of this.callbacks) callback(time, deltaMs);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
}

export const rafTicker = new RafTicker();
