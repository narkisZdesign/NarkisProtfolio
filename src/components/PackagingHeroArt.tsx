import { assetUrl } from "../data/siteContent";

// Preserve the desktop composition and scale both layers together on smaller screens.
const sketchHeight = 360;
const sketchWidth = sketchHeight * 1031 / 1409;
const boxHeight = sketchHeight * 1448 / 1274;
const boxWidth = boxHeight * 1086 / 1448;

export function PackagingHeroArt({ sketch, object }: { sketch: string; object: string }) {
  return (
    <svg className="packaging-hero-composition" viewBox="0 0 640 435" width="640" height="435" aria-hidden="true" focusable="false">
      <defs>
        <filter id="packaging-hero-sketch-ink" colorInterpolationFilters="sRGB">
          {/* Convert the existing drawing to black ink with transparent paper. */}
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.2126 -0.7152 -0.0722 1 0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="1.03" intercept="-0.03" />
          </feComponentTransfer>
        </filter>
        <clipPath id="packaging-hero-sketch-crop">
          <rect x="90" y="48" width={sketchWidth} height={sketchHeight - 2} />
        </clipPath>
      </defs>
      <image className="packaging-hero-sketch-layer" href={assetUrl(sketch)}
        x="90" y="46" width={sketchWidth} height={sketchHeight}
        filter="url(#packaging-hero-sketch-ink)" clipPath="url(#packaging-hero-sketch-crop)" />
      <image className="packaging-hero-box-layer" href={assetUrl(object)}
        x={640 - 15 - boxWidth} y={46 - sketchHeight * 86 / 1274}
        width={boxWidth} height={boxHeight} />
    </svg>
  );
}
