const fs=require('fs'),{JSDOM}=require('jsdom'),assert=require('assert');
const html=fs.readFileSync('buddies-preview.html','utf8');let spokenText="",speaks=0,cancels=0,suspended=0,resumed=0;
const dom=new JSDOM(html,{url:'https://example.test',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.SpeechSynthesisUtterance=function(text){this.text=text;};w.speechSynthesis={getVoices:()=>[{name:'Natural English',lang:'en-US'}],cancel:()=>cancels++,speak:u=>{spokenText=u.text;speaks++;u.onstart?.();}};}});const w=dom.window,d=w.document;
try{
const lines=w.eval(`Array.from({length:8000},()=>characterDialogue('match',10,'Honu'))`);assert.equal(new Set(lines).size,8000);assert(lines.every(s=>s.includes('10')));
d.querySelector('#sample').click();assert.equal(speaks,1);assert(d.querySelector('.character-pop.talking'));
w.eval('AudioSys.ctx={suspend:()=>window.suspended++,resume:()=>window.resumed++};');w.suspended=0;w.resumed=0;
d.querySelector('#sound').click();assert.equal(w.localStorage.getItem('ohana_muted'),'true');assert.equal(w.suspended,1);assert(!d.querySelector('.character-pop.talking'));const count=speaks;d.querySelector('#sample').click();assert.equal(speaks,count);assert(d.querySelector('.character-pop p').textContent.includes('10'));assert.equal(d.querySelector('#sound').getAttribute('aria-pressed'),'true');assert(cancels>0);
d.querySelector('#sound').click();assert.equal(w.localStorage.getItem('ohana_muted'),'false');assert.equal(w.resumed,1);
w.eval("showCharacterMoment('Memaw and Pe-paw earned 20 points.',20)");assert.equal(spokenText,'Mee maw and Pee paw earned 20 points.');assert.equal(d.querySelector('.character-pop p').textContent,'Memaw and Pe-paw earned 20 points.');
assert.equal(w.eval("spokenFamilyNames(\"Meemaw’s turn, Pepaw!\")"),'Mee maw’s turn, Pee paw!');
console.log('PASS: 8000 unique scoring messages, spoken points, talking state, immediate speech cancellation, active audio suspension, muted captions, saved mute and unmute.');
}finally{w.close();}
