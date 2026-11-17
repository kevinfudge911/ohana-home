// Semantic, nonvisual jigsaw controls. Server remains authoritative for placement.
function pzAccessBrowseStart(value,length){const n=Number(value)-1;return Number.isSafeInteger(n)&&n>=0&&n<length?n:0;}
function pzAccessDescribe(pc){
 if(!pc)return 'No piece selected.';
 const m=PZ.data.meta,group=PZ.data.pieces.filter(q=>q.g===pc.g),edges=[];
 if(pc.r===0)edges.push('top');if(pc.r===m.rows-1)edges.push('bottom');if(pc.c===0)edges.push('left');if(pc.c===m.cols-1)edges.push('right');
 return 'Piece '+(pc.i+1)+'. '+(edges.length?edges.join(' and ')+' straight edge. ':'Interior piece. ')+(group.length>1?'Joined group of '+group.length+' pieces. ':'')+(pc.l?'Already placed.':group.some(pzHeldByOther)?'Held by another player.':pc.tray?'In sorting tray.':'Available.')+' All pieces stay upright; rotation is not used in this puzzle.';
}
function pzAccessSay(text){const el=document.getElementById('pz-access-status');if(el)el.textContent=text;}
function pzAccessCurrent(a){return !!a&&PZ.access===a&&a.puzzle===PZ.id&&a.data===PZ.data&&a.member===S.me?.id&&a.session===S.token;}
function pzAccessCancel(a){
 if(!pzAccessCurrent(a))return false;
 if(a.pending){pzAccessSay('A placement has already been sent. Wait for confirmation; it cannot be cancelled here.');return false;}
 const i=PZ.carry?.p??PZ.drag?.p??PZ.strip?.lift,pc=PZ.data.pieces[i];
 if(!pc||pc.l||PZ.data.pieces.some(q=>q.g===pc.g&&pzHeldByOther(q))){pzAccessSay('No piece held by you can be released.');return false;}
 pzCancelHeldPiece(i,true);pzAccessSay('Release requested for the held piece at its current position. The shared table still needs to confirm it.');return true;
}
function pzAccessEvent(m){
 const a=PZ.access;if(!a)return;
 if(m.t==='closed'||m.t==='recount'||m.t==='init'){clearTimeout(a.timer);a.pending=null;if(document.getElementById('pz-access-title'))document.getElementById('pz-dialog')?.close();PZ.access=null;return;}
 if(!pzAccessCurrent(a)||!a.pending)return;
 if(m.t!=='drop'||m.p!==a.pending.p||m.by!==a.member||!m.clientAction||m.clientAction!==a.pending.action||PZ.latestActions?.[m.p]!==m.clientAction)return;
 if(['drop','deny','drop-blocked','stage-denied','tray-deny'].includes(m.t)){
  clearTimeout(a.timer);a.pending=null;
  pzAccessSay(m.t==='drop'?(m.l?'Piece or joined group placed successfully.':m.joined?'Pieces joined successfully.':'Piece moved, but it has not snapped into the picture. Try another position.'): 'Placement was not completed. Another player may be holding this piece or the destination is occupied. Review the piece and try again.');
  document.getElementById('pz-access-place')?.removeAttribute('disabled');
 }
}
function pzAccessPlace(index,row,col,a=PZ.access){
 if(!pzAccessCurrent(a)||a.pending)return false;
 const d=PZ.data,pc=d?.pieces[index];
 if(!pc||pc.l||d.pieces.some(q=>q.g===pc.g&&pzHeldByOther(q))){pzAccessSay('This piece is already placed or held by another player. Choose another piece.');return false;}
 if(!Number.isInteger(row)||!Number.isInteger(col)||row<1||row>d.meta.rows||col<1||col>d.meta.cols){pzAccessSay('Choose a row from 1 to '+d.meta.rows+' and a column from 1 to '+d.meta.cols+'.');return false;}
 if(PZ.mode==='ws'&&PZ.ws?.readyState!==1){pzAccessSay('The puzzle is reconnecting. Wait, then try again.');return false;}
 if(PZ.drag||PZ.carry||PZ.strip?.lift!=null){pzAccessSay('Finish or cancel the piece you are already holding first.');return false;}
 const x=Math.round((col-1)*d.meta.w/d.meta.cols),y=Math.round((row-1)*d.meta.h/d.meta.rows);
 a.pending={p:index};document.getElementById('pz-access-place')?.setAttribute('disabled','');pzAccessSay('Placing piece '+(index+1)+'. Waiting for the shared table.');
 // No optimistic mutation and no auto-solve. Existing server checks holds, groups,
 // collisions and snap tolerance. Sorting-tray pieces use the existing exit action.
 if(pc.tray)pzSend({t:'tray-out',p:index,x:pc.x,y:pc.y});
 const action={t:'drop',p:index,x,y,looseView:!!PZ.trayHidden};pzSend(action);a.pending.action=action.clientAction;
 a.timer=setTimeout(()=>{if(!pzAccessCurrent(a)||!a.pending)return;a.pending=null;pzAccessSay('Confirmation has not arrived. Check the selected piece before trying again; the shared table may still update.');document.getElementById('pz-access-place')?.removeAttribute('disabled');},12000);
 return true;
}
function pzAccessDialog(){
 if(!PZ.data)return;
 if(!pzAccessCurrent(PZ.access)&&PZ.access?.timer)clearTimeout(PZ.access.timer);
 const d=PZ.data,first=d.pieces.find(q=>!q.l&&!pzHeldByOther(q))||d.pieces[0];
 if(!pzAccessCurrent(PZ.access))PZ.access={puzzle:PZ.id,data:PZ.data,member:S.me?.id,session:S.token,pending:null,index:first?.i||0};
 const a=PZ.access;
 pzDialog(`<h2 id="pz-access-title">Play puzzle without dragging</h2><p>Choose a piece, choose a destination, then Place piece. Rows run top to bottom; columns run left to right. Joined pieces move together. Your shared progress is saved normally. Optional location clues reveal the correct destination as accessibility assistance; they do not place anything. Closing this panel does not cancel a placement already submitted. All pieces stay upright; no rotation is needed.</p><label for="pz-access-piece">Piece number, 1 to ${d.pieces.length}</label><input id="pz-access-piece" type="number" inputmode="numeric" min="1" max="${d.pieces.length}" value="${PZ.access.index+1}"><div class="pz-dlg-grid"><button id="pz-access-prev">Previous available piece</button><button id="pz-access-next">Next available piece</button><button id="pz-access-read">Describe selected piece</button><button id="pz-access-clue">Read location clue (assistance)</button></div><p id="pz-access-description"></p><label for="pz-access-row">Destination row, 1 to ${d.meta.rows}</label><input id="pz-access-row" type="number" inputmode="numeric" min="1" max="${d.meta.rows}" value="1"><label for="pz-access-col">Destination column, 1 to ${d.meta.cols}</label><input id="pz-access-col" type="number" inputmode="numeric" min="1" max="${d.meta.cols}" value="1"><button id="pz-access-place">Place piece at chosen row and column</button><button id="pz-access-release">Release my held piece</button><p id="pz-access-status" role="status" aria-live="polite" aria-atomic="true"></p>`,dlg=>{
  dlg.setAttribute('aria-labelledby','pz-access-title');dlg.addEventListener('close',()=>dlg.removeAttribute('aria-labelledby'),{once:true});
  const input=dlg.querySelector('#pz-access-piece'),row=dlg.querySelector('#pz-access-row'),col=dlg.querySelector('#pz-access-col');
  const selected=()=>pzAccessCurrent(a)?a.data.pieces[Number(input.value)-1]:null;
  const describe=()=>{if(!pzAccessCurrent(a))return;const pc=selected(),text=pzAccessDescribe(pc);dlg.querySelector('#pz-access-description').textContent=text;pzAccessSay(text);};
  input.oninput=describe;input.onchange=describe;dlg.querySelector('#pz-access-read').onclick=describe;
  for(const [id,step] of [['prev',-1],['next',1]])dlg.querySelector('#pz-access-'+id).onclick=()=>{if(!pzAccessCurrent(a))return;if(a.pending){pzAccessSay('Wait for placement confirmation first.');return;}const pieces=PZ.data.pieces,start=pzAccessBrowseStart(input.value,pieces.length);for(let k=1;k<=pieces.length;k++){const i=(start+step*k+pieces.length)%pieces.length,q=pieces[i];if(!q.l&&!pieces.some(p=>p.g===q.g&&pzHeldByOther(p))){input.value=String(i+1);describe();return;}}pzAccessSay('No available unplaced pieces.');};
  dlg.querySelector('#pz-access-clue').onclick=()=>{if(!pzAccessCurrent(a))return;const pc=selected();pzAccessSay(pc?'Location clue: piece '+(pc.i+1)+' belongs in row '+(pc.r+1)+', column '+(pc.c+1)+'. Enter that destination to place it.':'Choose a valid piece number.');};
  dlg.querySelector('#pz-access-place').onclick=()=>pzAccessPlace(Number(input.value)-1,Number(row.value),Number(col.value),a);
  dlg.querySelector('#pz-access-release').onclick=()=>pzAccessCancel(a);
  describe();if(PZ.access.pending){dlg.querySelector('#pz-access-place').disabled=true;pzAccessSay('Placement is awaiting confirmation. Closing this panel does not cancel a submitted placement.');}input.focus();
 });
}
