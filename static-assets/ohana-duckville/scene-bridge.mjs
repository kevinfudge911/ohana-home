/** Positions the existing canonical #app>header; never clones Bridge markup/actions. */
export function mountSceneBridge({header,frame,root=window,document=globalThis.document,sceneWidth=1672,sceneHeight=941,bridgeRect={left:750,top:5,width:300,height:90}}){
 if(!header||!frame)return{dispose(){}};
 if(![sceneWidth,sceneHeight,bridgeRect.width,bridgeRect.height].every(n=>Number.isFinite(n)&&n>0)||![bridgeRect.left,bridgeRect.top].every(n=>Number.isFinite(n)&&n>=0))throw Error('Invalid scene geometry');
 if(bridgeRect.left+bridgeRect.width>sceneWidth||bridgeRect.top+bridgeRect.height>sceneHeight)throw Error('Invalid scene geometry: Bridge outside scene');
 const old=header.getAttribute('style'),oldInert=header.inert;let expanded=false,disposed=false;
 const opener=document.createElement('button'),close=document.createElement('button');opener.type=close.type='button';opener.textContent='';opener.setAttribute('aria-label','Open full-size Ohana Bridge controls');opener.setAttribute('aria-expanded','false');close.textContent='Close Bridge';close.hidden=true;document.body.append(opener,close);
 const put=(el,values)=>{for(const[k,v]of Object.entries(values))el.style.setProperty(k,v,'important')};
 function layout(){if(disposed)return;const r=frame.getBoundingClientRect();const width=Math.min(r.width,Math.max(0,(r.height-170)*(sceneWidth/sceneHeight))),left=r.left+(r.width-width)/2,scale=width/sceneWidth;const x=left+bridgeRect.left*scale,y=r.top+bridgeRect.top*scale,expandedWidth=Math.min(540,r.width,root.innerWidth-16);
  put(header,{position:'fixed',left:(expanded?Math.max(8,r.left+(r.width-expandedWidth)/2):x)+'px',top:(expanded?Math.max(8,r.top):y)+'px',width:(expanded?expandedWidth:bridgeRect.width)+'px',margin:'0','z-index':'1000','transform-origin':'top left',transform:expanded?'none':`scale(${scale})`,background:expanded?'rgba(255,249,232,.97)':'transparent'});
  header.inert=!expanded;put(opener,{position:'fixed',left:x+'px',top:y+'px',width:Math.max(44,bridgeRect.width*scale)+'px',height:Math.max(44,bridgeRect.height*scale)+'px',padding:'0',border:'0',background:'transparent','z-index':'1001',cursor:'pointer'});opener.hidden=expanded;close.hidden=!expanded;put(close,{position:'fixed',left:Math.max(8,r.left+r.width-110)+'px',top:Math.max(8,r.top+150)+'px','min-height':'44px','z-index':'1002'});
 }
 function open(){expanded=true;opener.setAttribute('aria-expanded','true');layout();root.dispatchEvent(new Event('resize'));header.querySelector('[role=button],button')?.focus()}
 function shut(){expanded=false;opener.setAttribute('aria-expanded','false');layout();root.dispatchEvent(new Event('resize'));opener.focus()}
 const key=e=>{if(e.key==='Escape'&&expanded&&!e.target?.closest?.('dialog')&&!document.querySelector('dialog[open]')){e.preventDefault();shut()}};opener.onclick=open;close.onclick=shut;root.addEventListener('resize',layout);root.addEventListener('scroll',layout,true);document.addEventListener('keydown',key);const observer=new ResizeObserver(layout);observer.observe(frame);layout();
 return{dispose(){if(disposed)return;disposed=true;observer.disconnect();root.removeEventListener('resize',layout);root.removeEventListener('scroll',layout,true);document.removeEventListener('keydown',key);opener.remove();close.remove();header.inert=oldInert;if(old===null)header.removeAttribute('style');else header.setAttribute('style',old)}};
}
