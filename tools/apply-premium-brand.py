"""Apply the approved presentation layer to a CURRENT, separately recovered source.
Never deploy the old main-branch worker bundled in this repository.
Usage: python tools/apply-premium-brand.py /path/to/current/ohana-source
"""
from pathlib import Path
import re, shutil, sys
root=Path(__file__).resolve().parents[1]
target=Path(sys.argv[1]).resolve()
app=target/'app.html'
s=app.read_text()
assert 'hfCardShape' in s and 'renderOhana10' in s and 'ohana-chat-dialog' in s, 'Recover the current production source first.'
scripts=lambda text:re.findall(r'<script\b[^>]*>[\s\S]*?</script>',text)
before=scripts(s)
style='<style id="ohana-premium-brand">\n'+(root/'assets/premium-ohana.css').read_text()+'\n</style>\n'
if 'id="ohana-premium-brand"' in s:
 s=re.sub(r'<style id="ohana-premium-brand">[\s\S]*?</style>\n?',lambda _:style,s)
else:s=s.replace('</head>',style+'</head>',1)
assert scripts(s)==before
backup=app.with_name('app.before-premium.html')
if not backup.exists():shutil.copy2(app,backup)
asset=target/'ohana-island.webp'
asset_backup=target/'ohana-island.before-premium.webp'
if asset.exists() and not asset_backup.exists():shutil.copy2(asset,asset_backup)
app.write_text(s)
shutil.copy2(root/'assets/ohana-premium-island.webp',asset)
for name in ['ohana-scene.js', 'ohana-scene.js.txt']:
 scene=target/name
 if scene.exists():
  text=scene.read_text().replace('/ohana-island.webp\'', '/ohana-island.webp?v=premium1\'')
  scene.write_text(text)
print('Applied presentation only; all app script blocks preserved. No deploy performed.')
