const fs=require('fs');const[src,dst]=process.argv.slice(2);let s=fs.readFileSync(src,'utf8');const uri='/ohana-word-harvest-scenery-v4.webp';const old=s.match(/<style id="ohana-word-harvest-art-v3">[\s\S]*?<\/style>/);if(!old||s.includes('ohana-word-harvest-scenery-v4'))throw Error('style guard');
const scope=':root[data-ohana-season="thanksgiving"]';
const css=`<style id="ohana-word-harvest-scenery-v4">
@media(forced-colors:none){
${scope} #game[data-game-type="words"] .wb-surface rect[fill="url(#wb-sea)"]{fill:url(#wb-harvest-art)}
${scope} #game[data-game-type="words"] .wb-plane .c .t,
${scope} #game .game-tray .rack .rt,
${scope} body>.game-tray .rack .rt{background-image:linear-gradient(#fff9e394,#fff9e394),url('${uri}')!important;background-size:100% 100%,300% 100%!important;background-position:center,0% center!important;background-repeat:no-repeat!important;color:#302018!important;text-shadow:0 1px 1px #fffbe8!important}
${scope} #game[data-game-type="words"] .wb-plane .c:nth-of-type(3n+1) .t,
${scope} #game .game-tray .rack .rt:nth-child(3n+1){background-position:center,50% center!important}
${scope} #game[data-game-type="words"] .wb-plane .c:nth-of-type(3n+2) .t,
${scope} #game .game-tray .rack .rt:nth-child(3n+2){background-position:center,100% center!important}
${scope} #game[data-game-type="words"] .wb-plane .c .t i,
${scope} #game .game-tray .rack .rt i{color:#302018!important;text-shadow:0 0 2px #fff,1px 1px 0 #fff,-1px -1px 0 #fff!important}
${scope} #game .game-tray .rack .rt.sel{outline:2px solid #874012!important;outline-offset:1px}
${scope} #game .game-tray .rack .rt.swp{outline:3px solid #146579!important;outline-offset:-3px}
${scope} #game[data-game-type="words"] .wb-plane .c .t.new{outline:2px solid #a8531b!important;outline-offset:-2px}
${scope} #game[data-game-type="words"] .wb-plane .c .t.last{box-shadow:inset 0 0 0 2px #587239!important}
${scope} #game[data-game-type="words"] .wb-harvest-emblem{display:inline}
${scope} #game[data-game-type="words"] .wb-flower-emblem{display:none}
}
.wb-harvest-emblem{display:none}
</style>`;
s=s.replace(old[0],css);const pattern=s.match(/<pattern id="wb-harvest-art"[\s\S]*?<\/pattern>/);if(!pattern)throw Error('pattern guard');s=s.replace(pattern[0],`<pattern id="wb-harvest-art" width="1500" height="1500" patternUnits="userSpaceOnUse"><image href="${uri}" x="0" y="0" width="4500" height="1500" preserveAspectRatio="none"/><rect width="1500" height="1500" fill="#fff7df" opacity=".62"/></pattern>`);
const start=s.indexOf('const emblem=centerOccupied?'),end=s.indexOf(';',start);if(start<0||end<start)throw Error('emblem guard');s=s.slice(0,start)+`const emblem=centerOccupied?'':'<g class="wb-flower-emblem">'+wordCenterEmblem()+'</g><g class="wb-harvest-emblem"><svg x="700" y="700" width="100" height="100" viewBox="100 0 100 100"><image href="${uri}" width="300" height="100" preserveAspectRatio="none"/><rect x="100" width="100" height="100" fill="#fff7df" opacity=".35"/></svg></g>'`+s.slice(end);fs.writeFileSync(dst,s);
