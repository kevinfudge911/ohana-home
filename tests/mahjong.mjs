import assert from 'node:assert/strict';
import {mahjongInit,mahjongFree,mahjongDeal,mahjongMove} from '../mahjong.js';
for(let seed=1;seed<=100;seed++){
 let n=seed;const random=()=>((n=(n*1664525+1013904223)>>>0)/4294967296);
 const st=mahjongInit([5],random);assert.equal(st.tiles.length,72);
 const solution=mahjongDeal(st.tiles,random);
 for(const ids of solution){const result=mahjongMove(st,[5],0,{action:'match',ids,revision:st.revision});assert.equal(result.over,st.pairs===36);}
 assert.equal(st.scores[5],360);assert(st.tiles.every(t=>t.removed));
}
let st=mahjongInit([5,6]);
assert(!mahjongFree(st.tiles,st.tiles.find(t=>t.x===1&&t.y===1&&t.z===0)));
assert(!mahjongFree(st.tiles,st.tiles.find(t=>t.x===3&&t.y===2&&t.z===1)));
const solution=mahjongDeal(st.tiles);let turn=0;
for(const ids of solution){const r=mahjongMove(st,[5,6],turn,{action:'match',ids,revision:st.revision});turn=r.next;}
assert.deepEqual(st.scores,{5:180,6:180});
st=mahjongInit([5]);const pair=mahjongDeal(st.tiles)[0];
assert.throws(()=>mahjongMove(st,[5],0,{action:'match',ids:[pair[0],pair[0]],revision:0}));
mahjongMove(st,[5],0,{action:'match',ids:pair,revision:0});
assert.throws(()=>mahjongMove(st,[5],0,{action:'shuffle',revision:0}));
mahjongMove(st,[5],0,{action:'shuffle',revision:1});
assert.equal(st.scores[5],10);assert.equal(st.tiles.filter(t=>t.removed).length,2);
const rest=mahjongDeal(st.tiles);for(const ids of rest)mahjongMove(st,[5],0,{action:'match',ids,revision:st.revision});
assert.equal(st.scores[5],360);
console.log('PASS: 100 solvable deals, cover/side blocking, duplicate rejection, solo finish, alternating turns, stale moves, and solvable partial reshuffle without score loss.');
