// Presentation-only. A joined human opponent counts; empty tables, bots, solo saves and puzzles do not.
function ohanaHumanTableCount(sync,member){
 const me=Number(member);if(!Number.isSafeInteger(me)||me<=0)return 0;
 return ohanaUniqueGames(sync,me).filter(g=>{const players=(g.players||[]).map(Number);return players.includes(me)&&players.some(id=>Number.isSafeInteger(id)&&id>0&&id!==me);}).length;
}
function ohanaHumanClassicCount(response){
 const state=response?.state,actor=response?.actor;if(!state||state.phase==='finished'||!/^member-[1-9]\d*$/.test(String(actor)))return 0;
 const players=state.players||[];return players.some(p=>p.id===actor)&&players.some(p=>p.id!==actor&&/^member-[1-9]\d*$/.test(String(p.id)))?1:0;
}
// Reuse the already-authorized My Games listing response. This badge never issues a request.
function paintOhanaHumanGameCount(node=document.querySelector('#home-controls-dock .home-game-count')){
 if(!node?.isConnected||!S.token||!S.me)return;
 const owner=String(S.me.id)+':'+String(S.token),cache=ohanaClassicListing,known=cache.owner===owner&&cache.room===S.room&&cache.roomEpoch===S.roomEpoch&&cache.at>0;
 const classic=known&&!cache.error&&cache.value?ohanaHumanClassicCount({actor:cache.value.actor,state:{phase:'playing',players:cache.value.players}}):0;
 const total=ohanaHumanTableCount(S.sync,S.me.id)+classic,suffix=!known?' · Classic not checked':cache.error?' · Classic unavailable':'';
 node.textContent=total+' games · tables + Classic'+suffix;node.setAttribute('aria-label',total+' active games with other people, standard tables and MOMopoly Classic'+suffix+'. Saved GO and Journey games and shared puzzles are not included.');
 node.title='Only games with at least one other real player. Standard tables plus MOMopoly Classic; excludes empty tables, robot-only games, shared puzzles and saved GO/Journey games.';
}
