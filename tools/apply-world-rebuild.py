from pathlib import Path
import sys,re,shutil
root=Path(__file__).resolve().parents[1];target=Path(sys.argv[1]);p=next(target.glob('*-app.html'));s=p.read_text()
def rep(a,b):
 global s
 assert a in s,a[:100]
 s=s.replace(a,b)
rep('function renderJoin(errMsg) {',(root/'assets/ohana-world.js').read_text()+'\nfunction renderJoin(errMsg) {')
rep('function render() {','function render() {\n  ensureWorldScene();')
rep('  bindGameSetups(m);','  bindGameSetups(m);\n  mountWorldHome();')
rep('  addNextGameControl();','  addNextGameControl();\n  mountWorldGame(g,st);')
rep('renderHandFoot(st,g,myTurn);','renderHandFoot(st,g,myTurn);mountWorldGame(g,st);')
rep('const rerender=()=>renderOhana10(st,g,myTurn);','const rerender=()=>{renderOhana10(st,g,myTurn);mountWorldGame(g,st);};')
# Existing help dialogs accidentally contained unrelated chat-menu wiring.
start=s.index('function showTableHelp(');end=s.index('function renderGameChat(',start)
chunk=s[start:end];bad="d.querySelector('header').insertBefore(d.querySelector('#uc-mute'),d.querySelector('#uc-close'));d.querySelector('#uc-back').onclick=showChatMenu;"
assert bad in chunk
s=s[:start]+chunk.replace(bad,'')+s[end:]
rep("  const gameScroll = $('#game')?.scrollTop || 0;", "  const gameScroll=window.scrollY;const sameWorldGame=S._worldGameId===g.id;S._worldGameId=g.id;")
rep('  gameEl.scrollTop = gameScroll;', '  window.scrollTo(0,sameWorldGame?gameScroll:0);')
rep('</head>','<style id="ohana-world-composition">\n'+(root/'assets/ohana-world.css').read_text()+'\n</style></head>')
p.write_text(s)
# Use the existing live scene renderer as the full-screen backdrop.
p=next(target.glob('*-ohana-scene.js.txt'));s=p.read_text()
s=s.replace("im.src='/ohana-island.webp?v=premium1'", "im.src=this.hasAttribute('world')?'/ohana-world-scene.webp':'/ohana-island.webp?v=premium1'")
s=s.replace("fallback.src='/ohana-island.webp?v=premium1'", "fallback.src=this.hasAttribute('world')?'/ohana-world-scene.webp':'/ohana-island.webp?v=premium1'")
s=s.replace('night*.72', "night*(this.hasAttribute('world')?.40:.72)")
s=s.replace('</style>', ''':host([world]){width:100%;height:100%;contain:strict}:host([world]) section{width:100%;height:100%;aspect-ratio:auto;border:0;border-radius:0;background:#1296ba}:host([world]) canvas{width:100%;height:100%;object-fit:cover}:host([world]) .title,:host([world]) .saying,:host([world]) .verse,:host([world]) .pause{display:none}
</style>''',1)
a=s.index('      // Refraction');b=s.index('      // Broad',a);old=s[a:b]
s=s[:a]+'''      if(this.hasAttribute('world')){c.save();c.beginPath();c.rect(185,112,585,76);c.clip();for(let y=112;y<188;y+=2){const dx=Math.sin(y*.19+t*.7)*1.3+Math.sin(y*.07-t*.43)*.8;c.drawImage(this.buffer,0,y,960,2,dx,y,960,2);}c.restore();}else{
'''+old+'      }\n'+s[b:];p.write_text(s)
# Two static assets, without touching game engines or bindings.
p=target/'worker.js';s=p.read_text();marker='import ISLAND_IMAGE from '
pos=s.index(marker);s=s[:pos]+'import WORLD_SCENE from "./ohana-world-scene.webp";\nimport WORLD_TABLE from "./ohana-world-table.webp";\n'+s[pos:]
line='    if (req.method === "GET" && p === "/ohana-island.webp")'
pos=s.index(line);s=s[:pos]+'''    if (req.method === "GET" && p === "/ohana-world-scene.webp") return new Response(WORLD_SCENE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-world-table.webp") return new Response(WORLD_TABLE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
'''+s[pos:];p.write_text(s)
for n in ['ohana-world-scene.webp','ohana-world-table.webp']:shutil.copy2(root/'assets'/n,target/n)
print('Applied world composition and static routes; engines preserved')
