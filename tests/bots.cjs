const fs=require('fs'),vm=require('vm'),assert=require('assert');
let src=fs.readFileSync('worker.js','utf8').replace(/^import (\w+) from .*;$/gm,'const $1=null;').replace(/^import .*;$/gm,'').replace(/export\s*\{[\s\S]*?\};\s*$/,'');
const engine=fs.readFileSync('mahjong.js','utf8').replaceAll('export function','function');
const c=vm.createContext({console,structuredClone,URL,Response});vm.runInContext(engine+'\n'+src,c);
const players=[5,-1],db={prepare:()=>({bind:(word)=>({first:async()=>c.BOT_WORDS?.includes(word)?{}:{}})})};
(async()=>{
for(const difficulty of ['easy','medium','hard'])for(const type of ['tictac','memory','checkers','mahjong','words']){
 const st=c.initState(type,players,42,'classic');st.bot={difficulty,memory:{}};
 const move=await c.chooseBotMove(type,st,players,1,db,()=>.2);
 const res=await c.applyMove(type,st,players,1,move,db);assert.equal(typeof res.over,'boolean',type);
 console.log('PASS: legal '+difficulty+' computer move in '+type);
}
const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function humanPaths(board){assert(!lines.some(l=>l.every(i=>board[i]==='X')),'Hard must prevent every human win');if(lines.some(l=>l.every(i=>board[i]==='O'))||board.every(Boolean))return;for(let i=0;i<9;i++)if(!board[i]){const b=[...board];b[i]='X';assert(!lines.some(l=>l.every(j=>b[j]==='X')));if(b.some(v=>!v))b[c.hardTicTac(b,'O')]='O';humanPaths(b);}}
humanPaths(Array(9).fill(null));console.log('PASS: Hard tic-tac-toe never loses across every human continuation.');
let st=c.memInit(players,42);st.bot={difficulty:'easy',memory:{}};
const a=await c.chooseBotMove('memory',st,players,1,{},()=>.3);st.cards.reverse();const b=await c.chooseBotMove('memory',st,players,1,{},()=>.3);assert.equal(a.i,b.i,'hidden card identities must not affect choices');
st.open=[4];c.rememberBotCards(st);assert.deepEqual(Object.keys(st.bot.memory),['4']);
for(let i=0;i<8;i++){st.open=[i];c.rememberBotCards(st);}assert(Object.keys(st.bot.memory).length<=4);
console.log('PASS: memory computer cannot peek; Easy remembers at most four revealed cards.');
let t=c.tttInit();t.board=['X','X',null,'O',null,null,null,null,null];t.bot={difficulty:'medium'};
assert.equal((await c.chooseBotMove('tictac',t,players,1,{},()=>.1)).i,2);
assert.notEqual((await c.chooseBotMove('tictac',t,players,1,{},()=>.9)).i,2);
console.log('PASS: Medium can spot a threat but does not always block perfectly.');
})().catch(e=>{console.error(e);process.exitCode=1});
(async()=>{
const state=c.tttInit();state.board[0]='X';state.bot={difficulty:'easy',memory:{}};
let record={id:900,type:'tictac',players:'[5,-1]',turn:1,status:'playing',state:JSON.stringify(state)};
let writes=0;
const DB={prepare:sql=>({bind:(...args)=>({first:async()=>({...record}),run:async()=>{assert(sql.includes('AND state=?'));assert.equal(args.at(-1),record.state);record={...record,state:args[0],turn:args[1],status:args[2]};writes++;return {meta:{changes:1}};}})})};
c.notifyMembers=async()=>{};await c.advanceBot({DB},900);assert.equal(writes,1);assert.equal(record.turn,0);assert.equal(JSON.parse(record.state).board.filter(x=>x==='O').length,1);
console.log('PASS: background computer turn persists one legal move atomically and returns control to the human.');
})().catch(e=>{console.error(e);process.exitCode=1});
