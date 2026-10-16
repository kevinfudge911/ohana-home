const fs=require('fs'),p=process.argv[2],m=require('./patch.json');let a=fs.readFileSync(p,'utf8');for(const [o,n] of [[m.old,m.replacement],[m.oldHandler,m.handler],[m.titleOld,m.titleNew],[m.dockOld,m.dockNew]]){if(a.split(o).length!==2)throw Error('Header anchor changed');a=a.replace(o,n);}fs.writeFileSync(p,a+m.css);console.log('Bounded header patch applied');

