/* Opt-in presentation component. No game, network, storage or puzzle-state access. */
(()=>{'use strict';
 const TEMPLATE='__SIGN_TEMPLATE__',NS='http://www.w3.org/2000/svg',W=2143,TOP=330,MIDDLE=270,BOTTOM=134,BASE=734;
 const FONT="Fredoka, 'Arial Rounded MT Bold', Arial, sans-serif",controllers=new WeakMap();let serial=0;
 const node=(tag,attrs={})=>{const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
 const set=(e,values)=>{if(e)for(const[k,v]of Object.entries(values))e.style.setProperty(k,v,'important');};
 function fitLines(text,font,width,ctx){const measure=s=>{ctx.font='900 '+font+'px '+FONT;return ctx.measureText(s).width;},words=String(text).split(/\s+/u).filter(Boolean),lines=[];let line='';
  for(const word of words){if(measure(line?line+' '+word:word)<=width){line=line?line+' '+word:word;continue;}if(line){lines.push(line);line='';}if(measure(word)<=width){line=word;continue;}for(const char of word){if(line&&measure(line+char)>width){lines.push(line);line='';}line+=char;}}
  if(line)lines.push(line);return lines.length?lines:[''];
 }
 function artwork(text,pixels,id){const ctx=document.createElement('canvas').getContext('2d'),safeWidth=1460;ctx.font='900 260px '+FONT;const measured=ctx.measureText(text).width,minFont=Math.max(112,12*W/pixels),single=Math.min(260,260*safeWidth/Math.max(1,measured)),font=single>=minFont?single:minFont,lines=single>=minFont?[text]:fitLines(text,font,safeWidth,ctx),lineH=font*1.12,centerH=Math.max(MIDDLE,lines.length*lineH+40),H=TOP+centerH+BOTTOM;
  const svg=node('svg',{viewBox:`0 0 ${W} ${H}`,'aria-hidden':'true',focusable:'false','data-unified-sign':'true'});svg.style.cssText='display:block!important;width:100%!important;height:'+Math.max(88,H*pixels/W)+'px!important;overflow:visible!important;pointer-events:none!important';
  const defs=node('defs'),gold=node('linearGradient',{id:id+'gold',x1:0,y1:0,x2:0,y2:1}),stops=[[0,'#fffbd9'],[.28,'#fff0a3'],[.52,'#ffcb37'],[.8,'#ffb719'],[1,'#e58b06']];for(const[o,c]of stops)gold.append(node('stop',{offset:o,'stop-color':c}));defs.append(gold);svg.append(defs);
  // Nine-slice the generated blank template at plain wood: upper brand and lower carvings retain their proportions.
  for(const[y,sourceY,sourceH,targetH]of[[0,0,TOP,TOP],[TOP,TOP,MIDDLE,centerH],[TOP+centerH,TOP+MIDDLE,BOTTOM,BOTTOM]]){const slice=node('svg',{x:0,y,width:W,height:targetH,viewBox:`0 ${sourceY} ${W} ${sourceH}`,preserveAspectRatio:'none',overflow:'hidden'});slice.append(node('image',{href:TEMPLATE,x:0,y:0,width:W,height:BASE,preserveAspectRatio:'none'}));svg.append(slice);}
  const start=TOP+(centerH-lines.length*lineH)/2+font*.86;
  lines.forEach((line,i)=>{for(const[dy,fill,stroke,sw]of[[9,'#6a3109','#502405',8],[3,'#ad620b','#8a4806',7],[0,`url(#${id}gold)`,'#ffe6a1',3]]){const t=node('text',{x:W/2,y:start+i*lineH+dy,'text-anchor':'middle','font-family':FONT,'font-size':font,'font-weight':900,fill,stroke,'stroke-width':sw,'paint-order':'stroke fill'});t.textContent=line;svg.append(t);}});
  return{svg,lines,font,height:H,pixelFont:font*pixels/W};
 }
 function mount(options){const{header,title,home,next,gameType}=options;if(!header||!title||!header.contains(title))return null;
  if(gameType==='ohana10'||header.dataset.game==='ohana10'||header.closest('[data-game-type=ohana10]'))return null;
  if(title.querySelector('button,input,a,select,textarea'))throw Error('Title contains interactive controls; provide the plain title node.');
  if(controllers.has(header))return controllers.get(header);
  const saved={header:header.getAttribute('style'),title:title.getAttribute('style'),home:home?.getAttribute('style'),next:next?.getAttribute('style'),aria:title.getAttribute('aria-label'),children:[...header.childNodes]},id='ohanaSign'+(++serial),originalWordmarks=[...header.querySelectorAll('.room-home-wordmark')].map(e=>[e,e.getAttribute('style')]);
  const titleAnchor=title.parentElement===header?title:[...header.children].find(e=>e.contains(title));saved.anchor=titleAnchor?.getAttribute('style');
  let current='',lastWidth=-1,stopped=false,frame=0,layout=null;header.dataset.unifiedHeader='true';
  const originalName=()=>title.querySelector(':scope>[data-unified-title-source]')?.textContent??title.textContent;
  const draw=(force=false)=>{if(stopped)return;const name=String(originalName()||'').trim();if(!name)return;const width=Math.min(257,Math.max(100,title.clientWidth||240));if(!force&&name===current&&Math.abs(width-lastWidth)<.5&&title.querySelector(':scope>svg[data-unified-sign]'))return;current=name;lastWidth=width;layout=artwork(name,width,id);const source=document.createElement('span');source.hidden=true;source.dataset.unifiedTitleSource='';source.textContent=name;title.replaceChildren(source,layout.svg);title.setAttribute('aria-label',name);header.dataset.unifiedTitle=name;options.onResize?.({header,height:header.getBoundingClientRect().height,title:name});};
  const schedule=()=>{if(frame||stopped)return;frame=requestAnimationFrame(()=>{frame=0;draw();});};
  set(header,{display:'grid','grid-template-columns':'44px minmax(0,1fr) 44px','grid-template-rows':'auto','align-items':'center',gap:'6px',height:'auto','min-height':'100px',padding:'6px','box-sizing':'border-box'});
  set(titleAnchor,{'grid-column':'2','grid-row':'1',display:'block',width:'100%','min-width':'0','max-width':'340px',height:'auto','min-height':'0',padding:'0',margin:'0 auto','justify-self':'center'});
  set(title,{display:'block',width:'100%','min-width':'0',height:'auto',margin:'0',padding:'0','line-height':'0','font-size':'0',overflow:'visible'});
  for(const[e,col]of[[home,1],[next,3]])set(e,{'grid-column':String(col),'grid-row':'1',position:'static',width:'44px','min-width':'44px',height:'44px','min-height':'44px',margin:'0',padding:'0'});
  for(const[e]of originalWordmarks)set(e,{display:'none'});
  const extras=(options.additional||[]).filter(e=>e&&e!==home&&e!==next&&e!==titleAnchor);let tools=null;
  if(extras.length){tools=document.createElement('div');tools.dataset.unifiedTools='';set(tools,{'grid-column':'1 / -1','grid-row':'2',display:'flex','flex-wrap':'wrap','justify-content':'flex-end',gap:'6px','min-width':'0'});for(const e of extras)tools.append(e);header.append(tools);}
  const observer=new MutationObserver(schedule);observer.observe(title,{childList:true,subtree:true});document.fonts?.ready.then(()=>{if(!stopped)draw(true);});const resize=new ResizeObserver(schedule);resize.observe(title);draw(true);
  const api={update(name){title.textContent=String(name);draw(true);},refresh(){draw(true);},get title(){return current;},get layout(){return layout&&{lines:[...layout.lines],pixelFont:layout.pixelFont};},destroy({restoreRemoved=false}={}){const latest=String(originalName()||'').trim();if(latest)current=latest;stopped=true;cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();title.textContent=current;for(const[e,value]of[[header,saved.header],[title,saved.title],[titleAnchor,saved.anchor],[home,saved.home],[next,saved.next],...originalWordmarks])if(e){if(value==null)e.removeAttribute('style');else e.setAttribute('style',value);}if(saved.aria==null)title.removeAttribute('aria-label');else title.setAttribute('aria-label',current);for(const e of saved.children)if(e!==tools&&(restoreRemoved||header.contains(e)))header.append(e);tools?.remove();delete header.dataset.unifiedHeader;delete header.dataset.unifiedTitle;controllers.delete(header);}};controllers.set(header,api);return api;
 }
 window.OhanaUnifiedGameHeader={mount};
})();
