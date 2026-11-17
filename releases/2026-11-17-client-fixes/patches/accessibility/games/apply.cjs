const fs=require('fs');const pairs=require('./replacements.json');
function apply(source){let out=source;for(const[a,b]of pairs){const count=out.split(a).length-1;if(count!==1)throw Error('Accessibility anchor count '+count+': '+a.slice(0,80));out=out.replace(a,b);}return out;}
module.exports={apply};if(require.main===module)fs.writeFileSync(process.argv[3],apply(fs.readFileSync(process.argv[2],'utf8')));
