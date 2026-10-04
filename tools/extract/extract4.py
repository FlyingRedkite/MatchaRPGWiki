import json,glob,os,re,collections,sys
sys.path.insert(0,'/home/claude/b3')
from names2 import *
import icons
NT=[];NI={}
def nid(p):
    if p is None: return None
    t=(p[0],p[1],p[2] if len(p)>2 else None)
    if t not in NI: NI[t]=len(NT); NT.append([p[0],p[1],icons.icon(t[2]) if t[2] else -1])
    return NI[t]
STATION={'crafting_shaped':'craft','crafting_shapeless':'craft','smelting':'oven','campfire_cooking':'kindling','smoking':'kiln','blasting':'blast','stonecutting':'cutter','smithing_transform':'smith'}
DECOR=re.compile(r'(slab|stairs|_wall|carpet|_wool|banner|concrete|stained_glass|glazed_terracotta|planks|sapling|clone_|button|door|fence|_sign|shelf|pressure_plate|trapdoor|trapoor|waxed|exposed|weathered|oxidi|_dye|chiseled|_bricks_from|_wood_from|stripped|_log_from|polished|cut_|_tiles|from_stonecutting|_gate|_chain|_bars|_grate|_bulb|lightning_rod|golem_statue|music_disc|disc_fragment|terracotta|mosaic|hyphae|_from_smelting|_from_blasting)')
def effs(c):
    out=[]
    for oc in (c.get('minecraft:consumable') or {}).get('on_consume_effects',[]):
        for e in oc.get('effects',[]):
            if not isinstance(e,dict) or e.get('show_icon',True) is False: continue
            t=e.get('duration',0)//20; out.append([e['id'].split(':')[-1],e.get('amplifier',0)+1,'%d:%02d'%(t//60,t%60)])
    pc=c.get('minecraft:potion_contents')
    if isinstance(pc,dict):
        for e in pc.get('custom_effects',[]):
            t=e.get('duration',0)//20; out.append([e['id'].split(':')[-1],e.get('amplifier',0)+1,'%d:%02d'%(t//60,t%60)])
    return out
def lore(c):
    hearts=0;eff=[];desc=[]
    for l in c.get('minecraft:lore',[]):
        if not isinstance(l,dict): continue
        t=l.get('text','')
        if t and set(t)<=set('\ue030\u2764 '): hearts=sum(1 for ch in t if ch in '\ue030\u2764')
        k=l.get('translate','')
        args=[(w.get('text','') if isinstance(w,dict) else str(w)) for w in (l.get('with') or [])]
        if k.startswith('effect.kleispack.'): eff.append([k.split('.')[-1],1,args[0] if args else ''])
        elif k.startswith('desc.kleispack.'): desc.append([k.split('.')[-1],args])
        elif k.startswith(('block.minecraft','item.minecraft')): desc.append(['_item',[nid(vid(k.split('.')[-1]))]])
    return hearts,eff,desc
