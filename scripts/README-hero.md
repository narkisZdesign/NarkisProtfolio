# Hero media pipeline

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

The frontend uses native scroll progress over two viewport heights, a single
animation-frame loop, and a decoded-frame cache capped at 24 desktop / 20 phone
frames. The canvas render resolution is capped separately. Failed requests keep
the last drawn frame; initial media failure uses the final poster. Reduced-motion
visitors receive a static hero with no video or frame sequence requests.
