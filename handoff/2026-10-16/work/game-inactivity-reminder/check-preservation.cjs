const fs=require('fs'),assert=require('node:assert/strict');
const a=fs.readFileSync('work/final-current-release/worker.js','utf8'),b=fs.readFileSync(__dirname+'/worker.js','utf8'),moduleText=fs.readFileSync(__dirname+'/reminder.js','utf8');
const start=a.indexOf('  async scheduled(event, env222222, ctx) {'),end=a.indexOf('  async fetch(req, env222222, ctx) {',start);
const nextStart=b.indexOf('  async scheduled(event, env222222, ctx) {'),nextEnd=b.indexOf('  async fetch(req, env222222, ctx) {',nextStart);
let restored=b.slice(0,nextStart)+a.slice(start,end)+b.slice(nextEnd);
restored=restored.replace(moduleText+'\n','').replace('      await recordOhanaGameActivity(db,me.id,st.lastPlay.at).catch(error=>console.warn("Game activity tracking failed",error.message));\n','');
assert.equal(restored,a,'Unexpected worker changes outside reminder module, scheduled handler and activity hook');
console.log('PASS all worker bytes outside three approved hunks unchanged; PuzzleRoom code unchanged');

