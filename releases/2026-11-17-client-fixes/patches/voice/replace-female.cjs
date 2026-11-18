'use strict';
const fs=require('fs'),crypto=require('crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const ORIGINAL='64138c2fa36a9c2a92c223c9983baaa6fb3b19b3bac1c37f251b0f8d16e865b8';
const re=/(function ohanaGoGetEm\(\)\{[^\n]*?new Audio\('data:audio\/mpeg;base64,)([A-Za-z0-9+/=]+)('\);[^\n]*)/g;
function apply(source,mp3){
 const hits=[...source.matchAll(re)];
 if(hits.length!==1)throw Error('Expected one GoGetEm function');
 if(hash(Buffer.from(hits[0][2],'base64'))!==ORIGINAL)throw Error('Original audio differs; review new baseline');
 if(!Buffer.isBuffer(mp3)||mp3.length<1000||mp3.length>200000)throw Error('Invalid bounded MP3');
 if(!(mp3.subarray(0,3).toString()==='ID3'||(mp3[0]===255&&(mp3[1]&224)===224)))throw Error('MP3 required');
 return source.replace(re,(_,a,b,c)=>a+mp3.toString('base64')+c);
}
module.exports={apply,re,hash,ORIGINAL};
if(require.main===module){
 const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('input and output required');
 const source=fs.readFileSync(input,'utf8'),mp3=fs.readFileSync(__dirname+'/female-go-get-them.mp3');
 const result=apply(source,mp3);fs.writeFileSync(output,result);
 console.log(JSON.stringify({base:hash(source),candidate:hash(result),audio:hash(mp3),audioBytes:mp3.length,onlyChange:'embedded GoGetEm MP3'}));
}
