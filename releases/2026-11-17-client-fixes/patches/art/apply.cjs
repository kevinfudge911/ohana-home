const fs=require('fs'),path=require('path');const[src,dst]=process.argv.slice(2);let s=fs.readFileSync(src,'utf8');const marker='<style id="ohana-thanksgiving-theme">';if(s.split(marker).length!==2||s.includes('id="ohana-word-harvest-art-v3"'))throw Error('Art style guard');
const art=fs.readFileSync(path.join(__dirname,'tile.svg'),'utf8').trim();const url='data:image/svg+xml,'+encodeURIComponent(art).replace(/'/g,'%27');
const css=`/* Faith and harvest artwork is behind glyphs, never above labels or hit targets. */
@media(forced-colors:none){
:root[data-ohana-season="thanksgiving"] #game[data-game-type="words"] .wb-surface rect[fill="url(#wb-sea)"]{fill:url(#wb-harvest-art)}
:root[data-ohana-season="thanksgiving"] #game[data-game-type="words"] .wb-plane .c .t,
:root[data-ohana-season="thanksgiving"] #game .game-tray .rack .rt,
:root[data-ohana-season="thanksgiving"] body>.game-tray .rack .rt{background-image:url("${url}")!important;background-size:100% 100%!important;background-repeat:no-repeat!important;color:#3b2318!important}
:root[data-ohana-season="thanksgiving"] #game .game-tray .rack .rt.sel{outline:2px solid #874012!important;outline-offset:1px}
:root[data-ohana-season="thanksgiving"] #game .game-tray .rack .rt.swp{outline:3px solid #146579!important;outline-offset:-3px}
:root[data-ohana-season="thanksgiving"] #game[data-game-type="words"] .wb-plane .c .t.new{outline:2px solid #a8531b!important;outline-offset:-2px}
:root[data-ohana-season="thanksgiving"] #game[data-game-type="words"] .wb-plane .c .t.last{box-shadow:inset 0 0 0 2px #587239!important}
:root[data-ohana-season="thanksgiving"] #game[data-game-type="words"] .wb-harvest-emblem{display:inline}
:root[data-ohana-season="thanksgiving"] #game[data-game-type="words"] .wb-flower-emblem{display:none}
}
.wb-harvest-emblem{display:none}
`;
s=s.replace(marker,'<style id="ohana-word-harvest-art-v3">'+css+'</style>\n'+marker);
const a='const defs=`<defs><linearGradient id="wb-sea"';if(s.split(a).length!==2)throw Error('surface guard');
// The pattern is selected only when the actual current cell fill is the ordinary type.
const pattern='<pattern id="wb-harvest-art" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="#f8dfaa"/><path d="M43 15h14v21h18v12H57v38H43V48H25V36h18z" fill="#b77a32" opacity=".6"/><path d="M8 91Q27 89 38 80M92 91Q73 89 62 80" fill="none" stroke="#bd873d" stroke-width="3" opacity=".55"/><g fill="#bd873d" opacity=".55"><ellipse cx="17" cy="85" rx="4" ry="8" transform="rotate(-50 17 85)"/><ellipse cx="29" cy="82" rx="4" ry="8" transform="rotate(-45 29 82)"/><ellipse cx="83" cy="85" rx="4" ry="8" transform="rotate(50 83 85)"/><ellipse cx="71" cy="82" rx="4" ry="8" transform="rotate(45 71 82)"/></g></pattern>';
s=s.replace(a,'const defs=`<defs>'+pattern+'<linearGradient id="wb-sea"');
const e="const emblem=centerOccupied?'':wordCenterEmblem();";if(s.split(e).length!==2)throw Error('emblem guard');
const cross='<g class="wb-harvest-emblem"><circle cx="750" cy="750" r="47" fill="#fff1c9"/><path d="M744 709h12v24h19v11h-19v43h-12v-43h-19v-11h19z" fill="#9e5725"/><path d="M716 781Q702 754 719 721M784 781Q798 754 781 721" fill="none" stroke="#bf8432" stroke-width="4"/><g fill="#bf8432"><ellipse cx="712" cy="742" rx="4" ry="8"/><ellipse cx="714" cy="760" rx="4" ry="8"/><ellipse cx="788" cy="742" rx="4" ry="8"/><ellipse cx="786" cy="760" rx="4" ry="8"/></g></g>';
s=s.replace(e,"const emblem=centerOccupied?'':'<g class=\"wb-flower-emblem\">'+wordCenterEmblem()+'</g>"+cross+"';");fs.writeFileSync(dst,s);
