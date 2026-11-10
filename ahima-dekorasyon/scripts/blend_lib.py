"""Small helper layer over bpy shared by the bathroom and kitchen scenes.

Every material ends in a Mix Shader driven by the object's "fade" property (Attribute node, OBJECT
type), so items can dissolve in over a few frames like a time-lapse instead of flying in.
"""
import math
import os

import bmesh
import bpy
from mathutils import Vector

TEX = os.environ.get('AHIMA_TEX', '/tmp/ahima-tex')
_images = {}


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for m in list(bpy.data.materials):
        bpy.data.materials.remove(m)


def image(path, color=True):
    key = (path, color)
    if key not in _images:
        img = bpy.data.images.load(os.path.join(TEX, path), check_existing=True)
        if not color:
            img.colorspace_settings.name = 'Non-Color'
        _images[key] = img
    return _images[key]


# ---------------------------------------------------------------- materials

def _new(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    out.location = (900, 0)
    return m, nt, out


def _fade(nt, shader_out, out):
    attr = nt.nodes.new('ShaderNodeAttribute')
    attr.attribute_type = 'OBJECT'
    attr.attribute_name = 'fade'
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(attr.outputs['Fac'], mix.inputs['Fac'])
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(shader_out, mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])


def _set(bsdf, **kw):
    names = {
        'color': 'Base Color', 'rough': 'Roughness', 'metal': 'Metallic', 'transmission': 'Transmission Weight',
        'ior': 'IOR', 'coat': 'Coat Weight', 'coat_rough': 'Coat Roughness', 'sheen': 'Sheen Weight',
        'sss': 'Subsurface Weight', 'spec': 'Specular IOR Level', 'alpha': 'Alpha',
    }
    for k, v in kw.items():
        sock = bsdf.inputs[names[k]]
        if k == 'color':
            v = (*v, 1.0) if len(v) == 3 else v
        sock.default_value = v


def solid(name, color, rough=0.5, metal=0.0, **kw):
    m, nt, out = _new(name)
    b = nt.nodes.new('ShaderNodeBsdfPrincipled')
    _set(b, color=color, rough=rough, metal=metal, **kw)
    _fade(nt, b.outputs[0], out)
    return m


def emission(name, color, strength):
    m, nt, out = _new(name)
    e = nt.nodes.new('ShaderNodeEmission')
    e.inputs['Color'].default_value = (*color, 1)
    e.inputs['Strength'].default_value = strength
    _fade(nt, e.outputs[0], out)
    m['emit'] = e.name
    return m


def set_emission(mat, strength):
    mat.node_tree.nodes[mat['emit']].inputs['Strength'].default_value = strength


def glass(name, tint=(0.96, 0.99, 0.98), rough=0.0, frosted=False):
    """Thin architectural glass. Clear panes are a Fresnel mix of a tinted see-through layer and a sharp
    reflection (no refraction blur, cheap and crisp); frosted panes use rough transmission.
    Shadow rays always pass through, so daylight and lamps light the room behind the glass."""
    m, nt, out = _new(name)
    if frosted:
        g = nt.nodes.new('ShaderNodeBsdfPrincipled')
        _set(g, color=tint, rough=0.35, transmission=1.0, ior=1.5)
        surf = g.outputs[0]
    else:
        tr0 = nt.nodes.new('ShaderNodeBsdfTransparent')
        tr0.inputs['Color'].default_value = (*tint, 1)
        gl = nt.nodes.new('ShaderNodeBsdfGlossy')
        gl.inputs['Roughness'].default_value = rough
        fr = nt.nodes.new('ShaderNodeFresnel')
        fr.inputs['IOR'].default_value = 1.5
        mx0 = nt.nodes.new('ShaderNodeMixShader')
        nt.links.new(fr.outputs[0], mx0.inputs['Fac'])
        nt.links.new(tr0.outputs[0], mx0.inputs[1])
        nt.links.new(gl.outputs[0], mx0.inputs[2])
        surf = mx0.outputs[0]
    lp = nt.nodes.new('ShaderNodeLightPath')
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    tr.inputs['Color'].default_value = (*tint, 1)
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Shadow Ray'], mix.inputs['Fac'])
    nt.links.new(surf, mix.inputs[1])
    nt.links.new(tr.outputs[0], mix.inputs[2])
    _fade(nt, mix.outputs[0], out)
    return m


