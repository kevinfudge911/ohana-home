const fs=require('node:fs');
function patch(s){const one=(a,b)=>{if(s.split(a).length!==2)throw Error('Expected one heading anchor');s=s.replace(a,b)};
one("info.append(people,turn);body.append(info,go);row.append(title,body);list.prepend(row);","const heading=document.createElement('header');heading.className='ohana-home-game-group-title';heading.append(title);info.append(people,turn);body.append(info,go);row.append(heading,body);list.prepend(row);");
one("title.textContent='Ohana United · Puzzles';group.append(title);","title.textContent='Ohana United · Puzzles';const heading=document.createElement('header');heading.className='ohana-home-game-group-title';heading.append(title);group.append(heading);");return s;}
module.exports={patch};if(require.main===module)fs.writeFileSync(process.argv[3],patch(fs.readFileSync(process.argv[2],'utf8')));
