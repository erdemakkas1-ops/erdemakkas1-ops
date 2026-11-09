#!/usr/bin/env python3
"""Deterministic credit-free demo image sequences based solely on the user-provided reference.
These are 2D reframings/color-grade illustrations, NOT generated AI scenes or real installations.
Run: python scripts/generate-demo-frames.py
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageDraw, ImageFilter
import math

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'public/images/cetin-parke-salon-reference.png'
OUT=ROOT/'public/media'
WIDTH, HEIGHT=1152,648
N=72
base=Image.open(SOURCE).convert('RGB')
w,h=base.size

def ease(t): return t*t*(3-2*t)
def camera(t,start,end):
    zoom=start+(end-start)*ease(t)
    cw=w/zoom; ch=cw*HEIGHT/WIDTH
    if ch>h:
        ch=h/zoom;cw=ch*WIDTH/HEIGHT
    # Centered predictable dolly-in, bias slightly downward to feature flooring
    center_x=w*.51; center_y=h*(.53 + .035*ease(t))
    x0=max(0,min(w-cw,center_x-cw/2));y0=max(0,min(h-ch,center_y-ch/2))
    return base.crop((int(x0),int(y0),int(x0+cw),int(y0+ch))).resize((WIDTH,HEIGHT),Image.Resampling.LANCZOS)

# The original photo's pale floor is gently recolored to illustrate a flooring palette.
# This is explicitly a conceptual color-grade simulation, not a claim of real replacement.
def dark_floor(im):
    img=im.convert('RGB')
    tint=Image.new('RGB',img.size,(65,48,37))
    warm=Image.blend(img,tint,.48)
    mask=Image.new('L',img.size,0);d=ImageDraw.Draw(mask)
    # rough foreground floor region (mostly below seating), feather edges
    d.polygon([(0,480),(440,540),(780,534),(WIDTH,451),(WIDTH,HEIGHT),(0,HEIGHT)],fill=205)
    mask=mask.filter(ImageFilter.GaussianBlur(58))
    return Image.composite(warm,img,mask)

def write(folder, fn):
    directory=OUT/folder;directory.mkdir(parents=True,exist_ok=True)
    for i in range(N):
        t=i/(N-1)
        im=fn(t)
        im.save(directory/f'{i+1:04d}.webp',format='WEBP',quality=76,method=4)
    print(folder,N,sum(x.stat().st_size for x in directory.glob('*.webp'))//1024,'KiB')

write('hero',lambda t:camera(t,1.00,1.115))
write('finale',lambda t:camera(1-t,1.00,1.13))
def floor(t):
    im=camera(t,1.00,1.045)
    before=dark_floor(im)
    # Irregular, feathered transition moves across room, controlled by scroll.
    # On progress 0 = darker conceptual floor, 1 = source photo's natural oak floor.
    mask=Image.new('L',(WIDTH,HEIGHT),0)
    draw=ImageDraw.Draw(mask)
    threshold=-240 + (WIDTH+480)*ease(t)
    if threshold > 0: draw.rectangle((0,0,min(WIDTH,int(threshold)),HEIGHT),fill=255)
    mask=mask.filter(ImageFilter.GaussianBlur(85))
    return Image.composite(im,before,mask)
write('floor',floor)
