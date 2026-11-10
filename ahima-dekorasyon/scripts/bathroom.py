"""Ahima Dekorasyon - the bathroom of the scroll film, modelled and path-traced with Blender Cycles.

One room, one set of measurements: every renovation state, the before/after pair and the nine
configurator variants are rendered from the same geometry, so perspective never drifts.

  AHIMA_TEX=/path/to/tex python3 scripts/bathroom.py film   --out OUT --n 120 --res 1600x900 [--from 0 --to 120]
  AHIMA_TEX=...           python3 scripts/bathroom.py test   --out OUT --s 0,0.3,1 --res 800x450
  AHIMA_TEX=...           python3 scripts/bathroom.py config --out OUT --res 1600x900
  add --portrait for the phone framing (portrait camera, same room)

AHIMA_TEX holds pbr/<polyhaven>_{diff,rough,nor_gl}.jpg (CC0, polyhaven.com) and
slabs/<marble|anthra|beige>_{diff,rough,bump}.png (scripts/make_slabs.py).

Room: x -1.35..1.35 (2.70 m wide), y 0..3.60 (deep), z 0..2.75. Camera near the door (y=0) looking +y.
Scroll time s: 0 old bathroom -> .10 demolition -> .22 tiling -> .48 vanity -> .60 shower, WC
-> .72 ceiling, mirror, decor -> .82 lights on -> .92 hold.
"""
import argparse
import math
import os
import random
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from blend_lib import *  # noqa

W, D, H = 2.70, 3.60, 2.75
X0, X1 = -W / 2, W / 2
T = 0.022            # adhesive + tile: finished tile face sits 22 mm off the raw wall
TILE_T = 0.010
WIN = dict(y0=2.75, y1=3.35, z0=1.85, z1=2.38)   # window in the right wall (shower)

R = {}               # name -> object or list, used by the state function


def add(key, ob):
    R.setdefault(key, []).append(ob)
    return ob


# ------------------------------------------------------------------ materials

def build_materials():
    M = {}
    M['plaster'] = textured('plaster', 'pbr/plastered_wall_diff.jpg', 'pbr/plastered_wall_rough.jpg', 'pbr/plastered_wall_nor_gl.jpg', scale=2.0, tint=(0.66, 0.65, 0.63), rough_range=(0.7, 1.0))
    M['screed'] = textured('screed', 'pbr/concrete_floor_worn_001_diff.jpg', 'pbr/concrete_floor_worn_001_rough.jpg', 'pbr/concrete_floor_worn_001_nor_gl.jpg', scale=2.5, tint=(0.95, 0.93, 0.9), rough_range=(0.6, 0.95))
    M['ceiling'] = solid('ceiling', (0.86, 0.85, 0.83), 0.9)
    M['old_ceiling'] = textured('old_ceiling', 'pbr/painted_plaster_wall_diff.jpg', 'pbr/painted_plaster_wall_rough.jpg', None, scale=2.0, tint=(0.92, 0.88, 0.78), rough_range=(0.8, 1.0))
    M['old_paint'] = textured('old_paint', 'pbr/painted_plaster_wall_diff.jpg', 'pbr/painted_plaster_wall_rough.jpg', 'pbr/painted_plaster_wall_nor_gl.jpg', scale=1.6, tint=(0.97, 0.90, 0.72), rough_range=(0.6, 0.9))
    M['old_tile'] = brick_tiles('old_tile', (0.80, 0.78, 0.68), (0.74, 0.72, 0.63), (0.36, 0.34, 0.29), 0.25, 0.33, rough=0.22, dirt=0.40, mortar_size=0.004)
    M['old_band'] = brick_tiles('old_band', (0.23, 0.38, 0.40), (0.18, 0.32, 0.34), (0.45, 0.44, 0.40), 0.20, 0.08, rough=0.15)
    M['old_floor'] = brick_tiles('old_floor', (0.55, 0.47, 0.38), (0.50, 0.43, 0.35), (0.25, 0.23, 0.20), 0.33, 0.33, rough=0.35, dirt=0.25)
    M['old_ceramic'] = solid('old_ceramic', (0.82, 0.80, 0.73), 0.18)
    M['chrome'] = solid('chrome', (0.75, 0.75, 0.75), 0.12, metal=1.0)
    M['old_plastic'] = solid('old_plastic', (0.82, 0.81, 0.76), 0.45)
    M['curtain'] = solid('curtain', (0.55, 0.68, 0.70), 0.5, sss=0.2)
    M['mirror'] = solid('mirror', (0.92, 0.93, 0.93), 0.015, metal=1.0)
    M['ceramic'] = solid('ceramic', (0.93, 0.93, 0.91), 0.06, coat=0.3)
    M['brass'] = solid('brass', (0.80, 0.62, 0.38), 0.26, metal=1.0)
    M['copper'] = solid('copper', (0.85, 0.48, 0.32), 0.35, metal=1.0)
    M['ppr'] = solid('ppr', (0.85, 0.85, 0.82), 0.5)
    M['bucket'] = solid('bucket', (0.80, 0.80, 0.78), 0.55)
    M['frame_old'] = solid('frame_old', (0.86, 0.85, 0.80), 0.4)
    M['frame_new'] = solid('frame_new', (0.08, 0.08, 0.085), 0.45)
    M['glass'] = glass('glass')
    M['glass_frost'] = glass('glass_frost', frosted=True)
    M['towel'] = solid('towel', (0.80, 0.74, 0.64), 0.95, sheen=0.6)
    M['towel_w'] = solid('towel_w', (0.90, 0.89, 0.86), 0.95, sheen=0.6)
    M['amber'] = glass('amber', tint=(0.55, 0.30, 0.10))
    M['pot'] = textured('pot', 'pbr/rough_concrete_diff.jpg', 'pbr/rough_concrete_rough.jpg', 'pbr/rough_concrete_nor_gl.jpg', scale=0.6, tint=(0.80, 0.74, 0.66), rough_range=(0.6, 0.9))
    M['leaf'] = solid('leaf', (0.10, 0.20, 0.07), 0.45, sss=0.1)
    M['bark'] = solid('bark', (0.22, 0.17, 0.12), 0.8)
    M['wax'] = solid('wax', (0.92, 0.88, 0.80), 0.35, sss=0.6)
    M['mat'] = solid('mat', (0.62, 0.56, 0.48), 0.95, sheen=0.5)
    M['drain'] = solid('drain', (0.75, 0.58, 0.36), 0.3, metal=1.0)
    M['wire'] = solid('wire', (0.05, 0.05, 0.05), 0.5)
    # lights
    M['led'] = emission('led', kelvin(3400), 0.0)
    M['mirror_led'] = emission('mirror_led', kelvin(3600), 0.0)
    M['downlight'] = emission('downlight', kelvin(3300), 0.0)
    M['tube'] = emission('tube', kelvin(6200), 0.0)
    M['bulb'] = emission('bulb', kelvin(3000), 0.0)
    M['tile'] = tile_material()
    M['cabinet'] = cabinet_material()
    return M


