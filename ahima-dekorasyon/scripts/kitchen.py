"""Ahima Dekorasyon - the kitchen scene (scene 4), Blender Cycles, same toolkit as bathroom.py.

  AHIMA_TEX=... python3 scripts/kitchen.py film --out OUT --n 40 --res 1280x720 [--portrait]
  AHIMA_TEX=... python3 scripts/kitchen.py test --out OUT --s 0,0.5,1 --res 640x360

Room x -2.1..2.1, y 0..4.4, z 0..2.75; camera near the door looking +y.
Scroll time s: 0 bare shell -> .12 base + tall units -> .32 worktop and slab backsplash
-> .48 wall units, built-in appliances -> .64 island -> .78 hidden LEDs and pendants on.
"""
import argparse
import math
import os
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from blend_lib import *  # noqa

W, D, H = 4.2, 4.4, 2.75
X0, X1 = -W / 2, W / 2
R = {}


def add(key, *obs):
    R.setdefault(key, []).extend(obs)


def build():
    reset()
    M = {}
    M['plaster'] = textured('plaster', 'pbr/plastered_wall_diff.jpg', 'pbr/plastered_wall_rough.jpg', 'pbr/plastered_wall_nor_gl.jpg', scale=2.0, tint=(0.66, 0.65, 0.63), rough_range=(0.7, 1.0))
    M['paint'] = solid('paint', (0.74, 0.71, 0.66), 0.85)
    M['screed'] = textured('screed', 'pbr/concrete_floor_worn_001_diff.jpg', 'pbr/concrete_floor_worn_001_rough.jpg', 'pbr/concrete_floor_worn_001_nor_gl.jpg', scale=2.5, rough_range=(0.6, 0.95))
    M['ceiling'] = solid('ceiling', (0.88, 0.87, 0.85), 0.9)
    M['floor'] = textured('floor_tile', 'slabs/anthra_diff.png', 'slabs/anthra_rough.png', None, scale=(2.4, 1.2), bump='slabs/anthra_bump.png', rough_range=(0, 0.8))
    M['marble'] = textured('marble', 'slabs/marble_diff.png', 'slabs/marble_rough.png', None, scale=(2.4, 1.2), bump='slabs/marble_bump.png', rough_range=(0, 1))
    M['walnut'] = textured('walnut', 'pbr/walnut_veneer_diff.jpg', 'pbr/walnut_veneer_rough.jpg', 'pbr/walnut_veneer_nor_gl.jpg', scale=1.2, rough_range=(0.35, 0.55), rotate=0, nor_strength=0.4, tint=(0.92, 0.84, 0.76))
    M['lacquer'] = solid('lacquer', (0.085, 0.087, 0.092), 0.55)
    M['brass'] = solid('brass', (0.80, 0.62, 0.38), 0.26, metal=1.0)
    M['steel'] = solid('steel', (0.6, 0.6, 0.6), 0.3, metal=1.0)
    M['black_glass'] = solid('black_glass', (0.01, 0.01, 0.012), 0.05, coat=1.0)
    M['frame'] = solid('frame', (0.08, 0.08, 0.085), 0.45)
    M['glass'] = glass('glass')
    M['led'] = emission('led', kelvin(3300), 0.0)
    M['pendant_glow'] = emission('pendant_glow', kelvin(2900), 0.0)
    M['ceramic'] = solid('ceramic', (0.90, 0.88, 0.84), 0.2)
    M['bread'] = solid('bread', (0.55, 0.36, 0.18), 0.7)
    M['leaf'] = solid('leaf', (0.10, 0.20, 0.07), 0.45, sss=0.1)
    R['M'] = M

    c = collection('shell')
    t = 0.2
    box('wall_back', (W + 2 * t, t, H + 0.4), (0, D + t / 2, H / 2), M['plaster'], coll=c)
    left = box('wall_left', (t, D + 2 * t, H + 0.4), (X0 - t / 2, D / 2, H / 2), M['plaster'], coll=c)
    box('wall_right', (t, D + 2 * t, H + 0.4), (X1 + t / 2, D / 2, H / 2), M['plaster'], coll=c)
    box('wall_front', (W + 2 * t, t, H + 0.4), (0, -t / 2, H / 2), M['plaster'], coll=c)
    box('floor', (W + 0.4, D + 0.4, 0.2), (0, D / 2, -0.1), M['screed'], coll=c)
    box('ceiling', (W + 0.4, D + 0.4, 0.2), (0, D / 2, H + 0.1), M['ceiling'], coll=c)
    # tall window in the left wall
    wy0, wy1, wz0, wz1 = 1.6, 3.0, 0.9, 2.45
    hole = box('win_hole', (0.8, wy1 - wy0, wz1 - wz0), (X0 - 0.1, (wy0 + wy1) / 2, (wz0 + wz1) / 2), None, coll=c)
    boolean(left, hole)
    for nm, sz, loc in (('fb', (0.06, wy1 - wy0, 0.05), (X0 - 0.12, (wy0 + wy1) / 2, wz0 + 0.025)),
                        ('ft', (0.06, wy1 - wy0, 0.05), (X0 - 0.12, (wy0 + wy1) / 2, wz1 - 0.025)),
                        ('fl', (0.06, 0.05, wz1 - wz0), (X0 - 0.12, wy0 + 0.025, (wz0 + wz1) / 2)),
                        ('fr', (0.06, 0.05, wz1 - wz0), (X0 - 0.12, wy1 - 0.025, (wz0 + wz1) / 2)),
                        ('fm', (0.06, 0.04, wz1 - wz0), (X0 - 0.12, (wy0 + wy1) / 2, (wz0 + wz1) / 2))):
        box(nm, sz, loc, M['frame'], coll=c)
    box('win_glass', (0.006, wy1 - wy0, wz1 - wz0), (X0 - 0.12, (wy0 + wy1) / 2, (wz0 + wz1) / 2), M['glass'], coll=c)

    f = collection('finish')
    add('finish',
        box('paint_l', (0.004, D, H), (X0 + 0.002, D / 2, H / 2), M['paint'], coll=f),
        box('paint_r', (0.004, D, H), (X1 - 0.002, D / 2, H / 2), M['paint'], coll=f),
        box('paint_f', (W, 0.004, H), (0, 0.002, H / 2), M['paint'], coll=f),
        box('paint_b', (W, 0.004, H), (0, D - 0.002, H / 2), M['paint'], coll=f))
    boolean(R['finish'][0], hole)
    # floor: 60 x 120 beige stone tiles
    import random
    rnd = random.Random(5)
    fl = []
    y = 0.0
    while y < D - 1e-6:
        y2 = min(y + 1.2, D)
        x = X0
        while x < X1 - 1e-6:
            x2 = min(x + 0.6, X1)
            fl.append(box(f'fl_{x:.1f}_{y:.1f}', (x2 - x - 0.002, y2 - y - 0.002, 0.01), ((x + x2) / 2, (y + y2) / 2, 0.012), M['floor'], bevel=0.001, segs=1, coll=f,
                          uv_offset=(rnd.uniform(0, 1.6) - x, -y)))
            x = x2
        y = y2
    add('floor', *fl)

    k = collection('kitchen')
    back = D
    # base run along the back wall: matte anthracite, handleless with a brass gola line
    bx0, bx1 = X0 + 0.0, 1.25
    add('base', box('base', (bx1 - bx0, 0.58, 0.72), ((bx0 + bx1) / 2, back - 0.29, 0.1 + 0.36), M['lacquer'], bevel=0.002, coll=k))
    add('base', box('plinth', (bx1 - bx0, 0.52, 0.1), ((bx0 + bx1) / 2, back - 0.29, 0.05), M['frame'], coll=k))
    n = 6
    for i in range(n):
        x = bx0 + (bx1 - bx0) * (i + 0.5) / n
        wdt = (bx1 - bx0) / n - 0.004
        add('base', box(f'bdoor{i}', (wdt, 0.019, 0.66), (x, back - 0.58 - 0.0095, 0.1 + 0.33), M['lacquer'], bevel=0.0015, coll=k))
    add('base', box('gola', (bx1 - bx0, 0.012, 0.012), ((bx0 + bx1) / 2, back - 0.585, 0.8), M['brass'], coll=k))
    # tall units on the right: walnut, built-in oven + microwave
    tx0, tx1 = 1.25, X1
    add('tall', box('tall', (tx1 - tx0, 0.6, 2.35), ((tx0 + tx1) / 2, back - 0.3, 1.175 + 0.0), M['walnut'], bevel=0.002, coll=k))
    for i in range(2):
        wdt = (tx1 - tx0) / 2 - 0.004
        add('tall', box(f'tdoor{i}', (wdt, 0.019, 2.3), (tx0 + wdt / 2 + 0.002 + i * (wdt + 0.004), back - 0.6 - 0.0095, 1.17), M['walnut'], bevel=0.0015, coll=k))
    ax = tx0 + (tx1 - tx0) / 4
    add('appl', box('oven', ((tx1 - tx0) / 2 - 0.03, 0.03, 0.58), (ax, back - 0.62, 1.05), M['black_glass'], bevel=0.004, coll=k))
    add('appl', box('oven_bar', ((tx1 - tx0) / 2 - 0.12, 0.03, 0.015), (ax, back - 0.645, 1.3), M['steel'], coll=k))
    add('appl', box('micro', ((tx1 - tx0) / 2 - 0.03, 0.03, 0.38), (ax, back - 0.62, 1.6), M['black_glass'], bevel=0.004, coll=k))
    # worktop + full-height slab backsplash
    add('top', box('worktop', (bx1 - bx0, 0.62, 0.04), ((bx0 + bx1) / 2, back - 0.31, 0.84), M['marble'], bevel=0.0015, coll=k, uv_offset=(0.4, 0.3)))
    add('top', box('splash', (bx1 - bx0, 0.012, 0.66), ((bx0 + bx1) / 2, back - 0.006, 0.86 + 0.33), M['marble'], coll=k, uv_offset=(0.1, -0.86)))
    # sink + brass tap
    sx = -0.55
    add('top', box('sink', (0.6, 0.42, 0.005), (sx, back - 0.32, 0.8605), M['steel'], coll=k))
    add('appl', cyl('tap', 0.012, 0.34, (sx, back - 0.09, 0.86 + 0.17), M['brass'], coll=k))
    add('appl', cyl('tap_arm', 0.011, 0.2, (sx, back - 0.18, 1.2), M['brass'], axis='Y', coll=k))
    # wall units (walnut) with hidden LED strip underneath
    ux0, ux1 = X0, 1.25
    add('upper', box('upper', (ux1 - ux0, 0.36, 0.72), ((ux0 + ux1) / 2, back - 0.18, 1.52 + 0.36), M['walnut'], bevel=0.002, coll=k))
    for i in range(5):
        wdt = (ux1 - ux0) / 5 - 0.004
        add('upper', box(f'udoor{i}', (wdt, 0.019, 0.72), (ux0 + wdt / 2 + 0.002 + i * (wdt + 0.004), back - 0.36 - 0.0095, 1.88), M['walnut'], bevel=0.0015, coll=k))
    add('led', box('led_under', (ux1 - ux0 - 0.06, 0.012, 0.006), ((ux0 + ux1) / 2, back - 0.33, 1.515), M['led'], coll=k))
    R['under_light'] = area_light('under_light', (ux1 - ux0 - 0.1, 0.03), ((ux0 + ux1) / 2, back - 0.3, 1.51), (0, 0, 0), 0, kelvin(3300), coll=k)
    # island with waterfall ends, hob, bar stools omitted to keep the shot clean
    iy, ix0, ix1 = 2.45, -1.0, 1.0
    add('island', box('island_body', (ix1 - ix0 - 0.08, 0.86, 0.86), (0, iy, 0.43), M['walnut'], bevel=0.002, coll=k))
    add('island', box('island_top', (ix1 - ix0 + 0.04, 1.0, 0.04), (0, iy, 0.88), M['marble'], bevel=0.0015, coll=k, uv_offset=(0.2, 0.1)))
    add('island', box('wf_l', (0.04, 1.0, 0.86), (ix0 - 0.0, iy, 0.43), M['marble'], coll=k, uv_offset=(0.8, 0.0)))
    add('island', box('wf_r', (0.04, 1.0, 0.86), (ix1 + 0.0, iy, 0.43), M['marble'], coll=k, uv_offset=(0.9, 0.0)))
    add('island', box('hob', (0.6, 0.5, 0.004), (0.25, iy + 0.12, 0.902), M['black_glass'], coll=k))
    add('island', cyl('bowl', 0.14, 0.08, (-0.5, iy - 0.05, 0.94), M['ceramic'], coll=k, bevel=0.01))
    add('island', sphere('bread', 0.08, (-0.5, iy - 0.05, 0.99), M['bread'], scale=(1.4, 0.9, 0.5), coll=k))
    # pendants
    pend = []
    for i, x in enumerate((-0.5, 0.5)):
        pend.append(cyl(f'cord{i}', 0.003, 0.95, (x, iy, H - 0.475), M['frame'], coll=k))
        pend.append(cyl(f'shade{i}', 0.11, 0.22, (x, iy, H - 1.05), M['brass'], coll=k, bevel=0.003))
        pend.append(cyl(f'glow{i}', 0.1, 0.004, (x, iy, H - 1.161), M['pendant_glow'], coll=k))
        pend.append(point_light(f'pl{i}', (x, iy, H - 1.2), 0, kelvin(2900), radius=0.05, kind='SPOT', spot=math.radians(100), coll=k))
    add('pend', *pend)
    # ceiling downlights + a recessed linear groove over the run
    dl = []
    for i, (x, y) in enumerate(((-1.4, 3.3), (0.0, 3.3), (1.4, 3.3), (-1.0, 1.0), (1.0, 1.0))):
        dl.append(cyl(f'dld{i}', 0.035, 0.004, (x, y, H - 0.002), M['led'], coll=k))
        dl.append(point_light(f'dl{i}', (x, y, H - 0.02), 0, kelvin(3300), radius=0.03, kind='SPOT', spot=math.radians(75), coll=k))
    add('dl', *dl)
    # a little olive tree in the corner by the window
    pot = cyl('pot', 0.2, 0.45, (X0 + 0.35, 1.0, 0.235), M['ceramic'], coll=k, bevel=0.01)
    add('decor', pot)

    world((0.70, 0.76, 0.84), 1.4)
    sun = bpy.data.lights.new('sun', 'SUN')
    sun.angle = math.radians(1.5)
    sun.energy = 3.5
    sun.color = kelvin(5000)
    so = bpy.data.objects.new('sun', sun)
    so.rotation_euler = (math.radians(55), 0, math.radians(-75))
    link(so)
    R['sun'] = so
    R['hall'] = area_light('hall', (1.6, 1.0), (0.3, 0.06, 1.8), (math.radians(90), 0, 0), 60, kelvin(5200))
    R['hall'].visible_glossy = False
    R['hall'].visible_camera = False
    for o in bpy.data.objects:
        if 'fade' not in o:
            o['fade'] = 1.0


