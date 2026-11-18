const fs=require('fs');const input=process.argv[2];let s=fs.readFileSync(input,'utf8');const begin=s.indexOf(' const meldButtons=[...root.querySelectorAll(\'[data-layoff]\')];');const end=s.indexOf(" const count=document.createElement('span');count.className='rd-turn'",begin);if(begin<0||end<0)throw Error('Meld block missing');const block=` // One familiar Meld control handles new sets/runs and extensions.
 const meldButtons=[...root.querySelectorAll('[data-layoff]')];
 if(g.state.mode==='rummy'){
 const create=actions.querySelector('[data-action="meld"]');
 const selected=[...(shufflePrivateDraft(g,g.state).selected||[])];
 const canPlay=g.in_game&&g.status==='playing'&&g.players[g.turn]===S.me.id&&g.state.phase==='play'&&!S.movePending;
 const context={token:S.token,member:S.me?.id,room:S.room,epoch:S.roomEpoch,game:S.game,visit:S.gameEntryVisit||0,revision:g.state.revision};
 const current=()=>root.isConnected&&document.getElementById('game')===root&&S.token===context.token&&S.me?.id===context.member&&S.room===context.room&&S.roomEpoch===context.epoch&&S.game===context.game&&(S.gameEntryVisit||0)===context.visit&&S.gstate?.state?.revision===context.revision;
 const options=[];const originals=document.createElement('span');originals.hidden=true;menu.append(originals);
 if(create&&OhanaCardRules.isCardMeld(selected))options.push({label:'New meld: '+selected.map(shuffleCardLabel).join(', '),button:create});
 for(const b of meldButtons){const i=Number(b.dataset.layoff),m=g.state.melds[i];if(selected.length&&m&&OhanaCardRules.isCardMeld([...m.cards,...selected]))options.push({label:'Meld '+(i+1)+': '+shuffleMeldOrder(m.cards).map(shuffleCardLabel).join(', '),button:b});originals.append(b);}
 const meld=document.createElement('button');meld.type='button';meld.textContent='Meld';meld.dataset.shuffleMeld='true';meld.setAttribute('aria-label','Meld selected cards');meld.disabled=!canPlay||!options.length;
 if(create){create.replaceWith(meld);originals.append(create);}else actions.prepend(meld);
 meld.onclick=()=>{if(meld.disabled||!current())return;if(options.length===1){options[0].button.click();return;}
 const d=document.createElement('dialog');d.className='shuffle-help';d.setAttribute('aria-label','Choose where to meld');const close=document.createElement('button');close.type='button';close.textContent='Cancel';close.onclick=()=>d.close();d.append(close);
 for(const option of options){const b=document.createElement('button');b.type='button';b.textContent=option.label;b.onclick=()=>{if(!current()||S.movePending){observer.disconnect();d.remove();return;}d.close();if(current()&&!S.movePending)option.button.click();};d.append(b);}
 const observer=new MutationObserver(()=>{if(!d.isConnected||!current()){observer.disconnect();d.remove();}});
 d.onclose=()=>{observer.disconnect();d.remove();if(current()&&meld.isConnected)meld.focus();};document.body.append(d);d.showModal();observer.observe(document.body,{childList:true,subtree:true});};
 }
`;
s=s.slice(0,begin)+block+s.slice(end);s=s.replace('Select your cards, then use <b>Add to meld</b>. If several public melds are available, choose the destination Meld number.','Select your cards, then use <b>Meld</b>. A matching public meld is used automatically when it is the only choice; otherwise choose the destination.').replace('Tap a draw pile → optional Meld/Add to meld → Discard','Tap a draw pile → optional Meld → Discard');fs.writeFileSync(process.argv[3]||__dirname+'/candidate.html',s);
