#!/usr/bin/env bash
set -euo pipefail
# Usage: bash scripts/extract-frames.sh source.mp4 hero
SOURCE="${1:?Usage: extract-frames.sh VIDEO.mp4 hero|finale|floor}"
SCENE="${2:?Specify scene name}"
mkdir -p "public/media/$SCENE"
rm -f "public/media/$SCENE"/*.webp
ffmpeg -y -i "$SOURCE" -vf 'fps=12,scale=1152:-2:flags=lanczos' -c:v libwebp -quality 78 -compression_level 5 "public/media/$SCENE/%04d.webp"
echo "Frames created: $(find "public/media/$SCENE" -name '*.webp' | wc -l)"
echo 'Set media.ts frames to the exact count above.'
