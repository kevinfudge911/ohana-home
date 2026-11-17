const fs=require('fs'),path=require('path');let s=fs.readFileSync(process.argv[2],'utf8');function one(a,b){if(s.split(a).length!==2)throw Error('Nonunique anchor '+a.slice(0,80));s=s.replace(a,b)}
one("safe(){try{if(document.querySelector('dialog[open]'))return false;","safe(){try{if(document.hidden||Date.now()-this.back<5000||Date.now()-(this.interaction||0)<5000||document.querySelector('dialog[open]'))return false;");
one("return lobby||Date.now()-this.back<20000;","return lobby&&!S.granny&&!S.colorBook&&!PZ.lobby&&!S.movePending&&!document.querySelector('#pp-frame')&&S.tab==='games'&&(!S.gameShelf||S.gameShelf==='mine');");
one('function render() {',fs.readFileSync(path.join(__dirname,'home-refresh.js'),'utf8')+'\nfunction render() {');
one("if (!S.game && !PZ.id && sig !== S.sig && S.tab !== 'chat' && !S.avatarEditing && S.tab!=='rooms' && S.tab!=='settings') render();","if (!S.game && !PZ.id && !S.granny && !S.colorBook && !PZ.lobby && !document.querySelector('#pp-frame') && (sig !== S.sig||S.homeRefreshPending) && S.tab !== 'chat' && !S.avatarEditing && S.tab!=='rooms' && S.tab!=='settings' && !refreshOhanaHomeInPlace()) render();");
one("else if (S.token) sync().then(() => { if (!S.game) render(); }).catch(() => {});","else if (S.token) sync().catch(() => {});");
one("render(); if (S.token) { await sync(); render(); setupPush(); }","render(); if (S.token) { await sync(); setupPush(); }");
one('sync().then(render); render(); }', 'sync().catch(()=>{}); render(); }');
// Every game read is scoped to identity, room and the exact visit, not merely a reused table ID.
one('const wordDraftReadContext={token:S.token,member:S.me?.id,room:S.room};','const wordDraftReadContext={token:S.token,member:S.me?.id,room:S.room,roomEpoch:S.roomEpoch,visit:S.gameEntryVisit};\n  const readCurrent=()=>S.game===gameId&&readEpoch===S.gameReadEpoch&&S.token===wordDraftReadContext.token&&S.me?.id===wordDraftReadContext.member&&S.room===wordDraftReadContext.room&&S.roomEpoch===wordDraftReadContext.roomEpoch&&S.gameEntryVisit===wordDraftReadContext.visit;');
one('if(S.game!==gameId||readEpoch!==S.gameReadEpoch)return;','if(!readCurrent())return;');
one("await preparePrivateWordDraftStorage();if(S.game!==gameId||readEpoch!==S.gameReadEpoch||S.token!==wordDraftReadContext.token||S.me?.id!==wordDraftReadContext.member||S.room!==wordDraftReadContext.room)return;", "await preparePrivateWordDraftStorage();if(!readCurrent())return;");
one("setTimeout(() => {if(S.game===d.id&&!S.autoAdvancePending", "setTimeout(() => {if(readCurrent()&&S.game===d.id&&!S.autoAdvancePending");
one('setTimeout(() => celebrate(lastMove.score, taunt + (lastMove.note ? " " + lastMove.note : ""),lastMove.p,(lastMove.words||[]).map(w=>w.word)), 600);', 'setTimeout(() => {if(readCurrent())celebrate(lastMove.score, taunt + (lastMove.note ? " " + lastMove.note : ""),lastMove.p,(lastMove.words||[]).map(w=>w.word));}, 600);');
one('} catch (e) {if(S.game!==gameId)return;if(readEpoch===S.gameReadEpoch', '} catch (e) {if(!readCurrent())return;if(readEpoch===S.gameReadEpoch');
one('setTimeout(()=>OhanaFresh.check(),6000);',"for(const type of ['pointerdown','keydown','scroll'])document.addEventListener(type,()=>{OhanaFresh.interaction=Date.now();},{capture:true,passive:true});\nsetTimeout(()=>OhanaFresh.check(),6000);");
fs.writeFileSync(process.argv[3],s);
