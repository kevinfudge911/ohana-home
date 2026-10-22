const fs=require('fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const worker=fs.readFileSync('live/worker.js','utf8'),html=fs.readFileSync('live/'+worker.match(/^import APP_HTML(?:_GZIP)? from "\.\/(.*?)";/m)[1].replace(/\.gz$/,''),'utf8');
const bind=html.slice(html.indexOf('function bindGameSetups(root){'),html.indexOf('function gamePlayTime(',html.indexOf('function bindGameSetups(root){')));
const dom=new JSDOM('<!doctype html><dialog data-game-setup-view open></dialog>',{url:'http://fictional.test',runScripts:'outside-only'}),w=dom.window;
w.HTMLDialogElement.prototype.close=function(){this.open=false};
w.eval(`const S=window.S={room:1,sync:{roomId:1,familyName:'Fixture',rooms:[{id:1,name:'Fixture'}]}},gameSetups=window.setups={},esc=String;const calls=window.calls=[];const toast=m=>{throw Error(m)},enterRoom=async()=>{},sync=async()=>{},openGame=async id=>window.opened=id,api=async(p,b)=>{calls.push({p,b});return {id:901}},showSetupInvite=(id,cfg)=>window.invite={id,cfg},bindPictureEntries=()=>{},showGameSetup=()=>{};
${fs.readFileSync('live/shuffle-ui.js','utf8')}
const gameSetupCard=(id,sy,inside)=>shuffleSetupCard(sy,inside);
${bind}
const root=window.root=document.querySelector('dialog');window.setFixtureMode=mode=>{gameSetups.shuffle.mode=mode;root.innerHTML=shuffleSetupCard(S.sync,true);bindGameSetups(root);};root.innerHTML=shuffleSetupCard(S.sync,true);bindGameSetups(root);`);
const d=w.document,root=w.root;
(async()=>{try{
 const choose=(key,value)=>root.querySelector('[data-setup-key='+key+'][data-setup-value="'+value+'"]').click();
 choose('players',6);assert.equal(w.setups.shuffle.players,6);choose('opponent','bot');assert.equal(w.setups.shuffle.players,2);assert.equal(root.querySelector('[data-new]').textContent,'Play Ohana Robot');assert(!root.querySelector('[data-setup-key=players]'));
 w.setFixtureMode('gin');assert.equal(w.setups.shuffle.mode,'gin');assert.equal(w.setups.shuffle.players,2);assert(!root.querySelector('[data-setup-key=mode]'),'Decks mode is chosen before options');
 await root.querySelector('[data-new]').onclick();assert.equal(w.calls.length,1);assert.equal(w.calls[0].b.type,'shuffle');assert.equal(w.calls[0].b.mode,'gin');assert.equal(w.calls[0].b.opponent,'bot');assert.equal(w.calls[0].b.max_players,2);assert.equal(w.opened,901);
 w.setFixtureMode('rummy');choose('opponent','family');choose('players',6);await root.querySelector('[data-new]').onclick();assert.equal(w.calls.length,1,'family setup still uses invitation chooser');assert.equal(w.invite.cfg.players,6);assert.equal(w.invite.cfg.opponent,'family');
 assert(html.includes("(g.type !== 'shuffle' || g.max_players === 2) && g.in_game"));
 console.log('PASS actual setup bindings: robot/family/mode switches, two-seat clamp, keyboard focus, robot create payload/open and unchanged six-seat family chooser.');
}finally{w.close()}})().catch(e=>{console.error(e);process.exitCode=1});
