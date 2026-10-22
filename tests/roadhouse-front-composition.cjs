const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict'),zlib=require('node:zlib'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),base=process.env.OHANA_ROADHOUSE_BASE||'031b1947ed8fd820a450f7670a81f225dc73a034',git=process.env.OHANA_TEST_GIT||'git';
const app='live/'+fs.readdirSync(path.join(root,'live')).find(p=>p.endsWith('app.html')),read=p=>fs.readFileSync(path.join(root,p)),prior=p=>cp.execFileSync(git,['cat-file','blob',base+':'+p],{cwd:root,maxBuffer:20e6}),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const html=read(app).toString(),before=prior(app).toString();let restored=html;
const logo=html.match(/nashvillePhoto\.querySelector\('\.nashville-venue-logo'\)\.src='data:image\/jpeg;base64,([^']+)';/);assert(logo,'One existing official venue logo');
assert.equal(hash(Buffer.from(logo[1],'base64')),'78e28e255fe067933a3bbe9d6535d6ea0a99de1980181683bce11423986b1c94');
restored=restored.replace('<img class="nashville-venue-logo" alt="">','').replace(logo[0],'');
function block(s,a,b){const x=s.indexOf(a),y=s.indexOf(b,x);assert(x>=0&&y>x,a);return s.slice(x,y);}
for(const [a,b]of [['.nashville-print{','.nashville-viewer{'],['function placeNashvillePhoto(','function hideNashville(']])restored=restored.replace(block(restored,a,b),block(before,a,b));
assert.equal(restored,before,'Only composition markup, scoped print CSS and frame placement changed; navigation/audio/games/room images/viewer preserved');
const photo=s=>JSON.parse(s.match(/const nashvilleURI=("[^\n]+?");/)[1]);assert.equal(photo(html),photo(before));assert.equal(hash(Buffer.from(photo(html).split(',')[1],'base64')),'5b383827f10e633bc04095a93c2ec1e809aa1154103144b4b536d41d57738204');
for(const p of ['live/worker.js','wrangler.toml'])assert(read(p).equals(prior(p)),p+' unchanged');
assert(zlib.gunzipSync(read(app+'.gz')).equals(read(app)),'Exact merged HTML served by gzip loader');
let scripts=0;for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/src=|type=.?(?:application\/json|module)/i.test(m[1]))continue;new vm.Script(m[2]);scripts++;}
const receipt={passed:true,base,scopedCompositionOnly:true,photoBytesUnchanged:true,officialLogoBytesUnchanged:true,workerConfigUnchanged:true,gzipLossless:true,inlineScriptsParsed:scripts,appSha256:hash(read(app))};fs.mkdirSync(path.join(root,'artifacts/roadhouse-integration'),{recursive:true});fs.writeFileSync(path.join(root,'artifacts/roadhouse-integration/preservation.json'),JSON.stringify(receipt,null,2));console.log(receipt);
