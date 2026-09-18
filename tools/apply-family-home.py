"""Apply family gathering home to freshly recovered illustrated-details release."""
from pathlib import Path
import sys,shutil
root=Path(__file__).resolve().parents[1];target=Path(sys.argv[1]);p=next(target.glob('*-app.html'));s=p.read_text();a=s.index('/* Shared scene and table composition.');b=s.index('function renderJoin(',a);s=s[:a]+(root/'assets/ohana-world.js').read_text()+'\n'+s[b:]
s=s.replace('function renderJoin(errMsg) {','function renderJoin(errMsg) {\n ensureWorldScene(null);')
s=s.replace('</head>','<style id="ohana-family-home">\n'+(root/'assets/ohana-family.css').read_text()+'\n</style></head>');p.write_text(s)
p=next(target.glob('*-ohana-scene.js.txt'));s=p.read_text().replace("||'/ohana-world-scene.webp'):'/ohana-island.webp?v=premium1'", "||'/ohana-family-home-v2.webp'):'/ohana-family-home-v2.webp'")
assert '/ohana-family-home-v2.webp' in s
s=s.replace("c.rect(185,112,585,76);c.clip();", "if(this.getAttribute('world-theme')==='home')c.rect(350,112,275,110);else c.rect(185,112,585,76);c.clip();")
s=s.replace('Ohana Home ocean porch with two wicker chairs, a family game, soda glasses, and the Good Games Brighter People pillow','Ohana family home with a sofa, two wicker chairs, soda glasses, and a flower pillow')
p.write_text(s)
p=target/'worker.js';s=p.read_text();s='import OHANA_FAMILY_HOME from "./ohana-family-home-v2.webp";\n'+s;marker='    if (req.method === "GET" && p === "/ohana-world-scene.webp")';pos=s.index(marker);s=s[:pos]+'    if (req.method === "GET" && (p === "/ohana-family-home-v2.webp" || p === "/ohana-family-home-v1.webp")) return new Response(OHANA_FAMILY_HOME, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=86400" } });\n'+s[pos:];p.write_text(s)
shutil.copy2(root/'assets/ohana-family-home-v2.webp',target/'ohana-family-home-v2.webp');print('Applied family home and room-member gathering, engine unchanged')
