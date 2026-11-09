# ÇETİN PARKE — HIGGSFIELD VIDEO PRODUCTION

**IMPORTANT:** These are conceptual architectural scenes, not actual installed products. Do not represent them as real Çetin Parke work. Get the business owner's approval for products, logo, and copy prior to public launch.

## Global visual consistency protocol

1. Generate the **first still frame** as a reference for the complete house: contemporary Turkish premium home, warm oak elements, limestone walls, large window on the right, warm midday daylight, cream sofa on the left, walnut coffee table, minimal decor, straight architectural lines.
2. Save a high-quality first still and a last-frame still from every clip. Use the previous scene's last frame as reference for the following clip when the Higgsfield workflow supports image-to-video / first-last frame conditioning.
3. Keep **camera path and room layout consistent**. Independent text-to-video requests frequently create mismatched architecture. Prefer image-to-video with reference frames.
4. Render at **16:9**, ideally **1920×1080**, 24fps, about **6 seconds** per clip. Ask for stable, slow, constant camera movement, minimal blur, no dialogue, no text.
5. Do not generate words, logos, floor brands, watermarks or people in the videos. Website overlays live in HTML for crisp typography.
6. For true frame-precise scroll, **image sequences (AVIF/WebP) may outperform frequent video seeking**. Validate after first clip before producing the full set. The component supports video seeking as an initial implementation, with still fallback.

## Scene 01 — Atrium / Salon / Intro

**Target filename:** `/public/media/01-salon-intro.mp4`

**Prompt (English):**

> An ultra-photorealistic premium architectural film showing a sophisticated modern living room in a newly renovated home in Turkey. The design language is warm contemporary minimalism: natural oak plank flooring, pale limestone walls, an elegant warm ivory sofa on the left, a refined walnut coffee table, floor-to-ceiling glazing on the right, soft and realistic midday daylight, physically accurate reflections, subtle natural shadows. Start from a wide, perfectly level composition, as if the viewer is standing at the threshold of the room. Perform one exceptionally smooth, slow, constant-speed dolly-in, moving 1.5 meters forward in six seconds. All furniture and architecture must remain geometrically stable. Stable horizon, vertical walls stay perfectly straight, consistent lens and exposure. High-end interior architecture commercial, physically based materials, lifelike color grading, rich but restrained atmosphere. No people, no words, no logos, no cuts, no rotation, no fisheye, no warping, no flicker. 16:9 composition, natural 24fps movement, ideal for frame-accurate scroll-controlled playback.

**Review criteria:** Windows, sofa and floor direction remain stable; dolly feels continuous. Export first and last frame.

## Scene 02 — Parke transformation / FLOOR

**Target filename:** `/public/media/02-zemin-donusumu.mp4`

**Prompt (English):**

> Continue from the exact same modern living room, identical camera, identical architecture and furniture, identical natural daylight and exposure as the provided reference frame. Cinematic low-angle view toward the living room floor. A tasteful, believable architectural finish transformation: pale unfinished flooring progressively becomes richly textured, realistic warm natural oak parquet, spreading in a single clean controlled wave from left to right. The floor boards are accurately aligned with the room perspective, natural wood grain, real scale, no floating planks, no magical objects. The camera makes only a very gentle straight forward drift, maintaining consistent framing. Existing walls, glazing, sofa, objects, geometry and lighting do not change. Luxury architectural design film, physically accurate wood reflections. No people, no text, no logo, no cut, no jitter, no camera shake, no material flicker, no abrupt jump. Exactly one progressive, smooth transition suitable for reverse and forward frame-by-frame scrubbing, 16:9, six seconds.

**Review criteria:** Continuous transformation, no unrelated furniture morphing. If Higgsfield fails stable floor-only transformation, use two aligned stills and an HTML/CSS wipe rather than shipping a broken transformation.

## Scene 03 — Finale / Completed Interior

**Target filename:** `/public/media/03-final-reveal.mp4`

**Prompt (English):**

> Return to the same exact completed luxurious contemporary living room with warm natural oak parquet flooring, limestone walls, cream sofa to the left and floor-to-ceiling windows to the right. Match the provided reference frames and architecture exactly. Single seamless slow cinematic camera dolly backward revealing more of the living room and clean doorway frame, elegant spatial depth, rich wood texture, soft midday sunlight and calm premium mood. Luxury European architectural advertisement, beautiful realistic materials, natural color science. Stable straight lines and stable camera speed. No people, no logos, no text, no cuts, no shake, no geometry changes, no flicker, no exposure shifts. Cinematic 16:9 framing, six seconds, 24fps, scroll-scrubbing-friendly continuous motion.

**Review criteria:** Exact room continuity; clear dark area on left for HTML final title and CTA.

## Suggested fallback for mismatched footage

Use still frames as architecturally consistent background images and build motion with scroll-controlled transforms/masks. This is better than visually broken AI transformation. Always review desktop and mobile cropping.

## Integration checklist

1. Copy files to `/public/media` with exact names.
2. Run the project; assets automatically replace stills after metadata loads.
3. Test scrolling back and forth on desktop and mobile Safari. Large MP4 seeking can be choppy; render low-GOP videos (keyframe every 0.25–0.5s) or convert frames to AVIF/WebP and implement canvas playback if needed.
4. Compare cumulative total download size and page responsiveness; defer loading scene videos not yet near viewport for production.
5. Replace all Unsplash mockups with licensed images, ideally real business photography, before public launch.