recipes=[]
FOODIDS={'poisonous_potato','splash_potion','chicken_spawn_egg','stone_sword','music_disc_11','music_disc_cat','cooked_cod'}
def parse(f,root,src):
    d=json.load(open(f)); rel=os.path.relpath(f,root); cat=os.path.dirname(rel); stem=os.path.basename(f)[:-5]
    t=d.get('type','').split(':')[-1]
    if t not in STATION: return
    r=d.get('result'); r={'id':r} if isinstance(r,str) else r
    c=r.get('components',{}); rid=r['id'] if ':' in r['id'] else 'minecraft:'+r['id']
    base=re.split(r'_from_',stem)[0].replace('brasied','braised')
    name=comp_name(c,rid)
    if not name and src=='mf' and (rid.split(':')[-1]!=base and not rid.startswith('minecraft:') or rid.split(':')[-1] in FOODIDS):
        x=key('item.kleispack.'+base)
        if x: name=x+[('model:'+c['minecraft:item_model']) if c.get('minecraft:item_model') else rid]
    if not name: name=vid(rid)
    if cat=='blessing' and stem!='hell_bound_book':
        lk=[l.get('translate','') for l in c.get('minecraft:lore',[]) if isinstance(l,dict) and l.get('translate','').startswith('item.kleispack.blessing.')]
        if lk: name=(key(lk[0]) or name[:2])+[name[2]]
    if stem.startswith('trim_colour_'):
        mt=stem[12:]; name=['Trim Colour ('+H(mt)+')',"Couleur d'ornement ("+H(mt)+')',name[2]]
    rec={'k':src+':'+rel[:-5],'src':src,'cat':cat,'st':STATION[t],'n':nid(name),'q':r.get('count',1),'rid':rid.split(':')[-1] if rid.startswith('minecraft:') else rid,
         'm':(c.get('minecraft:item_model') or '').split(':')[-1]}
    if t=='crafting_shaped':
        kk={k:nid(ing(v)) for k,v in d['key'].items()}; pat=d['pattern']; w=max(len(p) for p in pat)
        rec['g']=[[kk.get(ch) if ch!=' ' else None for ch in p.ljust(w)] for p in pat]
    elif t=='crafting_shapeless':
        cnt=collections.Counter(nid(ing(i)) for i in d['ingredients']); rec['i']=[[k,v] for k,v in cnt.items()]
    elif t=='smithing_transform':
        rec['base']=nid(ing(d['base'])); rec['add']=nid(ing(d['addition'])); rec['tpl']=nid(ing(d['template'])) if d.get('template') else None
        rec['i']=[[rec['base'],1],[rec['add'],1]]+([[rec['tpl'],1]] if rec['tpl'] is not None else [])
    else:
        rec['i']=[[nid(ing(d['ingredient'])),1]]
        if 'cookingtime' in d: rec['s']=round(d['cookingtime']/20,1)
    h,e,ds=lore(c); fe=effs(c)
    if h: rec['h']=h
    if fe: rec['e']=fe
    elif e: rec['e']=e
    if ds: rec['d']=ds
    se=c.get('minecraft:stored_enchantments') or c.get('minecraft:enchantments')
    if se: rec['en']=[[k.split(':')[-1],v] for k,v in se.items()]
    if 'minecraft:max_damage' in c: rec['dur']=c['minecraft:max_damage']
    if cat.startswith('food'): rec['food']=1
    rec['x']=0 if (t=='stonecutting' or DECOR.search(stem)) and cat!='blessing' and not cat.startswith('food') and t!='smithing_transform' else 1
    if src in('wiz','pal','arc') and t in('smelting','blasting'): rec['x']=0
    if src=='ws': rec['x']=1
    INST={'minecraft','matcha','wizards','paladins','archers','waystones','spell_engine','skill_tree_rpgs','spell_power','c'}
    raw=json.dumps([d.get(k) for k in ('key','ingredients','ingredient','base','addition','template')])
    miss=sorted({m for m in re.findall(r'"#?([a-z0-9_]+):',raw) if m not in INST})
    if miss: rec['miss']=miss
    lc=d.get('fabric:load_conditions')
    req=set(v for c2 in (lc or []) for v in (c2.get('values') or []) if v not in INST)
    for m in re.findall(r'"#?([a-z0-9_]+):[a-z0-9_/]+"',json.dumps({k:v for k,v in d.items() if k not in('result','fabric:load_conditions','neoforge:conditions','type')})):
        if m not in INST: req.add(m)
    if req: rec['req']=sorted(req)
    recipes.append(rec)
INST={'minecraft','c','matcha','wizards','paladins','archers','waystones','spell_engine','skill_tree_rpgs','spell_power','rpg_series','fabric','neoforge'}
MODS=[('wiz','wizards','/home/claude/wiz'),('pal','paladins','/home/claude/paladins'),('arc','archers','/home/claude/archers')]
for f in sorted(glob.glob('/home/claude/MF_datapack/data/matcha/recipe/**/*.json',recursive=True)): parse(f,'/home/claude/MF_datapack/data/matcha/recipe','mf')
for src,ns,root in MODS:
    for f in sorted(glob.glob(f'{root}/data/{ns}/recipe/*.json')): parse(f,f'{root}/data/{ns}/recipe',src)
