const fs=require('fs');
function one(source,before,after){if(source.split(before).length!==2)throw Error('Expected unique invitation patch anchor: '+before.slice(0,70));return source.replace(before,after);}
function app(s){
 const start=s.indexOf('function invitationReason(games,me,member,type,seats) {'),end=s.indexOf('\nasync function openOhanaInvite',start);if(start<0||end<0)throw Error('Invitation reason boundary missing');
 s=one(s,s.slice(start,end),"function invitationReason(games,me,member,type,seats) {\n  // A new invitation creates a separate table; existing tables do not reserve people.\n  return '';\n}");
 s=one(s,"      if(op.status==='sent')return 'Invitation sent';\n",'');
 s=one(s,"    let op=state.attempt||invitationSends.get(k);\n    if(op?.status==='sending'||op?.status==='sent')return;","    let op=state.attempt||invitationSends.get(k);\n    if(op?.status==='sent'){invitationSends.delete(k);op=null;}\n    if(op?.status==='sending')return;");
 s=one(s,"    if(focusSelector){const next=dialog.querySelector(focusSelector);if(next&&!next.matches(':disabled'))next.focus({preventScroll:true});}","    if(focused&&!focused.isConnected&&owner.current()&&dialog.open&&document.activeElement===document.body){const preferred=focusSelector?dialog.querySelector(focusSelector):null;const eligible=el=>{if(!el?.isConnected||el.matches(':disabled')||el.closest('[hidden],[inert]'))return false;for(let node=el;node&&node!==document.body;node=node.parentElement){const css=getComputedStyle(node);if(css.display==='none'||css.visibility==='hidden'||css.visibility==='collapse')return false;}return true;};const next=eligible(preferred)?preferred:dialog.querySelector('#cancel-ohana-invite');if(eligible(next))next.focus({preventScroll:true});}");
 return s;
}
function worker(s){
 const a=s.indexOf('function invitationReason(games,me,member,type,seats){'),b=s.indexOf('async function sendInvitationBatch',a);if(a<0||b<0)throw Error('Server reason boundary missing');s=one(s,s.slice(a,b),'function invitationReason(games,me,member,type,seats){return""}');
 s=one(s,'if(recipients.some(id=>!options.members.some(m=>m.id===id)||invitationReason(options.games,me.id,id,type,seats)))throw new Error("Someone is already playing or has a pending invitation. Refresh the people and choose again.");','if(recipients.some(id=>!options.members.some(m=>m.id===id)))throw new Error("Someone is no longer available in this room. Refresh the people and choose again.");');
 const from=s.indexOf('const guard=`INSERT OR IGNORE INTO invitation_batches'),to=s.indexOf(';const permitted=',from);if(from<0||to<0)throw Error('Atomic guard boundary missing');
 const previous=s.slice(from,to);if(!previous.includes('AND NOT EXISTS (SELECT 1 FROM games')&&!previous.includes('OR EXISTS (SELECT 1 FROM games'))throw Error('Cross-game guard absent');
 s=one(s,previous,"const guard=`INSERT OR IGNORE INTO invitation_batches(sender_id,room_id,request_id,plan,codes,created_at) SELECT ?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM room_members WHERE room_id=? AND member_id=?) AND NOT EXISTS (SELECT 1 FROM json_each(?) snapshot WHERE (SELECT value FROM settings WHERE key='child_'||snapshot.key) IS NOT snapshot.value) AND NOT EXISTS (SELECT 1 FROM json_each(?) target WHERE NOT EXISTS (SELECT 1 FROM room_members WHERE room_id=? AND member_id=target.value))`;const stamps=now(),statements=[db.prepare(guard).bind(me.id,roomId,requestId,plan,JSON.stringify(codes),stamps,roomId,me.id,policySnapshot,JSON.stringify(recipients),roomId)]");
 return s;
}
module.exports={app,worker};
if(require.main===module){const [kind,input,output]=process.argv.slice(2);if(!['app','worker'].includes(kind))throw Error('Select app or worker');fs.writeFileSync(output,module.exports[kind](fs.readFileSync(input,'utf8')));}
