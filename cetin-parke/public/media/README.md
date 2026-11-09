# Scroll-driven frame sequences — NO VIDEO PLAYBACK

Place sequence images into:

- `hero/0001.webp` through `hero/0144.webp`
- `finale/0001.webp` through `finale/0144.webp`
- Optional `floor/` for a later true architectural transformation sequence

The website never plays an MP4. Each frame is selected solely by the visitor's scroll position.
Use `bash scripts/extract-frames.sh generated.mp4 hero` to convert a Higgsfield export into an image sequence (requires ffmpeg). Set `frames` in `lib/media.ts` to the actual output count. Until frames arrive, the site shows the static poster and real scroll-controlled CSS transitions.
