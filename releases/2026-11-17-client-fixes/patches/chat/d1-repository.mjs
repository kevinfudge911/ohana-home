const decode=row=>row&&({id:row.id,scope:row.scope,sender:row.sender,text:row.text,image:row.image||null,createdAt:row.created_at,clientId:row.client_id,mentions:JSON.parse(row.mentions||'[]')});
export function createD1Repository(db){
 return {
  async byClient(sender,client){
   const current=decode(await db.prepare('SELECT * FROM chat_v2_messages WHERE sender=? AND client_id=?').bind(sender,client).first());if(current)return current;
   // A retry crossing the deployment must not replay an already-sent legacy message to a new audience.
   const old=await db.prepare('SELECT id,conversation,sender,text,image,created_at FROM chat_messages WHERE source=?').bind('send:'+sender+':'+client).first();
   if(!old)return null;const ids=old.conversation.startsWith('people:')?old.conversation.slice(7).split(','):[];
   return {id:'legacy:'+old.id,scope:ids.length===2?old.conversation.replace('people:','direct:'):old.conversation,sender:old.sender,text:old.text,image:old.image||null,createdAt:old.created_at,clientId:client,mentions:[]};
  },
  async commit(m,recipients){
   const writes=[db.prepare('INSERT OR IGNORE INTO chat_v2_messages(id,scope,sender,text,image,created_at,client_id,mentions) VALUES(?,?,?,?,?,?,?,?)').bind(m.id,m.scope,m.sender,m.text,m.image||null,m.createdAt,m.clientId,JSON.stringify(m.mentions))];
   // D1 batch is transactional. Only the winning insert creates its recipient snapshot; retries never add recipients.
   for(const recipient of recipients)writes.push(db.prepare('INSERT OR IGNORE INTO chat_v2_deliveries(message_id,recipient) SELECT id,? FROM chat_v2_messages WHERE sender=? AND client_id=? AND scope=? AND text=? AND id=?').bind(recipient,m.sender,m.clientId,m.scope,m.text,m.id));
   // Same atomic transaction supplies the existing inbox history. Legacy history is never moved.
   writes.push(db.prepare('INSERT OR IGNORE INTO chat_messages(conversation,sender,text,image,created_at,source) SELECT ?,sender,text,image,created_at,? FROM chat_v2_messages WHERE id=?').bind(m.legacyScope||m.scope,'send:'+m.sender+':'+m.clientId,m.id));
   if(m.scope.startsWith('direct:')&&m.roomId)writes.push(db.prepare('INSERT OR IGNORE INTO chat_threads(conversation,room_id,members) VALUES(?,?,?)').bind(m.legacyScope,m.roomId,JSON.stringify(m.memberIds)));
   const results=await db.batch(writes);return {...await this.byClient(m.sender,m.clientId),created:results[0]?.meta?.changes===1};
  },
  async pending(recipient,{after,limit}){
   let time=-1,id='';if(after){try{[time,id]=JSON.parse(atob(after));if(!Number.isSafeInteger(time)||typeof id!=='string'||id.length>100)throw Error();}catch{throw new Error('Invalid message cursor.');}}
   const rows=(await db.prepare('SELECT m.* FROM chat_v2_messages m JOIN chat_v2_deliveries d ON d.message_id=m.id WHERE d.recipient=? AND d.acknowledged_at IS NULL AND (m.created_at>? OR (m.created_at=? AND m.id>?)) ORDER BY m.created_at,m.id LIMIT ?').bind(recipient,time,time,id,limit+1).all()).results;
   const more=rows.length>limit;rows.length=Math.min(rows.length,limit);const last=rows.at(-1);
   return {messages:rows.map(decode),next:more?btoa(JSON.stringify([last.created_at,last.id])):null};
  },
  async forRecipient(recipient,id){return decode(await db.prepare('SELECT m.* FROM chat_v2_messages m JOIN chat_v2_deliveries d ON d.message_id=m.id WHERE d.recipient=? AND m.id=?').bind(recipient,id).first());},
  async acknowledge(recipient,id,time){await db.prepare('UPDATE chat_v2_deliveries SET acknowledged_at=COALESCE(acknowledged_at,?) WHERE recipient=? AND message_id=?').bind(time,recipient,id).run();},
  async muted(recipient,scope){
   const keys=[scope];
   if(scope.startsWith('direct:'))keys.push(scope.replace('direct:','people:'));
   if(scope.startsWith('game:')){const game=await db.prepare('SELECT players FROM games WHERE id=?').bind(Number(scope.slice(5))).first();if(game){const ids=[...new Set(JSON.parse(game.players).filter(id=>id>0))].sort((a,b)=>a-b);keys.push('people:'+ids.join(','));}}
   if(scope.startsWith('puzzle:')){const puzzle=await db.prepare('SELECT room_id FROM puzzles WHERE id=?').bind(Number(scope.slice(7))).first();if(puzzle)keys.push('room:'+puzzle.room_id);}
   for(const key of keys)if((await db.prepare('SELECT muted FROM chat_preferences WHERE member_id=? AND conversation=?').bind(recipient,key).first())?.muted)return true;
   return false;
  }
 };
}
