/** Adjust neutral seating pixels off the main thread, before a frame is cached. */
export function createHeroSurface(color: [number, number, number]) {
  let worker: Worker | null = null;
  let serial = 0;
  let disposed = false;
  const pending = new Map<number, { resolve: (bitmap: ImageBitmap) => void; reject: (error: Error) => void }>();

  return {
    grade(bitmap: ImageBitmap, progress: number, mobile: boolean): Promise<ImageBitmap> {
      if (progress <= 0.82 || typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") {
        return Promise.resolve(bitmap);
      }
      if (disposed) { bitmap.close(); return Promise.reject(new Error("Hero surface disposed")); }
      if (!worker) {
        worker = new Worker(new URL("./heroSurface.worker.ts", import.meta.url), { type: "module" });
        worker.onmessage = (event: MessageEvent<{ id: number; bitmap: ImageBitmap }>) => {
          const request = pending.get(event.data.id);
          pending.delete(event.data.id);
          if (request) request.resolve(event.data.bitmap);
          else event.data.bitmap.close();
        };
        worker.onerror = () => {
          for (const request of pending.values()) request.reject(new Error("Hero surface worker failed"));
          pending.clear();
        };
      }
      const id = ++serial;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        worker!.postMessage({ id, bitmap, progress, mobile, color }, [bitmap]);
      });
    },
    dispose() {
      disposed = true;
      worker?.terminate();
      for (const request of pending.values()) request.reject(new Error("Hero surface disposed"));
      pending.clear();
    },
  };
}