def textured(name, diff, rough=None, nor=None, scale=1.0, tint=None, rough_range=(0.0, 1.0), nor_strength=1.0,
             bump=None, bump_strength=0.2, rotate=0.0, metal=0.0, coat=0.0, sheen=0.0):
    """Image material on the object's UVs (UVs are in metres, see uv_project); `scale` = metres per image."""
    m, nt, out = _new(name)
    b = nt.nodes.new('ShaderNodeBsdfPrincipled')
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    sx, sy = scale if isinstance(scale, tuple) else (scale, scale)
    mp.inputs['Scale'].default_value = (1 / sx, 1 / sy, 1)
    mp.inputs['Rotation'].default_value = (0, 0, rotate)
    nt.links.new(tc.outputs['UV'], mp.inputs['Vector'])
    d = nt.nodes.new('ShaderNodeTexImage')
    d.image = image(diff)
    nt.links.new(mp.outputs[0], d.inputs['Vector'])
    col = d.outputs['Color']
    if tint is not None:
        mx = nt.nodes.new('ShaderNodeMix')
        mx.data_type = 'RGBA'
        mx.blend_type = 'MULTIPLY'
        mx.inputs['Factor'].default_value = 1.0
        mx.inputs[7].default_value = (*tint, 1)
        nt.links.new(col, mx.inputs[6])
        col = mx.outputs[2]
    nt.links.new(col, b.inputs['Base Color'])
    if rough:
        r = nt.nodes.new('ShaderNodeTexImage')
        r.image = image(rough, False)
        nt.links.new(mp.outputs[0], r.inputs['Vector'])
        mr = nt.nodes.new('ShaderNodeMapRange')
        mr.inputs['To Min'].default_value, mr.inputs['To Max'].default_value = rough_range
        nt.links.new(r.outputs['Color'], mr.inputs['Value'])
        nt.links.new(mr.outputs[0], b.inputs['Roughness'])
    else:
        b.inputs['Roughness'].default_value = rough_range[1]
    if nor:
        n = nt.nodes.new('ShaderNodeTexImage')
        n.image = image(nor, False)
        nt.links.new(mp.outputs[0], n.inputs['Vector'])
        nm = nt.nodes.new('ShaderNodeNormalMap')
        nm.inputs['Strength'].default_value = nor_strength
        nt.links.new(n.outputs['Color'], nm.inputs['Color'])
        nt.links.new(nm.outputs[0], b.inputs['Normal'])
    elif bump:
        h = nt.nodes.new('ShaderNodeTexImage')
        h.image = image(bump, False)
        nt.links.new(mp.outputs[0], h.inputs['Vector'])
        bn = nt.nodes.new('ShaderNodeBump')
        bn.inputs['Strength'].default_value = bump_strength
        bn.inputs['Distance'].default_value = 0.002
        nt.links.new(h.outputs['Color'], bn.inputs['Height'])
        nt.links.new(bn.outputs[0], b.inputs['Normal'])
    _set(b, metal=metal, coat=coat, sheen=sheen)
    _fade(nt, b.outputs[0], out)
    return m


def brick_tiles(name, c1, c2, mortar, w, h, offset=0.0, mortar_size=0.003, rough=0.25, dirt=0.0):
    """Old small-format ceramic tiles (procedural grid) on metre UVs."""
    m, nt, out = _new(name)
    b = nt.nodes.new('ShaderNodeBsdfPrincipled')
    tc = nt.nodes.new('ShaderNodeTexCoord')
    br = nt.nodes.new('ShaderNodeTexBrick')
    br.offset = offset
    br.squash_frequency = 1
    br.inputs['Color1'].default_value = (*c1, 1)
    br.inputs['Color2'].default_value = (*c2, 1)
    br.inputs['Mortar'].default_value = (*mortar, 1)
    br.inputs['Scale'].default_value = 1.0
    br.inputs['Mortar Size'].default_value = mortar_size
    br.inputs['Mortar Smooth'].default_value = 0.3
    br.inputs['Brick Width'].default_value = w
    br.inputs['Row Height'].default_value = h
    nt.links.new(tc.outputs['UV'], br.inputs['Vector'])
    col = br.outputs['Color']
    if dirt:
        no = nt.nodes.new('ShaderNodeTexNoise')
        no.inputs['Scale'].default_value = 3.0
        no.inputs['Detail'].default_value = 8
        nt.links.new(tc.outputs['UV'], no.inputs['Vector'])
        mx = nt.nodes.new('ShaderNodeMix')
        mx.data_type = 'RGBA'
        mx.blend_type = 'MULTIPLY'
        mx.inputs['Factor'].default_value = dirt
        nt.links.new(col, mx.inputs[6])
        nt.links.new(no.outputs['Color'], mx.inputs[7])
        col = mx.outputs[2]
    nt.links.new(col, b.inputs['Base Color'])
    # grout lines are rougher and recessed
    rr = nt.nodes.new('ShaderNodeMapRange')
    rr.inputs['To Min'].default_value = 0.85
    rr.inputs['To Max'].default_value = rough
    nt.links.new(br.outputs['Fac'], rr.inputs['Value'])
    nt.links.new(rr.outputs[0], b.inputs['Roughness'])
    bn = nt.nodes.new('ShaderNodeBump')
    bn.inputs['Strength'].default_value = 0.35
    bn.inputs['Distance'].default_value = 0.002
    nt.links.new(br.outputs['Fac'], bn.inputs['Height'])
    nt.links.new(bn.outputs[0], b.inputs['Normal'])
    _fade(nt, b.outputs[0], out)
    return m


