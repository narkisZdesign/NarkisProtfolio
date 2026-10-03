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
const neutralLookup = Float64Array.from({ length: 256 }, (_, spread) => 1 - smooth((spread - 8) / 20));
let geometry: {
  width: number; height: number; mobile: boolean;
  nx: Float64Array; floor: Float64Array; shadowX: Float64Array; shadowY: Float64Array;
} | null = null;

scope.onmessage = ({ data }: MessageEvent<SurfaceRequest>) => {
  const { id, bitmap, progress, mobile, color } = data;
  try {
    const { width, height } = bitmap;
    if (!canvas || canvas.width !== width || canvas.height !== height) canvas = new OffscreenCanvas(width, height);
    if (!geometry || geometry.width !== width || geometry.height !== height || geometry.mobile !== mobile) {
      const nx = Float64Array.from({ length: width }, (_, x) => mobile ? 0.535 + (x / width - 0.5) * (530 / 2206) : x / width);
      geometry = {
        width, height, mobile, nx,
        floor: Float64Array.from({ length: height }, (_, y) => smooth((y / height - 0.63) / 0.035)),
        // The Gaussian separates into column and row factors. Cache them once
        // instead of evaluating exp() for every seating pixel in every frame.
        shadowX: Float64Array.from(nx, (x) => Math.exp(-2.5 * ((x - 0.535) / 0.048) ** 2)),
        shadowY: Float64Array.from({ length: height }, (_, y) => Math.exp(-2.5 * ((y / height - 0.812) / 0.066) ** 2)),
      };
    }
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    context.drawImage(bitmap, 0, 0);
    const startY = Math.floor(height * 0.63);
    // Only the seating region needs pixel access; keep the rest on the canvas.
    const image = context.getImageData(0, startY, width, height - startY);
    const pixels = image.data;
    const exposure = smooth((progress - 0.82) / 0.18);

    for (let y = startY; y < height; y++) {
      const ny = y / height;
      const floor = geometry.floor[y] * exposure;
      const shadowRow = geometry.shadowY[y] * 0.65;
      for (let x = 0; x < width; x++) {
        // Map the portrait crop back to the original wide composition.
        const nx = geometry.nx[x];
        // The left floor starts lower; keep the panel and its arrow untouched.
        if (nx < 0.332 && ny < 0.728) continue;
        // Protect the laptop and its light logo at the top of the seating plane.
        if (ny < 0.645 && nx > 0.498 && nx < 0.566) continue;
        const offset = ((y - startY) * width + x) * 4;
        const r = pixels[offset], g = pixels[offset + 1], b = pixels[offset + 2];
        const spread = Math.max(r, g, b) - Math.min(r, g, b);
        const neutral = neutralLookup[spread];
        if (neutral === 0) continue;
        const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
        const amount = floor * neutral * smooth((luma - 100) / 60);
        if (amount === 0) continue;

        // Retain local foot shadows while lifting the broad gray material tone.
        const shadow = Math.max(0, 225 - luma) * shadowRow * geometry.shadowX[x];
        const texture = Math.max(0, 235 - luma) * 0.06;
        const deficit = shadow + texture;
        pixels[offset] = r + (color[0] - deficit - r) * amount;
        pixels[offset + 1] = g + (color[1] - deficit - g) * amount;
        pixels[offset + 2] = b + (color[2] - deficit - b) * amount;
      }
    }
    context.putImageData(image, 0, startY);
    const result = canvas.transferToImageBitmap();
    bitmap.close();
    scope.postMessage({ id, bitmap: result }, [result]);
  } catch {
    // Keep the original media visible if a browser cannot process the surface.
    scope.postMessage({ id, bitmap }, [bitmap]);
  }
};