def tile_material():
    m = textured('tile', 'slabs/marble_diff.png', 'slabs/marble_rough.png', None, scale=(2.4, 1.2),
                 bump='slabs/marble_bump.png', bump_strength=0.15, rough_range=(0.0, 1.0))
    return m


def set_tile(mat, kind):
    for n in mat.node_tree.nodes:
        if n.type == 'TEX_IMAGE':
            for part in ('diff', 'rough', 'bump'):
                if n.image and n.image.name.endswith(f'_{part}.png'):
                    n.image = image(f'slabs/{kind}_{part}.png', part == 'diff')


def cabinet_material():
    m = textured('cabinet', 'pbr/walnut_veneer_diff.jpg', 'pbr/walnut_veneer_rough.jpg', 'pbr/walnut_veneer_nor_gl.jpg',
                 scale=1.2, rough_range=(0.35, 0.55), rotate=math.pi / 2, nor_strength=0.4, tint=(0.92, 0.84, 0.76))
    nt = m.node_tree
    b = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    link_in = b.inputs['Base Color'].links[0]
    src = link_in.from_socket
    mx = nt.nodes.new('ShaderNodeMix')
    mx.data_type = 'RGBA'
    mx.name = 'finish'
    mx.inputs['Factor'].default_value = 0.0
    nt.links.new(src, mx.inputs[6])
    mx.inputs[7].default_value = (0.9, 0.89, 0.86, 1)
    nt.links.new(mx.outputs[2], b.inputs['Base Color'])
    rough_link = b.inputs['Roughness'].links[0]
    rsrc = rough_link.from_socket
    rm = nt.nodes.new('ShaderNodeMix')
    rm.data_type = 'FLOAT'
    rm.name = 'finish_rough'
    rm.inputs['Factor'].default_value = 0.0
    nt.links.new(rsrc, rm.inputs[2])
    rm.inputs[3].default_value = 0.55
    nt.links.new(rm.outputs[0], b.inputs['Roughness'])
    return m


CABINETS = {
    'ceviz': (0.0, None),
    'beyaz': (1.0, (0.86, 0.855, 0.83)),
    'antrasit': (1.0, (0.075, 0.077, 0.082)),
}


def set_cabinet(mat, kind):
    fac, col = CABINETS[kind]
    nt = mat.node_tree
    nt.nodes['finish'].inputs['Factor'].default_value = fac
    nt.nodes['finish_rough'].inputs['Factor'].default_value = fac
    if col:
        nt.nodes['finish'].inputs[7].default_value = (*col, 1)


# ------------------------------------------------------------------ build

def build_shell(M):
    c = collection('shell')
    t = 0.2
    # walls (raw plaster), floor screed, ceiling slab
    back = box('wall_back', (W + 2 * t, t, H + 0.4), (0, D + t / 2, H / 2), M['plaster'], coll=c)
    box('wall_left', (t, D + 2 * t, H + 0.4), (X0 - t / 2, D / 2, H / 2), M['plaster'], coll=c)
    right = box('wall_right', (t, D + 2 * t, H + 0.4), (X1 + t / 2, D / 2, H / 2), M['plaster'], coll=c)
    box('wall_front', (W + 2 * t, t, H + 0.4), (0, -t / 2, H / 2), M['plaster'], coll=c)
    box('floor', (W + 0.4, D + 0.4, 0.2), (0, D / 2, -0.1), M['screed'], coll=c)
    box('ceiling', (W + 0.4, D + 0.4, 0.2), (0, D / 2, H + 0.1), M['ceiling'], coll=c)
    hole = box('win_hole', (0.8, WIN['y1'] - WIN['y0'], WIN['z1'] - WIN['z0']), (X1 + 0.1, (WIN['y0'] + WIN['y1']) / 2, (WIN['z0'] + WIN['z1']) / 2), None, coll=c)
    boolean(right, hole)
    R['win_hole'] = hole
    # window: frame + glass, set back in the reveal
    fx = X1 + 0.12
    fw = 0.05
    wy0, wy1, wz0, wz1 = WIN['y0'], WIN['y1'], WIN['z0'], WIN['z1']
    frames = [
        box('frame_b', (0.07, wy1 - wy0, fw), (fx, (wy0 + wy1) / 2, wz0 + fw / 2), M['frame_old'], coll=c),
        box('frame_t', (0.07, wy1 - wy0, fw), (fx, (wy0 + wy1) / 2, wz1 - fw / 2), M['frame_old'], coll=c),
        box('frame_l', (0.07, fw, wz1 - wz0), (fx, wy0 + fw / 2, (wz0 + wz1) / 2), M['frame_old'], coll=c),
        box('frame_r', (0.07, fw, wz1 - wz0), (fx, wy1 - fw / 2, (wz0 + wz1) / 2), M['frame_old'], coll=c),
        box('frame_m', (0.07, 0.04, wz1 - wz0), (fx, (wy0 + wy1) / 2, (wz0 + wz1) / 2), M['frame_old'], coll=c),
    ]
    R['frames'] = frames
    R['win_glass'] = box('win_glass', (0.006, wy1 - wy0 - 0.06, wz1 - wz0 - 0.06), (fx, (wy0 + wy1) / 2, (wz0 + wz1) / 2), M['glass_frost'], coll=c)


