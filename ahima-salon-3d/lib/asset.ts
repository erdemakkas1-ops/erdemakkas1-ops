/** Prefix public/ paths with the GitHub Pages base path when the site is exported under a sub-folder. */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;

export const MODELS = {
  shell: asset('/models/00_shell.glb'),
  surfaces: asset('/models/01_surfaces.glb'),
  furniture: asset('/models/02_furniture.glb'),
  details: asset('/models/03_details.glb'),
};
