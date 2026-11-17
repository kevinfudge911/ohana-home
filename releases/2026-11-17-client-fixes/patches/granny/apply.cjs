const fs=require('fs');fs.writeFileSync(process.argv[3],require('./keyboard.cjs').apply(fs.readFileSync(process.argv[2],'utf8')));
