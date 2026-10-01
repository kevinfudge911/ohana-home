"""Apply to freshly recovered live public app HTML, never to a stale Worker."""
from pathlib import Path
import sys
r=Path(__file__).resolve().parent;p=Path(sys.argv[1]);s=p.read_text();assert 'id="puzzle-picture-layout"' not in s
marker='\n}\nfunction renderPuzzleLobbyStatic';assert s.count(marker)==1
s=s.replace(marker,'\n pzPictureLobby(m,d,rooms);'+marker)
s=s.replace('function renderPuzzleLobbyStatic',(r/'puzzle-layout.js').read_text()+'\nfunction renderPuzzleLobbyStatic',1)
s=s.replace('</head>','<style id="puzzle-picture-layout">'+(r/'puzzle-layout.css').read_text()+'</style></head>',1)
p.write_text(s)