for f in sorted(glob.glob('/home/claude/se/data/spell_engine/recipe/*.json')): parse(f,'/home/claude/se/data/spell_engine/recipe','se')
for f in sorted(glob.glob('/home/claude/st/data/skill_tree_rpgs/recipe/*.json')): parse(f,'/home/claude/st/data/skill_tree_rpgs/recipe','st')
for f in sorted(glob.glob('/home/claude/waystones/data/waystones/recipe/*.json')): parse(f,'/home/claude/waystones/data/waystones/recipe','ws')
# trades
def stack(s):
    if not s: return None
    sid=s['id'] if ':' in s['id'] else 'minecraft:'+s['id']
    c=s.get('components',{}); mdl=(c.get('minecraft:item_model') or '').split(':')[-1]
    n=comp_name(c,sid)
    if not n and mdl and mdl!=sid.split(':')[-1]: n=(key('item.kleispack.'+mdl) or [H(mdl)]*2)+['model:'+c['minecraft:item_model']]
    if not n: n=vid(sid)
    return [nid(n),int(s.get('count',1))]
PF={'farmer':'Fermier','fisherman':'Pêcheur','fletcher':'Archer','mason':'Maçon','shepherd':'Berger','weaponsmith':"Forgeron d'armes"}
trades=collections.defaultdict(list)
for root,src,ns in [('/home/claude/MF_datapack/data/matcha/villager_trade','mf','minecraft')]+[(f'{r}/data/{n}/villager_trade',s,n) for s,n,r in MODS]:
    for f in sorted(glob.glob(root+'/**/*.json',recursive=True)):
        rel=os.path.relpath(f,root).split('/'); d=json.load(open(f)); prof=rel[0]; lvl=rel[1] if len(rel)>2 else ''
        pk=key('entity.minecraft.villager.'+prof) or key(f'entity.minecraft.villager.{ns}.{prof}') or [H(prof)]*2
        if prof=='wandering_trader': pk=['Wandering Trader','Marchand ambulant']
        if prof in PF: pk=[pk[0],PF[prof]]
        trades[nid(pk)].append({'l':lvl,'w':stack(d.get('wants')),'w2':stack(d.get('additional_wants')),'g':stack(d.get('gives')),'u':d.get('max_uses'),'src':src})
# fish / drops
fish=collections.defaultdict(list)
for f in sorted(glob.glob('/home/claude/MF_datapack/data/matcha/advancement/anglers_almanac/**/*.json',recursive=True)):
    parts=os.path.relpath(f,'/home/claude/MF_datapack/data/matcha/advancement/anglers_almanac')[:-5].split('/')
    if parts[-1] in('root','get_almanac') or len(parts)<2: continue
    k=parts[-1]; n=key('item.kleispack.fish.'+k)
    n=(n+['model:matcha:'+k]) if n else vid(k)
    fish['/'.join(parts[:-1])].append(nid(n))
rar={}
for f in glob.glob('/home/claude/MF_datapack/data/minecraft/loot_table/gameplay/fishing/fish/*.json'):
    s=open(f).read(); m=re.search(r'rarity\.(\d)',s); k=os.path.basename(f)[:-5]
    n=key('item.kleispack.fish.'+k); n=(n+['model:matcha:'+k]) if n else vid(k)
    rar[nid(n)]=int(m.group(1)) if m else None
drops={}
for f in sorted(glob.glob('/home/claude/MF_datapack/data/minecraft/loot_table/entities/*.json')):
    d=json.load(open(f)); items=set()
    def walk(x):
        if isinstance(x,dict):
            if x.get('type')=='minecraft:item' and 'name' in x:
                nn=None
                for fn in x.get('functions',[]):
                    if fn.get('function','').endswith('set_components'): nn=comp_name(fn.get('components',{}),x['name'])
                    if fn.get('function','').endswith('set_name') and isinstance(fn.get('name'),dict):
                        q=key(fn['name'].get('translate','')); nn=(q+[x['name']]) if q else nn
                items.add(nid(nn or vid(x['name'])))
            for v in x.values(): walk(v)
        elif isinstance(x,list):
            for v in x: walk(v)
    walk(d); m=os.path.basename(f)[:-5]
    drops[nid((key('entity.minecraft.'+m) or [H(m),VFR.get('mob:'+m,H(m))])+[None])]=sorted(items)
