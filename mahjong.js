// Ohana Mahjong: shared stacked-tile rules; a generated solution exists for every deal.
export function mahjongFree(tiles,t) {
  if(t.removed)return false;
  const live=tiles.filter(x=>!x.removed&&x.id!==t.id);
  if(live.some(x=>x.z>t.z&&Math.abs(x.x-t.x)<1&&Math.abs(x.y-t.y)<1))return false;
  const side=dx=>live.some(x=>x.z===t.z&&x.x===t.x+dx&&Math.abs(x.y-t.y)<1);
  return !side(-1)||!side(1);
}
export function mahjongDeal(tiles,random=Math.random) {
  const work=tiles.map(t=>({...t})),pairs=[];
  while(work.some(t=>!t.removed)) {
    const top=Math.max(...work.filter(t=>!t.removed).map(t=>t.z));
    const free=work.filter(t=>t.z===top&&mahjongFree(work,t));
    if(free.length<2)throw new Error('This layout cannot be dealt.');
    const a=free.splice(Math.floor(random()*free.length),1)[0],b=free[Math.floor(random()*free.length)];
    pairs.push([a.id,b.id]);a.removed=b.removed=true;
  }
  const faces=pairs.map((_,i)=>i%12);
  for(let i=faces.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[faces[i],faces[j]]=[faces[j],faces[i]];}
  const byId=new Map(tiles.map(t=>[t.id,t]));
  pairs.forEach(([a,b],i)=>{byId.get(a).face=byId.get(b).face=faces[i];});
  return pairs;
}
export function mahjongInit(players,random=Math.random) {
  const tiles=[];
  for(let z=0;z<2;z++)for(let y=z;y<6-z;y++)for(let x=z;x<8-z;x++)tiles.push({id:tiles.length,x,y,z,face:0,removed:false});
  mahjongDeal(tiles,random);
  return {tiles,scores:Object.fromEntries(players.map(p=>[p,0])),pairs:0,shuffles:0,lastPair:null,revision:0};
}
export function mahjongMove(st,players,turn,move) {
  if(move.revision!==st.revision)throw new Error('The table changed. Pick your tiles again.');
  if(move.action==='shuffle') {
    // Rebuild the remaining stack so even a physically trapped pair can be rescued.
    st.tiles.filter(t=>!t.removed).forEach((t,i)=>{t.z=i<48?0:1;const j=i<48?i:i-48;t.x=t.z+j%(t.z?6:8);t.y=t.z+Math.floor(j/(t.z?6:8));});
    mahjongDeal(st.tiles);st.shuffles++;st.lastPair=null;st.revision++;
    return {over:false,next:turn};
  }
  if(move.action!=='match'||!Array.isArray(move.ids)||move.ids.length!==2||move.ids[0]===move.ids[1])throw new Error('Choose two different matching tiles.');
  const [a,b]=move.ids.map(id=>st.tiles.find(t=>t.id===id));
  if(!a||!b||!mahjongFree(st.tiles,a)||!mahjongFree(st.tiles,b))throw new Error('Use uncovered tiles with a free left or right edge.');
  if(a.face!==b.face)throw new Error('Those treasures do not match.');
  a.removed=b.removed=true;st.pairs++;st.scores[players[turn]]+=10;st.lastPair={face:a.face,player:players[turn],points:10,ids:[a.id,b.id]};st.revision++;
  const over=st.tiles.every(t=>t.removed);
  const best=Math.max(...Object.values(st.scores)),winners=players.filter(p=>st.scores[p]===best);
  return {over,next:(turn+1)%players.length,winner:over?(winners.length===1?winners[0]:'tie'):null};
}
