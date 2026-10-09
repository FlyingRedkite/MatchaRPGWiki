const D=window.__DATA__, NT=D.NT;
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const KEY="matcha-guide-v3";
let S={done:{root:true},spoil:false,reveal:false,rv:{},lang:"fr"};
try{const s=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem("matcha-guide-v2"));if(s&&s.done)S=Object.assign(S,s);}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}};
const L=()=>S.lang==="en"?0:1;
const nm=i=>i==null?"":NT[i][L()];
const pick=p=>p?p[L()]:"";
(function(){const st=document.createElement("style");st.textContent=D.ICONS.map((u,i)=>`.i${i}{background-image:url(${u})}`).join("");document.head.appendChild(st);})();
const ic=i=>(i!=null&&NT[i]&&NT[i][2]>=0)?`<i class="ic i${NT[i][2]}" aria-hidden="true"></i>`:"";
const icx=x=>x>=0?`<i class="ic i${x}" aria-hidden="true"></i>`:"";
const nmi=i=>ic(i)+esc(nm(i));
const SRC={wiz:"Sorcier",pal:"Paladin",arc:"Archer",se:"Spell Engine",st:"Skill Tree",ws:"Waystones"};
const MODN={betterend:"BetterEnd",betternether:"BetterNether",aether:"The Aether"};
const modList=a=>a.map(m=>MODN[m]||m).join(", ");
const NA=a=>`<div class="noreq">⚠️ Non craftable avec tes mods : nécessite ${modList(a)}</div>`;
const missFromId=id=>/aether/.test(id)?["aether"]:/(aeternium|crystal|smaragdant)/.test(id)?["betterend"]:/ruby/.test(id)?["betternether"]:null;
const needs=r=>[...new Set([...(r.req||[]),...(r.miss||[])])].map(m=>MODN[m]||m);
const warnMod=r=>{const n=needs(r);return n.length?`<p class="meta warn2">⚠️ Non craftable sans le mod ${n.join(", ")} (non installé)</p>`:""};
const isRPG=r=>["wiz","pal","arc","se","st"].includes(r.src);
const EFF={regeneration:"Régénération",resistance:"Résistance",night_vision:"Vision nocturne",strength:"Force",fire_resistance:"Résistance au feu",health_boost:"Bonus de vie",aura:"Aura (créatures visibles)",glowing:"Surbrillance",speed:"Vitesse",haste:"Célérité",haste_2:"Célérité II",water_breathing:"Respiration aquatique",levitation:"Lévitation",poison:"Poison",weakness:"Faiblesse",invisibility:"Invisibilité",absorption:"Absorption",conduit_power:"Force de conduit",luck:"Chance",slowness:"Lenteur",jump_boost:"Saut amélioré",slow_falling:"Chute lente",wither:"Wither",blindness:"Cécité",darkness:"Obscurité",nausea:"Nausée"};
const EN={protection:"Protection",fire_protection:"Protection contre le feu",blast_protection:"Protection contre les explosions",projectile_protection:"Protection contre les projectiles",feather_falling:"Chute amortie",respiration:"Apnée",aqua_affinity:"Affinité aquatique",thorns:"Épines",depth_strider:"Agilité aquatique",frost_walker:"Semelles givrantes",soul_speed:"Agilité des âmes",swift_sneak:"Furtivité rapide",sharpness:"Tranchant",smite:"Châtiment",bane_of_arthropods:"Fléau des arthropodes",knockback:"Recul",fire_aspect:"Aura de feu",looting:"Butin",sweeping_edge:"Affilage",efficiency:"Efficacité",silk_touch:"Toucher de soie",unbreaking:"Solidité",fortune:"Fortune",power:"Puissance",punch:"Frappe",flame:"Flamme",infinity:"Infinité",luck_of_the_sea:"Chance de la mer",lure:"Appât",loyalty:"Loyauté",impaling:"Empalement",riptide:"Impulsion",channeling:"Canalisation",multishot:"Tir multiple",quick_charge:"Charge rapide",piercing:"Perforation",mending:"Raccommodage",density:"Densité",breach:"Brèche",wind_burst:"Explosion de vent",lunge:"Fente",binding_curse:"Malédiction du lien éternel",vanishing_curse:"Malédiction de disparition"};
const ENMAP={cleanse_armor_head:"cleanses_head",cleanse_armor_chest:"cleanses_chest",cleanse_armor_feet:"cleanses_feet",cleanse_armor_legs:"cleanses_legs"};
const enName=k=>{const w=/^warding_(\d)$/.exec(k);if(w)return pick(["Warding "+w[1],"Apotropaïque "+w[1]]);const m=D.ench[ENMAP[k]||k];return m?pick(m):(EN[k]||k.replace(/_/g," "));};
const DESC={attack_damage:"Dégâts",cooldown:"Recharge (s)",mining_speed:"Vitesse de minage",armour:"Armure",armour_toughness:"Robustesse",knockback_resistance:"Résist. recul",speed_attribute:"Vitesse",fall_height_attribute:"Chute",knockback_attribute:"Recul",melee_blocking:"Blocage (%)",projectile_blocking:"Blocage projectiles (%)",step_height:"Hauteur de pas",throwable:"Se lance",cleanses_maleffect:"Purifie les effets négatifs",cleanse:"Purifie"};
const ROMAN=["","","II","III","IV","V","VI","VII"];
const effTxt=e=>`${EFF[e[0]]||e[0]}${e[1]>1?" "+(ROMAN[e[1]]||e[1]):""}${e[2]?" ("+e[2]+")":""}`;
const enTxt=e=>`${enName(e[0])}${e[1]>1?" "+(ROMAN[e[1]]||e[1]):""}`;
const ST={craft:["Crafting table","Établi"],oven:["Oven","Four"],kindling:["Kindling","Petit bois"],kiln:["Mud Kiln","Four en terre cuite"],blast:["Blast furnace","Haut fourneau"],cutter:["Stonecutter","Tailleur de pierre"],smith:["Smithing table","Table de forgeron"]};
const stN=s=>pick(ST[s]||[s,s]);
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");

