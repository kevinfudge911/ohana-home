const fs=require('fs'),path=require('path');let s=fs.readFileSync(process.argv[2],'utf8');
const old=/<style id="ohana-harvest-playing-cards-v1">[\s\S]*?<\/style>/g;
if([...s.matchAll(old)].length!==1||s.includes('function ohanaHarvestCardPattern('))throw Error('Expected one old card treatment');
s=s.replace(old,'<style id="ohana-harvest-card-art-v2">'+fs.readFileSync(path.join(__dirname,'cards.css'),'utf8')+'</style>');
const uri=fs.readFileSync(path.join(__dirname,'hand-uri.txt'),'utf8'),spUri=fs.readFileSync(path.join(__dirname,'spade-uri.txt'),'utf8');
const helper=`function ohanaHarvestCardPattern(shape,w,h){const id='ohana-harvest-card-'+(ohanaHarvestCardPattern.serial=(ohanaHarvestCardPattern.serial||0)+1);return '<defs><pattern id="'+id+'" patternUnits="userSpaceOnUse" width="'+w+'" height="'+h+'"><image href="'+(h===120?'${spUri}':'${uri}')+'" width="'+w+'" height="'+h+'" preserveAspectRatio="none"/></pattern></defs><path class="ohana-harvest-shape-art" aria-hidden="true" d="'+shape+'" style="fill:url(#'+id+')!important;stroke:none!important"/>';}
`;
const anchor='function hfCardShape(foot){';if(s.split(anchor).length!==2)throw Error('HF anchor');s=s.replace(anchor,helper+anchor);
const hf='stroke-linejoin="round"/><path d="${path}" fill="none" stroke="#ffe6a3"';if(s.split(hf).length!==2)throw Error('HF shape anchor');s=s.replace(hf,'stroke-linejoin="round"/>${ohanaHarvestCardPattern(path,104,152)}<path d="${path}" fill="none" stroke="#ffe6a3"');
const sp='<path d="${SP_SHAPE_PATH}"/></svg>`;}';if(s.split(sp).length!==2)throw Error('Spades shape anchor');s=s.replace(sp,'<path d="${SP_SHAPE_PATH}"/>${ohanaHarvestCardPattern(SP_SHAPE_PATH,100,120)}</svg>`;}');
fs.writeFileSync(process.argv[3]||path.join(__dirname,'candidate.html'),s);
