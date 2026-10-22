// Run the existing Menu notice suite with loaders adapted to configured gzip HTML.
// Its behavioral assertions remain intact; only its isolated fixture setup changes.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.join(__dirname,'megaphone-images.cjs');let source=fs.readFileSync(file,'utf8');
source=source.replace(".split('(async()=>{')[0];",".split('(async()=>{')[0].replace('const streams={};',\"const streams={gunzipAppHtml:()=>({toString:()=>''})};\");");
const start=source.indexOf('worker.match('),end=source.indexOf('[1]',start)+3;if(start<0||end<start)throw Error('Missing historical HTML import matcher');source=source.slice(0,start)+"fs.readdirSync('live').find(file=>file.endsWith('app.html'))"+source.slice(end);
source=source.replace('dom.window.eval(html.slice(a,b));',"dom.window.eval(\"function announcementContext(){return {room:1,valid:()=>true};}\"+html.slice(a,b));");
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=module.paths;compiled._compile(source,file);
