const fs=require('fs'),crypto=require('crypto'),assert=require('assert');
const [source,dest]=process.argv.slice(2);assert(source&&dest,'Usage: node apply.cjs source.html destination.html');
let s=fs.readFileSync(source,'utf8');
const changes=[
 ['<textarea id="pr-text" maxlength="800" rows="5"',`<textarea id="pr-text" aria-label="\${praise?'Praise report':'Prayer request'}" maxlength="800" rows="5"`,2],
 ['<input id="pz-name" class="pz-name"','<input id="pz-name" aria-label="Puzzle name" class="pz-name"',1],
 ['<input type="range" id="wmRange"','<input type="range" id="wmRange" aria-label="Beach sand watermark opacity"',1],
 ['<textarea id="aic-input" rows="2"','<textarea id="aic-input" aria-label="Message to AI helpers" rows="2"',1],
 ['<select data-mango-voices>','<select data-mango-voices aria-label="Local device voice">',1]
];
for(const [old,replacement,count] of changes){assert.equal(s.split(old).length-1,count,old+' expected match count');s=s.split(old).join(replacement)}
fs.writeFileSync(dest,s);console.log(crypto.createHash('sha256').update(s).digest('hex'));