/* tabs */
function showTab(t){document.querySelectorAll(".tabs button").forEach(x=>x.setAttribute("aria-selected",x.dataset.tab===t));document.querySelectorAll("main > section").forEach(s=>s.hidden=s.id!==t);window.scrollTo({top:0});}
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
document.querySelectorAll(".subtabs").forEach(g=>g.onclick=e=>{const b=e.target.closest("button");if(!b)return;g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-selected",x===b));g.parentElement.querySelectorAll(".subpane").forEach(p=>p.hidden=p.dataset.pane!==b.dataset.sub);});
const revBtn=$("#revealAll"),langBtn=$("#langBtn");
function syncTop(){document.body.classList.toggle("revealall",S.reveal);revBtn.textContent=S.reveal?"Remettre les spoilers":"Tout dévoiler";revBtn.setAttribute("aria-pressed",S.reveal);langBtn.textContent=S.lang==="en"?"Noms : EN":"Noms : FR";}
revBtn.onclick=()=>{S.reveal=!S.reveal;save();syncTop();};
langBtn.onclick=()=>{S.lang=S.lang==="en"?"fr":"en";save();renderAll();};
document.addEventListener("click",e=>{const s=e.target.closest(".spoil");if(s)s.classList.add("shown");});

/* recipes */
const RECS=D.recipes, byK={};RECS.forEach(r=>byK[r.k]=r);
const ingList=r=>r.g?Object.entries(r.g.flat().filter(c=>c!=null).reduce((a,c)=>(a[c]=(a[c]||0)+1,a),{})).map(([c,q])=>(q>1?q+"× ":"")+nm(+c)).join(", "):(r.i||[]).map(x=>(x[1]>1?x[1]+"× ":"")+nm(x[0])).join(" + ");
const ingHTML=r=>r.st==="smith"?`${nmi(r.base)} + ${nmi(r.add)}${r.tpl!=null?" + "+nmi(r.tpl):""}`:r.g?Object.entries(r.g.flat().filter(c=>c!=null).reduce((a,c)=>(a[c]=(a[c]||0)+1,a),{})).map(([c,q])=>`<span class="ii">${q>1?q+"× ":""}${nmi(+c)}</span>`).join(" "):(r.i||[]).map(x=>`<span class="ii">${x[1]>1?x[1]+"× ":""}${nmi(x[0])}</span>`).join(" + ");
function recBody(r){
  let h="";
  if(r.g){h+=`<div class="grid g${r.g[0].length}">`+r.g.flat().map(c=>`<span class="${c!=null?"":"empty"}"${c!=null?` title="${esc(nm(c))}"`:""}>${c!=null?ic(c)+`<small>${esc(nm(c))}</small>`:""}</span>`).join("")+`</div>`;}
  else if(r.st==="smith"){h+=`<p class="ing">${nmi(r.base)} <b>+</b> ${nmi(r.add)}${r.tpl!=null?` <b>+</b> ${nmi(r.tpl)}`:""}</p>`;}
  else if(r.i){h+=`<p class="ing">${r.i.map(x=>(x[1]>1?x[1]+"× ":"")+nmi(x[0])).join(" <b>+</b> ")}</p>`;}
  if(r.s)h+=`<p class="meta">Cuisson ${r.s} s</p>`;
  if(r.h)h+=`<p class="meta">Soigne ${"❤".repeat(r.h)}</p>`;
  if(r.e)h+=`<p class="meta">${r.e.map(effTxt).join(" · ")}</p>`;
  const ds=(r.d||[]).filter(d=>DESC[d[0]]);
  if(ds.length)h+=`<p class="meta">${ds.map(d=>DESC[d[0]]+(d[1]&&d[1].length?" "+esc(d[1].join(" ")):"")).join(" · ")}</p>`;
  if(r.en)h+=`<p class="meta">Effets : ${r.en.map(enTxt).join(", ")}</p>`;
  if(r.req)h=NA(r.req)+h;
  return h;
}
const badge=r=>SRC[r.src]?`<span class="rpg ${r.src}">${SRC[r.src]}</span>`:"";
function card(r,o={}){const id="r_"+r.k.replace(/\W/g,"_");
  return `<article class="rc${S.rv[id]?" open":""}${r.req?" na":""}" data-id="${id}"><header><b>${nmi(r.n)}${r.q>1?` ×${r.q}`:""} ${badge(r)}</b><span class="st">${esc(stN(r.st))}</span></header>${o.top?`<div class="fxwrap">${o.top}</div><div class="vbox">`:""}<div class="body">${recBody(r)}</div>${o.noveil?"":`<button class="veil">${o.label||"Voir la recette"}</button>`}${o.top?"</div>":""}</article>`;}
document.addEventListener("click",e=>{const v=e.target.closest(".veil");if(!v)return;const a=v.closest(".rc");a.classList.add("open");S.rv[a.dataset.id]=1;save();});

/* crafts tab */
const STS=["all","craft","kindling","kiln","oven","blast","smith","cutter"];
let fHideNA=false,fSt="all",fQ="",fDeco=false,fIng=false,fSrc="all",lim=60;
function chips(){ $("#stations").innerHTML=STS.map(s=>`<button class="chip${s===fSt?" on":""}" data-st="${s}">${s==="all"?"Tout":stN(s)}</button>`).join("")+`<span class="sep"></span>`+[["all","Tous"],["mf","Matcha"],["rpg","RPG"],["ws","Waystones"]].map(([k,l])=>`<button class="chip${k===fSrc?" on":""}" data-src="${k}">${l}</button>`).join("");}
$("#stations").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;if(b.dataset.st)fSt=b.dataset.st;if(b.dataset.src)fSrc=b.dataset.src;lim=60;chips();renderCrafts();};
$("#q").oninput=e=>{fQ=norm(e.target.value.trim());lim=60;renderCrafts();};
$("#deco").onchange=e=>{fDeco=e.target.checked;lim=60;renderCrafts();};
$("#hideNA").onchange=e=>{fHideNA=e.target.checked;lim=60;renderCrafts();};
$("#ingr").onchange=e=>{fIng=e.target.checked;lim=60;renderCrafts();};
const ingText=r=>norm(((r.g||[]).flat().filter(c=>c!=null).map(c=>NT[c].join(" ")).join(" "))+" "+(r.i||[]).map(x=>NT[x[0]].join(" ")).join(" "));
function renderCrafts(){
  const list=RECS.filter(r=>!(fHideNA&&r.req)&&!r.food&&r.cat!=="blessing"&&(fDeco||r.x)&&(fSt==="all"||r.st===fSt)&&(fSrc==="all"||r.src===fSrc||(fSrc==="rpg"&&isRPG(r)))&&(!fQ||norm(NT[r.n].join(" ")).includes(fQ)||(fIng&&ingText(r).includes(fQ))));
  list.sort((a,b)=>nm(a.n).localeCompare(nm(b.n)));
  $("#craftCount").textContent=`${list.length} recette${list.length>1?"s":""}`;
  $("#craftList").innerHTML=list.slice(0,lim).map(r=>card(r)).join("")+(list.length>lim?`<button class="btn more" id="more">Afficher plus (${list.length-lim} restantes)</button>`:"");
  const m=$("#more");if(m)m.onclick=()=>{lim+=90;renderCrafts();};
}

/* food */
let foodQ="",foodOnlyEff=false;
$("#fq").oninput=e=>{foodQ=norm(e.target.value);renderFood();};
$("#feff").onchange=e=>{foodOnlyEff=e.target.checked;renderFood();};
function renderFood(){
  const map={};RECS.filter(r=>r.food).forEach(r=>(map[r.n]=map[r.n]||[]).push(r));
  const rows=Object.keys(map).sort((a,b)=>nm(+a).localeCompare(nm(+b))).map(k=>{
    const rs=map[k],r0=rs.find(r=>r.e)||rs[0],effs=(r0.e||[]).map(effTxt).join(", ");
    if(foodOnlyEff&&!effs)return"";
    if(foodQ&&!norm(NT[k].join(" ")).includes(foodQ)&&!norm(effs).includes(foodQ))return"";
    return `<tr><td><b>${nmi(+k)}</b><br><small>${[...new Set(rs.map(r=>stN(r.st)))].join(", ")}</small></td><td>${r0.h?"❤".repeat(r0.h):"–"}</td><td>${effs?`<button class="spoil">${esc(effs)}</button>`:"–"}</td><td>${[...new Set(rs.map(ingList))].map(t=>`<button class="spoil">${esc(t)}</button>`).join("<br>")}</td></tr>`;}).join("");
  $("#foodBody").innerHTML=rows;
}

/* equipment */
const MATS=[["Wooden","Bois"],["Copper","Cuivre"],["Iron","Fer"],["Golden","Or"],["Diamond","Diamant"],["Steel","Acier"],["Shakudo","Shakudo"],["Hepatizon","Hepatizon"],["Electrum","Electrum"],["Adamant","Adamant"],["Silver","Argent"],["Warding","Garde (nazar)"],["Sturdy","Cuir robuste"],["Leather","Cuir"],["Chainmail","Mailles"],["Snow","Spécial"],["Netherite","RPG – Netherite (adamant)"],["Wizard","RPG – Sorcier"],["Novice","RPG – Sorcier"],["Arcane","RPG – Arcanes"],["Fire","RPG – Feu"],["Frost","RPG – Givre"],["Ruby","RPG – Mods tiers"],["Crystal","RPG – Mods tiers"],["Smaragdant","RPG – Mods tiers"]];
const kindOf=(en,r)=>{const id=(r&&isRPG(r))?String(r.rid):"";if(id){if(/(armor_|robe_|_hat|_hood)/.test(id))return"armor";if(/(staff|wand|mace|hammer|claymore|shield|bow|crossbow|spear|quiver|hook)/.test(id))return"weapon";}en=en.toLowerCase();if(/(helmet|chestplate|leggings|boots|elytra|robe|\bhat\b|hood|pauldron|crown|laurel|shellmet|gambeson|pants)/.test(en))return"armor";if(/(sword|spear|claymore|bow|wand|staff|shield|mace|trident|cross|hammer|quiver)/.test(en))return"weapon";if(/(pickaxe|axe|shovel|hoe|mattock|dolabra|shears|brush|compass)/.test(en))return"tool";return null;};
const matOf=(en,r)=>{if(r&&isRPG(r))return"RPG – "+SRC[r.src];for(const m of MATS)if(en.includes(m[0]))return m[1];return"Autre";};
function renderEquip(){
  const gear=RECS.filter(r=>(r.st==="smith"||(r.st==="craft"&&r.x&&(r.dur||(r.d||[]).some(d=>DESC[d[0]])||isRPG(r))))&&kindOf(NT[r.n][0],r));
  const seen=new Set();
  ["tool","weapon","armor"].forEach(kind=>{
    const groups={};
    gear.filter(r=>kindOf(NT[r.n][0],r)===kind).forEach(r=>{const sig=r.n+"|"+r.k;if(seen.has(sig))return;seen.add(sig);const m=matOf(NT[r.n][0],r);(groups[m]=groups[m]||[]).push(r);});
    const order=[...new Set([...MATS.map(m=>m[1]),"RPG – Sorcier","RPG – Paladin","RPG – Archer","Autre"])];
    $("#eq_"+kind).innerHTML=order.filter(m=>groups[m]).map(m=>{
      const rows=groups[m].map(r=>{
        const stats=(r.d||[]).filter(d=>DESC[d[0]]).map(d=>DESC[d[0]]+" "+esc((d[1]||[]).join(" "))).join(" · ");
        const rep=(r.d||[]).filter(d=>d[0]==="_item").map(d=>esc(nm(d[1][0])));
        const how=r.st==="smith"?`${esc(nm(r.base))} + ${esc(nm(r.add))}${r.tpl!=null?" + "+esc(nm(r.tpl)):""}`:ingList(r);
        return `<tr${r.req?' class="na"':""}><td><b>${nmi(r.n)}</b><br><small>${esc(stN(r.st))}</small></td><td><button class="spoil">${ingHTML(r)}</button></td><td>${stats||(isRPG(r)?"<small>Stats définies par le mod (voir en jeu)</small>":"–")}${r.dur?` · Durabilité ${r.dur}`:""}</td><td>${r.en?`<button class="spoil">${esc(r.en.map(enTxt).join(", "))}</button>`:"–"}${r.req?NA(r.req):""}</td><td>${rep.join(", ")||"–"}</td></tr>`;}).join("");
      return `<details><summary>${esc(m)} <small>(${groups[m].length})</small></summary><div class="tablewrap inner"><table><thead><tr><th>Objet</th><th>Recette</th><th>Stats</th><th>Effets intégrés</th><th>Réparation</th></tr></thead><tbody>${rows}</tbody></table></div></details>`;}).join("");
  });
}

/* enchantments */
const CUSTOM_EN=[["anemos","Épée (ou bâton)","Projette une charge de vent quand tu frappes (petite recharge)."],["bloodrage","Hache","Sous 5 cœurs, donne Résistance II et Force I."],["reach","Plastron, max III","Portée d'interaction avec les blocs +2 / +4 / +6."],["riposte","Armes d'alliage, max III","Après un coup, tu fais un bond en arrière (coûte 1 de durabilité)."],["slaughter","Arme","+40 dégâts contre le bétail, ralenti autour de toi."],["traversal","Bottes, max III","Bonus de vitesse de déplacement selon le terrain."],["zephyr","Bottes, max III","Reste accroupi pour charger un très grand saut."],["freezing_protection","Plastron, max III","Protège du gel (indispensable pour l'eau glacée)."],["magic_protection","Armure","Réduit les dégâts magiques."],["warding_1","Armes en argent/electrum, bouclier","Brûle les morts-vivants proches (niveaux I à IV)."],["fire_proof","Casque (bijou)","Résistance au feu permanente."]];
/* effets des prières, visibles avant la recette */
const EN_DESC={bane_of_arthropods:"dégâts bonus contre les arthropodes (araignées…)",smite:"dégâts bonus contre les morts-vivants",channeling:"trident : la foudre frappe la cible pendant un orage",density:"masse : dégâts bonus selon la hauteur de chute",knockback:"repousse plus loin la cible",punch:"arc : les flèches repoussent plus loin",depth_strider:"bottes : déplacement plus rapide sous l'eau",riptide:"trident : te propulse dans l'eau ou sous la pluie",aqua_affinity:"casque : minage normal sous l'eau",respiration:"casque : respirer plus longtemps sous l'eau",efficiency:"outils : minage plus rapide",unbreaking:"l'objet s'use moins vite",feather_falling:"bottes : moins de dégâts de chute",flame:"arc : flèches enflammées",fire_aspect:"arme : enflamme la cible",fire_protection:"armure : moins de dégâts de feu",frost_walker:"bottes : gèle l'eau sous tes pas",infinity:"arc : une seule flèche suffit",fortune:"outils : plus de butin des minerais (plafonné à I dans Matcha)",looting:"arme : plus de butin des créatures",lunge:"lance : élan vers l'avant en attaquant",breach:"masse : ignore une partie de l'armure",luck_of_the_sea:"canne à pêche : meilleures prises",lure:"canne à pêche : ça mord plus vite",loyalty:"trident : revient après un lancer",mending:"l'XP ramassée répare l'objet",impaling:"trident : dégâts bonus contre les créatures aquatiques",piercing:"arbalète : les flèches traversent les cibles",power:"arc : dégâts des flèches augmentés",multishot:"arbalète : tire trois flèches",silk_touch:"outils : récupère le bloc tel quel",swift_sneak:"jambières : plus rapide accroupi",soul_speed:"bottes : plus rapide sur le sable et la terre des âmes",wind_burst:"masse : rebond en l'air après un coup de chute",binding_curse:"malédiction : impossible de retirer la pièce d'armure"};
const blessFx=r=>`<ul class="fx">${r.en.map(e=>{const c=CUSTOM_EN.find(x=>x[0]===e[0]||(/^warding_/.test(e[0])&&x[0]==="warding_1"));const d=c?c[1]+" : "+c[2]:(EN_DESC[e[0]]||"");return `<li><b>${esc(enTxt(e))}</b>${d?" — "+d:""}</li>`;}).join("")}</ul>`;

/* mémos : prières, enclume, table de liaison */
const ID=en=>{const i=NT.findIndex(x=>x&&x[0]===en);return i<0?null:i;};
const fi=(en,q)=>{const i=ID(en);return `<span class="fi">${i==null?esc(en):nmi(i)}${q>1?" ×"+q:""}</span>`;};
const mobs=a=>a.map(en=>esc(nm(ID(en)))).join(", ");
const fstep=(out,ins,note,where,goal)=>`<div class="fstep${goal?" goal":""}"><div class="fout">${out}</div>${ins?`<div class="fin">${ins}</div>`:""}${note?`<p class="fnote">${note}</p>`:""}${where?`<p class="fnote">Où trouver : <button class="spoil">${where}</button></p>`:""}</div>`;
const flow=steps=>`<div class="flow">${steps.join('<span class="farr" aria-hidden="true">↓</span>')}</div>`;
function howBless(){return flow([
  fstep(fi("Benzene"),`${fi("Glass Bottle")} + ${fi("Hellspore",3)} + ${fi("Sulfur Chunk")}`,"Établi, sans forme.",`Spore infernale = verrue du Nether (forteresses du Nether). Soufre : ${mobs(["Ghast","Sulfur Cube"])}. Fiole : 3 verres.`),
  fstep(fi("Estus Ash"),fi("Raw Estus"),"Ramasser de l'Estus brut te soigne un peu et le change en Cendres d'Estus.",`Estus brut : ${mobs(["Zombie","Drowned","Husk","Zombie Villager"])}. Cendres d'Estus directement : ${mobs(["Skeleton","Stray","Bogged","Witch"])}.`),
  fstep(fi("Stabilized Estus"),`${fi("Estus Ash",7)} + ${fi("Benzene")} + ${fi("Stable Void")}`,"Établi.",`Vide stable : ${mobs(["Enderman"])} (à coup sûr).`),
  fstep(fi("Hell-Bound Book"),`${fi("Book")} + ${fi("Stabilized Estus")} + ${fi("Benzene")}`,"Établi. Le livre vierge porte la Malédiction du lien : ne l'applique pas tel quel sur une armure !"),
  fstep(`${fi("Hell-Bound Book")} + ingrédients d'un dieu → une prière`,"",'Chaque prière a sa recette (voir la liste plus bas) et donne un ou plusieurs enchantements.'),
  fstep(`${fi("Anvil")} : objet + prière → objet enchanté`,"","Seuls les enchantements compatibles avec l'objet s'appliquent. Coût : 1 niveau d'XP par niveau d'enchantement (voir l'onglet Enclume).",null,1)]);}
function howAnvil(){return flow([
  fstep(fi("Anvil"),`${fi("Steel Alloy",3)} + ${esc(nm(ID("Iron Tool Materials (any)")))} ×4`,"Établi. Il faut donc d'abord de l'acier."),
  fstep("🔧 Réparer","objet abîmé + lingot de son métal de base","Environ un quart de la durabilité par lingot, pour 1 niveau d'XP par lingot. Matcha remet à zéro le « coût de réparation » des objets de ton inventaire : jamais de « Trop cher ! », on peut réparer à l'infini. Le métal de chaque objet est indiqué dans l'onglet Équipement."),
  fstep("📜 Enchanter","objet + prière (livre)","C'est la façon normale d'enchanter : la table d'enchantement existe encore, mais elle n'est plus craftable ni au cœur du jeu. Depuis un livre, chaque niveau d'enchantement coûte 1 niveau d'XP (ex. Prière de Yama sur une épée : seule Aura de feu s'applique, donc 1 niveau)."),
  fstep("🔗 Combiner","deux objets identiques","Comme en vanilla : additionne la durabilité et fusionne les enchantements."),
  fstep("➕ Additionner les enchantements","objet + prière, plusieurs fois (ou prière + prière)","Oui, on peut les cumuler : chaque passage à l'enclume ajoute les enchantements compatibles. Deux fois le même niveau donne le niveau au-dessus (ex. Solidité II + Solidité II → III), jusqu'au maximum de l'enchantement ; deux niveaux différents gardent le plus haut. Comme Matcha remet le coût de réparation à zéro, cumuler ne devient pas de plus en plus cher. Incompatibles entre eux : les dégâts (Tranchant, Châtiment, Fléau des arthropodes, Densité, Brèche et, dans Matcha, Empalement), les protections d'armure, Fortune / Toucher de soie, Agilité aquatique / Semelles givrantes, Tir multiple / Perforation, Impulsion / Loyauté et Canalisation, et les effets intégrés des armes et armures en alliage (un seul par objet)."),
  fstep("✏️ Renommer","objet + nouveau nom","1 niveau d'XP."),
  fstep("⚠️ Usure","","Comme en vanilla, l'enclume s'abîme à l'usage (ébréchée, puis endommagée, puis cassée) : garde de l'acier pour en refaire une.",null,1)]);}
function howBind(){
  const n=t=>D.spells.filter(s=>s.book&&s.tier===t).length;
  const rows=[[2,7],[3,14],[4,18]].map(([t,b])=>`<tr><td><b>Rang ${t}</b> (${n(t)} sorts)</td><td>niveau ${t*10}</td><td>${t*3} niveaux + ${t*3} ${esc(nm(ID("Lapis Lazuli")))}</td><td><b>${b}</b> bibliothèques</td></tr>`).join("");
  return flow([
  fstep(fi("Spell Binding Table"),`${fi("Book")} + ${fi("Amethyst Shard",2)} + ${fi("Gold Ingot")} + ${fi("Polished Diorite",3)}`,"Établi."),
  fstep("📘 Créer un livre de sorts",`${fi("Book")} dans la table`,"Choisis l'école : Arcanes, Feu, Givre, Paladin, Prêtre ou Archer. Coût : 1 niveau d'XP."),
  fstep("✨ Lier un sort",`livre de sorts (ou arme de classe) + ${fi("Lapis Lazuli")}`,"Un seul sort par rang dans chaque livre. On peut délier un sort. Les sorts de rang 0 et 1 viennent avec les armes de classe et n'ont pas besoin de la table."),
  fstep("📚 Les bibliothèques débloquent les hauts rangs",`<div class="tablewrap"><table><thead><tr><th>Sort</th><th>Niveau requis</th><th>Coût</th><th>Autour de la table</th></tr></thead><tbody>${rows}</tbody></table></div>`,"Sans bibliothèque, la table ne débloque que les sorts qui demandent au plus le niveau 10, donc aucun sort de livre. Chaque bibliothèque ajoute 1,5 à ce plafond (10 + 1,5 × bibliothèques) ; à 18, tout est débloqué. Place-les comme autour d'une table d'enchantement : à un bloc d'écart, au même niveau ou un bloc plus haut, sans rien entre les deux. Bibliothèque : 6 dalles en bois + 3 livres.",null,1)]);}
function renderMagic(){
  $("#customEn").innerHTML=CUSTOM_EN.map(c=>`<tr><td><b>${esc(enName(c[0]))}</b></td><td>${c[1]}</td><td>${c[2]}</td></tr>`).join("");
  $("#blessList").innerHTML=RECS.filter(r=>r.cat==="blessing").map(r=>card(r,{label:"Voir la recette",top:blessFx(r)})).join("");
  $("#howBless").innerHTML=howBless();$("#howAnvil").innerHTML=howAnvil();$("#howBind").innerHTML=$("#howBind2").innerHTML=howBind();
  const si=D.spellinf;$("#spellInf").innerHTML=`<tr><td><b>${esc(pick(si.n))}</b> <span class="rpg">Spell Engine</span></td><td>Bâtons, baguettes, livres de sorts</td><td>${esc(pick(si.d))} (avec les runes). Possible à la table d'enchantement, mais comme elle n'est plus craftable dans Matcha Flavoured, tu as plus de chances de le trouver ailleurs (butin).</td></tr>`;
}

/* RPG */
const SCH={arcane:["Arcane","Arcanes"],fire:["Fire","Feu"],frost:["Frost","Givre"],healing:["Holy / Healing","Sacré (soins)"],physical_ranged:["Physical (ranged)","Physique (distance)"],physical_melee:["Physical (melee)","Physique (mêlée)"]};
const TIER={tier_0_weapons:0,tier_1_weapons:1,tier_2_weapons:2,tier_3_weapons:3,tier_4_weapons:4,tier_1_armors:1,tier_2_armors:2,tier_3_armors:3};
function renderRPG(){
  const btr=RECS.find(r=>r.src==="se");$("#bindCard").innerHTML=btr?card(btr):"";$("#bindTxt").textContent=pick(D.bindtable.d);
  $("#rpgBody").innerHTML=["wiz","pal","arc"].map(m=>{
    const items=D.rpgitems.filter(w=>w.mod===m&&!/spell_(book|scroll)/.test(w.id)).sort((a,b)=>(TIER[a.tier]??9)-(TIER[b.tier]??9));
    const rows=items.map(w=>{const r=RECS.find(x=>x.src===m&&x.x&&x.n===w.n)||RECS.find(x=>x.src===m&&x.rid===w.id&&x.x);
      return `<tr${(r&&r.req)||(!r&&missFromId(w.id))?' class="na"':""}><td><b>${nmi(w.n)}</b></td><td>${TIER[w.tier]??"–"}</td><td>${r?`${r.req?NA(r.req):""}<button class="spoil">${ingHTML(r)}</button>`:(missFromId(w.id)?NA(missFromId(w.id)):"<small>Pas de recette : butin ou échange</small>")}</td></tr>`;}).join("");
    const sp=D.spells.filter(x=>x.mod===m);const schools=[...new Set(sp.map(x=>x.sch))];
    const spells=schools.map(sc=>{const l=sp.filter(x=>x.sch===sc).sort((a,b)=>a.tier-b.tier);return `<h4>${pick(SCH[sc]||[sc,sc])}</h4><div class="tablewrap"><table><thead><tr><th>Sort</th><th>Rang</th><th>Effet</th><th>Incant. / recharge</th></tr></thead><tbody>${l.map(x=>`<tr><td><b>${esc(pick(x.n))}</b>${x.book?`<br><small>Tome</small>`:x.weap?`<br><small>Arme</small>`:""}</td><td>${x.tier??"–"}</td><td><button class="spoil">${esc(pick(x.d))}${x.coef?` (dégâts ${x.coef}× puissance)`:""}${x.heal?` (soin ${x.heal}× puissance)`:""}</button></td><td>${x.cast?x.cast+" s":"instantané"}${x.cd?" / "+x.cd+" s":""}</td></tr>`).join("")}</tbody></table></div>`;}).join("");
    const adv=D.rpgadv.filter(a=>a.mod===m).map(a=>`<li><b>${esc(pick(a.t))}</b> : <button class="spoil">${esc(pick(a.d))}</button></li>`).join("");
    return `<details${m==="wiz"?" open":""}><summary>${{wiz:"🧙 Sorcier",pal:"🛡️ Paladin & Prêtre",arc:"🏹 Archer"}[m]} <small>(${items.length} objets, ${sp.length} sorts)</small></summary><div class="dbody"><h4>Objets</h4><p class="help">Rang = palier de puissance (0 à 4). Recettes floutées.</p><div class="tablewrap"><table><thead><tr><th>Objet</th><th>Rang</th><th>Recette</th></tr></thead><tbody>${rows}</tbody></table></div>${spells}${adv?`<h4>Succès</h4><ul class="help">${adv}</ul>`:""}</div></details>`;}).join("");
  $("#wizEff").innerHTML=D.rpgeff.filter(e=>e.n).map(e=>`<li><b>${esc(pick(e.n))}</b> : ${esc(pick(e.d)||"")}</li>`).join("");
}

/* waystones */
const BIOME={plains:"Plaines",sunflower_plains:"Plaines de tournesols",snowy_plains:"Plaines enneigées",ice_spikes:"Pics de glace",forest:"Forêt",flower_forest:"Forêt fleurie",birch_forest:"Forêt de bouleaux",dark_forest:"Forêt noire",old_growth_birch_forest:"Forêt de bouleaux ancienne",old_growth_pine_taiga:"Taïga de pins ancienne",old_growth_spruce_taiga:"Taïga de sapins ancienne",taiga:"Taïga",snowy_taiga:"Taïga enneigée",savanna:"Savane",savanna_plateau:"Plateau de savane",windswept_hills:"Collines venteuses",windswept_forest:"Forêt venteuse",windswept_savanna:"Savane venteuse",meadow:"Prairie",cherry_grove:"Cerisaie",grove:"Bosquet",desert:"Désert",swamp:"Marais",mangrove_swamp:"Marais de palétuviers",mushroom_fields:"Champs de champignons",bamboo_jungle:"Jungle de bambous",jungle:"Jungle",sparse_jungle:"Jungle clairsemée",deep_dark:"Deep dark",the_end:"L'End",end_highlands:"Hautes terres de l'End",end_midlands:"Terres moyennes de l'End",small_end_islands:"Petites îles de l'End",end_barrens:"Terres arides de l'End",nether_wastes:"Terres désolées (Hell)",soul_sand_valley:"Vallée des âmes (Hell)",crimson_forest:"Forêt carmin (Hell)",warped_forest:"Forêt biscornue (Hell)",basalt_deltas:"Deltas de basalte (Hell)",badlands:"Badlands",wooded_badlands:"Badlands boisés",eroded_badlands:"Badlands érodés",stony_shore:"Côte rocheuse",beach:"Plage",snowy_beach:"Plage enneigée",pale_garden:"Jardin pâle"};
const WSMOD={amplifies:"Amplifie l'effet",blinds:"Aveugle",cures:"Soigne les effets",feather_falls:"Chute amortie",poisons:"Empoisonne",prefers_round_robin:"Alterne entre les destinations",prefers_single_use:"Cible à usage unique",redstone_sensitive:"Contrôlée par le courant",resists_fire:"Résistance au feu",sets_on_fire:"Enflamme",slows_down_warp_plate:"Ralentit la plaque",speeds_up_warp_plate:"Accélère la plaque",withers:"Inflige Wither"};
function renderWS(){
  const R=RECS.filter(r=>r.src==="ws"&&!r.k.includes("_from_ruined")),W=D.ws;const idp=r=>String(r.rid).split(":").pop();
  const grp=[["🗿 Pierres de téléportation (waystones)",r=>/waystone/.test(idp(r))],["🔷 Sharestones",r=>/sharestone/.test(idp(r))],["🚩 Portstones",r=>/portstone/.test(idp(r))],["💎 Pierres de saut (warp stones)",r=>/warp_stone/.test(idp(r))],["📜 Parchemins",r=>/scroll/.test(idp(r))],["✨ Plaque, éclats et objets",r=>!/(waystone|sharestone|portstone|warp_stone|scroll)/.test(idp(r))]];
  $("#wsBody").innerHTML=grp.map(([t,f])=>{const l=R.filter(f);if(!l.length)return"";
    return `<details${t.includes("waystones")?" open":""}><summary>${t} <small>(${l.length})</small></summary><div class="dbody"><div class="cards">${l.map(r=>{const u=W.unlock[r.k]||[];const tip=W.tips[String(r.rid).split(":").pop()];
      return card(r).replace('<div class="body">',`<div class="unl">${u.length?`🔓 Recette débloquée en obtenant : ${u.map(nmi).join(", ")}`:""}${tip?`<br><i>${esc(pick(tip))}</i>`:""}</div><div class="body">`);}).join("")}</div></div></details>`;}).join("");
  $("#wsBiomes").innerHTML=Object.entries(W.biomes).filter(([k,v])=>v.length).map(([k,v])=>{const r=R.find(x=>String(x.rid).endsWith(k.replace("sandy_waystone","sandstone_waystone").replace("mossy_waystone","mossy_andesite_waystone").replace(/^waystone$/,"andesite_waystone")));
    return `<tr><td><b>${r?nmi(r.n):esc(k)}</b></td><td>${v.map(b=>BIOME[b.split(":").pop()]||b.split(":").pop().replace(/_/g," ")).join(", ")}</td></tr>`;}).join("");
  $("#wsMods").innerHTML=Object.entries(W.mods).map(([k,v])=>`<tr><td>${v.map(i=>`<span class="ii">${nmi(i)}</span>`).join(" ")}</td><td>${WSMOD[k]||k}</td></tr>`).join("");
}
/* trades */
function renderTrades(){
  const st=x=>x?`${x[1]>1?x[1]+"× ":""}${nmi(x[0])}`:"";
  $("#tradeBody").innerHTML=Object.entries(D.trades).sort((a,b)=>nm(+a[0]).localeCompare(nm(+b[0]))).map(([p,ts])=>{
    ts.sort((a,b)=>String(a.l).localeCompare(String(b.l)));const rpg=ts.find(t=>t.src!=="mf");
    return `<details><summary>${esc(nm(+p))} ${rpg?`<span class="rpg ${rpg.src}">${SRC[rpg.src]}</span>`:""}<small>(${ts.length})</small></summary><div class="dbody"><ul class="trades">${ts.map(t=>`<li><span class="lvl">${/^\d$/.test(t.l)?"Niv. "+t.l:"–"}</span> <button class="spoil">${st(t.w)}${t.w2?" + "+st(t.w2):""} → <b>${st(t.g)}</b></button></li>`).join("")}</ul></div></details>`;}).join("");
}
/* fish & mobs */
function renderFish(){
  const HAB={freshwater:"Eau douce",saltwater:"Eau salée",cool:"fraîche",cold:"froide",temperate:"tempérée",hot_wet:"chaude et humide",hot_dry:"chaude et sèche",warm:"chaude",swamps:"Marais",pale_garden:"Jardin pâle",deep_dark:"Deep dark",sulfur_caves:"Grottes de soufre",junk:"Déchets",treasure:"Trésors",frozen:"glacée",lukewarm:"tiède"};
  const lab=k=>k.split("/").map(p=>HAB[p]||p.replace(/_/g," ")).join(", ");
  const isJ=k=>k.startsWith("junk")||k.startsWith("treasure");
  $("#fishBody").innerHTML=Object.entries(D.fish).sort((a,b)=>isJ(a[0])-isJ(b[0])||a[0].localeCompare(b[0])).map(([k,v])=>`<tr><td><b>${esc(lab(k))}</b></td><td>${v.map(f=>`<button class="spoil">${nmi(f)}${D.rar[f]?" "+"★".repeat(D.rar[f]):""}</button>`).join(" ")}</td></tr>`).join("");
  $("#mobBody").innerHTML=Object.entries(D.drops).filter(([m,v])=>v.length).map(([m,v])=>`<tr><td><b>${esc(nm(+m))}</b></td><td><button class="spoil">${v.map(i=>`<span class="ii">${nmi(i)}</span>`).join(" ")}</button></td></tr>`).join("");
}
function renderGloss(){
  const sg=new Set();$("#glossary").innerHTML=D.gloss.filter(g=>!/Spawn Egg|Upgrade Smithing/.test(g[0][0])&&!sg.has(g[0][0]+g[1][0])&&sg.add(g[0][0]+g[1][0])).map(g=>`<div>${esc(S.lang==="en"?g[0][0]:g[0][1])}</div><div>${icx(g[2])}${esc(pick(g[1]))}</div>`).join("");
}

/* progression tree */
const A=D.adv,T=window.__ADVFR__;
const kids={};Object.entries(A).forEach(([k,a])=>{if(a.p)(kids[a.p]=kids[a.p]||[]).push(k);});
const order=Object.keys(T);Object.values(kids).forEach(l=>l.sort((a,b)=>order.indexOf(a)-order.indexOf(b)));
const POS={};let row=0;
(function lay(k,d){POS[k]={x:d,y:row};const c=kids[k]||[];if(!c.length){row++;return;}c.forEach(ch=>lay(ch,d+1));})("root",0);
const CW=104,CH=84,NS=52,PAD=14,maxX=Math.max(...Object.values(POS).map(p=>p.x));
const treeEl=$("#treeEl"),svg=$("#edges"),W=PAD*2+(maxX+1)*CW,Hh=PAD*2+row*CH;
treeEl.style.width=W+"px";treeEl.style.height=Hh+"px";svg.setAttribute("width",W);svg.setAttribute("height",Hh);
const cx=k=>PAD+POS[k].x*CW+CW/2, cy=k=>PAD+POS[k].y*CH+NS/2+2;
const stat=k=>S.done[k]?"done":(S.spoil||!A[k].p||S.done[A[k].p])?"avail":"locked";
const title=k=>pick(A[k].t)||(T[k]||[])[1]||k;
function renderTree(){
  treeEl.querySelectorAll(".node").forEach(n=>n.remove());let p="";
  Object.keys(POS).forEach(k=>{const a=A[k];if(!a.p)return;const x1=cx(a.p)+NS/2,y1=cy(a.p),x2=cx(k)-NS/2,y2=cy(k),mx=x1+(x2-x1)/2;p+=`<path class="edge${S.done[a.p]?" on":""}" opacity="${stat(k)==="locked"?.4:1}" d="M${x1},${y1} H${mx} V${y2} H${x2}"/>`;});
  svg.innerHTML=p;
  Object.keys(POS).forEach(k=>{const st=stat(k),t=T[k]||["❔"],a=A[k],hid=st==="locked";
    const b=document.createElement("button");b.className=`node ${st} fr-${a.fr}`;b.style.left=(PAD+POS[k].x*CW+(CW-100)/2)+"px";b.style.top=(PAD+POS[k].y*CH)+"px";
    b.setAttribute("aria-label",hid?"Étape verrouillée":title(k)+(st==="done"?" (obtenue)":""));
    b.innerHTML=`<span class="frame">${hid?"?":(a.ic>=0?`<i class="ic big i${a.ic}"></i>`:t[0])}${a.rw==="heart"&&!hid?'<span class="heartb">♥</span>':""}</span><span class="lbl">${hid?"???":esc(title(k))}</span>`;
    b.onclick=()=>openNode(k);treeEl.appendChild(b);});
  const tot=Object.keys(POS).length-1,d=Object.keys(S.done).filter(k=>k!=="root"&&POS[k]).length;
  $("#count").textContent=`${d} / ${tot}`;$("#meterfill").style.width=(d/tot*100)+"%";$("#spoilAll").textContent=S.spoil?"Masquer la suite":"Révéler tout l'arbre";
}
const sheet=$("#sheet"),scrim=$("#scrim");let lastF=null;const FRM={task:"Tâche",goal:"Objectif",challenge:"Défi"};
function rwTxt(r){if(!r)return"";if(r==="heart")return"♥ Jalon : ton minimum de cœurs baisse d'un cran.";const m=r.match(/obol_(\d+)/);if(m)return`Récompense : ${m[1]} obole${m[1]>1?"s":""}.`;const c=r.match(/crystal_heart_(\d+)/);if(c)return`Récompense : ${c[1]} cœur${c[1]>1?"s":""} de cristal !`;return"";}
function linked(k){const a=A[k],t=T[k]||[],out=[],seen=new Set();const add=r=>{if(!r)return;const sig=r.n+JSON.stringify(r.g||r.i);if(!seen.has(sig)){seen.add(sig);out.push(r);}};
  (a.rec||[]).forEach(x=>add(byK[x]));
  (a.it||[]).forEach(it=>{if(it.startsWith("model:")){const m=it.slice(6);RECS.filter(r=>r.m===m&&r.src==="mf").forEach(add);}else{const id=it.split(":").pop();RECS.filter(r=>r.rid===id&&r.x&&!r.food&&r.src==="mf").slice(0,3).forEach(add);}});
  (t[3]||[]).forEach(n=>RECS.filter(r=>r.src==="mf"&&NT[r.n][0].toLowerCase()===n.toLowerCase()&&(!r.k.includes("_from_")||r.k.includes("mud_bricks_from_stonecutting"))).sort((a,b)=>b.x-a.x).slice(0,3).forEach(add));
  return out.slice(0,10);}
function openNode(k){lastF=document.activeElement;const st=stat(k),t=T[k]||["❔",k,"",[],""],a=A[k];
  if(st==="locked"){const p=a.p;sheet.innerHTML=`<h2>🔒 Étape verrouillée</h2><p>Termine d'abord « ${stat(p)!=="locked"?esc(title(p)):"l'étape précédente"} ».</p><div class="actions"><button class="btn" data-close>Fermer</button></div>`;}
  else{const done=st==="done",recs=linked(k);
    sheet.innerHTML=`<h2 id="sheetTitle"><span>${a.ic>=0?`<i class="ic big i${a.ic}"></i>`:t[0]}</span>${esc(title(k))}</h2><p class="adv">${FRM[a.fr]||"Tâche"}${a.hid?" cachée":""}${a.d?` · <i>${esc(pick(a.d))}</i>`:""}</p>
    ${rwTxt(a.rw)?`<p class="${a.rw==="heart"?"warn":"reward"}">${rwTxt(a.rw)}</p>`:""}<div class="hint"><b>Indice.</b> ${t[2]||""}</div>
    <div id="sol" ${done?"":"hidden"}>${t[4]?`<p>${t[4]}</p>`:""}${recs.length?`<div class="cards">${recs.map(r=>card(r,{noveil:1})).join("")}</div>`:""}</div>
    <div class="actions">${done||(!t[4]&&!recs.length)?"":`<button class="btn" id="showSol">Voir la solution</button>`}${k==="root"?"":`<button class="btn ${done?"":"gold"}" id="tog">${done?"Annuler « obtenu »":"Marquer comme obtenu"}</button>`}<button class="btn" data-close>Fermer</button></div>`;
    const ss=sheet.querySelector("#showSol");if(ss)ss.onclick=()=>{sheet.querySelector("#sol").hidden=false;ss.remove();};
    const tg=sheet.querySelector("#tog");if(tg)tg.onclick=()=>{if(done)unmark(k);else S.done[k]=true;save();renderTree();closeS();};}
  sheet.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeS);sheet.hidden=false;scrim.hidden=false;sheet.scrollTop=0;(sheet.querySelector("button")||sheet).focus();}
