const fs=require('fs'),crypto=require('crypto');
const changes=[
["function renderGame() {\n  closePrivateDuckville();", `function ohanaKeepGameFocus(g){
 const old=document.activeElement,root=document.getElementById('game');
 if(!g||S.game!==g.id||S._worldGameId!==g.id||!root?.contains(old)||old===document.body)return;
 const gameId=g.id,selectedGame=S.game,tab=S.tab,room=S.room,token=S.token,member=S.me?.id,visit=S.gameEntryVisit,nav=window.OhanaScreenHistory?.navigationEpoch?.(),id=old.id,label=old.getAttribute('aria-label'),tag=old.tagName;
 const square=['data-i','data-idx','data-pos'].map(k=>[k,old.getAttribute(k)]).find(x=>x[1]!==null);
 // Never restore a hand by array index: sorting/removal may change its identity.
 queueMicrotask(()=>{
  if(old.isConnected||S.gstate?.id!==gameId||S.game!==selectedGame||S.tab!==tab||S.room!==room||S.token!==token||S.me?.id!==member||S.gameEntryVisit!==visit||window.OhanaScreenHistory?.navigationEpoch?.()!==nav||document.querySelector('dialog[open]')||![document.body,null].includes(document.activeElement))return;
  const now=document.getElementById('game');if(!now||now.closest('[hidden],[inert]'))return;
  let target=id?document.getElementById(id):null;
  if(target&&(!now.contains(target)||target.tagName!==tag||(label&&target.getAttribute('aria-label')!==label)))target=null;
  if(!target&&label){const matches=[...now.querySelectorAll('[aria-label]')].filter(e=>e.tagName===tag&&e.getAttribute('aria-label')===label&&(!square||e.getAttribute(square[0])===square[1]));if(matches.length===1)target=matches[0];}
  if(!target||target.disabled||target.getAttribute('aria-disabled')==='true'||target.closest('[hidden],[inert]')||!target.getClientRects().length)return;
  target.focus({preventScroll:true});
 });
}
function renderGame() {
  ohanaKeepGameFocus(S.gstate);
  closePrivateDuckville();`],
['function toast(t, ms = 2600) { const e = document.createElement(\'div\'); e.className = \'toast\'; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), ms); }',`function ohanaAnnounceStatus(text){
 const host=[...document.querySelectorAll('dialog[open]')].at(-1)||document.body;
 let region=host.querySelector(':scope > [data-ohana-screenreader-status]');
 if(!region){region=document.createElement('span');region.dataset.ohanaScreenreaderStatus='1';region.setAttribute('role','status');region.setAttribute('aria-live','polite');region.setAttribute('aria-atomic','true');region.style.cssText='position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;pointer-events:none';host.appendChild(region);}
 clearTimeout(region.ohanaAnnouncementTimer);region.textContent='';region.ohanaAnnouncementTimer=setTimeout(()=>{if(region.isConnected)region.textContent=String(text||'');},50);
}
function toast(t, ms = 2600) { ohanaAnnounceStatus(t); const e = document.createElement('div'); e.className = 'toast'; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), ms); }`],
["function pzToast(t){const e=$('#pz-toast');", "function pzToast(t){ohanaAnnounceStatus(t);const e=$('#pz-toast');"],
['<canvas id="pz-canvas"></canvas><canvas id="pz-strip" class="pz-strip"></canvas>', '<canvas id="pz-canvas" role="img" aria-label="Visual jigsaw puzzle. Piece movement currently requires touch dragging."></canvas><canvas id="pz-strip" class="pz-strip" role="img" aria-label="Visual loose-piece tray"></canvas>'],
['<nav class="tabs"><div class="in">','<nav class="tabs" aria-label="Main navigation"><div class="in">'],
['<button data-room="${r.id}">Come on in</button>','<button data-room="${r.id}" aria-label="Enter ${esc(r.name)} room">Come on in</button>'],
['data-game-room="${g.room_id}">${g.in_game?', 'data-game-room="${g.room_id}" aria-label="Open ${esc(g.name)} in ${esc((sy.rooms||[]).find(r=>r.id===g.room_id)?.name||g.room_name||\'Room\')}">${g.in_game?'],
["document.body.append(d);bindGameSetups(d);d.showModal();", "document.body.append(d);bindGameSetups(d);d.showModal();const setupHeading=d.querySelector('#game-setup-title');if(setupHeading){setupHeading.tabIndex=-1;setupHeading.focus({preventScroll:true});}"],
];
function apply(s){for(const [a,b]of changes){const n=s.split(a).length-1;if(n!==1)throw Error('Expected unique anchor ('+n+'): '+a.slice(0,90));s=s.replace(a,b);}return s;}
module.exports={apply,changes};
if(require.main===module){const src=fs.readFileSync(process.argv[2],'utf8');if(crypto.createHash('sha256').update(src).digest('hex')!=='54095b10c7ae9a19c104b3247ab2cfa1999784b4755ddfc716134537e6b12ba6')throw Error('Wrong baseline');fs.writeFileSync(process.argv[3],apply(src));console.log(crypto.createHash('sha256').update(apply(src)).digest('hex'));}
