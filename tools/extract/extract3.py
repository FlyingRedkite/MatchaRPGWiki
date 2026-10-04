import json,glob,os,re
def L(p):
    try: return json.load(open(p))
    except: return {}
EN={};FR={}
for d in ['/home/claude/sp/assets/spell_power/lang/','/home/claude/st/assets/skill_tree_rpgs/lang/','/home/claude/wiz/assets/wizards/lang/','/home/claude/se/assets/spell_engine/lang/']:
    EN.update(L(d+'en_us.json'));FR.update(L(d+'fr_fr.json'))
def key(k): 
    e=EN.get(k)
    if not e: return None
    return [e,FR.get(k) or e]
def H(s): return ' '.join(w.capitalize() for w in s.split(':')[-1].replace('_',' ').split())
INST={'wizards','paladins','archers'}
def findnum(o,name):
    if isinstance(o,dict):
        for k,v in o.items():
            if k==name and isinstance(v,(int,float)): return v
            r=findnum(v,name)
            if r is not None: return r
    elif isinstance(o,list):
        for v in o:
            r=findnum(v,name)
            if r is not None: return r
    return None
ALIAS={'effect_duration':'duration','effect_amplifier_cap':'amplifier_cap','cloud_duration':'time_to_live_seconds','extra_launch':'extra_launch_count','trigger_chance':'chance','impact_chance':'chance','damage':'spell_power_coefficient','heal':'spell_power_coefficient','impact_range':'radius','effect_amplifier':'amplifier'}
def resolve(txt,spell):
    def rep(m):
        n=re.sub(r'_\d+$','',m.group(1).split('|')[0])
        v=findnum(spell,n)
        if v is None and n in ALIAS: v=findnum(spell,ALIAS[n])
        if v is None: return '…'
        if 'multiplier' in n or n in('trigger_chance','impact_chance','critical_chance_bonus'): return f'{round(v*100)} %'
        if n in('damage','heal'): return f'{v:g}× puissance'
        if isinstance(v,float) and v.is_integer(): v=int(v)
        return str(v)
    return re.sub(r'\{([a-z0-9_|:]+)\}',rep,(txt or '').replace('%%','%'))
def spelldesc(sid):
    ns,k=sid.split(':')
    p={'skill_tree_rpgs':'/home/claude/st/data/skill_tree_rpgs/spell/','wizards':'/home/claude/wiz/data/wizards/spell/'}[ns]+k+'.json'
    sp=L(p); d=key(f'spell.{ns}.{k}.description') or ['','']
    return [resolve(d[0],sp),resolve(d[1],sp)]
ATTR=lambda a: key('attribute.name.'+a.replace(':','.')) or [H(a)]*2
def rewdesc(r):
    t=r['type'];d=r['data']
    if t=='puffish_skills:attribute':
        an=ATTR(d['attribute']);v=d['value']
        pct=f"+{round(v*100,1):g} %" if 'multiply' in d.get('operation','') else f"+{v:g}"
        return [f"{pct} {an[0]}",f"{pct} {an[1]}"]
    if t=='skill_tree_rpgs:conditional_attribute':
        an=ATTR(d['attribute']);v=d.get('value',0)
        cond=key(d.get('condition',{}).get('translationKey','')) or ['','']
        pct=f"+{round(v*100,1):g} %" if 'multiply' in d.get('operation','') else f"+{v:g}"
        return [f"{pct} {an[0]} {cond[0]}".strip(),f"{pct} {an[1]} {cond[1]}".strip()]
    if t=='skill_tree_rpgs:spell':
        out=[[],[]]
        for c in d['containers']:
            for s in c['spell_ids']:
                ds=spelldesc(s); nm=key(f"spell.{s.split(':')[0]}.{s.split(':')[1]}.name") or [H(s)]*2
                pre=['',''] if s.startswith('skill_tree_rpgs') else [f"New spell: {nm[0]}. ",f"Nouveau sort : {nm[1]}. "]
                out[0].append(pre[0]+ds[0]); out[1].append(pre[1]+ds[1])
        return [' '.join(out[0]),' '.join(out[1])]
    return ['','']