def wall_layer(name, mat, z0, z1, depth, coll, key, cut_window=False):
    """A thin layer covering back/left/right/front walls between z0 and z1."""
    obs = [
        box(f'{name}_back', (W, depth, z1 - z0), (0, D - depth / 2, (z0 + z1) / 2), mat, coll=coll),
        box(f'{name}_left', (depth, D, z1 - z0), (X0 + depth / 2, D / 2, (z0 + z1) / 2), mat, coll=coll),
        box(f'{name}_right', (depth, D, z1 - z0), (X1 - depth / 2, D / 2, (z0 + z1) / 2), mat, coll=coll),
        box(f'{name}_front', (W, depth, z1 - z0), (0, depth / 2, (z0 + z1) / 2), mat, coll=coll),
    ]
    if cut_window and z1 > WIN['z0']:
        boolean(obs[2], R['win_hole'])
    for o in obs:
        add(key, o)
    return obs


def build_old(M):
    c = collection('old')
    wall_layer('old_tiles', M['old_tile'], 0, 1.42, 0.008, c, 'old_walls')
    wall_layer('old_band', M['old_band'], 1.42, 1.50, 0.010, c, 'old_walls')
    wall_layer('old_paint', M['old_paint'], 1.50, H, 0.004, c, 'old_walls', cut_window=True)
    add('old_walls', box('old_floor', (W, D, 0.008), (0, D / 2, 0.004), M['old_floor'], coll=c))
    add('old_walls', box('old_ceil', (W, D, 0.004), (0, D / 2, H - 0.002), M['old_ceiling'], coll=c))
    # pedestal sink + mirror cabinet + tube light on the back wall
    bx = -0.6
    basin = rounded('old_basin', (0.56, 0.44, 0.17), (bx, D - 0.008 - 0.22, 0.80), None, 0.06, coll=c)
    basin.data.materials.append(M['old_ceramic'])
    cut = rounded('old_basin_cut', (0.46, 0.32, 0.2), (bx, D - 0.008 - 0.24, 0.89), None, 0.07, coll=c)
    basin.modifiers.clear()
    boolean(basin, cut)
    add_bevel(basin, 0.05, 6)
    add('old_fix', basin)
    add('old_fix', rounded('old_pedestal', (0.2, 0.2, 0.72), (bx, D - 0.008 - 0.15, 0.36), M['old_ceramic'], 0.05, coll=c))
    add('old_fix', cyl('old_tap', 0.012, 0.16, (bx, D - 0.03, 0.97), M['chrome'], axis='Y', coll=c))
    add('old_fix', cyl('old_tap_v', 0.016, 0.1, (bx, D - 0.1, 0.92), M['chrome'], coll=c))
    add('old_fix', box('old_cab', (0.56, 0.14, 0.62), (bx, D - 0.008 - 0.07, 1.62), M['old_plastic'], bevel=0.008, coll=c))
    add('old_fix', box('old_cab_mirror', (0.5, 0.004, 0.55), (bx, D - 0.008 - 0.142, 1.62), M['mirror'], coll=c))
    add('old_fix', cyl('old_tube', 0.016, 0.52, (bx, D - 0.008 - 0.09, 2.0), M['tube'], axis='X', coll=c))
    add('old_fix', box('old_tube_hold', (0.56, 0.06, 0.04), (bx, D - 0.008 - 0.04, 2.03), M['old_plastic'], coll=c))
    # floor-standing toilet on the left wall, by the door
    wy = 1.62
    add('old_fix', rounded('old_wc', (0.52, 0.38, 0.40), (X0 + 0.008 + 0.34, wy, 0.20), M['old_ceramic'], 0.12, coll=c))
    add('old_fix', rounded('old_wc_seat', (0.46, 0.37, 0.03), (X0 + 0.008 + 0.36, wy, 0.415), M['old_plastic'], 0.012, coll=c))
    add('old_fix', rounded('old_tank', (0.18, 0.42, 0.38), (X0 + 0.008 + 0.1, wy, 0.62), M['old_ceramic'], 0.03, coll=c))
    # bathtub across the back right, curtain on a rod
    tx0, tx1, ty0 = 0.12, X1 - 0.008, D - 0.008 - 0.72
    tub = rounded('old_tub', (tx1 - tx0, 0.72, 0.55), ((tx0 + tx1) / 2, (ty0 + D - 0.008) / 2, 0.275), None, 0.04, coll=c)
    tub.data.materials.append(M['old_ceramic'])
    tub.modifiers.clear()
    tcut = rounded('old_tub_cut', (tx1 - tx0 - 0.12, 0.6, 0.6), ((tx0 + tx1) / 2, (ty0 + D - 0.008) / 2, 0.62), None, 0.12, coll=c)
    boolean(tub, tcut)
    add_bevel(tub, 0.03, 4)
    add('old_fix', tub)
    add('old_fix', cyl('old_rod', 0.012, tx1 - tx0, ((tx0 + tx1) / 2, ty0 + 0.02, 2.0), M['chrome'], axis='X', coll=c))
    add('old_fix', curtain('old_curtain', tx1 - 0.55, tx1 - 0.02, ty0 + 0.02, 2.0, 0.62, M['curtain'], c))
    add('old_fix', cyl('old_shower_hose', 0.01, 0.6, (1.0, D - 0.02, 1.45), M['chrome'], coll=c))
    # ceiling dome light
    add('old_fix', sphere('old_dome', 0.17, (0, 1.9, H - 0.01), M['old_plastic'], scale=(1, 1, 0.35), coll=c))
    R['old_light'] = point_light('old_light', (0, 1.9, H - 0.12), 70, kelvin(5600), radius=0.12, coll=c)
    R['old_tube_light'] = area_light('old_tube_light', (0.5, 0.03), (bx, D - 0.2, 1.98), (math.radians(90), 0, 0), 12, kelvin(6200), coll=c)


