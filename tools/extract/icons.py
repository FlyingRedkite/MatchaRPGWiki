import json,os,re,io,base64,hashlib
from PIL import Image
ROOTS=['/home/claude/rp/MF_resourcepack/assets','/home/claude/wiz/assets','/home/claude/paladins/assets','/home/claude/archers/assets',
       '/home/claude/waystones/assets','/home/claude/se/assets','/home/claude/st/assets','/home/claude/mc/assets']
def find(rel):
    for r in ROOTS:
        p=os.path.join(r,rel)
        if os.path.exists(p): return p
    return None
def jl(p):
    try: return json.load(open(p))
    except: return None
def split(i,default='minecraft'):
    return i.split(':',1) if ':' in i else (default,i)
def first_model(o):
    if isinstance(o,dict):
        if o.get('type','').endswith('model') and isinstance(o.get('model'),str): return o['model']
        for k in ('on_false','fallback','on_true','cases','model','models'):
            if k in o:
                r=first_model(o[k])
                if r: return r
        for v in o.values():
            r=first_model(v)
            if r: return r
    elif isinstance(o,list):
        for v in o:
            r=first_model(v)
            if r: return r
    return None
def model_textures(mid,depth=0):
    if depth>8: return {}
    ns,p=split(mid); m=jl(find(f'{ns}/models/{p}.json'))
    if not m: return None
    tex={}
    if m.get('parent'):
        pt=model_textures(m['parent'],depth+1)
        if pt: tex.update(pt)
    tex.update(m.get('textures',{}))
    return tex
PRI=['layer0','all','front','side','texture','cross','top','end','pattern','particle','wool','0','1']
def tex_from_model(mid):
    t=model_textures(mid)
    if not t: return None
    for k in PRI+list(t.keys()):
        v=t.get(k)
        n=0
        while isinstance(v,str) and v.startswith('#') and n<5: v=t.get(v[1:]); n+=1
        if isinstance(v,str):
            ns,p=split(v); f=find(f'{ns}/textures/{p}.png')
            if f: return f
    return None
def tex_for(ref):
    if ref.startswith('model:'):
        ns,p=split(ref[6:])
        it=jl(find(f'{ns}/items/{p}.json'))
        mid=first_model(it) if it else f'{ns}:item/{p}'
        return tex_from_model(mid) or find(f'{ns}/textures/item/{p}.png')
    ns,p=split(ref)
    it=jl(find(f'{ns}/items/{p}.json'))
    if it:
        mid=first_model(it)
        if mid:
            f=tex_from_model(mid)
            if f: return f
    for mid in (f'{ns}:item/{p}',f'{ns}:block/{p}'):
        f=tex_from_model(mid)
        if f: return f
    for cand in (f'item/{p}',f'block/{p}',f'block/{p}_side',f'block/{p}_front',f'block/{p}_top',f'item/{p}_standby',f'block/{p.replace("_block","")}'):
        f=find(f'{ns}/textures/{cand}.png')
        if f: return f
    return None
ICONS=[];IH={};CACHE={}
def icon(ref):
    if not ref: return -1
    if ref in CACHE: return CACHE[ref]
    f=tex_for(ref); idx=-1
    if f:
        try:
            im=Image.open(f).convert('RGBA'); w,h=im.size
            if h>w: im=im.crop((0,0,w,w))
            if im.width>32: im=im.resize((32,32),Image.NEAREST)
            if im.getbbox() is None: raise Exception('empty')
            b=io.BytesIO(); im.save(b,'PNG',optimize=True); data=b.getvalue()
            hsh=hashlib.md5(data).hexdigest()
            if hsh not in IH: IH[hsh]=len(ICONS); ICONS.append('data:image/png;base64,'+base64.b64encode(data).decode())
            idx=IH[hsh]
        except Exception: idx=-1
    CACHE[ref]=idx; return idx
def model_full(mid,depth=0):
    ns,p=split(mid); m=jl(find(f'{ns}/models/{p}.json'))
    if not m or depth>8: return None
    base=model_full(m['parent'],depth+1) if m.get('parent') else None
    tex=dict(base['textures']) if base else {}
    tex.update(m.get('textures',{}))
    els=m.get('elements') or (base['elements'] if base else None)
    return {'textures':tex,'elements':els}
TEXC={}
def loadtex(ref,tex):
    n=0
    while isinstance(ref,str) and ref.startswith('#') and n<6: ref=tex.get(ref[1:]); n+=1
    if not isinstance(ref,str): return None
    if ref in TEXC: return TEXC[ref]
    ns,p=split(ref); f=find(f'{ns}/textures/{p}.png'); im=None
    if f:
        im=Image.open(f).convert('RGBA')
        if im.height>im.width and im.height%im.width==0: im=im.crop((0,0,im.width,im.width))
    TEXC[ref]=im; return im
def render_elements(mid):
    mf=model_full(mid)
    if not mf or not mf['elements']: return None
    els=mf['elements']; S=4
    maxy=max(e['to'][1] for e in els); H=int(max(16,maxy))
    canvas=Image.new('RGBA',(16*S,H*S),(0,0,0,0)); drew=False
    for e in sorted(els,key=lambda e:-e['from'][2]):
        f=e.get('faces',{}).get('north') or e.get('faces',{}).get('south')
        if not f: continue
        im=loadtex(f.get('texture'),mf['textures'])
        if im is None: continue
        uv=f.get('uv') or [e['from'][0],16-e['to'][1],e['to'][0],16-e['from'][1]]
        W,Ht=im.size; u0,v0,u1,v1=uv
        box=(int(min(u0,u1)*W/16),int(min(v0,v1)*Ht/16),max(int(max(u0,u1)*W/16),int(min(u0,u1)*W/16)+1),max(int(max(v0,v1)*Ht/16),int(min(v0,v1)*Ht/16)+1))
        x0,x1=e['from'][0],e['to'][0]; y0,y1=H-e['to'][1],H-e['from'][1]
        w=max(1,int((x1-x0)*S)); h=max(1,int((y1-y0)*S))
        piece=im.crop(box).resize((w,h),Image.NEAREST)
        canvas.alpha_composite(piece,(int(x0*S),int(y0*S))); drew=True
    if not drew: return None
    side=max(canvas.width,canvas.height); sq=Image.new('RGBA',(side,side),(0,0,0,0)); sq.alpha_composite(canvas,((side-canvas.width)//2,(side-canvas.height)//2))
    return sq.resize((32,32),Image.NEAREST)
_old_icon=icon
def icon(ref):
    if not ref: return -1
    if ref in CACHE: return CACHE[ref]
    im=None
    ns,p=split(ref[6:] if ref.startswith('model:') else ref)
    if ns not in ('minecraft','matcha'):
        it=jl(find(f'{ns}/items/{p}.json')); mid=first_model(it) if it else f'{ns}:item/{p}'
        mf=model_full(mid) if mid else None
        if mf and mf['elements'] and 'layer0' not in mf['textures']:
            try: im=render_elements(mid)
            except Exception: im=None
    if im is None: return _old_icon(ref)
    b=io.BytesIO(); im.save(b,'PNG',optimize=True); data=b.getvalue(); hsh=hashlib.md5(data).hexdigest()
    if hsh not in IH: IH[hsh]=len(ICONS); ICONS.append('data:image/png;base64,'+base64.b64encode(data).decode())
    CACHE[ref]=IH[hsh]; return IH[hsh]
