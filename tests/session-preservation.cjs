const fs=require('fs'),assert=require('assert'),{JSDOM}=require('jsdom');const html=fs.readFileSync('app.html','utf8'),dom=new JSDOM(html,{url:'https://test',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
w.matchMedia=()=>({matches:true});w.fetch=async()=>({ok:true,status:200,json:async()=>({})});
w.eval([...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n')+`\nclearTimeout(pollTimer);schedulePoll=()=>{};S.token='saved-session';localStorage.setItem('ohana_token',S.token);window.testApi=api;window.sessionEval=c=>eval(c);`);
(async()=>{
for(const status of [500,401]){w.fetch=async()=>({ok:false,status,json:async()=>({error:'Please sign in.'})});await assert.rejects(w.testApi('/api/sync'));assert.equal(w.localStorage.getItem('ohana_token'),'saved-session');assert.equal(w.sessionEval('S.token'),'saved-session');}
assert(w.document.querySelector('#session-reconnect'));
w.fetch=async()=>({ok:true,status:200,json:async()=>({ok:true})});await w.testApi('/api/sync');assert(!w.document.querySelector('#session-reconnect'));
w.fetch=async()=>{w.sessionEval("S.token='new-session';localStorage.setItem('ohana_token',S.token)");return {ok:false,status:401,json:async()=>({error:'Please sign in.'})}};await assert.rejects(w.testApi('/api/sync'));assert.equal(w.localStorage.getItem('ohana_token'),'new-session');assert(!w.document.querySelector('#session-reconnect'));
console.log('PASS: server failures and 401 keep saved login; successful retry dismisses notice; stale failures cannot affect a newer session.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>w.close());
