"""Ahima Dekorasyon procedural blockout assets for Claude Code.
Requires: pip install trimesh numpy
Coordinate system: +Y up, meters; camera views toward -Z.
This is an editable 3D blockout, not a final photoreal model.
"""
from pathlib import Path
import numpy as np
import trimesh as tm
from trimesh.transformations import rotation_matrix

OUT=Path(__file__).resolve().parent
COLORS={
 'concrete':'#C8C5C0','plaster':'#E8E3DB','ceiling':'#F1ECE4','frame':'#343634',
 'oak':'#9C6D48','oak_dark':'#5D4030','oak_pale':'#BE976D','stone':'#CFC3B2',
 'stone2':'#B3A69B','sofa':'#E5DBCB','cushion':'#C8B7A3','leather':'#956E4A',
 'rug':'#D8CEBF','metal':'#3B3732','gold':'#C9A76C','plant':'#58745A',
 'leaf':'#718765','linen':'#E5D9C7','black':'#151819','glass':'#769BA2',
 'softlight':'#FFE3AB','white':'#F3F0EA'
}

def rgb(code):
 c=code.lstrip('#');return np.array([int(c[i:i+2],16) for i in (0,2,4)]+[255],dtype=np.uint8)

stages={s:tm.Scene() for s in ['00_shell','01_surfaces','02_furniture','03_details']}

def register(stage,name,mesh,color):
 mesh.visual.vertex_colors=np.tile(rgb(COLORS.get(color,color)),(len(mesh.vertices),1))
 stages[stage].add_geometry(mesh, node_name=name, geom_name=name)

def box(st,name,pos,size,color):
 mesh=tm.creation.box(extents=size)
 mesh.apply_translation(pos)
 register(st,name,mesh,color)

def sphere(st,name,pos,scale,color,sub=1):
 mesh=tm.creation.icosphere(subdivisions=sub,radius=1)
 mesh.apply_scale(scale);mesh.apply_translation(pos)
 register(st,name,mesh,color)

def cyl(st,name,pos,radius,height,color,section=24):
 mesh=tm.creation.cylinder(radius=radius,height=height,sections=section)
 # creation axis Z; to Y
 mesh.apply_transform(rotation_matrix(np.pi/2,[1,0,0]));mesh.apply_translation(pos)
 register(st,name,mesh,color)

def leg4(st,prefix,x,y,z,w,d,height,r,material):
 for i,(sx,sz) in enumerate([(-1,-1),(-1,1),(1,-1),(1,1)]):
  cyl(st,f'{prefix}_leg_{i}',(x+sx*(w/2-.14),y,z+sz*(d/2-.12)),r,height,material,12)

# Structural shell. Room width 8.4, depth 6.4, height 3.15. camera toward -Z.
box('00_shell','shell_raw_concrete_floor',(0,-.09,0),(8.4,.18,6.4),'concrete')
box('00_shell','shell_ceiling',(0,3.14,0),(8.4,.12,6.4),'ceiling')
box('00_shell','shell_left_wall',(-4.18,1.55,0),(.13,3.1,6.4),'plaster')
box('00_shell','shell_right_wall',(4.18,1.55,0),(.13,3.1,6.4),'plaster')
# Back window: x [-2.35,2.35], y [0.34,2.78]
box('00_shell','shell_back_wall_left',(-3.45,1.57,-3.15),(1.5,3.15,.13),'plaster')
box('00_shell','shell_back_wall_right',(3.45,1.57,-3.15),(1.5,3.15,.13),'plaster')
box('00_shell','shell_back_wall_header',(0,2.99,-3.15),(5.4,.3,.13),'plaster')
box('00_shell','shell_back_wall_sill',(0,.16,-3.15),(5.4,.32,.13),'plaster')
box('00_shell','window_frame_L',(-2.7,1.53,-3.08),(.08,2.75,.09),'frame')
box('00_shell','window_frame_R',(2.7,1.53,-3.08),(.08,2.75,.09),'frame')
box('00_shell','window_frame_top',(0,2.91,-3.08),(5.5,.07,.09),'frame')
box('00_shell','window_frame_bottom',(0,.16,-3.08),(5.5,.06,.09),'frame')
for i,x in enumerate([-1.0,.95]):
 box('00_shell',f'window_vertical_mullion_{i}',(x,1.52,-3.08),(.06,2.75,.08),'frame')
