const fs=require('fs');const replace=(s,a,b)=>{if(s.split(a).length!==2)throw Error('Anchor '+a.slice(0,80));return s.replace(a,b)};
function apply(s){
s=replace(s,"const img=portrait?.querySelector('img');if(img)set(img,{width:'44px'","const img=portrait?.querySelector(dock.id==='home-controls-dock'?':scope > img':'img');if(img)set(img,{width:'44px'");
s=replace(s,"count.textContent=String(games.length);","count.textContent=games.length+' active game'+(games.length===1?'':'s');");
s=replace(s,"const seat=player.querySelector('.world-seat');(seat||player).append(count);","const seat=player.querySelector('.world-seat');(seat||player).append(count);const cue=document.createElement('span');cue.className='home-profile-cue';cue.textContent='My character & profile';(seat||player).append(cue);");
s=replace(s,"+'<small>Profile</small></button>'","+'</button>'");
const anchor="    if(dock.id==='pz-workstation')for(const seat of dock.querySelectorAll('.pz-active .world-seat')){";
const patch=`    // Home has one prominent character, not the compact multiplayer score layout.
    if(dock.id==='home-controls-dock')for(const seat of dock.querySelectorAll('.dock-player .world-seat')){
     const compact=innerHeight<=500, portraitSize=compact?'88px':'124px';
     set(seat,{display:'grid','grid-template-columns':portraitSize+' minmax(0,1fr)','grid-template-rows':'auto auto auto',width:'100%','max-width':'480px',flex:'1 1 auto','min-height':portraitSize,height:'auto',gap:'3px 14px','box-sizing':'border-box','align-items':'center'});
     const portrait=seat.querySelector('.world-portrait');if(portrait)set(portrait,{'grid-column':'1','grid-row':'1 / 4',position:'relative',width:portraitSize,height:portraitSize,'min-width':portraitSize,'max-width':portraitSize,'max-height':portraitSize,padding:'0',margin:'0',transform:'none'});
     for(const image of portrait?.querySelectorAll(':scope > img')||[])set(image,{width:'100%',height:'100%','max-width':'100%','max-height':'100%','object-fit':'contain',position:'static',transform:'none'});
     const plate=seat.querySelector('.world-nameplate');if(plate)set(plate,{display:'block','grid-column':'2','grid-row':'1',position:'static',inset:'auto',transform:'none',width:'100%',margin:'0',padding:'0','align-self':'end'});
     const name=plate?.querySelector('b');if(name)set(name,{display:'block',position:'static',inset:'auto',transform:'none',margin:'0',padding:'0','font-size':'22px','line-height':'1.2','white-space':'normal','text-align':'left',color:'#fff4d0'});
     const count=seat.querySelector('.home-game-count');if(count)set(count,{'grid-column':'2','grid-row':'2',position:'static',inset:'auto',transform:'none','font-size':'15px','line-height':'1.3','white-space':'normal','text-align':'left','align-self':'center',color:'#fff4d0'});
     const cue=seat.querySelector('.home-profile-cue');if(cue)set(cue,{'grid-column':'2','grid-row':'3',position:'static','font-size':'15px','line-height':'1.3','text-align':'left','align-self':'start',color:'#a9faff','text-decoration':'underline'});
    }
`;
s=replace(s,anchor,patch+anchor);return s;}
module.exports=apply;if(require.main===module)fs.writeFileSync(process.argv[3],apply(fs.readFileSync(process.argv[2],'utf8')));