# ---------------------------------------------------------------- geometry

def link(obj, coll=None):
    (coll or bpy.context.scene.collection).objects.link(obj)
    obj['fade'] = 1.0
    return obj


def collection(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


def uv_project(obj, offset=(0.0, 0.0)):
    """Box-project UVs in world-scale metres from each face's dominant normal axis."""
    me = obj.data
    bm = bmesh.new()
    bm.from_mesh(me)
    uv = bm.loops.layers.uv.verify()
    mw = obj.matrix_world
    for f in bm.faces:
        n = f.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        for l in f.loops:
            co = mw @ l.vert.co
            if ax == 0:
                u, v = co.y, co.z
            elif ax == 1:
                u, v = co.x, co.z
            else:
                u, v = co.x, co.y
            l[uv].uv = (u + offset[0], v + offset[1])
    bm.to_mesh(me)
    bm.free()


def box(name, size, loc, mat, bevel=0.0, segs=3, coll=None, uv_offset=(0, 0), rot=None):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
        v.co.z *= size[2]
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    ob.location = loc
    if rot:
        ob.rotation_euler = rot
    link(ob, coll)
    if mat:
        me.materials.append(mat)
    bpy.context.view_layer.update()
    uv_project(ob, uv_offset)
    if bevel:
        bv = ob.modifiers.new('bevel', 'BEVEL')
        bv.width = bevel
        bv.segments = segs
        bv.limit_method = 'ANGLE'
        bv.harden_normals = False
        for p in me.polygons:
            p.use_smooth = True
    return ob


def cyl(name, r, h, loc, mat, axis='Z', verts=48, coll=None, bevel=0.0, scale=(1, 1, 1)):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=verts, radius1=r, radius2=r, depth=h)
    for v in bm.verts:
        v.co.x *= scale[0]
        v.co.y *= scale[1]
        v.co.z *= scale[2]
    for f in bm.faces:
        f.smooth = len(f.verts) == 4
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    ob.location = loc
    if axis == 'X':
        ob.rotation_euler = (0, math.pi / 2, 0)
    elif axis == 'Y':
        ob.rotation_euler = (math.pi / 2, 0, 0)
    link(ob, coll)
    if mat:
        me.materials.append(mat)
    bpy.context.view_layer.update()
    uv_project(ob)
    if bevel:
        bv = ob.modifiers.new('bevel', 'BEVEL')
        bv.width = bevel
        bv.segments = 3
        bv.limit_method = 'ANGLE'
    return ob


def sphere(name, r, loc, mat, scale=(1, 1, 1), coll=None, segs=32):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=segs // 2, radius=r)
    for v in bm.verts:
        v.co.x *= scale[0]
        v.co.y *= scale[1]
        v.co.z *= scale[2]
    for f in bm.faces:
        f.smooth = True
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    ob.location = loc
    link(ob, coll)
    if mat:
        me.materials.append(mat)
    return ob


def rounded(name, size, loc, mat, radius, coll=None, segs=6, rot=None):
    """Soft-edged block (ceramics, towels): box with a wide multi-segment bevel."""
    ob = box(name, size, loc, mat, bevel=radius, segs=segs, coll=coll, rot=rot)
    return ob


def boolean(target, cutter, op='DIFFERENCE'):
    md = target.modifiers.new('bool', 'BOOLEAN')
    md.operation = op
    md.object = cutter
    md.solver = 'EXACT'
    cutter.hide_render = True
    cutter.hide_viewport = True
    cutter['cutter'] = 1
    return md


def add_bevel(ob, width, segs=3, angle=None):
    """Bevel added after any boolean so the cut edges get rounded too."""
    bv = ob.modifiers.new('bevel', 'BEVEL')
    bv.width = width
    bv.segments = segs
    bv.limit_method = 'ANGLE'
    if angle:
        bv.angle_limit = math.radians(angle)
    for p in ob.data.polygons:
        p.use_smooth = True
    return bv


