const fs=require('fs'),crypto=require('crypto');
const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('input output required');let s=fs.readFileSync(input,'utf8');
const replace=(a,b,n=1)=>{if(s.split(a).length-1!==n)throw Error('Anchor count mismatch: '+a);s=s.split(a).join(b);};
replace('animation:ohana-buddy-present 7s steps(1,end) infinite','animation:ohana-buddy-present 31s steps(1,end) infinite');
replace('@keyframes ohana-buddy-present{0%,27%{background-position:0 0}35%{background-position:33.333% 0}45%{background-position:66.666% 0}57%{background-position:100% 0}68%,100%{background-position:0 0}}','@keyframes ohana-buddy-present{0%,86%{background-position:0 0}88%{background-position:33.333% 0}90%{background-position:66.666% 0}92%{background-position:100% 0}94%{background-position:66.666% 0}96%{background-position:33.333% 0}98%,100%{background-position:0 0}}');
replace("(-Math.abs(Number(seat.dataset.playerId)||0)%7)+'s'","(-Math.abs(Number(seat.dataset.playerId)||0)%31)+'s'",2);
fs.writeFileSync(output,s);console.log(JSON.stringify({input:crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex'),output:crypto.createHash('sha256').update(s).digest('hex')}));
