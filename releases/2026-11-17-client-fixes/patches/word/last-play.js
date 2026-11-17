function wordOpponentLastPlay(st,g,viewer){
 if(!g||g.type!=='words'||viewer==null||!Array.isArray(g.players)||!g.players.some(p=>String(p)===String(viewer)))return null;
 const players=new Set(g.players.map(String));
 const history=Array.isArray(st?.history)?st.history:[];
 for(let i=history.length-1;i>=0;i--){
  const h=history[i];
  if(!h||h.p==null||String(h.p)===String(viewer)||!players.has(String(h.p))||!Number.isFinite(h.score)||!Array.isArray(h.words))continue;
  const words=h.words.filter(w=>w&&typeof w.word==='string'&&w.word.trim()).map(w=>w.word.trim());
  if(words.length)return {player:h.p,words,score:h.score};
 }
 return null;
}
function mountWordOpponentLastPlay(dock,st,g,viewer){
 dock.querySelector('.word-opponent-last-play')?.remove();
 const last=wordOpponentLastPlay(st,g,viewer);if(!last)return;
 const summary=document.createElement('div');summary.className='word-opponent-last-play';
 summary.setAttribute('role','group');summary.setAttribute('aria-label','Other player’s last word play');
 const who=document.createElement('span'),word=document.createElement('strong'),score=document.createElement('span');
 who.textContent=(g.names?.[last.player]?.name||nameOf(last.player))+':';
 word.textContent=last.words.join(', ');score.textContent=(last.score>0?'+':'')+last.score+' '+(Math.abs(last.score)===1?'point':'points');
 summary.append(who,word,score);dock.append(summary);
}