def fade_in(key, a, b, s):
    for o in R.get(key, []):
        if o.type != 'LIGHT' and not o.get('cutter'):
            show(o, smooth(a, b, s))


def apply_state(s):
    M = R['M']
    fade_in('finish', 0.04, 0.10, s)
    n = len(R['floor'])
    for k, o in enumerate(sorted(R['floor'], key=lambda o: -o.location.y)):
        a = 0.04 + 0.08 * k / n
        show(o, smooth(a, a + 0.02, s))
    fade_in('base', 0.12, 0.18, s)
    fade_in('tall', 0.18, 0.26, s)
    fade_in('top', 0.32, 0.40, s)
    fade_in('upper', 0.48, 0.54, s)
    fade_in('appl', 0.54, 0.60, s)
    fade_in('island', 0.64, 0.72, s)
    fade_in('decor', 0.70, 0.74, s)
    fade_in('pend', 0.72, 0.76, s)
    fade_in('dl', 0.72, 0.76, s)
    fade_in('led', 0.72, 0.76, s)
    on = smooth(0.78, 0.88, s)
    set_emission(M['led'], 25 * on)
    set_emission(M['pendant_glow'], 12 * smooth(0.82, 0.9, s))
    ul = R['under_light']
    ul.hide_render = on <= 0.001
    ul.data.energy = 40 * on
    for o in R['pend'] + R['dl']:
        if o.type == 'LIGHT':
            o.hide_render = on <= 0.001
            o.data.energy = (45 if o.name.startswith('pl') else 30) * on
    R['sun'].data.energy = lerp(3.5, 2.6, on)
    bpy.context.scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value = lerp(1.4, 0.8, on)
    bpy.context.scene.view_settings.exposure = 0.1 + 0.05 * on


