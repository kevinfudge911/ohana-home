const fs=require('fs');fs.writeFileSync(process.argv[3],require('./patch.cjs').worker(fs.readFileSync(process.argv[2],'utf8')));
