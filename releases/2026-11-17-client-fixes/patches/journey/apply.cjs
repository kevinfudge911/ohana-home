const fs=require('fs'),{app}=require('./patch.cjs');fs.writeFileSync(process.argv[3],app(fs.readFileSync(process.argv[2],'utf8')));
