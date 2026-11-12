import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import { asset } from '@/lib/asset';

/**
 * PBR material library. The GLBs only carry flat vertex colours; every surface is re-dressed here
 * with the procedural, seamless textures in public/textures (scripts/make_textures.py).
 * UVs are generated per mesh by world-space box projection (see geometry.ts), so `repeat` is always 1
 * and the real-world tile size lives in TILE.
 */

const T = (n: string) => asset(`/textures/${n}.jpg`);
const TEX = {
  oakCol: T('oak_herringbone_col'),
  oakNrm: T('oak_herringbone_nrm'),
  oakRgh: T('oak_herringbone_rgh'),
  walCol: T('walnut_col'),
  walNrm: T('walnut_nrm'),
  walRgh: T('walnut_rgh'),
  travCol: T('travertine_col'),
  travNrm: T('travertine_nrm'),
  travRgh: T('travertine_rgh'),
  boucleCol: T('boucle_col'),
  boucleNrm: T('boucle_nrm'),
  linenCol: T('linen_col'),
  linenNrm: T('linen_nrm'),
  rugCol: T('rug_col'),
  rugNrm: T('rug_nrm'),
  plasterNrm: T('plaster_nrm'),
  plasterRgh: T('plaster_rgh'),
  concCol: T('concrete_col'),
  concNrm: T('concrete_nrm'),
  concRgh: T('concrete_rgh'),
  leaCol: T('leather_col'),
  leaNrm: T('leather_nrm'),
  garden: T('garden_view'),
};
type TexKey = keyof typeof TEX;

/** real-world size (m) that one texture tile covers */
export const TILE: Record<string, number> = {
  oak: 1.2,
  walnut: 1.1,
  walnutBacking: 1.4,
  travertine: 1.5,
  boucle: 0.22,
  linen: 0.18,
  rug: 1.6,
  plaster: 2.2,
  concrete: 3.2,
  leather: 0.45,
  plain: 1,
};

export type MatKey =
  | 'concrete'
  | 'plaster'
  | 'ceiling'
  | 'frame'
  | 'oak'
  | 'walnut'
  | 'walnutDark'
  | 'travertine'
  | 'travertineSeam'
  | 'boucle'
  | 'boucleCushion'
  | 'linenPillow'
  | 'linenPillowTaupe'
  | 'leather'
  | 'stone'
  | 'stoneDark'
  | 'bronze'
  | 'brass'
  | 'screen'
  | 'screenTrim'
  | 'rug'
  | 'bookWhite'
  | 'bookStone'
  | 'ceramicWhite'
  | 'ceramicStone'
  | 'flower'
  | 'cove'
  | 'curtain'
  | 'leaf'
  | 'leafDark'
  | 'bark'
  | 'glass'
  | 'downlight';

