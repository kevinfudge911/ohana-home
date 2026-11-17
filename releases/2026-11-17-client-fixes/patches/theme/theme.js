/* Presentation only. Per-member choice on this browser; no account/game writes. */
(()=>{
 const key=id=>'ohana_seasonal_appearance_v1_'+id;
 const owner=()=>{try{return S?.me?.id&&S?.token?String(S.me.id):'';}catch{return '';}};
 const read=()=>{const id=owner();if(!id)return 'normal';try{return localStorage.getItem(key(id))==='normal'?'normal':'thanksgiving';}catch{return 'thanksgiving';}};
 const sync=()=>{const value=read();if(document.documentElement.dataset.ohanaSeason!==value)document.documentElement.dataset.ohanaSeason=value;};
 window.OhanaHarvest={read,sync,bind(d){const input=d.querySelector('#access-harvest');if(!input)return;const id=owner();let token;try{token=S.token;}catch{}input.checked=read()==='thanksgiving';input.onchange=()=>{if(!d.open||!id||owner()!==id||S.token!==token){input.checked=read()==='thanksgiving';return;}const value=input.checked?'thanksgiving':'normal';try{localStorage.setItem(key(id),value);sync();d.querySelector('#access-harvest-status').textContent=value==='thanksgiving'?'Thanksgiving appearance is on for you on this browser.':'Normal Ohana appearance is on for you on this browser.';}catch{input.checked=read()==='thanksgiving';d.querySelector('#access-harvest-status').textContent='This browser could not remember the change. Your appearance has not changed.';}};}};
 let frame=0;const queue=()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;sync();});};
 new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('storage',e=>{if(e.key?.startsWith('ohana_seasonal_appearance_v1_'))queue();});sync();
})();
