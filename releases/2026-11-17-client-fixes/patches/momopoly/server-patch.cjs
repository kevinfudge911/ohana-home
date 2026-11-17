const {OLD,FIX}=require('./patch.cjs');
const anchor="return new Response(object.body, { headers: { 'content-type': 'text/html; charset=utf-8', ...NO_STORE } });";
const replacement=`// Restore the existing Kevin-only, two-tap archive control without changing saved games or R2 assets.
      const html = await object.text();
      const oldControls = ${JSON.stringify(OLD)};
      const fixedControls = ${JSON.stringify(FIX)};
      const page = html.split(oldControls).length === 2 ? html.replace(oldControls, fixedControls) : html;
      return new Response(page, { headers: { 'content-type': 'text/html; charset=utf-8', ...NO_STORE } });`;
function patch(src){if(src.split(anchor).length!==2)throw Error('Expected one game response anchor');return src.replace(anchor,replacement);}
module.exports={patch,anchor,replacement};
if(require.main===module){const fs=require('node:fs');fs.writeFileSync(process.argv[3],patch(fs.readFileSync(process.argv[2],'utf8')));}