box('00_shell','shell_front_left_jamb',(-4.14,1.55,3.1),(.14,3.1,.12),'plaster')
box('00_shell','shell_front_right_jamb',(4.14,1.55,3.1),(.14,3.1,.12),'plaster')

# Stage 1 architectural finish: no layout displacement; objects appear with staggered fades/scales.
box('01_surfaces','surface_oak_parquet',(0,.012,0),(8.32,.045,6.27),'oak_pale')
# lines indicate planks, lightweight geometry
for i in range(22):
 z=-3.05+i*.29
 box('01_surfaces',f'floor_plank_joint_{i}',(0,.038,z),(8.2,.001,.006),'oak_dark')
for i in range(14):
 x=-4.05+i*.59
 box('01_surfaces',f'floor_cross_joint_{i}',(x,.038,0),(.007,.001,6.08),'oak')
# Left side walnut slatted panel
box('01_surfaces','surface_walnut_backing',(-4.075,1.6,-.85),(.07,2.8,4.05),'oak_dark')
for i,z in enumerate(np.linspace(-2.7,.95,27)):
 box('01_surfaces',f'wall_walnut_slat_{i}',(-4.0,1.6,float(z)),(.08,2.76,.065),'oak')
# Right wall stone feature (visually minimal)
box('01_surfaces','surface_right_travertine',(4.045,1.64,-.25),(.07,2.82,4.2),'stone')
for i,z in enumerate([-1.8,-.55,.70]):
 box('01_surfaces',f'stone_vertical_seam_{i}',(3.997,1.64,z),(.01,2.74,.012),'stone2')
box('01_surfaces','surface_cove_ceiling',(0,3.052,0),(8.1,.08,6.08),'white')

# Stage 2: sofa ensemble along left, TV right, armchairs back.
# L-shaped sectional, chaise in foreground.
box('02_furniture','sofa_main_base',(-2.02,.43,.43),(2.85,.4,1.06),'sofa')
box('02_furniture','sofa_main_back',(-2.02,.84,-.11),(2.85,.78,.21),'sofa')
box('02_furniture','sofa_chaise_base',(-2.95,.42,1.04),(1.05,.37,1.7),'sofa')
box('02_furniture','sofa_left_arm',(-3.51,.69,.49),(.21,.56,1.13),'sofa')
box('02_furniture','sofa_right_arm',(-.52,.70,.41),(.22,.54,1.1),'sofa')
for i,x in enumerate([-3.00,-2.25,-1.49]):
 sphere('02_furniture',f'sofa_cushion_{i}',(x,.9,-.02),(.37,.30,.16),'cushion',2)
# TV cabinet, screen on right wall
box('02_furniture','tv_low_cabinet',(3.73,.35,-.27),(.52,.44,3.35),'oak_dark')
box('02_furniture','tv_display_black_screen',(3.942,1.57,-.27),(.035,1.03,1.92),'black')
box('02_furniture','tv_screen_trim',(3.918,1.57,-.27),(.046,1.10,2.00),'metal')
# Re-add black screen over trim
box('02_furniture','tv_screen_front',(3.885,1.57,-.27),(.03,1.03,1.90),'black')
# Center coffee table: horizontal ellipsoid stone slab
cyl('02_furniture','coffee_table_top',(.20,.39,.87),.64,.09,'stone',42)
cyl('02_furniture','coffee_table_pedestal',(.20,.19,.87),.24,.31,'stone2',30)
# Secondary side table
cyl('02_furniture','side_table_top',(-3.45,.57,2.05),.32,.07,'oak_dark')
cyl('02_furniture','side_table_foot',(-3.45,.30,2.05),.13,.47,'metal')
# Pair of lounge chairs at back, angled view simplified
for i,x in enumerate([-1.2,1.4]):
 z=-1.83
 box('02_furniture',f'chair_{i}_seat',(x,.48,z),(.75,.20,.67),'leather')
 box('02_furniture',f'chair_{i}_back',(x,.86,z-.37),(.73,.68,.15),'leather')
 for j,dx in enumerate([-.28,.28]):
  box('02_furniture',f'chair_{i}_leg_{j}',(x+dx,.22,z),(.055,.45,.05),'oak_dark')

