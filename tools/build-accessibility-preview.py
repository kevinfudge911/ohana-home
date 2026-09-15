"""Publishable fictional fixture. No authentication, API calls or account changes."""
from pathlib import Path
s=Path('app.html').read_text()
s=s.replace("if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});",'')
a=s.index('(async () => {',s.index('function getInviteLink'));b=s.index('})();',a)+5;s=s[:a]+s[b:]
s=s.replace('schedulePoll();','')
a=s.index("document.addEventListener('visibilitychange'");b=s.index('// ---------- INVITE SYSTEM',a);s=s[:a]+s[b:]
# All local storage is isolated from actual accounts, including mute preferences.
s=s.replace('localStorage','previewStorage')
s=s.replace('<head>','<head><script>const previewStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};window.fetch=async()=>{throw Error("Fictional preview: network actions are disabled")};</script>')
fixture=Path('tests/fixtures/words-ui.js').read_text()+'''
S.game=1;S.gstate=previewGame;renderGame();
const picker=document.createElement('div');picker.className='preview-switcher';picker.innerHTML='<b>Practice only · fictional players</b><label>Choose a practice game <select id="practice-game"><option value="words">Words</option><option value="tictac">Tic-Tac-Toe</option><option value="memory">Memory</option><option value="checkers">Checkers</option><option value="mahjong">Mahjong</option><option value="handfoot">Hand & Foot</option></select></label>';document.body.prepend(picker);
picker.querySelector('select').onchange=async e=>{
 const type=e.target.value;
 if(['words','tictac','memory','checkers'].includes(type))await api('/api/game/create',{type});
 else if(type==='mahjong')previewGame={...previewGame,type,name:'Ohana Mahjong',state:{tiles:[{id:1,face:0,x:0,y:0,z:0},{id:2,face:0,x:3,y:0,z:0},{id:3,face:1,x:0,y:2,z:0},{id:4,face:1,x:3,y:2,z:0}],pairs:0,revision:1,scores:{1:0,2:0},chat:[]}};
 else previewGame={...previewGame,type,name:'Hand & Foot',state:{hands:{1:[{id:1,rank:'K',suit:'♥'},{id:2,rank:'K',suit:'♣'},{id:3,rank:'K',suit:'♦'}],2:11},feet:{1:11,2:11},inFoot:{},melds:{1:[],2:[]},red3s:{1:[],2:[]},scores:{1:0,2:0},drawPile:80,discardPile:[{rank:'6',suit:'♥'}],discardCount:3,hasDrawn:true,chat:[]}};
 S.game=1;S.placed=[];S.sel=null;S.chkFrom=null;S.gstate=previewGame;renderGame();document.querySelector('#board').focus();
};
'''
s=s.replace('</body>','<script>'+fixture+'</script></body>')
s=s.replace('</style>','.preview-switcher{padding:10px;background:#103842;color:#fff1ce;position:relative;z-index:90}.preview-switcher label{display:inline-block;margin-left:14px}.preview-switcher select{background:#17464d;color:#fff1ce}#game{position:relative;height:calc(100dvh - 60px);max-width:700px;margin:auto} </style>',1)
Path('accessibility-preview.html').write_text(s)
