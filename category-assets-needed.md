# Category Assets Needed

The category cards are now asset-driven from `src/data/siteContent.ts`.

Current placeholder files live in `public/assets/categories/`. Your wife can replace these files later, or add new image files and update the paths in `categories` inside `src/data/siteContent.ts`.

## Recommended Asset Specs

- Background/sketch asset: wide composition, transparent or white background, `1600 x 900` or similar.
- Floating object asset: transparent PNG/WebP/SVG, square canvas, `800 x 800` recommended.
- Optional hover animation: transparent GIF/WebP, same canvas as floating object.
- Keep filenames lowercase with hyphens.

## Required Per Category

| Category | Background/sketch | Floating object | Optional hover animation |
| --- | --- | --- | --- |
| Packaging | `public/assets/categories/packaging-sketch.svg` | `public/assets/categories/packaging-object.svg` | `public/assets/categories/packaging-object-hover.gif` |
| Fashion | `public/assets/categories/fashion-sketch.svg` | `public/assets/categories/fashion-object.svg` | `public/assets/categories/fashion-object-hover.gif` |
| Video | `public/assets/video/video_wireframe.jpeg` | `public/assets/video/gimbal_still.webp` | `public/assets/video/gimbal_rotate.gif` |
| Branding | `public/assets/categories/branding-sketch.svg` | `public/assets/categories/branding-object.svg` | `public/assets/categories/branding-object-hover.gif` |
| Illustration | `public/assets/categories/illustration-sketch.svg` | `public/assets/categories/illustration-object.svg` | `public/assets/categories/illustration-object-hover.gif` |
| Web Design | `public/assets/categories/web-design-sketch.svg` | `public/assets/categories/web-design-object.svg` | `public/assets/categories/web-design-object-hover.gif` |

## Notes

- The optional hover animations are not wired for the placeholder categories yet. When a hover file is ready, add its path as `objectHover` for that category in `src/data/siteContent.ts`.
- If final files are PNG or WebP instead of SVG, either keep the paths updated in `src/data/siteContent.ts` or replace the placeholder SVG names with the new extension there.
- For best visual match, the background should look like the sketch/wireframe layer, and the floating object should be the polished 3D/object layer.
