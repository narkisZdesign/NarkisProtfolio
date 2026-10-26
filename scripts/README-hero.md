# Hero media pipeline

The desktop homepage uses **home hero.mp4** (24 fps, 241 frames). Its opening
plays from 00:00 through exactly 00:02. Scroll frame 001 is source frame 48,
at 00:02; frame 193 is the last source frame, at 00:10. The dedicated mobile
source and its three-second handoff are described below.

Rebuild the desktop assets (and legacy portrait crop) from the repository root:

```powershell
python scripts/build-home-hero.py --source 'PATH-TO-home hero.mp4'
```

This requires only FFmpeg and ffprobe on PATH. Output goes to
`public/assets/hero/home-hero/{wide,portrait}/`, with timing metadata in
`src/data/heroMedia.json`. The muted intro includes the 00:02 frame; a video
frame callback pauses playback at that timestamp. The first decoded scroll
frame replaces it only when ready. Scrolling during the opening does not
interrupt playback; the current position becomes the scroll starting point
when the opening finishes. The remaining frames advance with native scroll
over the remaining hero distance. During the latter part of the desktop scroll,
the centered framing eases into the 1180 × 478 crop from the supplied reference.
The video scales uniformly.
The pinning distance remains two viewport heights while the frame changes size.
A narrow 16–28 px edge fade appears only over the final 6% of progress,
below the character's feet. The hero edge, work section and About background
share `--bg`. During the last 18% of the animation, an off-thread surface grade
lifts the neutral gray seating toward that background color while retaining
the character and local foot shadows. Graded frames use the existing bounded
cache; no pixel processing runs in the scroll handler. Reduced-motion visitors
receive the same surface treatment on the static final poster.

## Mobile homepage source

At widths up to 760px, the homepage uses `mobile_home_hero_video.mp4` through
its own `assets/hero/mobile-home-hero/` assets and `src/data/mobileHeroMedia.json`.
The desktop `wide` assets, two-second intro and scroll timing remain unchanged.

```powershell
python scripts/build-mobile-home-hero.py --source 'PATH-TO-mobile_home_hero_video.mp4'
```

The mobile intro stays at 00:00 while the viewing notice is open. Continuing,
closing the notice, or dismissing it with Escape starts the muted inline intro.
If the notice was dismissed earlier in the tab, playback starts immediately.
Both phases include source frame 72 at exactly 00:03. After the intro, the
remaining 289 source frames follow scroll position, in either direction, through
00:15. Early scrolling does not skip the opening; its position becomes the
handoff's starting point. The new portrait artwork is rendered without the
desktop seating grade. Reduced-motion visitors keep the static final poster.

## Previous extended hero

`build-hero.py` protects the original 3840 × 2160 center and adds 600 pixels of
background on each side. It does not regenerate the woman, lettering or camera
motion. Six Higgsfield FLUX.2 Pro outpaint references supply low-frequency
background lighting; tracked source edges determine wall and floor boundaries.

The source is 592 frames at 60 fps. The intro contains frames 0–193; the 399-frame
scroll sequence contains frames 193–591. The shared frame makes the handoff
continuous. Both responsive variants use exactly the same timestamps.

## Rebuild

Install Python dependencies `numpy` and `opencv-python-headless`, and put FFmpeg
and ffprobe on PATH. Run from the repository root:

```powershell
python scripts/build-hero.py --source 'PATH-TO-ORIGINAL.mp4'
```

The working folder defaults to the ignored `source_assets/hero-extension/`.
It contains `anchor_0.png` through `anchor_5.png`, `anchor-matches.json`, and
`generations.json` with reference provenance. The anchor source-frame indices
are `[1, 132, 263, 378, 450, 589]`. Extract the tracking frames first if absent:

```powershell
ffmpeg -i 'PATH-TO-ORIGINAL.mp4' -vf scale=960:540 source_assets/hero-extension/tracking/frame_%04d.png
```

Use `--preview` to inspect a contact sheet without replacing production media.
Each production render asserts that every original center pixel is identical
before video compression. The master and reference files stay outside the
deployed assets.

## Outputs

- Working folder: 5040 × 2160 master, 2520 × 1080 web video, 720 × 1280 portrait
  video, contact sheets and pixel-preservation verification.
- `public/assets/hero/wide/`: intro video, posters and 1920 × 824 WebP scroll frames.
- `public/assets/hero/portrait/`: 720 × 1280 intro video, posters and scroll frames.

The frontend uses native scroll progress over two viewport heights and a single
animation-frame loop. Layout is measured on actual viewport/header resizes,
not on the animated stage's changing dimensions. The idle animation clock resets
so the first scroll input eases in at the normal frame cadence.

The loader warms compressed frames during the opening (bounded at 20 MiB desktop
/ 12 MiB phone), independently of its 24 desktop / 20 phone decoded-frame cache.
At most four downloads and three decodes run together. The current frame and
predicted upcoming frames take priority, useful late decodes remain cached, and
fallback frames advance in the playback direction. Reversing reuses compressed
frames instead of downloading the sequence again. Loading pauses when the hero
is out of view or the document is hidden. The seating worker accesses only the
bottom region and reuses spatial coefficients without changing the color grade.

Run the cache/priority/disposal regression checks with `npm run test:hero`
(Node 24). Failed requests keep
the last drawn frame; initial media failure uses the final poster. Reduced-motion
visitors receive a static hero with no video or frame sequence requests.
