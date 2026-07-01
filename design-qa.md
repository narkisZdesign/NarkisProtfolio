# Design QA

final result: passed

## Source References

- Full-page reference: `C:\Projects\Nprotfolio\full_first_page.jpg`
- Hero reference: `C:\Projects\Nprotfolio\hero.jpg`
- Categories reference: `C:\Projects\Nprotfolio\categories.png`
- About reference: `C:\Projects\Nprotfolio\about_me.png`
- Motion reference: `C:\Projects\Nprotfolio\scrolling_animation_video.mp4`
- Original source frame sequence: `C:\Projects\Nprotfolio\source_assets\video_frames\frame_001.png` through `frame_200.png`
- Hosted optimized frame sequence: `C:\Projects\Nprotfolio\public\assets\hero_frames\frame_001.webp` through `frame_200.webp`

## Rendered Evidence

- Local URL: `http://127.0.0.1:5173`
- Desktop screenshot: `C:\Users\zomry\AppData\Local\Temp\nportfolio-qa\desktop-passed-2.png`
- Mobile screenshot: `C:\Users\zomry\AppData\Local\Temp\nportfolio-qa\mobile-passed.png`
- Scroll-frame screenshot: `C:\Users\zomry\AppData\Local\Temp\nportfolio-qa\scroll-frames-final.png`
- Browser path: in-app Browser plugin failed during setup with a local runtime path error, so QA used Python Playwright 1.58.0 as fallback.

## Checks

- Build: passed with `npm run build`.
- Page identity: title is `Narkis Zur | Graphic Designer`.
- Blank-page check: passed; rendered body includes `Narkis Zur`, `Packaging`, and `About Me`.
- Framework overlay: none visible in screenshots.
- Console health: passed; no warnings or errors captured during QA.
- Interaction proof: the Work nav anchor moves to `http://127.0.0.1:5173/#work`.
- Contact proof: CTA uses `mailto:hello@narkiszur.com`.
- Hero scroll animation proof: initial frame is `frame_001.webp`; after six wheel events the hero reaches `frame_040.webp` while `scrollY` remains `0`; after the sequence completes it reaches `frame_200.webp`, and later wheel input scrolls down the page.
- Responsive proof: desktop `1366x900` and mobile `390x844` screenshots captured.
- Category card proof: Video category uses `video_wireframe.jpeg`, `gimbal_still.webp`, and `gimbal_rotate.gif`; hover/focus changes the visible gimbal layer from still image to GIF.

## Fidelity Ledger

- Hero: uses the optimized 200-frame WebP sequence derived from the supplied PNG frames, transitioning from sketch to polished teal studio before normal downward scrolling. Visible duplicate hero heading was removed; code keeps an accessible H1.
- Categories: uses `categories.png` as the artwork source, with code-native card labels and arrow controls. Slight source-label ghosting remains under some cards because the original artwork contains baked-in text, but it is muted and does not block readability.
- Video category: rebuilt as the first reusable framed category card with an inner visual frame, lower label row, floating gimbal, and GIF rotation on hover/focus.
- About: uses a cropped portion of `about_me.png` for the avatar/notebook artwork so the service/process/tool panels are not duplicated inside the image.
- Services/process/tools: rebuilt as code-native panels with matching rounded surfaces, teal icon language, compact typography, and soft shadows.
- Motion: top-of-page wheel, touch, and keyboard scroll input advances the hero frames before normal page scrolling; reveal-on-scroll and hover lift continue below the hero, with reduced-motion support.
- Mobile: collapses into a single-column portfolio page with a working compact menu and readable card/panel content.

## Acceptance

The implementation is faithful to the accepted design direction and source images for V1. Remaining differences are intentional implementation choices for a responsive, editable, code-native website rather than a single static screenshot.
