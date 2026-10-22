// Rebuild after merging HTML changes; never copy a gzip made from an older app.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),live=path.join(root,'live'),worker=fs.readFileSync(path.join(live,'worker.js'),'utf8');
const imported=worker.match(/^import APP_HTML_GZIP from "\.\/([^"\n]+\.html\.gz)";/m);
assert(imported,'Expected the existing lossless APP_HTML_GZIP packaging import');
const packedPath=path.join(live,imported[1]),rawPath=packedPath.slice(0,-3),raw=fs.readFileSync(rawPath);
assert(Buffer.from(raw.toString('utf8'),'utf8').equals(raw),'HTML must round-trip through the existing UTF-8 loader');
if(!process.argv.includes('--check'))fs.writeFileSync(packedPath,zlib.gzipSync(raw,{level:9}));
const packed=fs.readFileSync(packedPath);assert(zlib.gunzipSync(packed).equals(raw),'Gzip must decode to the exact current HTML bytes');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
console.log(JSON.stringify({lossless:true,rawBytes:raw.length,gzipBytes:packed.length,savedBytes:raw.length-packed.length,appSha256:hash(raw),gzipSha256:hash(packed)}));