# advancements
adv={}
for f in sorted(glob.glob('/home/claude/MF_datapack/data/matcha/advancement/tutorial/*.json')):
    d=json.load(open(f)); k=os.path.basename(f)[:-5]; disp=d.get('display',{})
    crit=d.get('criteria',{}); recs=[];items=[]
    for c in crit.values():
        cond=c.get('conditions',{})
        if 'recipe_id' in cond: recs.append('mf:'+cond['recipe_id'].split(':')[-1])
        for it in cond.get('items',[]):
            if 'items' in it: v=it['items']; items+= v if isinstance(v,list) else [v]
            m=(it.get('components') or {}).get('minecraft:item_model')
            if m: items.append('model:'+m.split(':')[-1])
    rw=d.get('rewards',{}); reward=''
    for l in rw.get('loot',[]): reward=l.split('/')[-1]
    if 'decrease_minimum_hearts' in str(rw.get('function','')): reward='heart'
    tk=(disp.get('title') or {}).get('translate',''); ds=disp.get('description'); ds=ds if isinstance(ds,list) else [ds or {}]
    dk=[x.get('translate') for x in ds if isinstance(x,dict) and x.get('translate')]
    ic=disp.get('icon',{}); im=(ic.get('components') or {}).get('minecraft:item_model')
    adv[k]={'p':(d.get('parent') or '').split('/')[-1],'fr':disp.get('frame','task'),'hid':disp.get('hidden',False),'rec':recs,'it':items,'rw':reward,
            't':key(tk) or [H(k)]*2,'d':key(dk[0]) if dk else None,'ic':icons.icon(('model:'+im) if im else ic.get('id'))}
# RPG spells / items / advancements
def ph(s): return re.sub(r'\{[a-z_]+\}','…',s or '')
spells=[];rpgitems=[];rpgadv=[]
for src,ns,root in MODS:
    books={};weap={}
    for f in glob.glob(f'{root}/data/{ns}/tags/spell/spell_book/*.json'):
        for v in json.load(open(f))['values']: books[v['id'] if isinstance(v,dict) else v]=os.path.basename(f)[:-5]
    for f in glob.glob(f'{root}/data/{ns}/tags/spell/weapon/*.json'):
        for v in json.load(open(f))['values']: weap.setdefault(v['id'] if isinstance(v,dict) else v,[]).append(os.path.basename(f)[:-5])
    for f in sorted(glob.glob(f'{root}/data/{ns}/spell/*.json')):
        d=json.load(open(f)); k=os.path.basename(f)[:-5]; sid=f'{ns}:{k}'
        nm=key(f'spell.{ns}.{k}.name')
        if not nm: continue
        coef=None;heal=None
        for i in d.get('impacts') or []:
            a=i.get('action',{})
            if 'damage' in a and coef is None: coef=a['damage'].get('spell_power_coefficient')
            if 'heal' in a and heal is None: heal=a['heal'].get('spell_power_coefficient')
        ds=key(f'spell.{ns}.{k}.description') or ['','']
        spells.append({'mod':src,'id':k,'n':nm,'d':[ph(ds[0]),ph(ds[1])],'sch':d.get('school','').split(':')[-1],'tier':d.get('tier'),'cast':(d.get('active') or {}).get('cast',{}).get('duration'),
                       'cd':(d.get('cost') or {}).get('cooldown',{}).get('duration'),'coef':coef,'heal':heal,'book':books.get(sid),'weap':weap.get(sid)})
    tiers={}
    for f in glob.glob(f'{root}/data/rpg_series/tags/item/loot_tier/*.json'):
        for v in json.load(open(f))['values']: tiers[v['id'] if isinstance(v,dict) else v]=os.path.basename(f)[:-5]
    for k in EN:
        m=re.match(rf'item\.{ns}\.([a-z_]+)$',k)
        if m: rpgitems.append({'mod':src,'id':f'{ns}:{m.group(1)}','n':nid(key(k)+[f'{ns}:{m.group(1)}']),'tier':tiers.get(f'{ns}:{m.group(1)}')})
    for f in sorted(glob.glob(f'{root}/data/rpg_series/advancement/*.json')):
        k=os.path.basename(f)[:-5]
        rpgadv.append({'mod':src,'t':key(f'advancements.rpg_series.{k}.title') or [H(k)]*2,'d':key(f'advancements.rpg_series.{k}.description') or ['','']})
