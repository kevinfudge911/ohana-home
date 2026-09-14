// Run with NODE_PATH pointing to the installed jsdom package directory.
const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('app.html','utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
const dom=new JSDOM(html,{url:'https://example.test',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w.fetch=async()=>({json:async()=>({}),ok:true});
try {
w.eval(scripts.join('\n')+`\nS.me={id:5};S.sync={members:[{id:5,name:'Pe-paw'},{id:6,name:'Memaw'}]};
const g={id:4,players:[5,6],score_review:{id:'audit-1',moveCount:16,scores:{5:187,6:241},message:'Checked <all>',explanation:'16 − 15 = 1',acknowledged:{}}};
window.reviewBefore=renderScoreReview(g);
g.score_review.acknowledged[5]=123;window.reviewAfter=renderScoreReview(g);
S.me.id=6;window.reviewOther=renderScoreReview(g);
g.score_review.acknowledged[6]=456;window.reviewBoth=renderScoreReview(g);
S.me.id=7;window.reviewOutsider=renderScoreReview(g);`);
assert(w.reviewBefore.includes('data-review-game="4"'));
assert(w.reviewBefore.includes('Checked &lt;all&gt;'));
assert(!w.reviewAfter.includes('<button'));
assert(w.reviewAfter.includes('Waiting for the other'));
assert(w.reviewOther.includes('<button'));
assert(w.reviewOther.includes('Pe-paw: ✓ Saw it'));
assert(w.reviewBoth.includes('Everyone saw it'));
assert.equal(w.reviewOutsider,'');
console.log('PASS: separate player acknowledgment, persistent pending notice, shared seen status, outsider exclusion and escaped copy.');
} finally {w.close();}
