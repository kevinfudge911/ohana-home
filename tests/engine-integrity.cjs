const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('worker.js','utf8').replace(/^import (\w+) from .*;$/gm,'const $1=null;').replace(/^import .*;$/gm,'').replace(/export\s*\{[\s\S]*?\};\s*$/,'');
const c=vm.createContext({console,structuredClone});vm.runInContext(fs.readFileSync('mahjong.js','utf8').replaceAll('export function','function')+'\n'+source,c);
const db={prepare:()=>({bind:()=>({first:async()=>({})})})};
(async()=>{
 for(const type of ['tictac','memory'])for(const i of [0.5,NaN,Infinity,-1,100]){const s=c.initState(type,[1,2],123);const before=JSON.stringify(s);await assert.rejects(c.applyMove(type,s,[1,2],0,{i},db));assert.equal(JSON.stringify(s),before);}
 const words=()=>({board:Array(225).fill(null),bonus:Array(225).fill(''),racks:{1:['A','A','T','X'],2:['B']},bag:['E','S','N','R','I','O','E','L'],scores:{1:0,2:0},star:-1,starFound:false,surprises:{},foundSurprises:{},history:[],passes:0,mode:'classic'});
 for(const placements of [[{i:112,l:'A'},{i:112,l:'A'},{i:113,l:'T'}],[{i:112.5,l:'A'},{i:113,l:'T'}]]){const s=words(),before=JSON.stringify(s);await assert.rejects(c.wordsMove(s,[1,2],0,{placements},db));assert.equal(JSON.stringify(s),before);}
 let s=words();s.bonus[112]='DW';s.bonus[113]='TW';await c.wordsMove(s,[1,2],0,{placements:[{i:112,l:'A'},{i:113,l:'T'}]},db);assert.equal(s.scores[1],12,'DW and TW multiply together');s.racks[1]=['S'];await c.wordsMove(s,[1,2],0,{placements:[{i:114,l:'S'}]},db);assert.equal(s.history[1].score,3,'old bonuses do not reactivate');
 s=words();s.racks[1]=['?','T'];s.bonus[112]='DW';s.bonus[113]='TL';await c.wordsMove(s,[1,2],0,{placements:[{i:112,l:'A',blank:true},{i:113,l:'T'}]},db);assert.equal(s.scores[1],6,'blank zero; letter then word bonus');
 s=c.chkInit();s.board=Array(64).fill(null);s.board[42]='r';s.board[33]='b';s.board[46]='r';s.board[1]='b';s.counts={r:2,b:2};const before=JSON.stringify(s);assert.throws(()=>c.chkMove(s,[1,2],0,{from:46,to:37}),/capture/);assert.equal(JSON.stringify(s),before);for(const difficulty of ['easy','medium','hard']){const trial=structuredClone(s);trial.bot={difficulty};const move=await c.chooseBotMove('checkers',trial,[1,2],0,db);assert.equal(move.from,42);assert.equal(move.to,24);c.chkMove(trial,[1,2],0,move);}
 s=c.memInit([1,2],1);s.open=[0];s.pending=[1,2];s.matched[3]=true;s.bot={difficulty:'hard',memory:{4:s.cards[4]}};const original=JSON.stringify(s),view=c.viewState('memory',s,1);for(let i=0;i<20;i++)assert.equal(view.cards[i],i<4?s.cards[i]:null);assert(!('memory' in view.bot));assert.equal(JSON.stringify(s),original);
 assert(source.includes("AND state=? AND turn=? AND status='playing'"));
 console.log('PASS: invalid coordinates and duplicate placements preserve state; compounded premiums, blanks and used premiums; compulsory captures for human/bots; concealed Memory faces; guarded saves for every game.');
})().catch(e=>{console.error(e);process.exitCode=1});