rpgeff=[{'n':key(k),'d':key(k+'.description')} for k in EN if re.match(r'effect\.(wizards|paladins|archers)\.[a-z_]+$',k)]
# waystones
wsu={}
for f in glob.glob('/home/claude/waystones/data/waystones/advancement/recipes/**/*.json',recursive=True):
    d=json.load(open(f)); k=os.path.basename(f)[:-5]; its=[]
    for cn,c in d.get('criteria',{}).items():
        if cn=='has_the_recipe': continue
        for it in c.get('conditions',{}).get('items',[]):
            v=it.get('items'); 
            if v: its+= v if isinstance(v,list) else [v]
    wsu['ws:'+k]=[nid(vid(i)) if not i.startswith('#') else nid(tag(i[1:])) for i in its]
biomes={}
for f in glob.glob('/home/claude/waystones/data/waystones/tags/worldgen/biome/has_structure/*.json'):
    vals=[v if isinstance(v,str) else v.get('id') for v in json.load(open(f))['values']]
    biomes[os.path.basename(f)[:-5]]=vals
wtips={k.split('.')[-1]:key(k) for k in EN if k.startswith('tooltip.waystones.') and k.split('.')[-1].endswith(('sharestone','portstone','blank_scroll'))}
mods={}
for f in glob.glob('/home/claude/waystones/data/waystones/tags/item/warp_modifiers/*.json'):
    mods[os.path.basename(f)[:-5]]=[nid(vid(v if isinstance(v,str) else v['id'])) for v in json.load(open(f))['values']]
ws={'unlock':wsu,'biomes':biomes,'tips':wtips,'mods':mods}
gloss=[]
for k,v in EN.items():
    m=re.match(r'(item|block)\.minecraft\.([a-z0-9_]+)$',k)
    if not m: continue
    v_=m.group(2)
    if re.search(r'(shulker_box|_slab|_stairs|_wall|_ore$|spawn_egg)',v_) and v_!='shulker_box': continue
    o=[H(v_),VFR.get(v_,H(v_))]; nn=key(k)
    if nn and nn[0]!=o[0]: gloss.append([o,nn,icons.icon('minecraft:'+v_)])
ench={}
for k in EN:
    m=re.match(r'enchantment\.kleispack\.([a-z0-9_]+)$',k)
    if m: ench[m.group(1)]=key(k)
out={'gloss':gloss,'NT':NT,'recipes':recipes,'trades':{str(k):v for k,v in trades.items()},'fish':fish,'rar':{str(k):v for k,v in rar.items()},'drops':{str(k):v for k,v in drops.items()},
     'adv':adv,'spells':spells,'rpgitems':rpgitems,'rpgadv':rpgadv,'rpgeff':rpgeff,'ench':ench,'ws':ws,
     'spellinf':{'n':key('enchantment.spell_engine.spell_infinity'),'d':key('enchantment.spell_engine.spell_infinity.desc')},
     'bindtable':{'n':key('block.spell_engine.spell_binding'),'d':key('block.spell_engine.spell_binding.description')}}
d3=json.load(open('/home/claude/b3/data3.json')); out.update(d3)
out['ICONS']=icons.ICONS
json.dump(out,open('/home/claude/b3/data.json','w'),ensure_ascii=False,separators=(',',':'))
print(len(recipes),len(NT),'icons',len(icons.ICONS),'with icon',sum(1 for n in NT if n[2]>=0))
print(collections.Counter(r['src'] for r in recipes))