def curtain(name, x0, x1, y, ztop, zbot, mat, coll):
    import bmesh
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    nx, nz = 60, 12
    verts = []
    for j in range(nz + 1):
        row = []
        for i in range(nx + 1):
            u = i / nx
            x = x0 + (x1 - x0) * u
            z = ztop - (ztop - zbot) * j / nz
            yy = y + 0.035 * math.sin(u * math.pi * 14) * (0.6 + 0.4 * j / nz)
            row.append(bm.verts.new((x, yy, z)))
        verts.append(row)
    for j in range(nz):
        for i in range(nx):
            f = bm.faces.new((verts[j][i], verts[j][i + 1], verts[j + 1][i + 1], verts[j + 1][i]))
            f.smooth = True
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    link(ob, coll)
    me.materials.append(mat)
    sol = ob.modifiers.new('solid', 'SOLIDIFY')
    sol.thickness = 0.002
    return ob


def build_raw(M):
    c = collection('raw')
    # pipe stubs where the new fittings go
    for i, x in enumerate((-0.72, -0.48)):
        add('pipes', cyl(f'stub_v{i}', 0.011, 0.07, (x, D - 0.035, 0.56), M['copper'], axis='Y', coll=c))
    add('pipes', cyl('stub_wc', 0.05, 0.08, (X0 + 0.04, 1.62, 0.22), M['ppr'], axis='X', coll=c))
    add('pipes', cyl('stub_wc_w', 0.01, 0.08, (X0 + 0.04, 1.52, 0.95), M['copper'], axis='X', coll=c))
    add('pipes', box('mixer_box', (0.14, 0.05, 0.14), (0.87, D - 0.02, 1.1), M['ppr'], coll=c))
    add('pipes', box('el_box', (0.07, 0.03, 0.07), (-0.6, D - 0.012, 1.95), M['copper'], coll=c))
    add('pipes', box('drain_pre', (0.8, 0.08, 0.02), (0.87, D - 0.1, 0.01), M['ppr'], coll=c))
    add('props', cyl('bucket', 0.15, 0.32, (0.55, 1.75, 0.16), M['bucket'], coll=c, bevel=0.005, scale=(1, 1, 1)))
    add('props', cyl('bucket_rim', 0.158, 0.02, (0.55, 1.75, 0.31), M['bucket'], coll=c))
    # bare work bulb on its flex
    add('bulb', cyl('flex', 0.004, 0.38, (0.0, 1.9, H - 0.19), M['wire'], coll=c))
    add('bulb', sphere('bulb_glass', 0.035, (0.0, 1.9, H - 0.42), M['bulb'], scale=(1, 1, 1.3), coll=c))
    R['bulb_light'] = point_light('bulb_light', (0.0, 1.9, H - 0.44), 70, kelvin(3000), radius=0.03, coll=c)


def build_tiles(M):
    """Large-format 60 x 120 cm porcelain, laid wall rows bottom-up, then the floor from the back to the door."""
    c = collection('tiles')
    rnd = random.Random(3)
    g = 0.002
    order = []
    rows = [(0.0, 1.2), (1.2, 2.4), (2.4, H)]
    for ri, (z0, z1) in enumerate(rows):
        row = []
        # back wall: x from X0
        x = X0
        while x < X1 - 1e-6:
            x2 = min(x + 0.6, X1)
            ob = box(f'tb_{ri}_{x:.2f}', (x2 - x - g, TILE_T, z1 - z0 - g), ((x + x2) / 2, D - T + TILE_T / 2, (z0 + z1) / 2), M['tile'], bevel=0.001, segs=1, coll=c,
                     uv_offset=(rnd.uniform(0, 1.6) - x, -z0))
            row.append(ob)
            x = x2
        for side, xw in (('l', X0 + T - TILE_T / 2), ('r', X1 - T + TILE_T / 2)):
            y = D - T
            while y > T + 1e-6:
                y2 = max(y - 0.6, 0.0)
                ob = box(f't{side}_{ri}_{y:.2f}', (TILE_T, y - y2 - g, z1 - z0 - g), (xw, (y + y2) / 2, (z0 + z1) / 2), M['tile'], bevel=0.001, segs=1, coll=c,
                         uv_offset=(rnd.uniform(0, 1.6) - y2, -z0))
                if side == 'r' and z1 > WIN['z0'] and y2 < WIN['y1'] and y > WIN['y0']:
                    boolean(ob, R['win_hole'])
                row.append(ob)
                y = y2
        # front wall tiles (behind the camera, but they light the room)
        x = X0
        while x < X1 - 1e-6:
            x2 = min(x + 0.6, X1)
            row.append(box(f'tf_{ri}_{x:.2f}', (x2 - x - g, TILE_T, z1 - z0 - g), ((x + x2) / 2, T - TILE_T / 2, (z0 + z1) / 2), M['tile'], coll=c,
                           uv_offset=(rnd.uniform(0, 1.6) - x, -z0)))
            x = x2
        rnd.shuffle(row)
        row.sort(key=lambda o: -o.location.y + (0.0 if abs(o.location.y - (D - T)) < 0.05 else 0))
        order.extend(row)
        if ri == 1:
            # window reveal lined with the same tile
            wy0, wy1, wz0, wz1 = WIN['y0'], WIN['y1'], WIN['z0'], WIN['z1']
            dep = 0.2 + T - 0.08
            cx = X1 - T + dep / 2
            for nm, sz, loc in (('rev_b', (dep, wy1 - wy0, 0.01), (cx, (wy0 + wy1) / 2, wz0 + 0.005)),
                                ('rev_t', (dep, wy1 - wy0, 0.01), (cx, (wy0 + wy1) / 2, wz1 - 0.005)),
                                ('rev_l', (dep, 0.01, wz1 - wz0), (cx, wy0 + 0.005, (wz0 + wz1) / 2)),
                                ('rev_r', (dep, 0.01, wz1 - wz0), (cx, wy1 - 0.005, (wz0 + wz1) / 2))):
                order.append(box(nm, sz, loc, M['tile'], coll=c))
    # floor: columns of 60 along x, 120 along y; from the back wall toward the door
    fl = []
    yrows = [(D - T, D - T - 1.2), (D - T - 1.2, D - T - 2.4), (D - T - 2.4, T)]
    for yi, (ya, yb) in enumerate(yrows):
        x = X0 + T
        while x < X1 - T - 1e-6:
            x2 = min(x + 0.6, X1 - T)
            fl.append(box(f'tfl_{yi}_{x:.2f}', (x2 - x - g, ya - yb - g, TILE_T), ((x + x2) / 2, (ya + yb) / 2, TILE_T / 2 + 0.012), M['tile'], bevel=0.001, segs=1, coll=c,
                          uv_offset=(rnd.uniform(0, 1.6) - x, -yb)))
            x = x2
    order.extend(fl)
    R['tile_order'] = order
    # screed under tiles gets a levelling layer so the grout gaps read as grout, not raw concrete
    R['grout'] = [box('grout_floor', (W - 0.01, D - 0.01, 0.012), (0, D / 2, 0.006), solid('grout', (0.62, 0.61, 0.58), 0.9), coll=c)]


