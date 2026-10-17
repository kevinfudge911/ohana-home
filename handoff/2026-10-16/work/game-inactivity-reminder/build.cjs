const fs=require('fs'),path=require('path');
const input=process.argv[2];if(!input)throw Error('Pass latest worker');let s=fs.readFileSync(input,'utf8');
const start=s.indexOf('  async scheduled(event, env222222, ctx) {'),end=s.indexOf('  async fetch(req, env222222, ctx) {',start);
if(start<0||end<0||!s.slice(start,end).includes("title: \"It's still your turn!\""))throw Error('Scheduled handler guard');
s=s.slice(0,start)+"  async scheduled(event, env222222, ctx) {\n    ctx.waitUntil(runOhanaInactivityReminders(env222222.DB).catch(error=>console.error('Ohana friendly reminder failed',error.message)));\n  },\n"+s.slice(end);
const anchor='      if (!saved.meta.changes) throw new Error("The table changed. Please refresh and try again.");\n      if (!res.over && players[res.next] === BOT_ID)';
if(s.split(anchor).length!==2)throw Error('Successful human move guard');
s=s.replace(anchor,'      if (!saved.meta.changes) throw new Error("The table changed. Please refresh and try again.");\n      await recordOhanaGameActivity(db,me.id,st.lastPlay.at).catch(error=>console.warn("Game activity tracking failed",error.message));\n      if (!res.over && players[res.next] === BOT_ID)');
const marker='var worker_default = {';if(s.split(marker).length!==2)throw Error('Worker marker');
s=s.replace(marker,fs.readFileSync(path.join(__dirname,'reminder.js'),'utf8')+'\n'+marker);
fs.writeFileSync(path.join(__dirname,'worker.js'),s);console.log(JSON.stringify({bytes:Buffer.byteLength(s),delta:Buffer.byteLength(s)-fs.statSync(input).size}));

