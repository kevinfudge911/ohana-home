'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function apply(input){
 let s=input;assert(!s.includes('data-music-branding-fix-20261117'),'Already patched');
 const arts={landscape:['d4f14940add54e62b9c3c55e001bf442eff3d67ac0dc41a2090953ea76f091fb','5e7677c2145d9216223b5f2e0e0920b596e9f9fa036db195703fb846e53f0815'],portrait:['79c022492201c59af06ec920e4c27fa6ec7c3e077d48f5ab06b6f839c1b8e0fa','fb574e16ab9bce5e7798d5cca2d6960ec61b46065acc079ff4e2cd3eb3780383']};
 for(const[k,[before,after]]of Object.entries(arts)){
  const matches=[...s.matchAll(/data:image\/webp;base64,[A-Za-z0-9+/=]+/g)].filter(m=>hash(Buffer.from(m[0].split(',')[1],'base64'))===before);assert.equal(matches.length,1,k+' source count');
  const p=path.join(__dirname,k+'-after.webp');const b=fs.existsSync(p)?fs.readFileSync(p):Buffer.from(fs.readFileSync(p+'.b64','utf8').trim(),'base64');assert.equal(hash(b),after,k+' output hash');
  s=s.replace(matches[0][0],'data:image/webp;base64,'+b.toString('base64'));
 }
 const replace=(a,b,n=1)=>{assert.equal(s.split(a).length-1,n,'Anchor count: '+a);s=s.split(a).join(b);};
 replace("const jb=document.getElementById('ohana-jukebox-private');if(app&&app.style.visibility==='hidden'&&jb&&getComputedStyle(jb).display!=='none')return 'music';","const jb=document.getElementById('ohana-jukebox-private');/* data-music-branding-fix-20261117: the modal player owns its Home and Close header. Keep the Bridge in the room, not over the player's search field. */if(jb?.shadowRoot?.querySelector('.full:not([hidden])'))return '';if(app&&app.style.visibility==='hidden'&&jb&&getComputedStyle(jb).display!=='none')return 'music';");
 for(const[a,b,n]of [
 ['Ohana Tunes song reader','Ohana Music song reader',2],
 ["title.textContent='Ohana Tunes'","title.textContent='Ohana Music'",1],
 ['The complete Ohana TSCMS room with all four musicians','The complete Ohana Music room with all four musicians',1],
 ['Enter Ohana TSCMS music room','Enter Ohana Music room',2],
 ['Ohana TSCMS music room entrance','Ohana Music room entrance',1],
 ['Go to Ohana TSCMS','Go to Ohana Music',1]
 ])replace(a,b,n);
 return s;
}
module.exports=apply;
if(require.main===module){assert(process.argv[2]&&process.argv[3],'Usage: node apply.cjs INPUT OUTPUT');const input=fs.readFileSync(process.argv[2],'utf8'),out=apply(input);fs.writeFileSync(process.argv[3],out);console.log(JSON.stringify({input:hash(input),output:hash(out)}));}
