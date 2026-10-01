"""Build the portfolio hero from the original, with protected source pixels.

Requires ffmpeg/ffprobe, numpy, opencv-python-headless. The working directory
contains anchor_0.png .. anchor_5.png and anchor-matches.json from Higgsfield.
Only background strips are synthesized; the 3840x2160 source is copied exactly.
"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys

parser = argparse.ArgumentParser()
parser.add_argument("--source", required=True)
parser.add_argument("--work", default="source_assets/hero-extension")
parser.add_argument("--assets", default="public/assets/hero")
parser.add_argument("--preview", action="store_true")
args = parser.parse_args()
work = Path(args.work)
sys.path.insert(0, str(work / "python-deps"))
import cv2
import numpy as np

cv2.setNumThreads(4)
WIDTH, HEIGHT, PAD, FPS = 3840, 2160, 600, 60
INTRO_FRAMES = 194
FIRST_SCROLL = INTRO_FRAMES - 1
meta = json.loads(subprocess.check_output([
    "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
    "stream=width,height,nb_frames,r_frame_rate", "-of", "json", args.source
]))["streams"][0]
assert (meta["width"], meta["height"], meta["r_frame_rate"]) == (WIDTH, HEIGHT, "60/1")
COUNT = int(meta["nb_frames"])
anchor_indices = json.loads((work / "anchor-matches.json").read_text())

# Track camera motion on the original low-resolution footage. Robust estimation
# discards local character/letter animation; unsupported estimates remain stable.
tracking_files = sorted((work / "tracking").glob("*.png"))
assert len(tracking_files) == COUNT
transforms = [np.eye(3)]
previous = cv2.imread(str(tracking_files[0]), cv2.IMREAD_GRAYSCALE)
for path in tracking_files[1:]:
    current = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
    points = cv2.goodFeaturesToTrack(previous, 180, .02, 12)
    transform = np.eye(3)
    if points is not None and len(points) >= 12:
        tracked, status, _ = cv2.calcOpticalFlowPyrLK(previous, current, points, None)
        good = status.ravel() == 1
        if good.sum() >= 12:
            affine, inliers = cv2.estimateAffinePartial2D(points[good], tracked[good], method=cv2.RANSAC, ransacReprojThreshold=2)
            if affine is not None:
                scale = np.hypot(affine[0, 0], affine[0, 1])
                if .96 < scale < 1.04 and np.max(np.abs(affine[:, 2])) < 18:
                    transform[:2] = affine
    transforms.append(transform @ transforms[-1])
    previous = current

anchors = []
for i in range(len(anchor_indices)):
    painted = cv2.resize(cv2.imread(str(work / f"anchor_{i}.png")), (1260, 540))
    # Reference models may invent geometry outside the frame. Use only their
    # low-frequency wall lighting/texture; source boundaries own all geometry.
    painted = cv2.GaussianBlur(painted.astype(np.float32), (0, 0), 12)
    anchors.append(painted)

def tracked_reference(anchor, frame):
    relative = transforms[frame] @ np.linalg.inv(transforms[anchor_indices[anchor]])
    pad_transform = np.array([[1., 0., 150.], [0., 1., 0.], [0., 0., 1.]])
    relative = pad_transform @ relative @ np.linalg.inv(pad_transform)
    return cv2.warpAffine(anchors[anchor], relative[:2], (1260, 540), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

def side_reference(frame):
    right = int(np.searchsorted(anchor_indices, frame, side="right"))
    right = min(max(1, right), len(anchors) - 1)
    left = right - 1
    fraction = np.clip((frame - anchor_indices[left]) / max(1, anchor_indices[right] - anchor_indices[left]), 0., 1.)
    fraction = fraction * fraction * (3 - 2 * fraction)
    return tracked_reference(left, frame) * (1 - fraction) + tracked_reference(right, frame) * fraction

def extend(source, index):
    reference = side_reference(index)
    output = np.empty((HEIGHT, WIDTH + PAD * 2, 3), np.uint8)
    for side in (0, 1):
        # Work from the inner seam outward. The original edge drives color and
        # floor/wall boundaries every frame, preventing drifting seams/flicker.
        edge = source[:, 0 if side == 0 else -1].astype(np.float32)
        strip = reference[:, :150][:, ::-1] if side == 0 else reference[:, -150:]
        strip = cv2.resize(strip, (PAD, HEIGHT))
        reference_seam = strip[:, :1]
        distance = np.linspace(0., 1., PAD, dtype=np.float32)[None, :, None]
        # Low-amplitude reference lighting cannot introduce generated furniture.
        lighting = np.clip(strip - reference_seam, -12, 12) * distance ** .7
        result = np.clip(edge[:, None, :] + lighting, 0, 255).astype(np.uint8)
        if side == 0: output[:, :PAD] = result[:, ::-1]
        else: output[:, -PAD:] = result
    output[:, PAD:PAD + WIDTH] = source
    # A lossless assertion BEFORE codec compression protects all source pixels.
    assert np.array_equal(output[:, PAD:PAD + WIDTH], source)
    return output

def portrait(source, index):
    # The sketch/figure centers at x=54%; later the seated woman is at x=53.3%.
    progress = np.clip(index / 450, 0., 1.)
    center = WIDTH * (.54 * (1 - progress) + .533 * progress)
    crop_width = int(HEIGHT * 9 / 16)
    left = round(center - crop_width / 2)
    return cv2.resize(source[:, left:left + crop_width], (720, 1280), interpolation=cv2.INTER_AREA)

def reader():
    return subprocess.Popen(["ffmpeg", "-v", "error", "-i", args.source, "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)

def encoder(path, size, crf):
    return subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", size,
        "-r", str(FPS), "-i", "-", "-an", "-c:v", "libx264", "-preset", "fast", "-crf", str(crf),
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(path)], stdin=subprocess.PIPE)

assets = Path(args.assets)
for variant in ("wide", "portrait"):
    (assets / variant / "frames").mkdir(parents=True, exist_ok=True)
capture = reader()
writers = None if args.preview else [encoder(work / "hero-wide-master.mp4", "5040x2160", 15),
    encoder(work / "hero-wide-web.mp4", "2520x1080", 19), encoder(work / "hero-portrait.mp4", "720x1280", 19)]
samples = list(range(0, COUNT, 40)) + [FIRST_SCROLL, COUNT - 1]
sheet = []
for index in range(COUNT):
    data = capture.stdout.read(WIDTH * HEIGHT * 3)
    assert len(data) == WIDTH * HEIGHT * 3, f"Incomplete source frame {index}"
    if args.preview and index not in samples: continue
    source = np.frombuffer(data, np.uint8).reshape(HEIGHT, WIDTH, 3)
    full = extend(source, index)
    wide = cv2.resize(full, (2520, 1080), interpolation=cv2.INTER_AREA)
    phone = portrait(source, index)
    if writers:
        for writer, frame in zip(writers, (full, wide, phone)):
            writer.stdin.write(frame.tobytes())
        for variant, frame in (("wide", wide), ("portrait", phone)):
            root = assets / variant
            if index >= FIRST_SCROLL:
                scroll_frame = cv2.resize(frame, (1920, 824), interpolation=cv2.INTER_AREA) if variant == "wide" else frame
                cv2.imwrite(str(root / "frames" / f"frame_{index - FIRST_SCROLL + 1:03d}.webp"), scroll_frame, [cv2.IMWRITE_WEBP_QUALITY, 82])
            if index in (0, COUNT - 1):
                cv2.imwrite(str(root / ("intro-poster.webp" if index == 0 else "final-poster.webp")), frame, [cv2.IMWRITE_WEBP_QUALITY, 90])
    if index in samples:
        small = cv2.resize(wide, (840, 360))
        cv2.putText(small, f"{index / FPS:.2f}s", (10, 25), cv2.FONT_HERSHEY_SIMPLEX, .7, (0, 0, 255), 2)
        sheet.append(small)
        cv2.imwrite(str(work / f"review_{index:03d}.jpg"), wide)
    if index % 60 == 0: print(f"Processed {index}/{COUNT}", flush=True)
assert capture.wait() == 0
if writers:
    for writer in writers:
        writer.stdin.close()
        assert writer.wait() == 0
    for variant, name in (("wide", "hero-wide-web.mp4"), ("portrait", "hero-portrait.mp4")):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(work / name), "-frames:v", str(INTRO_FRAMES),
            "-an", "-c:v", "libx264", "-crf", "19", "-preset", "fast", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            str(assets / variant / "intro.mp4")], check=True)
    (work / "verification.json").write_text(json.dumps({"frames": COUNT, "fps": FPS, "scrollFrames": COUNT - FIRST_SCROLL,
        "introFrames": INTRO_FRAMES, "masterSize": [5040, 2160], "originalCenterPixelExactBeforeEncoding": True,
        "source": args.source, "anchorFrames": anchor_indices}, indent=2))
if len(sheet) % 2: sheet.append(np.zeros_like(sheet[0]))
cv2.imwrite(str(work / "review-sheet.jpg"), np.vstack([np.hstack(sheet[i:i + 2]) for i in range(0, len(sheet), 2)]))
print("Hero assets complete", flush=True)