def build_vanity(M):
    c = collection('vanity')
    face = D - T
    cx, w, d = -0.6, 1.2, 0.48
    z0, z1 = 0.38, 0.80
    R['carcass'] = box('carcass', (w - 0.01, d - 0.02, z1 - z0 - 0.01), (cx, face - d / 2 + 0.0, (z0 + z1) / 2), M['cabinet'], bevel=0.002, coll=c)
    R['doors'] = [
        box('door_l', ((w - 0.006) / 2 - 0.002, 0.019, z1 - z0 - 0.04), (cx - w / 4, face - d + 0.0095, (z0 + z1) / 2 - 0.016), M['cabinet'], bevel=0.0015, coll=c),
        box('door_r', ((w - 0.006) / 2 - 0.002, 0.019, z1 - z0 - 0.04), (cx + w / 4, face - d + 0.0095, (z0 + z1) / 2 - 0.016), M['cabinet'], bevel=0.0015, coll=c),
        box('grip', (w - 0.02, 0.012, 0.022), (cx, face - d + 0.02, z1 - 0.022), M['frame_new'], coll=c),
    ]
    R['top'] = box('countertop', (w + 0.02, d + 0.02, 0.03), (cx, face - (d + 0.02) / 2, z1 + 0.015), M['tile'], bevel=0.0015, coll=c, uv_offset=(0.3, 0.2))
    # vessel basin: oval, thin walled
    by = face - 0.26
    basin = cyl('basin', 0.25, 0.13, (cx, by, z1 + 0.03 + 0.065), M['ceramic'], verts=96, coll=c, scale=(1, 0.7, 1))
    cut = cyl('basin_cut', 0.235, 0.14, (cx, by, z1 + 0.03 + 0.065 + 0.012), None, verts=96, coll=c, scale=(1, 0.68, 1))
    boolean(basin, cut)
    add_bevel(basin, 0.006, 3)
    R['basin'] = basin
    R['faucet'] = [
        rounded('tap_plate', (0.07, 0.01, 0.2), (cx, face - 0.005, 1.08), M['brass'], 0.004, coll=c),
        cyl('spout', 0.011, 0.22, (cx, face - 0.11, 1.12), M['brass'], axis='Y', coll=c),
        cyl('knob', 0.018, 0.04, (cx, face - 0.03, 1.02), M['brass'], axis='Y', coll=c),
    ]


