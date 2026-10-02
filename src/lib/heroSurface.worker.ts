/// <reference lib="webworker" />
export {};

type SurfaceRequest = {
  id: number;
  bitmap: ImageBitmap;
  progress: number;
  mobile: boolean;
  color: [number, number, number];
};
const scope = self as unknown as DedicatedWorkerGlobalScope;
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
let canvas: OffscreenCanvas | null = null;

scope.onmessage = ({ data }: MessageEvent<SurfaceRequest>) => {
  const { id, bitmap, progress, mobile, color } = data;
  try {
    const { width, height } = bitmap;
    if (!canvas || canvas.width !== width || canvas.height !== height) canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    context.drawImage(bitmap, 0, 0);
    const image = context.getImageData(0, 0, width, height);
    const pixels = image.data;
    const exposure = smooth((progress - 0.82) / 0.18);

    for (let y = Math.floor(height * 0.63); y < height; y++) {
      const ny = y / height;
      const floor = smooth((ny - 0.63) / 0.035) * exposure;
      for (let x = 0; x < width; x++) {
        // Map the portrait crop back to the original wide composition.
        const nx = mobile ? 0.535 + (x / width - 0.5) * (530 / 2206) : x / width;
        // The left floor starts lower; keep the panel and its arrow untouched.
        if (nx < 0.332 && ny < 0.728) continue;
        // Protect the laptop and its light logo at the top of the seating plane.
        if (ny < 0.645 && nx > 0.498 && nx < 0.566) continue;
        const offset = (y * width + x) * 4;
        const r = pixels[offset], g = pixels[offset + 1], b = pixels[offset + 2];
        const spread = Math.max(r, g, b) - Math.min(r, g, b);
        const neutral = 1 - smooth((spread - 8) / 20);
        if (neutral === 0) continue;
        const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
        const amount = floor * neutral * smooth((luma - 100) / 60);
        if (amount === 0) continue;

        // Retain local foot shadows while lifting the broad gray material tone.
        const dx = (nx - 0.535) / 0.048;
        const dy = (ny - 0.812) / 0.066;
        const shadow = Math.max(0, 225 - luma) * 0.65 * Math.exp(-2.5 * (dx * dx + dy * dy));
        const texture = Math.max(0, 235 - luma) * 0.06;
        const deficit = shadow + texture;
        pixels[offset] = r + (color[0] - deficit - r) * amount;
        pixels[offset + 1] = g + (color[1] - deficit - g) * amount;
        pixels[offset + 2] = b + (color[2] - deficit - b) * amount;
      }
    }
    context.putImageData(image, 0, 0);
    const result = canvas.transferToImageBitmap();
    bitmap.close();
    scope.postMessage({ id, bitmap: result }, [result]);
  } catch {
    // Keep the original media visible if a browser cannot process the surface.
    scope.postMessage({ id, bitmap }, [bitmap]);
  }
};
