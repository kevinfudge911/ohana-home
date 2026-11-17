// Every v2 history row is visible only to its original sender/recipient snapshot.
const visible=alias=>`NOT EXISTS(SELECT 1 FROM chat_v2_messages v WHERE ${alias}.source='send:'||v.sender||':'||v.client_id AND v.sender!=? AND NOT EXISTS(SELECT 1 FROM chat_v2_deliveries vd WHERE vd.message_id=v.id AND vd.recipient=?))`;
function apply(worker){
 const replacements=[
 ['SELECT id,sender,text,image,created_at FROM chat_messages WHERE conversation=? AND (?=0 OR id<?) ORDER BY id DESC LIMIT 100\").bind(key,before,before)',`SELECT m.id,m.sender,m.text,m.image,m.created_at FROM chat_messages m WHERE m.conversation=? AND (?=0 OR m.id<?) AND ${visible('m')} ORDER BY m.id DESC LIMIT 100\").bind(key,before,before,me.id,me.id)`],
 ['WHERE m.conversation IN (${marks}) GROUP BY m.conversation`).bind(me.id,started,me.id,...keys)',`WHERE m.conversation IN (\${marks}) AND ${visible('m')} GROUP BY m.conversation\x60).bind(me.id,started,me.id,...keys,me.id,me.id)`],
 ['AND r.reaction IS NOT NULL GROUP BY r.message_id,r.reaction\").bind(memberId,conversation,...chunk)',`AND r.reaction IS NOT NULL AND ${visible('m')} GROUP BY r.message_id,r.reaction\").bind(memberId,conversation,...chunk,memberId,memberId)`],
 ['SELECT id FROM chat_messages WHERE id=? AND conversation=?\").bind(messageId,key)',`SELECT m.id FROM chat_messages m WHERE m.id=? AND m.conversation=? AND ${visible('m')}\").bind(messageId,key,me.id,me.id)`],
 ['if(thread.kind==="room")return err("Room chats stay put', 'if(thread.kind==="room"||thread.v2&&thread.kind==="group")return err("Room chats stay put']
 ,['await db.batch([db.prepare("DELETE FROM chat_reactions WHERE message_id IN (SELECT id FROM chat_messages WHERE conversation=?)")', 'await db.batch([db.prepare("DELETE FROM chat_v2_deliveries WHERE message_id IN (SELECT id FROM chat_v2_messages WHERE scope=? OR scope=?)").bind(key,key.replace(/^people:/,"direct:")),db.prepare("DELETE FROM chat_v2_messages WHERE scope=? OR scope=?").bind(key,key.replace(/^people:/,"direct:")),db.prepare("DELETE FROM chat_reactions WHERE message_id IN (SELECT id FROM chat_messages WHERE conversation=?)")']
 ];for(const[from,to]of replacements){if(worker.split(from).length!==2)throw Error('History filter anchor drift: '+from.slice(0,60));worker=worker.replace(from,to);}return worker;
}
module.exports={visible,apply};