def build_shower_wc(M):
    c = collection('fixtures')
    face = D - T
    # walk-in screen parallel to the back wall; you step in from the vanity side
    gy, gx0, gx1 = 2.72, 0.74, X1 - T
    R['glass'] = [
        box('shower_glass', (gx1 - gx0, 0.008, 2.0), ((gx0 + gx1) / 2, gy, 1.0 + 0.012), M['glass'], bevel=0.002, segs=1, coll=c),
        box('glass_channel', (0.025, 0.02, 2.0), (gx1 - 0.0125, gy, 1.012), M['brass'], coll=c),
        cyl('stabiliser', 0.009, face - gy, (gx0 + 0.02, (gy + face) / 2, 1.98), M['brass'], axis='Y', coll=c),
    ]
    sx, sy = 0.88, 3.2
    R['shower'] = [
        cyl('rain_arm', 0.01, face - sy, (sx, (face + sy) / 2, 2.40), M['brass'], axis='Y', coll=c),
        cyl('rain_drop', 0.01, 0.06, (sx, sy, 2.37), M['brass'], coll=c),
        rounded('rain_head', (0.30, 0.30, 0.012), (sx, sy, 2.335), M['brass'], 0.004, coll=c),
        rounded('mixer', (0.15, 0.012, 0.15), (sx, face - 0.006, 1.10), M['brass'], 0.006, coll=c),
        cyl('mixer_knob', 0.02, 0.05, (sx, face - 0.035, 1.10), M['brass'], axis='Y', coll=c),
        cyl('hand_holder', 0.012, 0.05, (sx + 0.28, face - 0.025, 1.10), M['brass'], axis='Y', coll=c),
        cyl('hand_shower', 0.018, 0.2, (sx + 0.28, face - 0.06, 1.13), M['brass'], coll=c),
    ]
    R['drain'] = [box('drain', (0.8, 0.05, 0.004), (sx, face - 0.08, 0.024), M['drain'], coll=c)]
    wy = 1.62
    wf = X0 + T
    R['wc'] = [
        rounded('wc', (0.53, 0.36, 0.30), (wf + 0.265, wy, 0.40), M['ceramic'], 0.11, coll=c),
        rounded('wc_lid', (0.50, 0.355, 0.035), (wf + 0.27, wy, 0.565), M['ceramic'], 0.015, coll=c),
        rounded('flush', (0.008, 0.24, 0.16), (wf + 0.004, wy, 1.05), M['brass'], 0.003, coll=c),
    ]
    # brass ladder towel rail on the right wall, a linen towel over it
    rf = X1 - T
    rail = []
    for yy in (1.95, 2.38):
        rail.append(cyl(f'rail_v{yy}', 0.013, 1.1, (rf - 0.07, yy, 0.85), M['brass'], coll=c))
    for k in range(9):
        rail.append(cyl(f'rail_h{k}', 0.008, 0.43, (rf - 0.07, 2.165, 0.38 + k * 0.115), M['brass'], axis='Y', coll=c))
    rail.append(rounded('rail_towel', (0.04, 0.34, 0.55), (rf - 0.07, 2.165, 1.02), M['towel'], 0.015, coll=c))
    R['rail'] = rail


def build_ceiling(M):
    c = collection('ceiling')
    inset = 0.11
    z = 2.60
    R['dropped'] = [box('dropped', (W - 2 * inset, D - 2 * inset, 0.04), (0, D / 2, z + 0.02), M['ceiling'], coll=c)]
    strips = []
    for nm, sz, loc in (('led_b', (W - 2 * inset, 0.012, 0.008), (0, D - inset - 0.01, z + 0.045)),
                        ('led_f', (W - 2 * inset, 0.012, 0.008), (0, inset + 0.01, z + 0.045)),
                        ('led_l', (0.012, D - 2 * inset, 0.008), (X0 + inset + 0.01, D / 2, z + 0.045)),
                        ('led_r', (0.012, D - 2 * inset, 0.008), (X1 - inset - 0.01, D / 2, z + 0.045))):
        strips.append(box(nm, sz, loc, M['led'], coll=c))
    R['led'] = strips
    # cove lights: thin area lights along the slab edge, aimed at the walls (cleaner than emission alone)
    cove = []
    for nm, size, loc, rot in (('cove_b', (W - 0.3, 0.02), (0, D - inset + 0.01, z + 0.05), (math.radians(120), 0, 0)),
                               ('cove_f', (W - 0.3, 0.02), (0, inset - 0.01, z + 0.05), (math.radians(-120), 0, 0)),
                               ('cove_l', (0.02, D - 0.3), (X0 + inset - 0.01, D / 2, z + 0.05), (0, math.radians(120), 0)),
                               ('cove_r', (0.02, D - 0.3), (X1 - inset + 0.01, D / 2, z + 0.05), (0, math.radians(-120), 0))):
        cove.append(area_light(nm, size, loc, rot, 0, kelvin(3400), coll=c))
    R['cove'] = cove
    dl = []
    for i, (x, y) in enumerate(((-0.6, 3.36), (0.88, 3.30), (0.0, 1.55))):
        dl.append(cyl(f'dl_disc{i}', 0.035, 0.004, (x, y, z - 0.001), M['downlight'], coll=c))
        dl.append(point_light(f'dl{i}', (x, y, z - 0.02), 0, kelvin(3300), radius=0.03, kind='SPOT', spot=math.radians(70), coll=c))
    R['downlights'] = dl
    # mirror with LED back glow
    face = D - T
    R['mirror'] = [box('mirror', (1.0, 0.012, 0.85), (-0.6, face - 0.032, 1.50), M['mirror'], bevel=0.006, coll=c),
                   box('mirror_back', (0.98, 0.02, 0.83), (-0.6, face - 0.015, 1.50), M['frame_new'], coll=c)]
    R['mirror_led'] = [box('mirror_led', (1.03, 0.004, 0.88), (-0.6, face - 0.004, 1.50), M['mirror_led'], coll=c)]


