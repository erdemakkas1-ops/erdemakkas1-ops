/** Prefix public/ paths with the GitHub Pages base path when the site is exported under a sub-folder. */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