# Stage 3: textiles, plants, sculpture, lamps
box('03_details','detail_area_rug',(-.1,.055,1.02),(4.35,.035,2.78),'rug')
for i,(x,z) in enumerate([(-2.91,1.2),(-2.33,.36),(-1.65,.36)]):
 sphere('03_details',f'detail_pillow_{i}',(x,.82,z),(.29,.20,.12),'linen',2)
# book stack on coffee table
for i in range(3):
 box('03_details',f'detail_book_{i}',(.03,.48+i*.025,.82),(.24,.025,.15),'stone2' if i%2 else 'white')
# vase and flowers
cyl('03_details','detail_vase_body',(.44,.53,.80),.105,.20,'stone2')
for i,(dx,dz) in enumerate([(-.08,0),(.07,.04),(0,-.08)]):
 sphere('03_details',f'detail_flower_{i}',(.44+dx,.72,.8+dz),(.08,.10,.08),'white',1)
# Corner plant
cyl('03_details','detail_plant_pot',(-3.5,.25,-1.8),.27,.46,'stone')
cyl('03_details','detail_plant_stem',(-3.5,.81,-1.8),.038,.66,'oak_dark')
for i,(dx,dz,h) in enumerate([(-.35,-.1,1.05),(.22,-.22,1.2),(.27,.18,1.15),(-.24,.3,1.22),(0,0,1.4)]):
 sphere('03_details',f'detail_plant_leaf_cluster_{i}',(-3.5+dx,h,-1.8+dz),(.28,.23,.23),'plant' if i%2 else 'leaf',1)
# hanging rings
for i,(r,y) in enumerate([(.66,2.78),(.48,2.56)]):
 mesh=tm.creation.annulus(r_min=r-.035,r_max=r+.035,height=.045,sections=48)
 mesh.apply_transform(rotation_matrix(np.pi/2,[1,0,0]));mesh.apply_translation((.12,y,.05))
 register('03_details',f'detail_pendant_ring_{i}',mesh,'gold')
 box('03_details',f'detail_pendant_cable_{i}',(.12,y+.17,.05),(.015,.32,.015),'metal')
# cabinet decorations
for i,z in enumerate([-1.25,.45,1.05]):
 cyl('03_details',f'detail_cabinet_vase_{i}',(3.68,.66,z),.08,.16,'stone' if i%2 else 'white')
# cove strips approximating emissive design
for i,(x,z,w,d) in enumerate([(0,-2.85,7.90,.05),(0,2.8,7.90,.05),(-3.92,0,.05,5.7),(3.92,0,.05,5.7)]):
 box('03_details',f'detail_cove_light_{i}',(x,3.009,z),(w,.02,d),'softlight')

# All stage models share exact 0,0,0 transformation.
for name,scene in stages.items():
 path=OUT/f'{name}.glb';path.write_bytes(scene.export(file_type='glb'))
 print(name,len(scene.geometry),path.stat().st_size)

complete=tm.Scene()
for st,sc in stages.items():
 for node in sc.graph.nodes_geometry:
  transf, g=sc.graph.get(node)
  geo=sc.geometry[g].copy()
  complete.add_geometry(geo,node_name=node,geom_name=node,transform=transf)
combined=OUT/'all_stages_for_inspection.glb';combined.write_bytes(complete.export(file_type='glb'))
print('combined',len(complete.geometry),combined.stat().st_size)
# Validate formats roundtrip
for fn in OUT.glob('*.glb'):
 check=tm.load(fn,force='scene')
 assert len(check.geometry)>0,fn
print('VALIDATED')
