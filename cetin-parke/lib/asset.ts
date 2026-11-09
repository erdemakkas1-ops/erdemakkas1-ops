/** Prefixes public/ paths with the deploy base path (GitHub Pages serves from a sub-folder). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
