const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
let listener,dialogs=[],queue=[],stack=[{ohanaScreen:true,game:42}],index=0,observer,lastUrl='https://audit.invalid/';
class D{
 constructor(label='Home'){this.open=false;this.isConnected=true;this.dataset={};this.label=label;this.events={};const listeners=[];this.homeButton={getAttribute:()=>this.label,textContent:this.label,hasAttribute:()=>false,addEventListener(n,f,capture){listeners.push({n,f,capture})},click(){for(const l of listeners.filter(x=>x.n==='click'&&x.capture))l.f();this.onclick?.();for(const l of listeners.filter(x=>x.n==='click'&&!x.capture))l.f();}};}
 querySelectorAll(){return[this.homeButton];}
 querySelector(){return this.extraInjected?{closest:()=>({remove:()=>{this.extraInjected=false;}})}:null;}
 addEventListener(n,f){(this.events[n]??=[]).push(f);}
 emit(n,e={preventDefault(){}}){for(const f of this.events[n]||[])f(e);}
 showModal(){this.open=true;if(!dialogs.includes(this))dialogs.push(this);}
 show(){this.showModal();}
 close(){this.open=false;queue.push(()=>this.emit('close'));}
 nativeFormClose(){this.open=false;this.emit('close');}
}
const doc={body:{},querySelectorAll(){return dialogs.filter(d=>d.open&&!d.inShadow)},createElement(){throw Error('Existing Home control was not recognized');}};
const history={get state(){return stack[index]},pushState(s){stack.splice(++index);stack.push(s)},replaceState(s,t,url){stack[index]=s;if(url)lastUrl=url;},back(){if(index===0)return;index--;let stopped=false;listener({state:stack[index],stopImmediatePropagation(){stopped=true}});return stopped}};
const ctx={window:{addEventListener(n,f){if(n==='popstate')listener=f}},HTMLDialogElement:D,document:doc,history,URL,location:{href:'https://audit.invalid/?ohana-nav-preview=1'},MutationObserver:class{constructor(f){observer=f}observe(){}disconnect(){}},queueMicrotask:f=>queue.push(f),Date,roomHomeControl(){throw Error('Unexpected duplicate Home');},goHomePorch(){}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/module.js','utf8'),ctx);
const flush=()=>{let n=0;while(queue.length){if(++n>100)throw Error('Loop');queue.shift()();}};
let a=new D('Back to Ohana Home');a.showModal();assert.equal(stack.length,2);assert.equal(stack[index].game,42);observer();observer();assert.equal(stack.length,2,'rerenders do not push');a.extraInjected=true;observer();assert(!a.extraInjected,'late original Home removes injected duplicate');let b=new D();b.showModal();history.back();flush();assert(!b.open);assert(a.open);assert.equal(stack[index].game,42);history.back();flush();assert(!a.open);assert.equal(index,0);assert.equal(stack[index].game,42,'game stays in current entry');
a=new D();a.showModal();a.close();flush();assert.equal(index,0);a.showModal();assert.equal(index,1);a.nativeFormClose();flush();assert.equal(index,0,'method=dialog close consumes entry');a.showModal();let prevented=false;a.emit('cancel',{preventDefault(){prevented=true}});flush();assert(prevented);assert.equal(index,0,'native Escape consumes entry');
a.showModal();a.close();a.showModal();flush();assert(a.open,'old close event cannot close reopened dialog');assert.equal(index,2,'reopen has own entry');a.close();flush();assert.equal(index,0,'stale entries are skipped');
a=new D();a.showModal();b=new D();b.showModal();a.close();flush();assert(b.open);b.close();flush();assert.equal(index,0,'closed lower dialog entry skipped');
a=new D();a.inShadow=true;a.showModal();history.back();flush();assert(!a.open,'Back closes registered shadow dialog');assert.equal(index,0);assert.equal(stack[index].game,42);
a=new D();a.showModal();a.homeButton.onclick=()=>a.close();a.homeButton.click();flush();assert.equal(stack[index].game,null,'existing Home does not queue Back to game');assert(!stack[index].ohanaOverlayNav);assert.equal(index,1,'existing Home consumes current overlay marker without back navigation');
assert.equal(history.back(),false,'Back after Home is not trapped by overlay handler');assert.equal(history.back(),undefined,'browser boundary stays native');console.log('PASS existing branded Home recognition and click, game state preserved, nested and Shadow DOM Back, rerender dedupe, Close, form-dialog close, Escape, rapid reopen, stale entries and native boundary');
stack[0]={ohanaMemories:true,room:1,album:'test'};ctx.location.href='https://audit.invalid/memories?room=1';a=new D();a.showModal();a.homeButton.onclick=()=>a.close();a.homeButton.click();flush();assert.equal(stack[index].ohanaMemories,undefined);assert.equal(lastUrl,'/','Home clears Memories URL and state');console.log('PASS Home clears inherited Memories route marker and URL');

