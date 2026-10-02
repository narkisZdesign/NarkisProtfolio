"""Prepare the homepage's two-second opening and matching scroll frames.

Requires only Python, ffmpeg and ffprobe. No artwork is regenerated.
"""
import argparse
from fractions import Fraction
import json
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("--source", required=True)
args = parser.parse_args()
repo = Path(__file__).resolve().parents[1]
assets = repo / "public/assets/hero/home-hero"
info = json.loads(subprocess.check_output([
    "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
    "stream=width,height,nb_frames,r_frame_rate", "-of", "json", args.source,
]))["streams"][0]
fps = Fraction(info["r_frame_rate"])
intro_seconds = 2
first_scroll = intro_seconds * fps
assert first_scroll.denominator == 1, "The two-second boundary must be a source frame."
first_scroll = int(first_scroll)
last_frame = int(info["nb_frames"]) - 1
assert last_frame > first_scroll

variants = {
    "wide": "scale=1920:824:flags=lanczos",
    "portrait": (
        f"crop=trunc(ih*9/16/2)*2:ih:trunc(iw*0.535-ow/2):0,"
        "scale=720:1280:flags=lanczos"
    ),
}

def render(output, filters, *options):
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", args.source, "-an", "-vf", filters,
        *options, str(output),
    ], check=True)

for variant, sizing in variants.items():
    root = assets / variant
    (root / "frames").mkdir(parents=True, exist_ok=True)
    # Include the 00:02 frame, then let the frontend pause exactly at 00:02.
    # The extra encoded frame is the same timestamp as scroll frame 001.
    render(root / "intro.mp4", sizing,
           "-frames:v", str(first_scroll + 1), "-c:v", "libx264", "-preset", "fast",
           "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart")
    render(root / "frames/frame_%03d.webp", f"select=gte(n\\,{first_scroll}),{sizing}",
           "-fps_mode", "passthrough", "-c:v", "libwebp", "-quality", "88",
           "-compression_level", "4", "-threads", "4", "-start_number", "1")
    for filename, index in (("intro-poster.webp", 0), ("final-poster.webp", last_frame)):
        render(root / filename, f"select=eq(n\\,{index}),{sizing}",
               "-frames:v", "1", "-c:v", "libwebp", "-quality", "92")
    count = len(list((root / "frames").glob("*.webp")))
    assert count == last_frame - first_scroll + 1
    print(f"{variant}: {count} scroll frames, opening stops at {intro_seconds}s", flush=True)

metadata = {
    "assetRoot": "assets/hero/home-hero",
    "sourceName": Path(args.source).name,
    "fps": float(fps),
    "introSeconds": intro_seconds,
    "firstScrollFrame": first_scroll,
    "frameCount": last_frame - first_scroll + 1,
    "lastFrameSeconds": float(Fraction(last_frame, 1) / fps),
    "wideWidth": 1920,
    "wideHeight": 824,
}
(repo / "src/data/heroMedia.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
