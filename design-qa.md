# Mobile homepage design QA

## Follow-up: mobile Fashion page and Products card

final result: passed

- Scope: the Products card on the homepage and the Fashion page at up to 760 CSS px. Previous homepage/header/footer work is retained. All new layout overrides are inside this breakpoint.
- Source references: the seven user images in C:/Users/narki/AppData/Local/Temp/, starting with codex-clipboard-24208849-b93b-4d86-a263-34627a72a22e.png. The explicit instructions override the references: swap selected gallery photos 01 and 03 on mobile; leave the overview text background transparent.
- Evidence: C:/Users/narki/AppData/Local/Temp/narkis-fashion-mobile-qa/. Captures include mobile-products-card.png, mobile-hero.png, mobile-overview.png, mobile-gallery-sketch.png, mobile-more-embroidery.png, and mobile-tags-footer.png. The gallery/sketch and overview reference/render comparisons are comparison-gallery-sketch.png and comparison-overview.png; both were reviewed as composite images.
- Products: reuse the existing transparent stand asset, position it on the right, retain the sketch behind it, and keep the original desktop video unchanged.
- Fashion layout: title/copy/link, shirt artwork, three horizontal service chips; video with right-side copy and four translucent process cards; 2+3 selected gallery; five image-left/text-right sketch rows with downward arrows; More Designs copy above four images; embroidery and tags copy above three-image rows; short details-video strip; shared footer.
- Gallery order: visual rows [selected-03, selected-02] and [selected-01, selected-04, selected-05]. Desktop DOM/layout order remains 01–05. Mobile shows the supplied still photographs without sticky hover substitution.
- Responsive checks: 320, 375, 390, 430, 760 and requested 761 px. The in-app browser rounds the last request to 762 CSS px; the mobile override is absent there. All measured scroll widths equal client widths, with no overflowing text. Process cards retain two columns; a final check after icon sizing found no content outside cards at 320 or 760. Landscape 760 x 390 also has no horizontal overflow.
- Interaction checks: the Fashion category opens the page; the back link returns to #work after the existing homepage animation/layout settles; the shared menu opens and closes. The overview video plays muted with playsInline. Its text background measures rgba(0, 0, 0, 0). No current runtime errors after a fresh reload; a transient HMR error during editing was corrected before validation.
- Desktop preservation: 56 geometry/font/display records at 1440 x 900 and the 761/762 boundary match the pre-edit records within 0.01 px. The sticky header's document-space scroll offset is excluded. Large desktop screenshot capture was unavailable in this browser session, so this follow-up uses measured layout preservation rather than claiming pixel-identical screenshots.
- Validation: npm run build passed; npm run test:hero passed all seven tests. No dependencies, routes, APIs, or media files were added.
- Accepted fidelity limits: the original landscape overview video crops differently across phone widths and animation frames; the existing sketch-step assets are small, pre-cropped raster images. Typography, spacing, gallery crop and card sizing are fluid to preserve reading and avoid clipping. No actionable P0/P1/P2 issues remain within this scope.

## Previous homepage review

final result: passed

## Target and evidence

- Scope: homepage content at widths up to 760 CSS px; shared mobile header/footer on all routes. Desktop layout is preserved.
- Source visual truth: C:/Users/narki/AppData/Local/Temp/codex-clipboard-eab05bd7-8a82-4e05-8fdd-c84676a66018.png (hero), codex-clipboard-ba31612d-aa7b-4470-afb5-a9244a2540fc.png (work), codex-clipboard-ad164a9e-816c-4664-a588-6a7eb67dcfbf.png (About), codex-clipboard-7d9bdea0-4e4b-4540-911a-26b461e3db89.png (services/footer), in the same Temp directory.
- Source images: 941 x 1672 px. The user's subsequent correction overrides card order: Packaging / Products, then Fashion / Branding. WhatsApp remains an icon beside the menu.
- Browser: Codex in-app browser; no external Playwright fallback.
- Local implementation: http://127.0.0.1:5173/
- Evidence directory: C:/Users/narki/AppData/Local/Temp/narkis-mobile-qa/
- Mobile CSS viewport: 390 x 844. Browser screenshots: 375 x 811 px; approximately 0.96 image pixels per CSS pixel. The persistent desktop scrollbar is excluded from content comparisons. References are normalized to 360 content-image pixels wide. These are section comparisons, not exact viewport-height replicas.
- Full section comparisons: comparison-work.png, comparison-about.png, comparison-services.png. States: #work, #about, #services after scrolling/reveal transitions settle.
- Focused checks: header logo/WhatsApp/menu, card captions/arrows, About illustration edges and button, service dividers, footer contact links. Raw implementation captures: mobile-work.png, mobile-about.png, mobile-services.png, mobile-hero.png.
- Desktop evidence: desktop-before.png and desktop-after.png, plus desktop-before.json and desktop-verified.json. Same 1440 x 900 CSS viewport and held 00:02 hero state; screenshot size 1424 x 4574 px. All 33 measured layout/type/color records match exactly.

