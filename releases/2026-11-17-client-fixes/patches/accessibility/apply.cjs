const fs=require('fs');
const games=require('./games/apply.cjs'),shell=require('./shell.cjs');
const source=fs.readFileSync(process.argv[2],'utf8');
fs.writeFileSync(process.argv[3],shell.apply(games.apply(source)));
