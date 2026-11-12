#!/usr/bin/env bash
# Joins the three Higgsfield clips (V1 K0->K1, V2 K1->K2, V3 K2->K3) into one continuous film and
# exports it as a scroll-scrubbed frame sequence.
#   bash scripts/build_film.sh [fps] [quality]
# Each clip's last frame and the next clip's first frame are the same Gemini keyframe; a 0.3 s blend
# hides the small sharpness/exposure difference the video model leaves at the seam (not a visible transition).
set -euo pipefail
cd "$(dirname "$0")/.."
FPS=${1:-20}
Q=${2:-78}
OUT=public/film
rm -rf "$OUT" && mkdir -p "$OUT"
ffmpeg -v error -y -i paket/film/v1.mp4 -i paket/film/v2.mp4 -i paket/film/v3.mp4 -filter_complex \
  "[0:v]settb=AVTB,fps=30[a];[1:v]settb=AVTB,fps=30[b];[2:v]settb=AVTB,fps=30[c];\
   [a][b]xfade=transition=fade:duration=0.3:offset=4.7[ab];\
   [ab][c]xfade=transition=fade:duration=0.3:offset=9.4,fps=${FPS},scale=1280:-2:flags=lanczos,format=yuv420p[v]" \
  -map "[v]" -c:v libwebp -quality "$Q" -compression_level 6 "$OUT/f%04d.webp"
# lighter set for phones
mkdir -p "$OUT/m"
for f in "$OUT"/f*.webp; do
  ffmpeg -v error -y -i "$f" -vf scale=960:-2:flags=lanczos -c:v libwebp -quality 70 "$OUT/m/$(basename "$f")"
done
COUNT=$(ls "$OUT"/f*.webp | wc -l)
echo "{ \"count\": $COUNT, \"fps\": $FPS }" > "$OUT/manifest.json"
echo "frames: $COUNT  desktop: $(du -sh --exclude=m "$OUT" | cut -f1)  mobile: $(du -sh "$OUT/m" | cut -f1)"
