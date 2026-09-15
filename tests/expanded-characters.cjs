const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('app.html','utf8'),worker=fs.readFileSync('worker.js','utf8');const c=vm.createContext({});
vm.runInContext(html.slice(html.indexOf('const CHARACTERS'),html.indexOf('function avatarMarkup'))+'\n'+html.slice(html.indexOf('const CHARACTER_VOICES'),html.indexOf('function speakingCharacter'))+'\nthis.roster=CHARACTERS;this.voices=CHARACTER_VOICES;',c);
assert.equal(Object.keys(c.roster).length,22);
assert.equal(new Set(Object.values(c.roster).map(x=>x.name)).size,22);
for(const [key,ch] of Object.entries(c.roster)){
 assert.equal(key.length,4);assert(worker.includes(JSON.stringify(key))||worker.includes("'"+key+"'"));assert(c.voices[key]);
 assert(fs.existsSync(ch.file.slice(1)),ch.file);assert(fs.existsSync('talk-'+ch.name.toLowerCase()+'.webp'));
 assert(c.voices[key].rate>=.8&&c.voices[key].rate<=1.2);
}
console.log('PASS: all 22 unique characters have four-character server IDs, portraits, animation strips and voice profiles.');
