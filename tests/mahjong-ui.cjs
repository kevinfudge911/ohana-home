const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('mahjong-preview.html','utf8');
const dom=new JSDOM(html,{url:'https://example.test',runScripts:'dangerously',pretendToBeVisual:true});
const d=dom.window.document;
(async()=>{try{
assert.equal(d.querySelectorAll('.mj-tile').length,72);
assert(d.querySelectorAll('.mj-tile:disabled').length>0);
d.querySelector('#mj-hint').click();const pair=[...d.querySelectorAll('.mj-tile.hinted')].map(x=>x.dataset.mj);assert.equal(pair.length,2);
d.querySelector(`[data-mj="${pair[0]}"]`).click();assert.equal(d.querySelectorAll('.picked').length,1);
d.querySelector(`[data-mj="${pair[1]}"]`).click();await new Promise(r=>setTimeout(r,10));
assert.equal(d.querySelectorAll('.mj-tile').length,70);assert(d.querySelector('.mj-scores').textContent.includes('10 points'));
d.querySelector('#mj-shuffle').click();await new Promise(r=>setTimeout(r,10));assert.equal(d.querySelectorAll('.mj-tile').length,70);assert(d.querySelector('.mj-scores').textContent.includes('10 points'));
console.log('PASS: rendered stack, blocked tiles, hint, selection, matching removes exactly two tiles, +10 receipt, reshuffle retains progress.');
}finally{dom.window.close();}})();
