const fs=require('fs'),path=require('path'),vm=require('vm');
const base=process.argv[2]||'minimal-chat-release/post/app.html',out=process.argv[3]||'thanksgiving-immersive/candidate.html';let s=fs.readFileSync(base,'utf8');
function one(a,b){if(s.split(a).length!==2)throw Error('Expected one anchor: '+a.slice(0,90));s=s.replace(a,b);}
const start='<style id="ohana-thanksgiving-theme">',end='</style>';const i=s.indexOf(start),j=s.indexOf(end,i);if(i<0||j<0||s.indexOf(start,i+1)>=0)throw Error('Seasonal style anchor');
s=s.slice(0,i)+start+fs.readFileSync(path.join(__dirname,'style.css'),'utf8')+s.slice(j);
one("foyer.insertAdjacentHTML('beforeend',ohanaEntranceBible());","foyer.insertAdjacentHTML('beforeend',ohanaEntranceBible());\n const thanks=document.createElement('header');thanks.className='ohana-harvest-welcome';thanks.innerHTML='<p>Gathered in His love</p><h2>Thank you, Jesus,<br>for Thanksgiving</h2><p>A place at the table. A heart full of gratitude.</p>';foyer.before(thanks);");
one("if(homeHeader)foyer.before(homeHeader);","if(homeHeader)(foyer.previousElementSibling?.classList.contains('ohana-harvest-welcome')?foyer.previousElementSibling:foyer).before(homeHeader);");
one('Your choice affects only decorative room colors and borders, not your character, cards or puzzle background.','Your choice changes the Thanksgiving welcome scene and decorative room styling, not your character, cards or puzzle background.');
for(const m of s.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))if(m[1].trim())new vm.Script(m[1]);fs.writeFileSync(out,s);console.log(require('crypto').createHash('sha256').update(s).digest('hex'));