export function useMaterialLibrary() {
  const tex = useTexture(TEX as Record<TexKey, string>) as Record<TexKey, THREE.Texture>;

  return useMemo(() => {
    const colorKeys: TexKey[] = ['oakCol', 'walCol', 'travCol', 'boucleCol', 'linenCol', 'rugCol', 'concCol', 'leaCol', 'garden'];
    (Object.keys(tex) as TexKey[]).forEach((k) => {
      const t = tex[k];
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      t.colorSpace = colorKeys.includes(k) ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.needsUpdate = true;
    });
    tex.garden.wrapS = tex.garden.wrapT = THREE.ClampToEdgeWrapping;

    const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);
    const phys = (p: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(p);
    const n = (s: number) => new THREE.Vector2(s, s);

    const lib: Record<MatKey, THREE.MeshStandardMaterial> = {
      concrete: std({ map: tex.concCol, normalMap: tex.concNrm, roughnessMap: tex.concRgh, roughness: 1, normalScale: n(0.6) }),
      plaster: std({ color: '#E9E4DC', normalMap: tex.plasterNrm, roughnessMap: tex.plasterRgh, roughness: 1, normalScale: n(0.35) }),
      ceiling: std({ color: '#F2EEE7', normalMap: tex.plasterNrm, roughness: 0.92, normalScale: n(0.2) }),
      frame: std({ color: '#4a4540', metalness: 0.55, roughness: 0.42 }),
      oak: phys({
        map: tex.oakCol,
        normalMap: tex.oakNrm,
        roughnessMap: tex.oakRgh,
        roughness: 1,
        normalScale: n(0.7),
        clearcoat: 0.25,
        clearcoatRoughness: 0.35,
      }),
      walnut: std({ map: tex.walCol, normalMap: tex.walNrm, roughnessMap: tex.walRgh, roughness: 1, normalScale: n(0.6) }),
      walnutDark: std({ map: tex.walCol, color: '#7d6e66', normalMap: tex.walNrm, roughnessMap: tex.walRgh, roughness: 1 }),
      travertine: std({ map: tex.travCol, normalMap: tex.travNrm, roughnessMap: tex.travRgh, roughness: 1, normalScale: n(0.8) }),
      travertineSeam: std({ color: '#9C8E80', roughness: 0.9 }),
      boucle: std({ map: tex.boucleCol, normalMap: tex.boucleNrm, roughness: 0.96, normalScale: n(1.1), color: '#F4EFE7' }),
      boucleCushion: std({ map: tex.boucleCol, normalMap: tex.boucleNrm, roughness: 0.96, normalScale: n(1.1), color: '#DCD0C0' }),
      linenPillow: std({ map: tex.linenCol, normalMap: tex.linenNrm, roughness: 0.95, color: '#EFE6D8' }),
      linenPillowTaupe: std({ map: tex.linenCol, normalMap: tex.linenNrm, roughness: 0.95, color: '#A69280' }),
      leather: phys({
        map: tex.leaCol,
        normalMap: tex.leaNrm,
        roughness: 0.52,
        normalScale: n(0.5),
        sheen: 0.3,
        sheenColor: new THREE.Color('#d8a575'),
        clearcoat: 0.15,
        clearcoatRoughness: 0.5,
      }),
      stone: std({ map: tex.travCol, normalMap: tex.travNrm, roughnessMap: tex.travRgh, roughness: 1, color: '#f6efe6' }),
      stoneDark: std({ map: tex.travCol, normalMap: tex.travNrm, roughness: 0.8, color: '#b9aa98' }),
      bronze: std({ color: '#5a4636', metalness: 0.85, roughness: 0.35 }),
      brass: std({ color: '#CDA66E', metalness: 1, roughness: 0.28, emissive: '#000000' }),
      screen: phys({ color: '#060708', roughness: 0.08, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04 }),
      screenTrim: std({ color: '#1d1c1b', metalness: 0.7, roughness: 0.4 }),
      rug: std({ map: tex.rugCol, normalMap: tex.rugNrm, roughness: 1, normalScale: n(1.2) }),
      bookWhite: std({ color: '#ECE6DC', roughness: 0.8 }),
      bookStone: std({ color: '#8C7B6A', roughness: 0.75 }),
      ceramicWhite: phys({ color: '#EEE9E1', roughness: 0.42, clearcoat: 0.3 }),
      ceramicStone: std({ map: tex.travCol, color: '#cbbfae', roughness: 0.85 }),
      flower: std({ color: '#F4F1E8', roughness: 0.8, emissive: '#1a1a14' }),
      cove: std({ color: '#FFE6BD', emissive: '#FFC27A', emissiveIntensity: 0, roughness: 1, toneMapped: false }),
      curtain: std({
        map: tex.linenCol,
        color: '#F3EDE3',
        roughness: 1,
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide,
        emissive: '#3b342a',
        depthWrite: false,
      }),
      leaf: std({ color: '#6E8456', roughness: 0.62, side: THREE.DoubleSide, emissive: '#0d1408' }),
      leafDark: std({ color: '#4F6640', roughness: 0.62, side: THREE.DoubleSide, emissive: '#0a1006' }),
      bark: std({ map: tex.walCol, color: '#8a7a6c', roughness: 0.9 }),
      glass: phys({
        color: '#dfe9ee',
        roughness: 0.04,
        metalness: 0,
        transparent: true,
        opacity: 0.05,
        depthWrite: false,
        envMapIntensity: 1,
      }),
      downlight: std({ color: '#fff4e2', emissive: '#FFD9A6', emissiveIntensity: 0, toneMapped: false }),
    };

    const backdrop = new THREE.MeshBasicMaterial({ map: tex.garden, color: new THREE.Color(1.75, 1.72, 1.65), toneMapped: true });
    return { lib, backdrop, tex };
  }, [tex]);
}