def build_decor(M):
    c = collection('decor')
    face = D - T
    top = 0.83
    d = []
    d.append(rounded('towel1', (0.30, 0.22, 0.06), (-1.03, face - 0.17, top + 0.03), M['towel_w'], 0.02, coll=c))
    d.append(rounded('towel2', (0.28, 0.21, 0.055), (-1.03, face - 0.17, top + 0.088), M['towel'], 0.02, coll=c))
    d.append(cyl('bottle', 0.035, 0.15, (-0.2, face - 0.12, top + 0.075), M['amber'], coll=c, bevel=0.01))
    d.append(cyl('pump', 0.01, 0.05, (-0.2, face - 0.12, top + 0.17), M['brass'], coll=c))
    d.append(cyl('pump_head', 0.012, 0.012, (-0.19, face - 0.12, top + 0.198), M['brass'], coll=c, scale=(2, 1, 1)))
    d.append(cyl('candle', 0.04, 0.08, (-0.08, face - 0.2, top + 0.04), M['wax'], coll=c, bevel=0.004))
    R['decor'] = d
    # potted plant between WC and vanity: stone pot, trunk, instanced leaves
    px, py = X0 + T + 0.2, 2.82
    plant = [cyl('pot', 0.16, 0.42, (px, py, 0.21 + 0.012), M['pot'], coll=c, bevel=0.01, scale=(1, 1, 1))]
    plant.append(cyl('trunk', 0.012, 0.75, (px, py, 0.42 + 0.37), M['bark'], coll=c))
    import bmesh
    leaf_me = bpy.data.meshes.new('leaf')
    bm = bmesh.new()
    pts = [(0, 0, 0), (0.012, 0.03, 0), (0.0, 0.075, 0.004), (-0.012, 0.03, 0)]
    vs = [bm.verts.new(p) for p in pts]
    bm.faces.new(vs)
    bm.to_mesh(leaf_me)
    bm.free()
    leaf_me.materials.append(M['leaf'])
    rnd = random.Random(11)
    for k in range(420):
        # three foliage clouds up the trunk
        cxz = rnd.choice(((0, 1.05, 0.2), (0.06, 1.25, 0.17), (-0.05, 1.38, 0.13)))
        th, ph = rnd.uniform(0, 2 * math.pi), math.acos(rnd.uniform(-0.6, 1))
        r = cxz[2] * rnd.uniform(0.6, 1.0)
        lo = bpy.data.objects.new(f'leaf{k}', leaf_me)
        lo.location = (px + cxz[0] + r * math.sin(ph) * math.cos(th), py + r * math.sin(ph) * math.sin(th) * 0.8, cxz[1] + r * math.cos(ph))
        lo.rotation_euler = (rnd.uniform(-1.2, 1.2), rnd.uniform(-1.2, 1.2), rnd.uniform(0, 6.28))
        s = rnd.uniform(0.8, 1.3)
        lo.scale = (s, s, s)
        link(lo, c)
        plant.append(lo)
    R['plant'] = plant
    R['mat'] = [rounded('bath_mat', (0.75, 0.48, 0.012), (-0.5, 2.62, 0.024), M['mat'], 0.005, coll=c)]


def build():
    reset()
    M = build_materials()
    R['M'] = M
    build_shell(M)
    build_old(M)
    build_raw(M)
    build_tiles(M)
    build_vanity(M)
    build_shower_wc(M)
    build_ceiling(M)
    build_decor(M)
    bg = world((0.62, 0.70, 0.80), 1.0)
    R['sky'] = bg
    sun = bpy.data.lights.new('sun', 'SUN')
    sun.angle = math.radians(1.2)
    so = bpy.data.objects.new('sun', sun)
    # low sun from the right, slightly from behind the back wall, through the shower window
    so.rotation_euler = (math.radians(60), 0, math.radians(104))
    link(so)
    R['sun'] = so
    # daylight from the hallway behind the camera (open door): soft, neutral fill in every state
    R['hall'] = area_light('hall', (1.4, 0.9), (0.0, 0.06, 1.7), (math.radians(-90 + 180), 0, 0), 120, kelvin(5200))
    R['hall'].visible_glossy = False
    R['hall'].visible_camera = False
    for o in bpy.data.objects:
        if 'fade' not in o:
            o['fade'] = 1.0


# ------------------------------------------------------------------ state over scroll time

def flat(*keys):
    out = []
    for k in keys:
        v = R.get(k)
        if v is None:
            continue
        out.extend(v if isinstance(v, list) else [v])
    return out


def fade_in(keys, a, b, s):
    for o in flat(*keys):
        show(o, smooth(a, b, s))


def fade_out(keys, a, b, s):
    for o in flat(*keys):
        show(o, 1 - smooth(a, b, s))


def apply_state(s):
    M = R['M']
    # 0 - .21 old bathroom, then demolition
    fade_out(['old_fix', 'old_tube_light'], 0.10, 0.14, s)
    fade_out(['old_walls'], 0.14, 0.20, s)
    show(R['old_light'], 1 - smooth(0.11, 0.13, s))
    for o in R['frames']:
        o.data.materials[0] = M['frame_old'] if s < 0.17 else M['frame_new']
    R['win_glass'].data.materials[0] = M['glass_frost'] if s < 0.17 else M['glass']
    set_emission(M['tube'], 6.0 * (1 - smooth(0.10, 0.14, s)))
    # raw shell props
    fade_in(['pipes'], 0.15, 0.20, s)
    for o in flat('pipes'):
        if o.get('fade', 1) > 0:
            show(o, smooth(0.15, 0.20, s) * (1 - smooth(0.29, 0.33, s)))
    fade_in(['props'], 0.15, 0.20, s)
    for o in flat('props'):
        show(o, smooth(0.15, 0.20, s) * (1 - smooth(0.46, 0.49, s)))
    bulb_on = smooth(0.12, 0.14, s) * (1 - smooth(0.80, 0.84, s))
    for o in flat('bulb'):
        show(o, bulb_on)
    show(R['bulb_light'], bulb_on)
    set_emission(M['bulb'], 40 * bulb_on)
    # tiling .22 - .47
    order = R['tile_order']
    n = len(order)
    for k, o in enumerate(order):
        a = 0.22 + 0.245 * k / n
        show(o, smooth(a, a + 0.012, s))
    show(R['grout'][0], smooth(0.36, 0.37, s))
    # vanity .48 - .60
    fade_in(['carcass'], 0.48, 0.51, s)
    fade_in(['doors'], 0.50, 0.53, s)
    fade_in(['top'], 0.52, 0.55, s)
    fade_in(['basin'], 0.54, 0.57, s)
    fade_in(['faucet'], 0.56, 0.59, s)
    # shower, WC .60 - .72
    fade_in(['wc'], 0.60, 0.63, s)
    fade_in(['drain'], 0.61, 0.63, s)
    fade_in(['glass'], 0.63, 0.67, s)
    fade_in(['shower'], 0.66, 0.69, s)
    fade_in(['rail'], 0.68, 0.71, s)
    # ceiling, mirror, decor .72 - .82
    fade_in(['dropped', 'led'], 0.72, 0.75, s)
    fade_in(['mirror', 'mirror_led'], 0.74, 0.77, s)
    for o in flat('downlights'):
        if o.type != 'LIGHT':
            show(o, smooth(0.72, 0.75, s))
    fade_in(['decor'], 0.77, 0.80, s)
    fade_in(['plant'], 0.78, 0.81, s)
    fade_in(['mat'], 0.79, 0.81, s)
    # lights on .82 - .92
    led = smooth(0.82, 0.86, s)
    set_emission(M['led'], 30 * led)
    for o in R['cove']:
        o.hide_render = led <= 0.001
        o.data.energy = 95 * led * (o.data.size if o.data.size > 0.5 else o.data.size_y)
    ml = smooth(0.84, 0.88, s)
    set_emission(M['mirror_led'], 10 * ml)
    dl = smooth(0.86, 0.90, s)
    set_emission(M['downlight'], 30 * dl)
    for o in flat('downlights'):
        if o.type == 'LIGHT':
            o.hide_render = dl <= 0.001
            o.data.energy = 35 * dl
    # daylight: grey morning for the old room, low warm sun at the end
    warm = smooth(0.80, 0.92, s)
    sun = R['sun'].data
    sun.energy = 1.0 if s < 0.12 else lerp(4.0, 4.5, warm)
    sun.color = tuple(lerp(a, b, warm) for a, b in zip(kelvin(6200), kelvin(4300)))
    sky = R['sky']
    sky.inputs['Strength'].default_value = lerp(1.6, 1.0, warm)
    col = tuple(lerp(a, b, warm) for a, b in zip((0.66, 0.73, 0.82), (0.78, 0.74, 0.70)))
    sky.inputs['Color'].default_value = (*col, 1)
    # the hallway fill dims as the room's own lights take over
    hall = R['hall'].data
    hall.energy = lerp(60, 18, warm) if s >= 0.12 else 45
    hall.color = kelvin(6500) if s < 0.12 else kelvin(5200)
    bpy.context.scene.view_settings.exposure = (-0.4 if s < 0.12 else -0.2) - 0.35 * warm


