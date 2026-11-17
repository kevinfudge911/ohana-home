const fs=require('fs');
function patch(s){
 const add=fs.readFileSync(__dirname+'/access.js','utf8');
 function replace(a,b){if(s.split(a).length!==2)throw Error('Anchor not unique: '+a.slice(0,80));s=s.replace(a,b);}
 replace("const PZ_TOOLS=[",add+"\nconst PZ_TOOLS=[['pz-access','Play without dragging'],");
 replace("dlg.close();$('#'+b.dataset.pzTool)?.click();","dlg.close();if(b.dataset.pzTool==='pz-access')pzAccessDialog();else $('#'+b.dataset.pzTool)?.click();");
 replace('function pzHandle(m,echo){const d=PZ.data;','function pzHandle(m,echo){const result=pzHandleCore(m,echo);pzAccessEvent(m);return result;}\nfunction pzHandleCore(m,echo){const d=PZ.data;');
 return s;
}
module.exports={patch};if(require.main===module)fs.writeFileSync(process.argv[3],patch(fs.readFileSync(process.argv[2],'utf8')));
