/** Prioritized decoding with a bounded bitmap cache and lightweight prefetch. */
export function createHeroFrames(
  url: (frame: number) => string, count: number, mobile: boolean, onReady: () => void,
  process?: (bitmap: ImageBitmap, index: number) => Promise<ImageBitmap>,
) {
  const capacity = mobile ? 20 : 24;
  const decoded = new Map<number, ImageBitmap>();
  // Retain the small WebP files so reversing scroll doesn't refetch them.
  const compressed = new Map<number, Blob>();
  const compressedLimit = (mobile ? 12 : 20) * 1024 * 1024;
  let compressedBytes = 0;
  const downloading = new Map<number, AbortController>();
  const decoding = new Set<number>();
  const failed = new Set<number>();
  let wanted: number[] = [];
  let currentFrame = 0;
  let warmCursor = 0;
  let warming = false;
  let active = true;
  let disposed = false;

  const trim = () => {
    const rank = (index: number) => {
      const position = wanted.indexOf(index);
      return position < 0 ? capacity + Math.abs(index - currentFrame) : position;
    };
    while (decoded.size > capacity) {
      let victim = -1;
      let worstRank = -1;
      for (const index of decoded.keys()) {
        const value = rank(index);
        if (value > worstRank) { victim = index; worstRank = value; }
      }
      decoded.get(victim)?.close();
      decoded.delete(victim);
    }
    while (compressedBytes > compressedLimit) {
      const index = compressed.keys().next().value!;
      compressedBytes -= compressed.get(index)!.size;
      compressed.delete(index);
    }
  };

  const decode = (index: number, blob: Blob) => {
    decoding.add(index);
    void (async () => {
      let bitmap: ImageBitmap | undefined;
      try {
        bitmap = await createImageBitmap(blob);
        // Don't queue costly processing for a seek that has already passed.
        if (disposed || (!wanted.includes(index) && Math.abs(index - currentFrame) > capacity)) {
          bitmap.close();
          return;
        }
        if (process) bitmap = await process(bitmap, index);
        if (disposed) bitmap.close();
        else {
          // Keep useful completed frames even when scrolling shifted the window
          // during decode. Discarding them caused gaps during fast scrubbing.
          decoded.set(index, bitmap);
          trim();
          onReady();
        }
      } catch {
        bitmap?.close();
        if (!disposed) failed.add(index);
      } finally {
        decoding.delete(index);
        pump();
      }
    })();
  };

  const download = (index: number) => {
    const controller = new AbortController();
    downloading.set(index, controller);
    void (async () => {
      try {
        const response = await fetch(url(index), { signal: controller.signal, cache: "force-cache" });
        if (!response.ok) throw new Error(`Hero frame ${response.status}`);
        const blob = await response.blob();
        if (!disposed) {
          compressed.set(index, blob);
          compressedBytes += blob.size;
          trim();
        }
      } catch {
        if (!disposed && !controller.signal.aborted) { failed.add(index); onReady(); }
      } finally {
        downloading.delete(index);
        pump();
      }
    })();
  };

  const pump = () => {
    if (disposed || !active) return;
    // Downloads can warm the sequence independently of expensive bitmap work.
    // Limit concurrent decoding so old jobs cannot bury the latest scroll frame.
    for (const index of wanted) {
      if (decoding.size >= 3) break;
      const blob = compressed.get(index);
      if (blob && !decoded.has(index) && !decoding.has(index) && !failed.has(index)) decode(index, blob);
    }
    for (const index of wanted) {
      if (downloading.size >= 4) break;
      if (!compressed.has(index) && !downloading.has(index) && !failed.has(index)) download(index);
    }
    while (warming && downloading.size < 4 && warmCursor < count) {
      const index = warmCursor++;
      if (!compressed.has(index) && !downloading.has(index) && !failed.has(index)) download(index);
    }
  };

  return {
    request(current: number, target: number, direction: number, advance = 1) {
      currentFrame = current;
      const lead = Math.max(1, Math.min(8, Math.round(advance)));
      const order = [current, current + lead * direction, current + 2 * lead * direction, target];
      for (let offset = 1; offset <= 3; offset++) order.push(current - offset * direction);
      for (let offset = 1; offset <= capacity; offset++) order.push(current + offset * direction);
      wanted = [...new Set(order.map((frame) => Math.max(0, Math.min(count - 1, frame))))].slice(0, capacity);
      trim();
      pump();
    },
    warm() { warming = true; pump(); },
    setActive(value: boolean) { active = value; if (active) pump(); },
    get(index: number) { return decoded.get(index); },
    hasFailed(index: number) { return failed.has(index); },
    nearest(index: number, from = -1, direction = 1) {
      let result: { index: number; bitmap: ImageBitmap } | null = null;
      let distance = Infinity;
      for (const [candidate, bitmap] of decoded) {
        // Hold or advance towards the requested frame. A late decode must not
        // briefly play backwards, or show a distant future frame too early.
        if (from >= 0 && (direction > 0 ? candidate < from : candidate > from)) continue;
        if (direction > 0 ? candidate > index + 2 : candidate < index - 2) continue;
        const gap = Math.abs(candidate - index);
        if (gap < distance) { result = { index: candidate, bitmap }; distance = gap; }
      }
      return result;
    },
    dispose() {
      disposed = true;
      for (const controller of downloading.values()) controller.abort();
      for (const bitmap of decoded.values()) bitmap.close();
      decoded.clear();
      compressed.clear();
    },
  };
}