function unmark(k){delete S.done[k];if(!S.spoil)(kids[k]||[]).forEach(c=>{if(S.done[c])unmark(c);});}
function closeS(){sheet.hidden=true;scrim.hidden=true;if(lastF)lastF.focus();}
scrim.onclick=closeS;document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!sheet.hidden)closeS();});
$("#spoilAll").onclick=()=>{S.spoil=!S.spoil;save();renderTree();};
let resetArmed=null;
$("#reset").onclick=()=>{const b=$("#reset");
  if(!resetArmed){b.textContent="Confirmer ?";b.classList.add("gold");resetArmed=setTimeout(()=>{resetArmed=null;b.textContent="Recommencer";b.classList.remove("gold");},4000);return;}
  clearTimeout(resetArmed);resetArmed=null;b.textContent="Recommencer";b.classList.remove("gold");
  S.done={root:true};S.spoil=false;S.rv={};save();renderAll();};
function renderAll(){renderWS();chips();renderTree();renderCrafts();renderFood();renderEquip();renderMagic();renderRPG();renderTrades();renderFish();renderGloss();syncTop();}

/* ===== Spell Power enchants ===== */
function renderSpellPower(){
  const sup=s=>/critical|haste|generic/.test(s)?"Bâtons et baguettes":/armor|specialized|energize|soulfrost|sunfire/.test(s)?"Armures":s;
  $("#spPow").innerHTML=D.spen.map(e=>{const eff=e.per.length?e.per.map(p=>`+${(p[1]*100).toFixed(0)} % ${esc(pick(p[0]))}`).join(", ")+" par niveau":e.prot?`−${e.prot} de dégâts magiques par niveau (réduction)`:"";
    return `<tr><td><b>${esc(pick(e.n))}</b><br><small>max ${["","I","II","III","IV","V"][e.max]||e.max}</small></td><td>${sup(e.sup)}</td><td>${esc(pick(e.d)||"")}<br><small>${eff}${e.excl&&/critical/.test(e.excl)?" · incompatible avec l'autre enchantement critique":e.excl&&/multi_school/.test(e.excl)?" · un seul enchantement d'école par pièce":""}</small></td></tr>`;}).join("");
}
/* ===== Skill trees ===== */
S.sk=S.sk||{class_skills:{},weapon_skills:{}};
const KIND={root:"Racine",spell:"Amélioration de sort",mod:"Modificateur",passive:"Passif",stat:"Bonus de statistique"};
function skState(cat){
  const c=D.skills[cat],T=S.sk[cat]||(S.sk[cat]={}),nb={},ex={};
  c.normal.forEach(([a,b])=>{(nb[a]=nb[a]||[]).push(b);(nb[b]=nb[b]||[]).push(a);});
  c.exclusive.forEach(([a,b])=>{(ex[a]=ex[a]||[]).push(b);(ex[b]=ex[b]||[]).push(a);});
  const used=Object.keys(T).length,rootTaken=Object.keys(T).some(k=>c.nodes[k]&&c.nodes[k].root);
  const st=id=>{if(T[id])return"taken";const n=c.nodes[id];if((ex[id]||[]).some(o=>T[o]))return"excluded";if(used>=c.limit)return"locked";
    if(n.root)return(c.exroot&&rootTaken)?"excluded":"avail";return(nb[id]||[]).some(o=>T[o])?"avail":"locked";};
  return {c,T,nb,ex,used,st};
}
function prune(cat){const {c,T,nb}=skState(cat);const keep=new Set(),q=Object.keys(T).filter(k=>c.nodes[k]&&c.nodes[k].root);q.forEach(k=>keep.add(k));
  while(q.length){const k=q.pop();(nb[k]||[]).forEach(o=>{if(T[o]&&!keep.has(o)){keep.add(o);q.push(o);}});}Object.keys(T).forEach(k=>{if(!keep.has(k))delete T[k];});}
