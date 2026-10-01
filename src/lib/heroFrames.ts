/** Bounded decoded-frame cache. Native scrolling never waits for this loader. */
export function createHeroFrames(url: (frame: number) => string, count: number, mobile: boolean, onReady: () => void) {
  const capacity = mobile ? 20 : 24;
  const decoded = new Map<number, ImageBitmap>();
  const compressed = new Map<number, Blob>();
  const pending = new Map<number, AbortController>();
  const failed = new Set<number>();
  let wanted: number[] = [];
  let disposed = false;

  const trim = () => {
    const rank = (index: number) => {
      const position = wanted.indexOf(index);
      return position < 0 ? 1000 : position;
    };
    while (decoded.size > capacity) {
      const victim = [...decoded.keys()].sort((a, b) => rank(b) - rank(a))[0];
      decoded.get(victim)?.close();
      decoded.delete(victim);
    }
    while (compressed.size > 64) compressed.delete(compressed.keys().next().value!);
  };

  const pump = () => {
    if (disposed) return;
    for (const index of wanted) {
      if (pending.size >= 6) break;
      if (decoded.has(index) || pending.has(index) || failed.has(index)) continue;
      const controller = new AbortController();
      pending.set(index, controller);
      void (async () => {
        try {
          let blob = compressed.get(index);
          if (!blob) {
            const response = await fetch(url(index), { signal: controller.signal, cache: "force-cache" });
            if (!response.ok) throw new Error(`Hero frame ${response.status}`);
            blob = await response.blob();
            compressed.set(index, blob);
          }
          const bitmap = await createImageBitmap(blob);
          if (disposed || !wanted.includes(index)) bitmap.close();
          else decoded.set(index, bitmap);
          trim();
        } catch {
          if (!disposed) failed.add(index);
        } finally {
          pending.delete(index);
          if (!disposed) {
            onReady();
            pump();
          }
        }
      })();
    }
  };

  return {
    request(current: number, target: number, direction: number) {
      const order = [current, target];
      for (let offset = 1; offset <= capacity; offset++) {
        order.push(current + offset * direction);
        if (offset <= 3) order.push(current - offset * direction);
      }
      wanted = [...new Set(order.map((frame) => Math.max(0, Math.min(count - 1, frame))))].slice(0, capacity);
      trim();
      pump();
    },
    get(index: number) { return decoded.get(index); },
    hasFailed(index: number) { return failed.has(index); },
    nearest(index: number) {
      for (let offset = 0; offset <= 2; offset++) {
        for (const candidate of [index + offset, index - offset]) {
          const bitmap = decoded.get(candidate);
          if (bitmap) return { index: candidate, bitmap };
        }
      }
      return null;
    },
    dispose() {
      disposed = true;
      for (const controller of pending.values()) controller.abort();
      for (const bitmap of decoded.values()) bitmap.close();
      decoded.clear();
      compressed.clear();
    },
  };
}
