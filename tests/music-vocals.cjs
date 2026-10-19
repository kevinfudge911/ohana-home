// Validate the shipped catalog and exercise its actual credit renderer with isolated DOM data.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync('live/'+fs.readdirSync('live').find(f=>f.endsWith('app.html')),'utf8');
const i=app.indexOf('jb-tracks'),a=app.indexOf('>',i)+1,b=app.indexOf('<',a);
const tracks=JSON.parse(JSON.parse('"'+app.slice(a,b)+'"'));
const vocals=tracks.filter(t=>t.id.startsWith('ohana-revalidated-byfor-'));
assert.equal(vocals.length,11);assert.equal(new Set(tracks.map(t=>t.id)).size,tracks.length);
const nodes=[];const document={createElement(tag){const node={tag,style:{},children:[],append(...children){this.children.push(...children)},replaceChildren(){this.children=[]}};nodes.push(node);return node}};
const code=app.slice(app.indexOf('function renderMusicCredits('),app.indexOf('function musicFlat('));
const context={document,URL};vm.createContext(context);vm.runInContext(code+';this.render=renderMusicCredits;',context);
for(const t of vocals){
 assert.equal(t.license,'CC BY 3.0 United States');assert.deepEqual(t.sources,['Sunday Best','Vocal Christian Worship']);
 assert.equal(t.vocal,true);assert.equal(t.collection_only,true);assert(t.duration_seconds>60);
 assert(t.attribution.includes('vocals:'));for(const credit of ['Marcus Melton','Makoto Fujimura','Ryann Cooley'])assert(t.attribution.includes(credit));
 const out=document.createElement('div');context.render(t,out);assert.equal(out.children[0].textContent,t.attribution);
 const links=out.children.filter(n=>n.tag==='a');assert.equal(links.length,4);
 assert.equal(links[1].textContent,t.license);assert(!links.some(n=>n.textContent.includes('4.0')));
 for(const link of links){assert.equal(new URL(link.href).protocol,'https:');assert.equal(link.target,'_blank');assert.equal(link.rel,'noopener noreferrer')}
 assert.equal(links[0].href,t.source_url);assert.equal(links[2].href,t.artwork_source_url);assert.equal(links[3].href,t.artwork_underlying_url);
}
const out=document.createElement('div');context.render({attribution:'<script>unsafe text</script>',source_url:'javascript:alert(1)',license_url:'https://example.com/',artwork_source_url:'https://example.com/',artwork_underlying_url:'https://user:password@example.com/'},out);
assert.equal(out.children[0].textContent,'<script>unsafe text</script>');assert.equal(out.children.filter(n=>n.tag==='a').length,1,'unsafe and duplicate links rejected');
context.render({},out);assert.equal(out.children.length,0);
console.log('PASS: 11 distinct vocal records, credits and correct license links rendered for all 11, artwork provenance, safe text/URL handling, collection-only saved-list guard.');
