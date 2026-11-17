function o10AddSupplement(st,random=Math.random){
 if(st.extraDeckVersion===1)return false;
 if(!Array.isArray(st.deck)||!Array.isArray(st.discard)||!st.hands||!st.melds)throw Error('Ohana Ten state is incomplete; no cards changed.');
 const cards=[...st.deck,...st.discard,...Object.values(st.hands).flat(),...Object.values(st.melds).flat().flatMap(m=>m.cards||[])];
 let max=0;for(const card of cards){if(!Number.isSafeInteger(card?.id)||card.id<1)throw Error('Ohana Ten card IDs need review; no cards changed.');max=Math.max(max,card.id)}
 if(max>Number.MAX_SAFE_INTEGER-104)throw Error('Ohana Ten card IDs are exhausted.');
 const extra=o10Deck(random).map(c=>({...c,id:++max}));
 st.deck=shuffle([...st.deck,...extra],random);st.extraDeckVersion=1;return true;
}
async function o10EnsureSupplement(db,g,actor,token){
 if(!Number.isSafeInteger(actor)||actor<1||!token)throw Error('A participating member is required.');
 for(let attempt=0;attempt<5;attempt++){
  if(g.type!=='ohana10'||g.status!=='playing'||!g.state)return;
  const st=JSON.parse(g.state);if(!o10AddSupplement(st))return;
  const state=JSON.stringify(st);
  const saved=await db.prepare("UPDATE games SET state=?,updated_at=? WHERE id=? AND state=? AND turn=? AND status='playing' AND type='ohana10' AND room_id=? AND EXISTS(SELECT 1 FROM rooms r JOIN room_members rm ON rm.room_id=r.id JOIN members m ON m.id=rm.member_id WHERE r.id=games.room_id AND m.id=? AND m.token=? AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||r.id AND value<>'')) AND EXISTS(SELECT 1 FROM json_each(games.players) WHERE value=?)").bind(state,now(),g.id,g.state,g.turn,g.room_id,actor,token,actor).run();
  if(saved.meta.changes){g.state=state;return;}
  const fresh=await db.prepare('SELECT state,turn,status,winner FROM games WHERE id=?').bind(g.id).first();
  if(!fresh)throw Error('Game not found.');Object.assign(g,fresh);
 }
 throw Error('The table is busy. Please try again; your cards are safe.');
}
