const fs=require('fs'),path=require('path');
function replace(s,a,b){if(s.split(a).length!==2)throw Error('Anchor mismatch '+a.slice(0,80));return s.replace(a,b);}
function server(s){s="import {savedRoute} from './saved.mjs';\n"+s;return replace(s,'  try {\n    if (!validMember(me) || !path.startsWith(PATH)) return notFound();',`  try {
    if (req.method === 'GET' && ['saved','game/saved-solo','game/saved-room'].includes(path.slice(PATH.length)) && path.startsWith(PATH)) {
      if (!validMember(me) || !await momoAllowed(env,me)) return notFound();
      const db=env.DB.withSession?env.DB.withSession('first-primary'):env.DB;
      return await savedRoute({db,env,me,sub:path.slice(PATH.length),objectKey:GAME_OBJECT});
    }
    if (!validMember(me) || !path.startsWith(PATH)) return notFound();`);}
function app(s){
 s=replace(s,'async open(isCurrent=()=>true){','async open(isCurrent=()=>true,savedMode=null){');
 s=replace(s,"fetch('/api/pp/game',{headers:","fetch('/api/pp/'+(savedMode==='solo'?'game/saved-solo':savedMode==='room'?'game/saved-room':'game'),{headers:");
 s=replace(s,'function mountOhanaHomeGames(main,table,nook){',fs.readFileSync(path.join(__dirname,'helpers.js'),'utf8')+'\nfunction mountOhanaHomeGames(main,table,nook){');
 s=replace(s,"ohanaAppendClassicListing(section.querySelector('.ohana-home-game-rows'),ohanaOpenClassicListing);","ohanaAppendClassicListing(section.querySelector('.ohana-home-game-rows'),ohanaOpenClassicListing);ohanaAppendJourneyListing(section.querySelector('.ohana-home-game-rows'),ohanaOpenJourneyListing);");
 s=replace(s,"dialog.append(list,back);ohanaAppendClassicListing", "dialog.append(list,back);ohanaAppendJourneyListing(list,async(mode)=>{const current=bridgeGameContext();await bridgeDismissForGameExit(dialog,current);if(!current.valid())return;await OhanaBridgeChildren.openRoute('activity',bridge,()=>ohanaOpenJourneyListing(mode));});ohanaAppendClassicListing");
 return s;
}
module.exports={server,app};
