const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const worker=fs.readFileSync('live/worker.js','utf8'),html=fs.readFileSync(process.env.OHANA_TEST_APP||path.join('live',worker.match(/^import APP_HTML from "\.\/(.*?)";/m)[1]),'utf8');
const section=(start,end)=>{const a=html.indexOf(start),b=html.indexOf(end,a);assert(a>=0&&b>a);return html.slice(a,b)};
const render=section('function renderWords(st, g, myTurn) {','// Compact Ohana confirmations;');
const drafts=section("const WORD_DRAFT_STORAGE_PREFIX=",'function wordDraftReviewState(');
const place=section('function placeDraftTile(', 'function positionWordTray(');
const drag=section('function initDragDrop(', 'function initWordRackPinch(');
let cases=0;
function fixture({turn=0,inGame=true,status='playing'}={}){
 const dom=new JSDOM('<!doctype html><div id="game"><div id="board"></div></div>',{url:'https://fictional.test',runScripts:'outside-only'}),w=dom.window;
 w.scrollBy=w.scrollTo=()=>{};w.requestAnimationFrame=()=>1;w.cancelAnimationFrame=()=>{};w.setTimeout=()=>1;
 w.eval(`let S={me:{id:101},token:'fictional-token',room:1,game:501,placed:[],sel:null,swapSel:[],swapMode:false,wordOrder:[],wordDraftStorageScope:'fictional',wordDraftStorageToken:'fictional-token',wordDraftStorageMember:'101'};
 const $=s=>document.querySelector(s),esc=s=>String(s),dmAttr=()=>'',avOf=()=>'',nameOf=()=>'',LV=Object.fromEntries([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ?'].map(c=>[c,1]));let dragState=null,suppressTileClickUntil=0;
 const AudioSys={tileDrop(){},tilePickup(){},getCtx(){return null}},cancelWordDrag=()=>{},positionWordTray=()=>{},calcPreviewScore=()=>({total:0,words:[]}),wordBoardSurface=()=>'',renderPlayBreakdown=()=>'',initBoardZoom=()=>{},initWordRackPinch=()=>{},mountWorldGame=()=>{},mountGameControlDock=()=>{},addNextGameControl=()=>{},runLastReveal=()=>{},showBlankLetterPicker=()=>{},submitPrivateWordDraft=()=>{throw Error('No real submit')},move=()=>{throw Error('No real move')};
 ${drafts}${place}${drag}${render}
 window.fx={get S(){return S},render:(st,g,my)=>renderWords(st,g,my),reload(){S={...S,wordDrafts:null,wordDraftContext:null,placed:[],sel:null,wordOrder:[]}}};`);
 const st={board:Array(225).fill(null),bonus:Array(225).fill(''),lastMove:[],racks:{101:['A','A','?','T','E','R','S']},scores:{101:4,202:7},bag:20},g={id:501,room_id:1,type:'words',status,in_game:inGame,players:[101,202],turn,state:st};st.board[111]={l:'H',v:4};
 const call=()=>w.fx.render(st,g,turn===0);call();const s=w.fx.S;s.wordOrder=[6,3,1,0,2,5,4];s.placed=[{i:112,l:'A',blank:false,rackIdx:1},{i:113,l:'Q',blank:true,rackIdx:2},{i:114,l:'T',blank:false,rackIdx:3}];s.sel=null;call();
 return {dom,w,st,g,call,cell:i=>w.document.querySelector('.c[data-i="'+i+'"]'),rack:k=>w.document.querySelector('.rt[data-r="'+k+'"]')};
}
for(const turn of [0,1]){const f=fixture({turn}),before=JSON.stringify(f.st),order=JSON.stringify(f.w.fx.S.wordOrder);f.cell(112).click();assert.deepEqual(Array.from(f.w.fx.S.placed,p=>p.rackIdx),[2,3]);assert(!f.rack(1).classList.contains('used'));assert.equal(JSON.stringify(f.w.fx.S.wordOrder),order);assert.equal(JSON.stringify(f.st),before);assert.equal(f.w.document.activeElement,f.rack(1));f.w.fx.reload();f.call();assert.deepEqual(Array.from(f.w.fx.S.placed,p=>p.rackIdx),[2,3]);assert.equal(JSON.stringify(f.w.fx.S.wordOrder),order);cases+=2;f.dom.window.close();}
for(const key of ['Enter',' ']){const f=fixture();assert.equal(f.cell(113).getAttribute('aria-label'),'Return blank Q to your tray');f.cell(113).dispatchEvent(new f.w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));assert.deepEqual(Array.from(f.w.fx.S.placed,p=>p.rackIdx),[1,3]);assert.equal(f.rack(2).querySelector('.tile-glyph').textContent,'');cases++;f.dom.window.close();}
{const f=fixture(),before=JSON.stringify(f.st);f.cell(111).click();assert.equal(f.w.fx.S.placed.length,3);assert(!f.cell(111).hasAttribute('role'));f.cell(115).click();assert.equal(f.w.fx.S.placed.length,3);f.rack(0).click();f.cell(115).click();assert.equal(f.w.fx.S.placed.length,4);assert.equal(JSON.stringify(f.st),before);cases++;f.dom.window.close();}
{const f=fixture();f.rack(1).click();assert.deepEqual(Array.from(f.w.fx.S.placed,p=>p.rackIdx),[2,3]);f.w.fx.S.swapMode=true;f.call();f.cell(113).click();assert.equal(f.w.fx.S.placed.length,2);cases++;f.dom.window.close();}
for(const opts of [{inGame:false},{status:'finished'}]){const f=fixture(opts);assert.equal(f.w.fx.S.placed.length,0);assert.equal(f.w.document.querySelectorAll('.c[role="button"]').length,0);cases++;f.dom.window.close();}
{const f=fixture(),cell=f.cell(112),dest=f.cell(120);f.w.document.elementFromPoint=()=>dest;const e={pointerId:1,isPrimary:true,button:0,clientX:10,clientY:10,pointerType:'mouse',preventDefault(){}};cell.onpointerdown(e);cell.onpointermove({...e,clientX:30});cell.onpointerup({...e,clientX:30});assert.equal(f.w.fx.S.placed.find(p=>p.rackIdx===1).i,120);assert.equal(f.w.fx.S.placed.length,3);cases++;f.dom.window.close();}
console.log('PASS '+cases+' fictional Words cases: single/blank/duplicate-letter return, Enter/Space, committed cells, off-turn drafts, reload/order, spectator/finished/swap guards and drag relocation. No production APIs.');
