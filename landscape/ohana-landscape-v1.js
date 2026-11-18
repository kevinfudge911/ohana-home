(function(){
 if(window.ohanaLandscape)return;
 var d=document,writes=0,busy=false,SKIP=[],runs=0,win=0,stopped=false;
 function short(){return innerWidth>innerHeight&&innerHeight<=500;}
 var touched=[];
 var norm=new WeakMap();
 function set(el,o){var m=norm.get(el);if(!m){m={};norm.set(el,m);}for(var k in o){var key=k+'='+o[k],cur=el.style.getPropertyValue(k);if(m[key]!==undefined&&cur===m[key]&&el.style.getPropertyPriority(k)==='important')continue;if(cur===o[k]&&el.style.getPropertyPriority(k)==='important'){m[key]=cur;continue;}el.style.setProperty(k,o[k],'important');var v=el.style.getPropertyValue(k);m[key]=v;writes++;touched.push([el,k,v]);}}
 function undo(){if(!touched.length)return;var t=touched;touched=[];t.forEach(function(x){if(x[0].style.getPropertyValue(x[1])===x[2])x[0].style.removeProperty(x[1]);});}
 function spades(dock){
  dock.querySelectorAll(':scope > .dock-player').forEach(function(r){set(r,{display:'flex','flex-direction':'row','flex-wrap':'nowrap','align-items':'center','overflow-x':'auto','overflow-y':'hidden','scrollbar-width':'none'});});
  dock.querySelectorAll(':scope > .dock-guide').forEach(function(g){set(g,{position:'absolute',top:'1px',right:'64px',left:'auto',width:'auto',height:'16px','min-height':'0','font-size':'12px','line-height':'16px',margin:'0',padding:'0','pointer-events':'none'});});
  dock.querySelectorAll('.dock-player .world-seat').forEach(function(s){
   set(s,{display:'grid','grid-template-columns':'36px auto','grid-template-rows':'20px 36px',height:'58px','min-height':'0','max-height':'58px',width:'auto','min-width':'0','max-width':'none',flex:'0 0 auto',gap:'0 6px',padding:'0',margin:'0','align-items':'center'});
   var p=s.querySelector(':scope > .world-portrait');if(p)set(p,{'grid-column':'1','grid-row':'1 / 3',width:'36px',height:'46px','min-height':'0'});
   var n=s.querySelector('.spades-name-v');if(n)set(n,{'grid-column':'2','grid-row':'1','font-size':'15px','line-height':'20px',height:'20px',width:'auto',margin:'0',padding:'0','white-space':'nowrap'});
   var sc=s.querySelector('.world-plate-score');if(sc)set(sc,{'grid-column':'2','grid-row':'2',display:'flex','flex-direction':'row','flex-wrap':'nowrap','align-items':'center',gap:'6px',height:'36px','min-height':'0',width:'auto',margin:'0',padding:'0'});
   var c=s.querySelector('.spades-cash-score-v');if(c)set(c,{zoom:'0.66',flex:'0 0 auto'});
   var b=s.querySelector('.spades-bags-v');if(b)set(b,{zoom:'0.55',width:'auto',flex:'0 0 auto','flex-wrap':'nowrap'});
   s.querySelectorAll('.spades-detail-v').forEach(function(x){if(!x.textContent.trim())set(x,{display:'none'});});
  });
 }
 function home(dock){
  set(dock,{height:'60px','min-height':'60px','max-height':'60px','padding-top':'2px','padding-bottom':'2px'});
  dock.querySelectorAll(':scope > .dock-player').forEach(function(r){set(r,{height:'56px','min-height':'0','max-height':'56px'});});
  dock.querySelectorAll('.dock-player .world-seat').forEach(function(s){
   set(s,{'grid-template-columns':'46px auto','grid-template-rows':'auto auto',height:'56px','min-height':'0','column-gap':'10px','row-gap':'0','align-items':'center'});
   var p=s.querySelector(':scope > .world-portrait');if(p)set(p,{width:'46px',height:'56px','min-height':'0','grid-row':'1 / 3'});
   var im=p&&p.querySelector('img');if(im)set(im,{width:'46px',height:'56px','max-height':'56px','object-fit':'contain'});
  });
 }
 function fix(){
  if(busy||stopped)return;var now=Date.now();if(now-win>1000){win=now;runs=0;}if(++runs>60){stopped=true;setTimeout(function(){stopped=false;},3000);return;}busy=true;
  try{
   var root=d.documentElement;
   root.classList.toggle('ohana-short-landscape',short());
   if(!short()){undo();return;}
   if(touched.length>4000)touched=touched.slice(-2000);
   var hd=d.getElementById('home-controls-dock');if(hd&&hd.offsetHeight>0)home(hd);
   var dock=d.getElementById('game-controls-dock');
   if(dock&&dock.offsetHeight>0&&!d.getElementById('chs-beach-root')&&SKIP.indexOf(dock.dataset.gameType||'')<0){
    var gm=d.getElementById('game');if(gm)set(gm,{'--ohana-game-header-space':'64px'});
    var sp=dock.dataset.gameType==='spades',H=sp?58:52;
    set(dock,{'grid-template-columns':'max-content minmax(0,1fr)','grid-template-rows':H+'px',height:(H+4)+'px','min-height':(H+4)+'px','max-height':(H+4)+'px','padding-top':'2px','padding-bottom':'2px','padding-left':'4px','padding-right':'60px','column-gap':'8px','row-gap':'0'});
    var cmd=dock.querySelector(':scope > .dock-command-row'),wide=sp&&(!cmd||cmd.offsetHeight<6);
    dock.querySelectorAll(':scope > .dock-player').forEach(function(r){set(r,{'grid-column':wide?'1 / -1':'1','grid-row':'1',width:'auto','max-width':wide?'100%':'48vw',height:H+'px','min-height':H+'px','max-height':H+'px',gap:sp?'2px 16px':'2px 10px','padding-right':'0'});});
    dock.querySelectorAll(':scope > .dock-command-row').forEach(function(r){set(r,{'grid-column':'2','grid-row':'1',width:'100%','min-width':'0'});});
    if(sp)spades(dock);
    else dock.querySelectorAll('.dock-player .world-seat').forEach(function(s){set(s,{'flex-direction':'row',height:'50px','min-height':'0','min-width':'0',gap:'4px'});});
    var rail=Math.ceil(dock.offsetHeight+28)+'px';
    if(root.style.getPropertyValue('--game-rail-space')!==rail){root.style.setProperty('--game-rail-space',rail);writes++;}
   }
  }finally{busy=false;}
 }
 var mo=new MutationObserver(fix);
 function watch(){mo.disconnect();mo.observe(d.documentElement,{attributes:true,attributeFilter:['style','class']});var g=d.getElementById('game');if(g)mo.observe(g,{attributes:true,subtree:true,attributeFilter:['style']});var h=d.getElementById('home-controls-dock');if(h)mo.observe(h,{attributes:true,attributeFilter:['style','class','hidden']});var ap=d.getElementById('app');if(ap)mo.observe(ap,{attributes:true,attributeFilter:['class']});mo.observe(d.body,{childList:true});}
 addEventListener('resize',function(){fix();});
 addEventListener('orientationchange',function(){setTimeout(fix,300);});
 setInterval(function(){watch();fix();},1000);
 watch();fix();
 window.ohanaLandscape={fix:fix,snapshot:function(){return{short:short(),writes:writes};}};
})();
