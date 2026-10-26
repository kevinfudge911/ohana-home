// Sanitized host scalars only. The app validates its token before creating this input.
// Scene names alone never identify a game, and inert Music overlays park the underlay.
export function audioHostContext(state={}){
 state=state&&typeof state==='object'?state:{};
 const valid=state.authenticated===true&&Number.isSafeInteger(state.memberId)&&state.memberId>0&&Number.isSafeInteger(state.sessionRevision)&&state.sessionRevision>=0;
 const sessionKey=valid?'member:'+state.memberId+':revision:'+state.sessionRevision:null;
 const scalar=v=>typeof v==='string'||typeof v==='number'&&Number.isFinite(v)?v:null;
 const routeKey=JSON.stringify([sessionKey,...['roomId','roomEpoch','gameId','gameType','gameEntryVisit','puzzleId','tab','activity','recordId','pageId'].map(k=>scalar(state[k])),state.visible===true,state.appInert===true,state.eligible===true]);
 return{sessionKey,routeKey,visible:valid&&state.eligible===true&&state.visible===true&&state.appInert!==true&&state.activity!=='music'&&state.paused!==true,reduced:typeof state.reducedMotion==='boolean'?state.reducedMotion:null};
}
export function createHostAudioGuard({controller,readState}={}){
 if(!controller||typeof readState!=='function')throw Error('Existing controller and sanitized host reader required');let previous=null,destroyed=false;
 return{refresh(){if(destroyed)return null;let state;try{state=readState()||{};}catch{state={};}const next=audioHostContext(state);controller.setSession(next.sessionKey);if(previous&&previous.routeKey!==next.routeKey)controller.reset('host-route-change');if(next.reduced!==null)controller.setReduced(next.reduced);controller.setVisible(next.visible);previous=next;return{...next};},stop(reason='host-stopped'){controller.setVisible(false);controller.audio?.stop(reason);previous=null;},destroy(){if(destroyed)return;destroyed=true;controller.setVisible(false);controller.audio?.stop('host-destroyed');previous=null;}};
}