function renderSkills(cat){
  const {c,T,st,used,nb}=skState(cat),N=c.nodes,ids=Object.keys(N);
  const xs=ids.map(i=>N[i].x),ys=ids.map(i=>N[i].y),SC=1.7,P=34;
  const minX=Math.min(...xs),minY=Math.min(...ys),W=(Math.max(...xs)-minX)*SC+P*2,Hh=(Math.max(...ys)-minY)*SC+P*2;
  const X=i=>(N[i].x-minX)*SC+P,Y=i=>(N[i].y-minY)*SC+P;
  let s=`<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" class="sksvg">`;
  c.normal.forEach(([a,b])=>s+=`<line x1="${X(a)}" y1="${Y(a)}" x2="${X(b)}" y2="${Y(b)}" class="skl${T[a]&&T[b]?" on":""}"/>`);
  c.exclusive.forEach(([a,b])=>s+=`<line x1="${X(a)}" y1="${Y(a)}" x2="${X(b)}" y2="${Y(b)}" class="skx"/>`);
  ids.forEach(i=>{const n=N[i],r=n.root?15:n.k==="spell"?13:n.k==="mod"||n.k==="passive"?11:8,state=st(i);
    const sh=n.k==="spell"||n.root?`<rect x="${X(i)-r}" y="${Y(i)-r}" width="${2*r}" height="${2*r}" rx="${n.root?8:3}"`:`<circle cx="${X(i)}" cy="${Y(i)}" r="${r}"`;
    s+=`<g class="skn ${state} k-${n.k}" data-id="${i}" tabindex="0" role="button" aria-label="${esc(pick(n.t))}">${sh}/></g>`;});
  s+="</svg>";
  $("#sk_"+cat).innerHTML=`<div class="bar"><div class="progress">${used} / ${c.limit} points utilisés<div class="meter"><i style="width:${used/c.limit*100}%"></i></div></div><button class="btn" data-skreset="${cat}">Vider</button></div><div class="skwrap">${s}</div><div class="sklegend"><span><i class="lg root"></i>Racine</span><span><i class="lg spell"></i>Sort amélioré</span><span><i class="lg mod"></i>Modificateur / passif</span><span><i class="lg stat"></i>Bonus</span><span><i class="lg ex"></i>Choix exclusif</span></div><div id="skinfo_${cat}" class="skinfo"><p class="help">Touche une compétence pour lire son effet et l'ajouter à ton build.</p></div>`;
  $("#sk_"+cat).querySelectorAll(".skn").forEach(g=>{const f=()=>skInfo(cat,g.dataset.id);g.onclick=f;g.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();f();}};});
  const w=$("#sk_"+cat+" .skwrap"),rs=ids.filter(i=>N[i].root),cxr=rs.reduce((a,i)=>a+X(i),0)/rs.length,cyr=rs.reduce((a,i)=>a+Y(i),0)/rs.length;
  w.dataset.cx=cxr;w.dataset.cy=cyr;centerSk(w);
  $("#sk_"+cat).querySelector("[data-skreset]").onclick=()=>{S.sk[cat]={};save();renderSkills(cat);$("#sk_"+cat+" .skwrap").dataset.done="";centerSk($("#sk_"+cat+" .skwrap"));};
}
function centerSk(w){if(!w||!w.clientWidth||w.dataset.done)return;w.scrollLeft=+w.dataset.cx-w.clientWidth/2;w.scrollTop=+w.dataset.cy-w.clientHeight/2;w.dataset.done=1;}
document.addEventListener('click',()=>setTimeout(()=>document.querySelectorAll('.skwrap').forEach(centerSk),30));
function skInfo(cat,id){const {c,T,st}=skState(cat),n=c.nodes[id],state=st(id);
  const msg={avail:"Disponible",taken:"Pris",locked:c.limit<=Object.keys(T).length?"Plus de points":"Pas encore reliée à ton build",excluded:"Exclue par un autre choix"}[state];
  $("#skinfo_"+cat).innerHTML=`<h4>${esc(pick(n.t))}</h4><p class="adv">${KIND[n.k]} · ${msg}</p><p>${esc(pick(n.d)||"—")}</p><div class="actions">${state==="avail"?`<button class="btn gold" id="sktake">Prendre (1 point)</button>`:""}${state==="taken"?`<button class="btn" id="skdrop">Retirer</button>`:""}</div>`;
  const t=$("#sktake");if(t)t.onclick=()=>{T[id]=true;save();renderSkills(cat);skInfo(cat,id);};
  const d=$("#skdrop");if(d)d.onclick=()=>{delete T[id];prune(cat);save();renderSkills(cat);skInfo(cat,id);};
  $("#skinfo_"+cat).scrollIntoView({block:"nearest",behavior:"smooth"});
}
const _ra=renderAll;renderAll=function(){_ra();renderSpellPower();renderSkills("class_skills");renderSkills("weapon_skills");$("#orbTxt").textContent=pick(D.orb.d);const o=RECS.find(r=>r.src==="st");$("#orbCard").innerHTML=o?card(o):"";};
renderAll();
