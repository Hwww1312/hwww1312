import math, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
FONTS=os.environ.get('OG_FONTS','.')
PHOTO=os.environ.get('OG_PHOTO','source-photos/beef-greens.jpg')
OUT=os.environ.get('OG_OUT','og.jpg')
W,H=1200,630
LACQ=(7,28,24); PAPER=(241,237,225); SAGE=(157,178,169); LIME=(200,220,75)

def face(name,wght,size):
    f=ImageFont.truetype(os.path.join(FONTS,name+'.ttf'),size)
    try: f.set_variation_by_axes([wght])
    except Exception: pass
    return f

img=Image.new('RGB',(W,H),LACQ)

# right panel: the restaurant's own photograph, faded into the ground
ph=Image.open(PHOTO).convert('RGB')
pw=int(W*0.46); s=max(pw/ph.width,H/ph.height)
ph=ph.resize((int(ph.width*s),int(ph.height*s)),Image.LANCZOS)
ph=ph.crop((( ph.width-pw)//2,(ph.height-H)//2,(ph.width-pw)//2+pw,(ph.height-H)//2+H))
a=np.asarray(ph).astype(np.float32)/255.0
a=np.clip(a,0,1)**1.06; a[...,2]*=0.93; a[...,1]+=0.015*(1-a[...,1])
ph=Image.fromarray(np.clip(a*255,0,255).astype(np.uint8))
mask=Image.new('L',(pw,H),255)
md=ImageDraw.Draw(mask)
for x in range(200):
    md.line([(x,0),(x,H)],fill=int(255*(x/200)**1.5))
img.paste(ph,(W-pw,0),mask)

d=ImageDraw.Draw(img)

def star(cx,cy,ro,fill):
    ri=ro*0.42
    pts=[(cx+(ro if i%2==0 else ri)*math.cos(-math.pi/2+i*math.pi/5),
          cy+(ro if i%2==0 else ri)*math.sin(-math.pi/2+i*math.pi/5)) for i in range(10)]
    d.polygon(pts,fill=fill)

def tracked(xy,text,font,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=font,fill=fill)
        x+=d.textlength(ch,font=font)+track
    return x

PAD=76
# lockup
star(PAD+13,52,15,LIME)
d.arc([PAD-6,50,PAD+32,74],start=12,end=168,fill=LIME,width=3)
tracked((PAD+44,44),"CAMBODIAN FOOD STARS",face('inter-tight',600,17),PAPER,2.2)

# headline
hl=face('bricolage-grotesque',800,66)
for i,line in enumerate(["A Cambodian","kitchen in","Springvale"]):
    d.text((PAD,132+i*70),line,font=hl,fill=PAPER)

d.rectangle([PAD,364,PAD+72,367],fill=LIME)

body=face('inter-tight',400,21)
d.text((PAD,400),"14 Buckingham Ave, Springvale VIC 3171",font=body,fill=SAGE)
d.text((PAD,432),"Lok lak, beef noodle soup and steamboat.",font=body,fill=SAGE)

# rating row
r=face('bricolage-grotesque',800,40)
d.text((PAD,498),"3.8",font=r,fill=LIME)
rx=PAD+int(d.textlength("3.8",font=r))+20
for i in range(5): star(rx+i*26,522,10.5,LIME if i<4 else (86,100,60))
d.text((PAD,556),"41 Google reviews",font=face('inter-tight',500,19),fill=SAGE)
img.save(OUT,quality=88,optimize=True,progressive=True)
print('og written',OUT,os.path.getsize(OUT)//1024,'KB')
