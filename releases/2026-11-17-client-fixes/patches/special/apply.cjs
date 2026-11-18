const fs=require('fs'),p=require('path');
const [src,dst]=process.argv.slice(2); let s=fs.readFileSync(src,'utf8');
const marker='<style id="ohana-thanksgiving-theme">', music='shadow.append(musicHeaderStyle);';
if(s.split(marker).length!==2||s.split(music).length!==2||s.includes('ohana-harvest-special-rooms-v1'))throw Error('Special-room guard mismatch');
s=s.replace(marker,'<style id="ohana-harvest-special-rooms-v1">'+fs.readFileSync(p.join(__dirname,'rooms.css'),'utf8')+'</style>\n'+marker);
s=s.replace(music,music+'\nconst harvestMusicStyle=document.createElement("style");harvestMusicStyle.id="ohana-harvest-music-v1";harvestMusicStyle.textContent='+JSON.stringify(fs.readFileSync(p.join(__dirname,'music.css'),'utf8'))+';shadow.append(harvestMusicStyle);const syncHarvestMusic=()=>{host.dataset.ohanaSeason=document.documentElement.dataset.ohanaSeason==="thanksgiving"?"thanksgiving":"normal";};new MutationObserver(syncHarvestMusic).observe(document.documentElement,{attributes:true,attributeFilter:["data-ohana-season"]});syncHarvestMusic();');
fs.writeFileSync(dst,s);