def area_light(name, size, loc, rot, energy, color=(1, 1, 1), shape='RECTANGLE', coll=None, spread=None):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.shape = shape
    if isinstance(size, (tuple, list)):
        ld.size, ld.size_y = size
    else:
        ld.size = size
    ld.energy = energy
    ld.color = color
    if spread:
        ld.spread = spread
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    ob.rotation_euler = rot
    link(ob, coll)
    return ob


def point_light(name, loc, energy, color=(1, 1, 1), radius=0.05, kind='POINT', spot=None, rot=(0, 0, 0), coll=None):
    ld = bpy.data.lights.new(name, kind)
    ld.energy = energy
    ld.color = color
    ld.shadow_soft_size = radius
    if spot:
        ld.spot_size = spot
        ld.spot_blend = 0.6
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    ob.rotation_euler = rot
    link(ob, coll)
    return ob


def show(obj, fade):
    """fade 0 = gone (not rendered), 1 = solid; between = dissolving."""
    fade = max(0.0, min(1.0, fade))
    if obj.type == 'LIGHT':
        obj.hide_render = fade <= 0.001
        base = obj.get('base_energy', obj.data.energy)
        obj['base_energy'] = base
        obj.data.energy = base * fade
        return
    obj.hide_render = fade <= 0.001
    if abs(obj.get('fade', 1.0) - fade) > 1e-6:
        obj['fade'] = fade
        obj.update_tag()


def show_coll(coll, fade):
    for o in coll.all_objects:
        if not o.get('cutter'):
            show(o, fade)


def kelvin(k):
    """Approximate RGB of a black body (good enough for 2200-6500 K)."""
    t = k / 100.0
    if t <= 66:
        r = 1.0
        g = max(0, min(1, (99.4708025861 * math.log(t) - 161.1195681661) / 255))
        b = 0 if t <= 19 else max(0, min(1, (138.5177312231 * math.log(t - 10) - 305.0447927307) / 255))
    else:
        r = max(0, min(1, 329.698727446 * ((t - 60) ** -0.1332047592) / 255))
        g = max(0, min(1, 288.1221695283 * ((t - 60) ** -0.0755148492) / 255))
        b = 1.0
    # the curve fit is over-saturated in a linear scene; pull it halfway back to white
    return tuple(0.5 + 0.5 * c ** 2.2 for c in (r, g, b))


def setup_render(w, h, samples=64, denoise=True):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    cy = sc.cycles
    cy.device = 'CPU'
    cy.samples = samples
    cy.use_adaptive_sampling = True
    cy.adaptive_threshold = 0.02
    cy.use_denoising = denoise
    try:
        cy.denoiser = 'OPENIMAGEDENOISE'
    except Exception:
        pass
    cy.max_bounces = 8
    cy.diffuse_bounces = 3
    cy.glossy_bounces = 4
    cy.transmission_bounces = 8
    cy.transparent_max_bounces = 16
    cy.caustics_reflective = False
    cy.caustics_refractive = False
    cy.sample_clamp_indirect = 6.0
    cy.blur_glossy = 1.0
    sc.render.resolution_x = w
    sc.render.resolution_y = h
    sc.render.resolution_percentage = 100
    sc.render.use_persistent_data = True
    sc.render.film_transparent = False
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGB'
    vs = sc.view_settings
    vs.view_transform = 'AgX'
    for look in ('AgX - Medium High Contrast', 'AgX - Base Contrast', 'Medium High Contrast'):
        try:
            vs.look = look
            break
        except Exception:
            continue


def world(color=(0.55, 0.62, 0.72), strength=1.0):
    w = bpy.data.worlds.new('World')
    bpy.context.scene.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes.get('Background') or w.node_tree.nodes.new('ShaderNodeBackground')
    bg.inputs['Color'].default_value = (*color, 1)
    bg.inputs['Strength'].default_value = strength
    out = w.node_tree.nodes.get('World Output') or w.node_tree.nodes.new('ShaderNodeOutputWorld')
    w.node_tree.links.new(bg.outputs[0], out.inputs['Surface'])
    return bg


def camera(name, loc, yaw_deg, lens, pitch_deg=0.0, shift=(0, 0), sensor_fit='HORIZONTAL'):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.sensor_width = 36
    cd.sensor_fit = sensor_fit
    cd.shift_x, cd.shift_y = shift
    cd.clip_start = 0.05
    ob = bpy.data.objects.new(name, cd)
    ob.location = loc
    # looking toward +Y by default; yaw > 0 turns right
    ob.rotation_euler = (math.radians(90 + pitch_deg), 0, math.radians(-yaw_deg))
    bpy.context.scene.collection.objects.link(ob)
    bpy.context.scene.camera = ob
    return ob


def smooth(a, b, x):
    t = min(1.0, max(0.0, (x - a) / (b - a))) if b != a else float(x >= a)
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t
