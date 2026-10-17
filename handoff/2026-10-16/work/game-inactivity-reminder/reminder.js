// Friendly reminders use existing D1 settings; no Durable Object changes.
async function recordOhanaGameActivity(db, memberId, stamp=Date.now()) {
  if(!Number.isSafeInteger(memberId)||memberId<=0||!Number.isFinite(stamp)||stamp<=0)return;
  await db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value WHERE CAST(settings.value AS INTEGER)<CAST(excluded.value AS INTEGER)")
    .bind('game_last_played_'+memberId,String(Math.floor(stamp))).run();
}
async function runOhanaInactivityReminders(db, stamp=Date.now(), deliver=notifyMembers) {
  const cutoff=stamp-72*60*60*1000;
  const games=(await db.prepare("SELECT id,players,turn,state,room_id FROM games WHERE status='playing'").all()).results||[];
  const waiting=new Map();
  for(const game of games){
    try{
      const players=JSON.parse(game.players),state=JSON.parse(game.state),memberId=players[game.turn],room=Number(game.room_id);
      if(!Array.isArray(players)||players.length<2||state?.bot||players.includes(BOT_ID)||!Number.isSafeInteger(memberId)||memberId<=0||!Number.isSafeInteger(room)||room<=0)continue;
      if(!waiting.has(memberId))waiting.set(memberId,new Set());
      waiting.get(memberId).add(room);
    }catch{}
  }
  let attempts=0;
  for(const [memberId,roomSet] of waiting){
    const rooms=[...roomSet],marks=rooms.map(()=>'?').join(',');
    const member=await db.prepare("SELECT m.id,m.last_seen,m.created_at FROM members m WHERE m.id=? AND EXISTS(SELECT 1 FROM push_subscriptions s WHERE s.member_id=m.id) AND EXISTS(SELECT 1 FROM room_members r WHERE r.member_id=m.id AND r.room_id IN ("+marks+"))").bind(memberId,...rooms).first();
    if(!member)continue;
    const activityKey='game_last_played_'+memberId;
    // Legacy accounts have no historical per-member move timestamp. Start from
    // their latest known visit once, then only successful moves advance it.
    const baseline=Math.max(Number(member.last_seen)||0,Number(member.created_at)||0);
    if(baseline>0)await db.prepare("INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)").bind(activityKey,String(Math.floor(baseline))).run();
    const activity=Number((await db.prepare("SELECT value FROM settings WHERE key=?").bind(activityKey).first())?.value);
    if(!Number.isFinite(activity)||activity<=0||activity>cutoff)continue;
    // One atomic claim across all waiting games and overlapping cron runs.
    // Recheck activity, current turn, membership and opt-in atomically. Also
    // inspect committed lastPlay data to cover the short gap before its
    // separate best-effort activity timestamp write finishes.
    const claim=await db.prepare("INSERT INTO settings(key,value) SELECT ?,? WHERE EXISTS(SELECT 1 FROM settings WHERE key=? AND CAST(value AS INTEGER)=? AND CAST(value AS INTEGER)<=?) AND EXISTS(SELECT 1 FROM push_subscriptions WHERE member_id=?) AND EXISTS(SELECT 1 FROM games g JOIN room_members r ON r.room_id=g.room_id JOIN members m ON m.id=r.member_id WHERE g.status='playing' AND r.member_id=? AND CASE WHEN json_valid(g.players) AND json_valid(g.state) THEN json_array_length(g.players)>=2 AND CAST(json_extract(g.players,'$['||g.turn||']') AS INTEGER)=? AND NOT EXISTS(SELECT 1 FROM json_each(g.players) p WHERE p.value=?) AND (json_type(g.state,'$.bot') IS NULL OR json_type(g.state,'$.bot')='null' OR json_extract(g.state,'$.bot')=0) ELSE 0 END) AND NOT EXISTS(SELECT 1 FROM games g WHERE CASE WHEN json_valid(g.state) THEN CAST(json_extract(g.state,'$.lastPlay.p') AS INTEGER)=? AND CAST(json_extract(g.state,'$.lastPlay.at') AS INTEGER)>? ELSE 0 END) ON CONFLICT(key) DO UPDATE SET value=excluded.value WHERE CAST(settings.value AS INTEGER)<CAST(excluded.value AS INTEGER)")
      .bind('game_inactivity_reminded_'+memberId,String(activity),activityKey,activity,cutoff,memberId,memberId,memberId,BOT_ID,memberId,cutoff).run();
    if(!claim.meta?.changes)continue;
    attempts++;
    try{await deliver(db,[memberId],{type:'reminder',title:'We miss you in Ohana',body:'Hey, we miss you in Ohana. Your games are waiting.',tag:'ohana-friendly-reminder-'+memberId});}
    catch(error){console.warn('Ohana reminder delivery failed',error.message);}
  }
  return {attempts};
}