# ------------------------------------------------------------------ cameras

CAM_A = dict(loc=(-0.08, 0.28, 1.50), yaw=4.0, lens=17.5, shift=-0.03)     # wide, from the door
CAM_B = dict(loc=(0.02, 0.95, 1.30), yaw=3.0, lens=18.5, shift=-0.07)      # one step in, the finished room
CAM_PA = dict(loc=(-0.05, 0.30, 1.42), yaw=5.0, lens=15.0)    # phone framing
CAM_PB = dict(loc=(0.05, 0.85, 1.30), yaw=4.0, lens=17.0)


def place_camera(cam, a, b, t):
    t = smooth(0, 1, t)
    loc = tuple(lerp(x, y, t) for x, y in zip(a['loc'], b['loc']))
    cam.location = loc
    cam.rotation_euler = (math.radians(90), 0, math.radians(-lerp(a['yaw'], b['yaw'], t)))
    cam.data.lens = lerp(a['lens'], b['lens'], t)
    cam.data.shift_y = lerp(a.get('shift', 0.0), b.get('shift', 0.0), t)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('mode', choices=['film', 'test', 'config'])
    ap.add_argument('--out', required=True)
    ap.add_argument('--res', default='1600x900')
    ap.add_argument('--n', type=int, default=120)
    ap.add_argument('--from', dest='f0', type=int, default=0)
    ap.add_argument('--to', dest='f1', type=int, default=None)
    ap.add_argument('--s', default='0,0.3,0.6,1')
    ap.add_argument('--samples', type=int, default=48)
    ap.add_argument('--portrait', action='store_true')
    ap.add_argument('--tile', default='marble')
    ap.add_argument('--cabinet', default='ceviz')
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    w, h = map(int, args.res.split('x'))
    build()
    setup_render(w, h, args.samples)
    a, b = (CAM_PA, CAM_PB) if args.portrait else (CAM_A, CAM_B)
    cam = camera('cam', a['loc'], a['yaw'], a['lens'], sensor_fit='VERTICAL' if args.portrait else 'HORIZONTAL')
    if args.portrait:
        cam.data.sensor_height = 36
        cam.data.sensor_fit = 'VERTICAL'
    set_tile(R['M']['tile'], args.tile)
    set_cabinet(R['M']['cabinet'], args.cabinet)
    sc = bpy.context.scene

    def shot(path):
        sc.render.filepath = path
        bpy.ops.render.render(write_still=True)
        print('rendered', path, flush=True)

    if args.mode == 'film':
        f1 = args.f1 if args.f1 is not None else args.n
        for f in range(args.f0, f1):
            s = f / (args.n - 1)
            apply_state(s)
            place_camera(cam, a, b, smooth(0.04, 0.96, s))
            shot(os.path.join(args.out, f'{f + 1:04d}.png'))
    elif args.mode == 'test':
        for s in [float(x) for x in args.s.split(',')]:
            apply_state(s)
            place_camera(cam, a, b, smooth(0.04, 0.96, s))
            shot(os.path.join(args.out, f'test_{s:.2f}.png'))
    else:
        place_camera(cam, a, b, 1.0)
        apply_state(0.0)
        shot(os.path.join(args.out, 'once.png'))
        apply_state(1.0)
        for tile in ('marble', 'anthra', 'beige'):
            set_tile(R['M']['tile'], tile)
            for cab in ('ceviz', 'beyaz', 'antrasit'):
                set_cabinet(R['M']['cabinet'], cab)
                shot(os.path.join(args.out, f'{tile}-{cab}.png'))


if __name__ == '__main__':
    main()
