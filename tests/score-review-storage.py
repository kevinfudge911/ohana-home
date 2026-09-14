import sqlite3
from pathlib import Path
import json
c=sqlite3.connect(':memory:')
c.executescript(Path('migrations/0002_score_reviews.sql').read_text())
c.execute('INSERT INTO score_reviews VALUES(?,?)',(4,json.dumps({'id':'review-1','acknowledged':{}})))
sql="UPDATE score_reviews SET payload=json_set(payload,?,COALESCE(json_extract(payload,?),?)) WHERE game_id=? AND json_extract(payload,'$.id')=?"
def ack(member,stamp,review='review-1'):
 p='$.acknowledged."'+str(member)+'"'
 return c.execute(sql,(p,p,stamp,4,review)).rowcount
assert ack(5,100)==1
assert ack(6,200)==1
assert ack(5,300)==1
assert ack(6,400,'stale-review')==0
r=json.loads(c.execute('SELECT payload FROM score_reviews').fetchone()[0])
assert r['acknowledged']=={'5':100,'6':200}
print('PASS: atomic independent acknowledgments, stable first-seen times, stale-review rejection.')
