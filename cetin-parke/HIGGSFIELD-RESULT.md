# Higgsfield — completed first scene (reference asset)

The first 6-second/720p image-to-video generation finished successfully.

- Job ID: `3644e4ff-c9c4-48c2-9c7d-087e9f1c9328`
- Model: `seedance_2_5`
- Exact reference: `public/images/cetin-parke-salon-reference.png`
- Output URL: `https://d8j0ntlcm91z4.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/hf_20261106_052706_3644e4ff-c9c4-48c2-9c7d-087e9f1c9328.mp4`

**Status:** Video generated but could not be fetched into the creation container due to external download restrictions. It is not embedded in the current ZIP. The website **does not autoplay video**; the shipped hero is a placeholder *72-frame scroll-driven WebP sequence*. No additional paid jobs were submitted.

When the video file is available in the project folder, run:

```bash
# Requires FFmpeg installed on your machine
bash scripts/extract-frames.sh higgsfield-hero.mp4 hero
```

This replaces `public/media/hero/` with 72 scrub-controlled WebP still frames (12 fps × 6 sec). Check that the video preserves the room accurately before using it. See `scripts/extract-frames.sh`.
