# Vercel preview deployment

This project is a Next.js app, not a standalone HTML page.

## Option A — GitHub → Vercel (recommended)

1. Extract this ZIP. Upload the **contents of the extracted folder** to a new GitHub repository; `package.json` and `app/` must be at repository root.
2. In Vercel select **Add New → Project → Import Git Repository** and choose that repo.
3. Framework preset: **Next.js**; Root Directory: `./`; Build Command: `npm run build`; install command: `npm install`.
4. Deploy. Wait for build success before opening the preview URL.

## Option B — Vercel CLI

```bash
npm install
npm run typecheck
npm run build
npx vercel
```

Do not set `NEXT_PUBLIC_SITE_URL` until there is an actual production domain. Search indexing is intentionally off for this customer demo.

## Preview checks

- On the hero, scroll down: top-right frame counter must change 001→072.
- Stop scrolling: frame must freeze, and moving upward must reverse it.
- The floor section has an independent 72-frame sequence; the finale has one too.
- Test both desktop and Android/iOS mobile; image sequences and remote editorial photos must load.
- Check click-to-WhatsApp and category navigation.

## Reality check

The ZIP contains real Next.js source code and 216 locally generated demo frames. It does **not** yet contain the finished Higgsfield clip's extracted frames; the output is documented in `HIGGSFIELD-RESULT.md`. Build validation is not possible in the source creation environment because the npm package registry is unavailable. Do not present this as a live-tested or customer-approved production release.
