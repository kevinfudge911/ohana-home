"""Local visual preview with fictional data; never contacts production.
Run python tools/preview.py, then open http://localhost:8765.
"""
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
fixture=r'''
clearTimeout(pollTimer); schedulePoll = () => {};
S.token='local-preview';S.me={id:1,name:'Alex',avatar:'🐢',is_admin:false};S._pushAsked=true;
const previewMembers=[S.me,{id:2,name:'Jamie',avatar:'🌺',online:true},{id:3,name:'Riley',avatar:'🦊',online:false}];
const previewTypes={words:{name:'Ohana Words',max:4,desc:'Build words. Find surprises. Make memories.'},tictac:{name:'Tic-Tac-Toe',max:2,desc:'A quick little game for a big smile.'},memory:{name:'Memory Match',max:2,desc:'Flip a card. Find a pair. Play together.'},checkers:{name:'Checkers',max:2,desc:'A family favorite, one clever move at a time.'}};
let previewGame={id:1,type:'words',name:'Ohana Words',status:'playing',in_game:true,my_turn:true,players:[1,2],turn:0,max_players:2,updated_at:1,mode:'classic',state:{board:Array(225).fill(null),bonus:Array(225).fill(''),racks:{1:['F','A','M','I','L','Y','S']},scores:{1:48,2:36},bag:64,lastMove:[],foundSurprises:{},surprises:[],chat:[{p:2,text:'Always room for one more game. ❤️'}],history:[]}};
for(let i=0;i<225;i++){if(i%37===0)previewGame.state.bonus[i]='TW';else if(i%17===0)previewGame.state.bonus[i]='DL';else if(i%23===0)previewGame.state.bonus[i]='DW';}
'HOME'.split('').forEach((l,i)=>previewGame.state.board[110+i]={l,v:LV[l]});
const previewWords=JSON.parse(JSON.stringify(previewGame.state));
const previewSync=()=>({me:S.me,familyName:'Our family, together',members:previewMembers,games:[previewGame],types:previewTypes,messages:[]});
api=async (path,body)=>{
 if(path.startsWith('/api/sync'))return previewSync();
 if(path.endsWith('/chat')){previewGame.state.chat.push({p:1,text:body.text});return {};}
 if(path==='/api/game/create'){
  previewGame={...previewGame,type:body.type,name:previewTypes[body.type].name,turn:0};
  if(body.type==='words')previewGame.state=JSON.parse(JSON.stringify(previewWords));
  if(body.type==='checkers')previewGame.state={board:Array.from({length:64},(_,i)=>(Math.floor(i/8)+i%8)%2===1?(i<24?'b':i>39?'r':null):null),mustContinue:null,chat:[]};
  if(body.type==='tictac')previewGame.state={board:Array(9).fill(null),chat:[]};
  if(body.type==='memory')previewGame.state={cards:['🐢','🐢','🌺','🌺','🦊','🦊','⭐','⭐','🐱','🐱','🐸','🐸','🌞','🌞','🍀','🍀'],matched:[],open:[],pending:[],scores:{1:0,2:0},chat:[]};
  return {id:1};
 }
 if(path.endsWith('/move')){toast('Design preview only — game results are not saved.');if(previewGame.type==='tictac'){previewGame.state.board[body.i]='X';previewGame.turn=1;}return {};}
 if(path==='/api/message'){S.msgs.push({id:Date.now(),member_id:1,text:body.text,created_at:Date.now()});return {};}
 if(path==='/api/game/1')return JSON.parse(JSON.stringify(previewGame));
 throw new Error('Preview only: this action does not change a real account.');
};
S.sync=previewSync();
render();
'''
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  route=self.path.split('?')[0]
  if route=='/':
   b='''<!doctype html><html><head><title>Ohana Home design preview</title></head><body style="margin:0;background:#091e23;color:#f4dfb9;font:16px system-ui;padding:24px"><p>LOCAL DESIGN PREVIEW · Fictional family data · 390 × 844 mobile layout</p><iframe title="Ohana Home mobile preview" src="/app.html" style="width:390px;height:844px;border:1px solid #ab9165;border-radius:22px"></iframe><p><a style="color:#f4dfb9" href="/app.html">Open full width</a> · <a style="color:#f4dfb9" href="/join.html">Welcome screen</a></p></body></html>'''.encode();mime='text/html'
  elif route in ['/app.html','/join.html']:
   s=(ROOT/'app.html').read_text();start=s.index('// On load: check for invite URL');s=s[:start]+(fixture if route=='/app.html' else "clearTimeout(pollTimer);schedulePoll=()=>{};S.token=null;render();")+'\n</script></body></html>';b=s.encode();mime='text/html'
  elif route=='/ohana-welcome.png':b=(ROOT/'ohana-welcome.png').read_bytes();mime='image/png'
  else:self.send_error(404);return
  self.send_response(200);self.send_header('Content-Type',mime);self.end_headers();self.wfile.write(b)
if __name__ == '__main__':
 ThreadingHTTPServer(('0.0.0.0',8765),Handler).serve_forever()
