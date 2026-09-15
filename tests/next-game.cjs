const fs=require('fs'),assert=require('assert'),{JSDOM}=require('jsdom');
const html=fs.readFileSync('app.html','utf8'),dom=new JSDOM(html,{url:'https://test',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
w.matchMedia=()=>({matches:true});w.fetch=async()=>({ok:true,json:async()=>({})});
w.eval([...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n')+'\n'+fs.readFileSync('tests/fixtures/words-ui.js','utf8')+'\nwindow.run=code=>eval(code);');
(async()=>{
 const d=w.document;w.run('S.game=1;S.gstate=previewGame;S.room=1;renderGame()');assert(d.querySelector('.game-tray .acts #next-game'));
 w.run(`window.opened=[];enterRoom=async id=>{window.opened.push(['room',id]);S.room=id;};openGame=async id=>{window.opened.push(['game',id]);S.game=id;};api=async()=>({allGames:[{id:1,in_game:true,my_turn:true,status:'playing',room_id:1},{id:2,in_game:false,my_turn:true,status:'playing',room_id:1},{id:3,in_game:true,my_turn:true,status:'waiting',room_id:1},{id:4,in_game:true,my_turn:false,status:'playing',room_id:1},{id:5,in_game:true,my_turn:true,status:'playing',room_id:2}]});`);
 await w.run('goToNextGame()');assert.equal(JSON.stringify(w.opened),'[["room",2],["game",5]]');
 w.run('window.opened=[];api=async()=>({allGames:[]});');await w.run('goToNextGame()');assert.equal(w.opened.length,0);assert(d.querySelector('.toast').textContent.includes('caught up'));assert(!d.querySelector('#next-game').disabled);
 w.run('S.movePending=true');await w.run('goToNextGame()');assert.equal(w.opened.length,0);w.run('S.movePending=false;S.placed=[{i:1}]');w.confirm=()=>false;await w.run('goToNextGame()');assert.equal(w.opened.length,0);w.run('S.placed=[]');
 for(const type of ['tictac','memory','checkers']){w.run(`previewGame.type='${type}';previewGame.state=${type==='tictac'?"{board:Array(9).fill(null),chat:[]}":type==='memory'?"{cards:['🐢','🐢'],matched:[],open:[],pending:[],chat:[]}":"{board:Array(64).fill(null),mustContinue:null,chat:[]}"};S.game=1;S.gstate=previewGame;renderGame()`);assert(d.querySelector('#board #next-game'));}
 console.log('PASS: next stays in word controls; fresh joined-turn filtering; room switches before game; no-turn feedback; pending move and draft guards; other boards retain control.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>w.close());
