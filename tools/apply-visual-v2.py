"""Apply presentation-only repair to a freshly recovered Ohana Home module folder."""
from pathlib import Path
import re,sys,base64
root=Path(__file__).resolve().parents[1]
target=Path(sys.argv[1])
app=next(target.glob('*-app.html'))
s=app.read_text()
css=(root/'assets/premium-ohana-v2.css').read_text()
for token,name in [('WOOD_ASSET','ohana-wood-v2.webp'),('LOGO_ASSET','ohana-logo-v2.webp')]:
 p=root/'assets'/name
 css=css.replace(token,'url("data:image/webp;base64,'+base64.b64encode(p.read_bytes()).decode()+'")' if p.exists() else 'none')
old=re.findall(r'<script\b[^>]*>[\s\S]*?</script>',s)
s=re.sub(r'<style id="ohana-premium-brand">[\s\S]*?</style>',lambda _: '<style id="ohana-premium-brand">\n'+css+'\n</style>',s)
assert old==re.findall(r'<script\b[^>]*>[\s\S]*?</script>',s)
app.write_text(s)
# Keep animation, time-of-day and canvas untouched. Restyle only surrounding frame.
for p in target.glob('*-ohana-scene.js*'):
 s=p.read_text()
 if '/* visual-v2 */' not in s:
  s=s.replace('</style>', '''/* visual-v2 */
 section{border-radius:0;border:0;border-bottom:3px solid #ffdc8b;box-shadow:none;aspect-ratio:16/8}
 canvas{object-fit:cover}
 .title{display:none}
 .saying{top:8%;left:0;right:0;text-align:center;color:#fff6d3!important;font-size:clamp(14px,2.4vw,21px);text-shadow:0 1px 3px #153c48;opacity:1}
 .verse{font-size:clamp(11px,1.9vw,14px);padding:8px 5px;background:linear-gradient(transparent,#093e4bd9)}
 @media(min-width:700px){section{aspect-ratio:3/1}}
 </style>''',1)
 p.write_text(s)
print('Applied visual repair; all app scripts unchanged')
