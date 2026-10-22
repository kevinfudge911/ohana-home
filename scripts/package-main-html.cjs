const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const live=path.resolve(__dirname,'..','live'),app=fs.readdirSync(live).find(x=>x.endsWith('app.html'));
assert(app,'Main HTML source exists');const raw=fs.readFileSync(path.join(live,app)),packed=zlib.gzipSync(raw,{level:9});assert(zlib.gunzipSync(packed).equals(raw),'Main HTML packaging must be lossless');fs.writeFileSync(path.join(live,app+'.gz'),packed);console.log('Main HTML packaged losslessly: '+raw.length+' -> '+packed.length+' bytes');