## Fidelity review and accepted differences

- Typography: mobile homepage uses the existing Inter font; headings, descriptions and captions have fluid sizes. No clipped text at tested widths. Desktop font and layout records remain unchanged.
- Spacing/layout: work is a 2 x 2 grid without horizontal scrolling; About reads heading/lead, illustration, paragraphs, CTA; services remain 2 x 3 even at 320 px; footer is centered with separate contact rows. Section spacing is fluid rather than fixed to the mockup's canvas height. Contact/header targets and the About CTA retain practical dimensions.
- Colors/tokens: existing petrol, warm background, white surfaces and peach accents are retained. Card arrows have no circular background; WhatsApp has no text or filled button in mobile.
- Assets: original logo, About artwork, service icons and category posters are reused. Fashion has a reliable still image on touch screens. No generated replacements or placeholder artwork.
- Copy: all homepage and contact copy preserved; no new routes or APIs.
- Intentional hero difference: the user chose the existing animation over a newly composed mobile asset. The original portrait media is already cropped; the implementation adds no further crop, keeps its 9:16 ratio, and does not claim an exact match to the complete lettering/wave in the supplied still. Two-second intro, scroll-controlled continuation and existing cache remain intact.

## Comparison history

1. First desktop check caught an 8 px paragraph-margin change from inserting the hidden mobile artwork. Restored the adjacent paragraph rule. Final desktop comparison: zero differences.
2. First reference comparison identified a clipped left edge of the About background and overly heavy mobile typography. Adjusted illustration crop and selected the already-loaded Inter font for mobile only; updated comparisons show the natural artwork edge.
3. Inter changed the CTA text width and initially wrapped View my work. Increased its width, reduced internal gap, and kept its label on one line. Final About capture confirms the correction.
4. First 320 px browser check exposed overflow from the old body minimum width plus a desktop scrollbar. Reset the minimum width in the mobile breakpoint. Final client width and scroll width both equal 305 px in that browser viewport.
5. Added mobile anchor clearance to About/services so reveal/layout settling cannot put a heading under the sticky header. Final About title top: 76.875 px; header bottom: 64 px.
6. Tightened service row padding/icon sizing and contact row spacing after reference comparison. The final services/footer capture uses the revised spacing.

## Functional and responsive checks

| Check | Result |
| --- | --- |
| Build/type check: npm run build | Passed |
| Existing frame/cache regression suite: npm run test:hero | 7 passed |
| Page identity, meaningful content, framework error overlay | Passed; correct title/content, no overlay |
| Console health on application URL | No relevant warnings/errors |
| Widths 320, 375, 390, 430, 760 and 761 | No document overflow or clipped text; two mobile columns, previous desktop/tablet rules above breakpoint |
| Breakpoint rounding | In-app browser requested 761 but reported 762 due viewport rounding; desktop branch verified |
| Landscape 760 x 390, then portrait | No overflow; portrait canvas remains 720 x 1280 |
| Header/menu | WhatsApp outside nav with correct wa.me destination; 44 x 44 targets; open/close/Escape work |
| Work links | All four hrefs retained; visual order Packaging/Products/Fashion/Branding verified; Products navigation exercised |
| Shared project chrome | Products route has 44 px menu/WhatsApp targets and vertically stacked footer contacts |
| Hero intro | Video paused at exactly 2 seconds; first scroll frame is frame 1 at time 2 |
| Hero scroll/reverse | Forward progression to frame 193 at time 10; reverse returns to earlier frames |
| Hero arrow and About CTA | Both navigate to #work; state confirmed after transitions settle |
| Contact links | Correct mailto:narkis300@gmail.com and tel:+972504225510; no message/call sent |
| Reduced-motion branch | Isolated built-app fixture: phase static, frame 193, final poster loaded, no intro video, section height about 667 px |
| Media failure | Isolated built-app fixture returns 404 for intro/portrait frames; phase fallback, loaded final poster, caption visible, video hidden |

Reduced-motion and failure fixtures live outside the repository and simulate those inputs against the built application. They do not alter OS preferences or production sources. Native iOS/Safari hardware was not available; physical-device verification remains a test gap. No actionable P0/P1/P2 findings remain. Minor differences in illustration rendering, font wrapping and fluid section spacing follow reuse of the existing assets and responsive typography.
