import json,re,os
def L(p):
    try: return json.load(open(p))
    except: return {}
EN={};FR={}
VEN=L('/home/claude/mc/assets/minecraft/lang/en_us.json')
LANGS=['/home/claude/rp/MF_resourcepack/assets/minecraft/lang/','/home/claude/wiz/assets/wizards/lang/','/home/claude/paladins/assets/paladins/lang/','/home/claude/archers/assets/archers/lang/',
 '/home/claude/waystones/assets/waystones/lang/','/home/claude/se/assets/spell_engine/lang/','/home/claude/se/assets/rpg_series/lang/','/home/claude/st/assets/skill_tree_rpgs/lang/','/home/claude/sp/assets/spell_power/lang/']
for d in LANGS: EN.update(L(d+'en_us.json')); FR.update(L(d+'fr_fr.json'))
clean=lambda s: re.sub(r'[\ue000-\uf8ff]','',re.sub(r'§.','',s)).strip() if isinstance(s,str) else s
def H(s): return ' '.join(w.capitalize() for w in s.split(':')[-1].replace('_',' ').replace('/',' ').split())
VFR=json.load(open('/home/claude/b3/vfr.json'))
VEN=L('/home/claude/vanilla/assets/minecraft/lang/en_us.json')
def key(k,default=None):
    en=EN.get(k); fr=FR.get(k)
    if en in (None,'None',''): en=None
    if fr in (None,'None',''): fr=None
    if en is None and default is None: return None
    en=clean(en or default); return [en, clean(fr) if fr else en]
def vid(i):
    ns,k=i.split(':',1) if ':' in i else ('minecraft',i)
    ref=f'{ns}:{k}'
    for p in ('item','block'):
        r=key(f'{p}.{ns}.{k}')
        if r:
            for q in ('item','block'):
                fr=FR.get(f'{q}.{ns}.{k}')
                if fr and fr!=r[0]: r[1]=clean(fr); break
            return r+[ref]
    en=None
    if ns=='minecraft':
        en=VEN.get(f'item.minecraft.{k}') or VEN.get(f'block.minecraft.{k}')
    en=en or H(k); fr=VFR.get(k,en) if ns=='minecraft' else en
    return [en,fr,ref]
TAGFR={'logs':'Bûches (au choix)','planks':'Planches (au choix)','wooden_slabs':'Dalles en bois (au choix)','wool':'Laine (au choix)','eggs':'Œufs (au choix)','coals':'Charbon (au choix)','terracotta':'Terre cuite (au choix)','stone_crafting_materials':'Pierre (au choix)','logs_that_burn':'Bûches combustibles','soul_fire_base_blocks':'Sable/terre des âmes','copper_tool_materials':'Lingot de cuivre','iron_tool_materials':'Lingot de fer','gold_tool_materials':"Lingot d'or",'diamond_tool_materials':'Diamant','wooden_tool_materials':'Planches (au choix)','netherite_tool_materials':"Alliage d'adamant",'bamboo_blocks':'Blocs de bambou','nuggets/gold':"Pépite d'or",'stone_tool_materials':'Pierre (au choix)','ingots/iron':'Lingot de fer','ingots/gold':"Lingot d'or",'gems/diamond':'Diamant','leathers':'Cuir','strings':'Ficelle','rods/wooden':'Bâton','feathers':'Plume'}
TAGREP={'logs':'oak_log','planks':'oak_planks','wooden_slabs':'oak_slab','wool':'white_wool','eggs':'egg','coals':'coal','terracotta':'terracotta','stone_crafting_materials':'cobblestone','stone_tool_materials':'cobblestone','logs_that_burn':'oak_log','soul_fire_base_blocks':'soul_sand','copper_tool_materials':'copper_ingot','iron_tool_materials':'iron_ingot','gold_tool_materials':'gold_ingot','diamond_tool_materials':'diamond','wooden_tool_materials':'oak_planks','netherite_tool_materials':'netherite_ingot','bamboo_blocks':'bamboo_block','nuggets/gold':'gold_nugget','ingots/iron':'iron_ingot','ingots/gold':'gold_ingot','gems/diamond':'diamond','leathers':'leather','strings':'string','rods/wooden':'stick','feathers':'feather'}
def tag(t):
    k=t.split(':',1)[-1]
    en=H(k)+' (any)'; fr=TAGFR.get(k, H(k)+' (au choix)')
    if k=='netherite_tool_materials': en='Adamant Alloy'
    rep=TAGREP.get(k) or (k[:-1] if k.endswith('s') else k)
    return [en,fr,'minecraft:'+rep.split('/')[-1]]
def ing(i):
    if isinstance(i,list):
        parts=[ing(x) for x in i]
        import icons as _ic
        ref=next((p[2] for p in parts if p[2] and _ic.icon(p[2])>=0),parts[0][2])
        return [' / '.join(p[0] for p in parts),' / '.join(p[1] for p in parts),ref]
    if isinstance(i,dict):
        if 'item' in i: return ing(i['item'])
        if 'tag' in i: return tag(i['tag'])
        if 'items' in i: return ing(i['items'])
        return ['?','?',None]
    if i.startswith('#'): return tag(i[1:])
    return vid(i)
def comp_name(c,ref=None):
    mdl=c.get('minecraft:item_model'); r=('model:'+mdl) if mdl else ref
    n=c.get('minecraft:item_name') or c.get('minecraft:custom_name')
    if isinstance(n,dict) and 'translate' in n:
        x=key(n['translate'])
        if x: return x+[r]
        return [H(n['translate'].split('.')[-1])]*2+[r]
    if isinstance(n,str): return [n,n,r]
    return None
