// Preserve the current gzip transport; regenerate only its derived application bytes.
const fs=require('fs'),zlib=require('zlib'),assert=require('assert/strict');
for(const p of ['live/shuffle-ui.js','live/shuffle-table.css'])fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'));
require('./sync-shuffle-ui.cjs');
const app=fs.readdirSync('live').find(f=>f.endsWith('app.html'));
if(fs.existsSync('shared-header/unified-header.source.js')){
 const runtime=fs.readFileSync('shared-header/unified-header.js','utf8'),template=runtime.match(/const TEMPLATE='([^']+)'/)[1];
 fs.writeFileSync('shared-header/unified-header.js',fs.readFileSync('shared-header/unified-header.source.js','utf8').replace('__SIGN_TEMPLATE__',template));
}
if(fs.existsSync('shared-header/unified-header.js')&&fs.existsSync('shared-header/adapters.js')){
 let html=fs.readFileSync('live/'+app,'utf8');const runtime=fs.readFileSync('shared-header/unified-header.js','utf8');
 // The live Bridge already uses this exact corrected component. Keep its adapter,
 // and let the global block be the sole component definition for every surface.
 const standalone=html.match(/<script id="ohana-corrected-shared-header-dependency">([\s\S]*?)<\/script>\n?/);
 if(standalone){assert.equal(standalone[1].trim().replace(/\r\n/g,'\n'),runtime.trim().replace(/\r\n/g,'\n'),'Bridge and global component must be identical before ownership transfer');html=html.replace(standalone[0],'');}
 const block='<!-- OHANA GLOBAL SHARED SIGN START -->\n<script>if(!window.OhanaUnifiedGameHeader){'+runtime+'}\nif(!window.OhanaUnifiedHeaderAdapters){'+fs.readFileSync('shared-header/adapters.js','utf8')+'}\nwindow.OhanaDecksHeaderAdapter?.stop();window.OhanaUnifiedHeaderOwner=OhanaUnifiedHeaderAdapters.install();</script>\n<!-- OHANA GLOBAL SHARED SIGN END -->';
 html=html.replace(/<!-- OHANA DECKS SHARED SIGN START -->[\s\S]*?<!-- OHANA DECKS SHARED SIGN END -->\n?/,'');
 if(html.includes('<!-- OHANA GLOBAL SHARED SIGN START -->'))html=html.replace(/<!-- OHANA GLOBAL SHARED SIGN START -->[\s\S]*?<!-- OHANA GLOBAL SHARED SIGN END -->/,block);else html=html.replace('</body>',block+'\n</body>');
 fs.writeFileSync('live/'+app,html);
}
const raw=fs.readFileSync('live/'+app),packed=zlib.gzipSync(raw,{level:9});
assert(zlib.gunzipSync(packed).equals(raw));fs.writeFileSync('live/'+app+'.gz',packed);console.log('Lossless gzip refreshed: '+raw.length+' -> '+packed.length);
