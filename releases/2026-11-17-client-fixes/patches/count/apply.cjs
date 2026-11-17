const fs=require('fs'),path=require('path');let s=fs.readFileSync(process.argv[2],'utf8');function one(a,b){if(s.split(a).length!==2)throw Error('Nonunique anchor '+a.slice(0,70));s=s.replace(a,b)}
one('function mountHomeWorkstation(m,tabs){',fs.readFileSync(path.join(__dirname,'helpers.js'),'utf8')+'\nfunction mountHomeWorkstation(m,tabs){');
one("const games=(S.sync?.allGames||S.sync?.games||[]).filter(g=>g.in_game&&['playing','waiting'].includes(g.status));",'const games=Array(ohanaHumanTableCount(S.sync,S.me?.id));');
one("dock.append(tools,player);m.append(dock);observeGameRail(dock,'--home-workstation-space');","dock.append(tools,player);m.append(dock);void paintOhanaHumanGameCount(count);observeGameRail(dock,'--home-workstation-space');");
one('    S.sig = sig;','    S.sig = sig;\n    void paintOhanaHumanGameCount();');
one("Object.assign(ohanaClassicListing,{owner,at:0,value:null,pending:null});","Object.assign(ohanaClassicListing,{owner,at:0,value:null,pending:null,error:false});");
one("const pending=PP.bridge('GET','classic').then(r=>{const s=r.state;", "const requestRoom=S.room,requestRoomEpoch=S.roomEpoch;const pending=PP.bridge('GET','classic').then(r=>{if(ohanaClassicListing.owner===owner)ohanaClassicListing.error=false;const s=r.state;");
one("?{players:s.players,turn:s.turn,actor:r.actor}:null;}).catch(()=>null);", "?{players:s.players,turn:s.turn,actor:r.actor}:null;}).catch(()=>{if(ohanaClassicListing.owner===owner)ohanaClassicListing.error=true;return null;});");
one("ohanaClassicListing.at=Date.now();ohanaClassicListing.pending=null;}return", "ohanaClassicListing.at=Date.now();ohanaClassicListing.pending=null;ohanaClassicListing.room=requestRoom;ohanaClassicListing.roomEpoch=requestRoomEpoch;paintOhanaHumanGameCount();}return");
fs.writeFileSync(process.argv[3],s);
