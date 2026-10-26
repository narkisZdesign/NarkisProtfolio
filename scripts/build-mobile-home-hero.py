"""Build mobile-only hero assets without changing the desktop media or timing."""
import argparse
from fractions import Fraction
import json
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("--source", required=True)
args = parser.parse_args()
repo = Path(__file__).resolve().parents[1]
asset_root = "assets/hero/mobile-home-hero"
root = repo / "public" / asset_root
(root / "frames").mkdir(parents=True, exist_ok=True)
info = json.loads(subprocess.check_output([
    "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
    "stream=width,height,nb_frames,r_frame_rate", "-of", "json", args.source,
]))["streams"][0]
fps = Fraction(info["r_frame_rate"])
first_scroll = 3 * fps
assert first_scroll.denominator == 1, "The three-second boundary must be a source frame."
first_scroll = int(first_scroll)
last_frame = int(info["nb_frames"]) - 1
assert last_frame > first_scroll
assert int(info["width"]) * 16 == int(info["height"]) * 9, "A portrait 9:16 source is required."
sizing = "scale=720:1280:flags=lanczos"

def render(output, filters, *options):
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", args.source, "-an", "-vf", filters,
        *options, str(output),
    ], check=True)

# Include the boundary frame at 00:03 in both phases for a continuous handoff.
render(root / "intro.mp4", sizing,
       "-frames:v", str(first_scroll + 1), "-c:v", "libx264", "-preset", "fast",
       "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart")
render(root / "frames/frame_%03d.webp", f"select=gte(n\\,{first_scroll}),{sizing}",
       "-fps_mode", "passthrough", "-c:v", "libwebp", "-quality", "88",
       "-compression_level", "4", "-threads", "4", "-start_number", "1")
for filename, index in (("intro-poster.webp", 0), ("final-poster.webp", last_frame)):
    render(root / filename, f"select=eq(n\\,{index}),{sizing}",
           "-frames:v", "1", "-c:v", "libwebp", "-quality", "92")
count = last_frame - first_scroll + 1
assert len(list((root / "frames").glob("*.webp"))) == count
metadata = {
    "assetRoot": asset_root,
    "sourceName": Path(args.source).name,
    "fps": float(fps),
    "introSeconds": 3,
    "firstScrollFrame": first_scroll,
    "frameCount": count,
    "lastFrameSeconds": float(Fraction(last_frame, 1) / fps),
}
(repo / "src/data/mobileHeroMedia.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
print(json.dumps(metadata, indent=2))
