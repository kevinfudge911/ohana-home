"""Apply room and game identity artwork to a fresh live world-rebuild package."""
from pathlib import Path
import sys,re,shutil
root=Path(__file__).resolve().parents[1];target=Path(sys.argv[1]);p=next(target.glob('*-app.html'));s=p.read_text()
a=s.index('/* Shared scene and table composition.');b=s.index('function renderJoin(',a)
s=s[:a]+(root/'assets/ohana-world.js').read_text()+'\n'+s[b:]
s=s.replace('</head>','<style id="ohana-illustrated-details">\n'+(root/'assets/ohana-details.css').read_text()+'\n</style></head>')
s=s.replace("  $('#new-room').onsubmit=", "  decorateWorldRooms();\n  $('#new-room').onsubmit=")
s=s.replace('const rerender = () => renderWords(st, g, myTurn);','const rerender = () => {renderWords(st,g,myTurn);mountWorldGame(g,st);};')
p.write_text(s)
p=next(target.glob('*-ohana-scene.js.txt'));s=p.read_text()
a=s.index('      const im=new Image();');b=s.index('\n    }',a)
s=s[:a]+'      this.loadWorldArt();'+s[b:]
pos=s.index('    disconnectedCallback()')
s=s[:pos]+'''    static get observedAttributes(){return ['world-theme'];}
    attributeChangedCallback(){if(this.ctx)this.loadWorldArt();}
    loadWorldArt(){
      const url=this.hasAttribute('world')?({garden:'/ohana-garden-v1.webp',cove:'/ohana-cove-v1.webp'}[this.getAttribute('world-theme')]||'/ohana-world-scene.webp'):'/ohana-island.webp?v=premium1';
      if(url===this.artUrl)return;this.artUrl=url;const im=new Image();im.src=url;
      im.decode().then(()=>{if(this.artUrl!==url)return;this.images.island=im;clearTimeout(this.timer);if(this.isConnected)this.tick();}).catch(()=>{if(!this.images.island){this.style.background='url("'+url+'") center/cover';this.canvas.style.opacity='0';}});
    }
'''+s[pos:]
s=s.replace('const c=this.ctx,b=this.buffer.getContext',"if(!this.images.island)return;\n      const c=this.ctx,b=this.buffer.getContext")
p.write_text(s)
p=target/'worker.js';s=p.read_text();names=['ohana-garden-v1.webp','ohana-cove-v1.webp','ohana-flowers-v1.webp']
imports=''.join('import OHANA_DETAIL_'+str(i)+' from "./'+n+'";\n' for i,n in enumerate(names));s=imports+s
marker='    if (req.method === "GET" && p === "/ohana-world-scene.webp")';pos=s.index(marker)
s=s[:pos]+''.join('    if (req.method === "GET" && p === "/'+n+'") return new Response(OHANA_DETAIL_'+str(i)+', { headers: { "content-type": "image/webp", "cache-control": "public,max-age=86400" } });\n' for i,n in enumerate(names))+s[pos:];p.write_text(s)
for n in names:shutil.copy2(root/'assets'/n,target/n)
print('Applied room settings, scoreboards, illustrated details and three static assets')