skills={}
for cat in ['class_skills','weapon_skills']:
    base=f'/home/claude/st/data/skill_tree_rpgs/puffish_skills/categories/{cat}/'
    defs=L(base+'definitions.json');sk=L(base+'skills.json');cn=L(base+'connections.json');cj=L(base+'category.json')
    nodes={}
    for sid,s in sk.items():
        df=defs[s['definition']]
        if not set(df.get('required_mods',[]))<=INST: continue
        tk=df['title']['translate'] if isinstance(df['title'],dict) else None
        title=key(tk) if tk else [df['title']]*2
        dn=s['definition']
        kind='root' if s.get('root') else 'spell' if '_spell_' in dn and dn.endswith('_root') or dn in('fireball',) else 'mod' if 'modifier' in dn else 'passive' if 'passive' in dn else 'stat'
        descs=[rewdesc(r) for r in df.get('rewards',[])]
        nodes[sid]={'x':round(s['x'],1),'y':round(s['y'],1),'root':bool(s.get('root')),'t':title or [H(dn)]*2,'d':[' '.join(x[0] for x in descs),' '.join(x[1] for x in descs)],'k':kind,'def':dn}
    def conns(group):
        out=[]
        g=cn.get(group,{})
        for typ in ('bidirectional','unidirectional'):
            for a,b in g.get(typ,[]):
                if a in nodes and b in nodes: out.append([a,b])
        return out
    skills[cat]={'title':key('category.skill_tree_rpgs.'+cat) or [cj.get('title')]*2,'limit':cj.get('spent_points_limit'),'exroot':cj.get('exclusive_root'),
                 'xp':L(base+'experience.json')['experience_per_level']['data']['expression'],'nodes':nodes,'normal':conns('normal'),'exclusive':conns('exclusive')}
# spell power enchants
spen=[]
tagsrc={}
for root in ['/home/claude/sp/data/spell_power/tags/item/enchantable/','/home/claude/se/data/spell_power/tags/item/enchantable/']:
    for f in glob.glob(root+'*.json'): tagsrc.setdefault(os.path.basename(f)[:-5],[]).extend(L(f)['values'])
for f in sorted(glob.glob('/home/claude/sp/data/spell_power/enchantment/*.json')):
    d=L(f);k=os.path.basename(f)[:-5]
    eff=d.get('effects',{});per=[]
    for a in eff.get('minecraft:attributes',[]):
        per.append([ATTR(a['attribute']),a['amount']['base'],a['amount']['per_level_above_first']])
    prot=None
    for p in eff.get('minecraft:damage_protection',[]): prot=p['effect']['value']['base']
    si=d.get('supported_items','')
    spen.append({'id':k,'n':key('enchantment.spell_power.'+k),'d':key('enchantment.spell_power.'+k+'.description'),'max':d.get('max_level'),'slots':d.get('slots'),
                 'sup':si,'excl':d.get('exclusive_set'),'per':per,'prot':prot})
attrs=[{'n':key(k),'k':k} for k in EN if k.startswith('attribute.name.spell_power.')]
orb={'n':key('item.skill_tree_rpgs.orb_of_oblivion'),'d':key('item.skill_tree_rpgs.orb_of_oblivion.lore.0')}
json.dump({'skills':skills,'spen':spen,'attrs':attrs,'orb':orb},open('/home/claude/b3/data3.json','w'),ensure_ascii=False,separators=(',',':'))
print({c:(len(v['nodes']),len(v['normal']),len(v['exclusive'])) for c,v in skills.items()})
n=skills['class_skills']['nodes'];import itertools
for v in itertools.islice(n.values(),0,8): print(v['t'][1],'|',v['k'],'|',v['d'][1][:200])
for e in spen: print(e['n'],e['max'],e['sup'],[(p[0][1],p[1]) for p in e['per']],e['prot'])
print(orb)