CAM_A = dict(loc=(0.30, 0.22, 1.60), yaw=-3.0, lens=18.0, shift=-0.05)
CAM_B = dict(loc=(0.25, 0.45, 1.50), yaw=-4.0, lens=19.5, shift=-0.07)
CAM_PA = dict(loc=(0.30, 0.25, 1.50), yaw=-2.0, lens=15.0, shift=-0.02)
CAM_PB = dict(loc=(0.25, 0.45, 1.45), yaw=-3.0, lens=16.0, shift=-0.04)


def place_camera(cam, a, b, t):
    t = smooth(0, 1, t)
    cam.location = tuple(lerp(x, y, t) for x, y in zip(a['loc'], b['loc']))
    cam.rotation_euler = (math.radians(90), 0, math.radians(-lerp(a['yaw'], b['yaw'], t)))
    cam.data.lens = lerp(a['lens'], b['lens'], t)
    cam.data.shift_y = lerp(a['shift'], b['shift'], t)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('mode', choices=['film', 'test'])
    ap.add_argument('--out', required=True)
    ap.add_argument('--res', default='1280x720')
    ap.add_argument('--n', type=int, default=40)
    ap.add_argument('--s', default='0,0.5,1')
    ap.add_argument('--samples', type=int, default=20)
    ap.add_argument('--portrait', action='store_true')
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    w, h = map(int, args.res.split('x'))
    build()
    setup_render(w, h, args.samples)
    a, b = (CAM_PA, CAM_PB) if args.portrait else (CAM_A, CAM_B)
    cam = camera('cam', a['loc'], a['yaw'], a['lens'])
    if args.portrait:
        cam.data.sensor_fit = 'VERTICAL'
        cam.data.sensor_height = 36
    sc = bpy.context.scene

    def shot(s, path):
        apply_state(s)
        place_camera(cam, a, b, smooth(0.0, 1.0, s))
        sc.render.filepath = path
        bpy.ops.render.render(write_still=True)
        print('rendered', path, flush=True)

    if args.mode == 'film':
        for f in range(args.n):
            shot(f / (args.n - 1), os.path.join(args.out, f'{f + 1:04d}.png'))
    else:
        for s in [float(x) for x in args.s.split(',')]:
            shot(s, os.path.join(args.out, f'test_{s:.2f}.png'))


if __name__ == '__main__':
    main()
