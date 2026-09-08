import math, os, numpy as np
from PIL import Image, ImageDraw, ImageFilter

W,H=1920,1080; FPS=24; SHOT=4.6; FADE=1.2
SHOTS=[('beef-greens',0.560,0.500,1),('lok-lak',0.400,0.495,-1),
       ('beef-noodle',0.600,0.505,1),('seafood-crisp',0.415,0.495,-1)]
N=len(SHOTS); TOTAL=SHOT*N; SPAN=SHOT+FADE; PHASE=SHOT*0.5
SRC=os.environ.get('FILM_SRC','source-photos/'); EXT=os.environ.get('FILM_EXT','.jpg')

def grade(im,s=1.0):
    a=np.asarray(im).astype(np.float32)/255.0
    a=np.clip(a,0,1)**(1.0+0.07*s)
    r,g,b=a[...,0],a[...,1],a[...,2]
    r=r*(1.0+0.03*s); g=g+0.02*s*(1-g); b=b*(1-0.08*s)+0.04*s*(1-b)
    return Image.fromarray(np.clip(np.stack([r,g,b],-1)*255,0,255).astype(np.uint8))

BEDW,BEDH=int(W*1.16),int(H*1.16)
beds={};fgs={};shadows={}
for name,cx,cy,d in SHOTS:
    src=Image.open(SRC+name+EXT).convert('RGB')
    s=max(BEDW/src.width,BEDH/src.height)
    bed=src.resize((max(BEDW,int(src.width*s)),max(BEDH,int(src.height*s))),Image.LANCZOS)
    bed=bed.crop(((bed.width-BEDW)//2,(bed.height-BEDH)//2,(bed.width-BEDW)//2+BEDW,(bed.height-BEDH)//2+BEDH))
    bed=bed.filter(ImageFilter.GaussianBlur(34))
    b=np.asarray(bed).astype(np.float32)/255.0
    lum=(0.299*b[...,0]+0.587*b[...,1]+0.114*b[...,2])[...,None]**1.35
    ramp=np.array([0.020,0.062,0.052],np.float32)+lum*np.array([0.120,0.180,0.132],np.float32)
    beds[name]=Image.fromarray(np.clip((ramp*0.88+b*0.12*lum)*255,0,255).astype(np.uint8))
    sc=min(1180/src.width,720/src.height,1.45)
    fw,fh=int(src.width*sc),int(src.height*sc)
    fg=grade(src.resize((fw,fh),Image.LANCZOS)).filter(ImageFilter.UnsharpMask(1.3,72,3))
    ImageDraw.Draw(fg).rectangle([0,0,fw-1,fh-1],outline=(196,192,178),width=2)
    fgs[name]=fg
    sh=Image.new('L',(fw+140,fh+140),0)
    ImageDraw.Draw(sh).rectangle([70,70,70+fw,70+fh],fill=185)
    shadows[name]=sh.filter(ImageFilter.GaussianBlur(38))

yy,xx=np.mgrid[0:H,0:W]
r=np.sqrt(((xx-W/2)/(W/2))**2+((yy-H/2)/(H/2))**2)
VIG=np.clip(1.06-0.42*np.clip(r-0.28,0,None)**1.7,0,1.2).astype(np.float32)[...,None]
rng=np.random.default_rng(7)
GRAIN=[rng.normal(0,4.2,(H,W,1)).astype(np.float32) for _ in range(6)]

def bed_crop(idx,p):
    name,_,_,d=SHOTS[idx]
    mx,my=BEDW-W,BEDH-H
    ox=int(mx*(0.5+d*0.34*(p-0.5))); oy=int(my*(0.42+0.20*p))
    return beds[name].crop((ox,oy,ox+W,oy+H))

def paint_plate(f,idx,p,alpha):
    name,cxr,cyr,d=SHOTS[idx]
    fg=fgs[name]; sh=shadows[name]; sc=1.0+0.042*p
    fw,fh=int(fg.width*sc),int(fg.height*sc)
    fgr=fg.resize((fw,fh),Image.BILINEAR)
    x=int(W*cxr-d*36*(p-0.5)*2-fw/2); y=int(H*cyr+16*(p-0.5)*2-fh/2)
    shr=sh.resize((int(sh.width*sc),int(sh.height*sc)),Image.BILINEAR)
    if alpha<1.0:
        shr=shr.point(lambda v:int(v*alpha))
    f.paste((2,10,9),(x-int(70*sc),y-int(70*sc)+int(26*sc)),shr)
    f.paste(fgr,(x,y),Image.new('L',(fw,fh),int(255*alpha)) if alpha<1.0 else None)

def frame(i):
    T=i/FPS+PHASE; ws=[]
    for j in range(N):
        dt=(T-j*SHOT)%TOTAL
        if dt<FADE: w=dt/FADE
        elif dt<=SHOT: w=1.0
        elif dt<=SPAN: w=1.0-(dt-SHOT)/FADE
        else: w=0.0
        ws.append((w,dt/SPAN))
    act=[(j,w,p) for j,(w,p) in enumerate(ws) if w>0.001]
    if len(act)==1: f=bed_crop(act[0][0],act[0][2]).copy()
    else:
        a,b=act[0],act[1]
        f=Image.blend(bed_crop(a[0],a[2]),bed_crop(b[0],b[2]),b[1]/(a[1]+b[1]))
    # plates dip out against the ground instead of ghosting across each other
    for j,w,p in act:
        al=max(0.0,min(1.0,(w-0.5)*2))
        if al>0.004: paint_plate(f,j,p,al)
    return Image.fromarray(np.clip(np.asarray(f).astype(np.float32)*VIG+GRAIN[i%6],0,255).astype(np.uint8))

if __name__=='__main__':
    NF=int(round(TOTAL*FPS)); print('frames',NF,'dur',TOTAL)
    sheet=Image.new('RGB',(2*960,2*540))
    for k,i in enumerate([0,int(SHOT*FPS*1.05),int(SHOT*FPS*1.14),int(SHOT*FPS*2.5)]):
        sheet.paste(frame(i%NF).resize((960,540)),((k%2)*960,(k//2)*540))
    sheet.save('film_preview.png'); print('preview ok')