export type MaterialLibrary = ReturnType<typeof useMaterialLibrary>;

/** GLB node name -> material + uv tile size */
export function materialFor(name: string): { mat: MatKey; tile: number; rot?: number; uvAxisSwap?: boolean } {
  // ---- 00 shell
  if (name === 'shell_raw_concrete_floor') return { mat: 'concrete', tile: TILE.concrete };
  if (name === 'shell_ceiling') return { mat: 'ceiling', tile: TILE.plaster };
  if (name.startsWith('shell_')) return { mat: 'plaster', tile: TILE.plaster };
  if (name.startsWith('window_')) return { mat: 'frame', tile: 1 };
  // ---- 01 surfaces
  if (name === 'surface_oak_parquet') return { mat: 'oak', tile: TILE.oak, rot: Math.PI / 4 };
  if (name === 'surface_walnut_backing') return { mat: 'walnutDark', tile: TILE.walnutBacking };
  if (name.startsWith('wall_walnut_slat')) return { mat: 'walnut', tile: TILE.walnut };
  if (name === 'surface_right_travertine') return { mat: 'travertine', tile: TILE.travertine };
  if (name.startsWith('stone_vertical_seam')) return { mat: 'travertineSeam', tile: 1 };
  if (name === 'surface_cove_ceiling') return { mat: 'ceiling', tile: TILE.plaster };
  // ---- 02 furniture
  if (/^sofa_cushion/.test(name)) return { mat: 'boucleCushion', tile: TILE.boucle };
  if (name.startsWith('sofa_')) return { mat: 'boucle', tile: TILE.boucle };
  if (/^chair_\d_leg/.test(name)) return { mat: 'walnut', tile: TILE.walnut };
  if (name.startsWith('chair_')) return { mat: 'leather', tile: TILE.leather };
  if (name === 'tv_low_cabinet') return { mat: 'walnut', tile: TILE.walnut, uvAxisSwap: true };
  if (name === 'tv_screen_trim') return { mat: 'screenTrim', tile: 1 };
  if (name.startsWith('tv_')) return { mat: 'screen', tile: 1 };
  if (name === 'coffee_table_top') return { mat: 'stone', tile: TILE.travertine };
  if (name === 'coffee_table_pedestal') return { mat: 'stoneDark', tile: TILE.travertine };
  if (name === 'side_table_top') return { mat: 'walnut', tile: TILE.walnut, uvAxisSwap: true };
  if (name === 'side_table_foot') return { mat: 'bronze', tile: 1 };
  // ---- 03 details
  if (name === 'detail_area_rug') return { mat: 'rug', tile: TILE.rug };
  if (name === 'detail_pillow_1') return { mat: 'linenPillowTaupe', tile: TILE.linen };
  if (name.startsWith('detail_pillow')) return { mat: 'linenPillow', tile: TILE.linen };
  if (name === 'detail_book_1') return { mat: 'bookStone', tile: 1 };
  if (name.startsWith('detail_book')) return { mat: 'bookWhite', tile: 1 };
  if (name === 'detail_vase_body') return { mat: 'ceramicStone', tile: 0.5 };
  if (name === 'detail_cabinet_vase_1') return { mat: 'ceramicStone', tile: 0.5 };
  if (name.startsWith('detail_cabinet_vase')) return { mat: 'ceramicWhite', tile: 1 };
  if (name.startsWith('detail_flower')) return { mat: 'flower', tile: 1 };
  if (name.startsWith('detail_cove_light')) return { mat: 'cove', tile: 1 };
  if (name === 'detail_plant_pot') return { mat: 'stone', tile: 0.8 };
  if (name === 'detail_plant_stem') return { mat: 'bark', tile: 0.6 };
  if (name.startsWith('detail_plant_leaf')) return { mat: 'leaf', tile: 1 };
  if (name.startsWith('detail_pendant_ring')) return { mat: 'brass', tile: 1 };
  if (name.startsWith('detail_pendant_cable')) return { mat: 'screenTrim', tile: 1 };
  return { mat: 'plaster', tile: 1 };
}
