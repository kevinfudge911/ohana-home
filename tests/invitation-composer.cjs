// Actual configured composer + actual overlay history, fictional model only.
const assert=require('assert/strict'),{JSDOM}=require('jsdom'),fixture=require('../tools/invitation-fixture.cjs');
const dom=new JSDOM('<body><main id="app"><button id="trigger">Invite</button><p id="fixture-status"></p></main></body>',{url:'https://fixture.invalid',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document;
w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
w.eval(fixture.code+'\nwindow.run=code=>eval(code);');
const run=code=>w.run(code),q=s=>d.querySelector(s),tick=async()=>{await new Promise(r=>setTimeout(r,20));};
const click=s=>{assert(q(s),s);q(s).click();},person=id=>`[data-invite-person="${id}"]`,posts=()=>JSON.parse(run('JSON.stringify(calls.filter(c=>c.method===\'POST\'))'));
async function open(id,type){await run(`openOhanaInvite(${id||'undefined'},${JSON.stringify(type)})`);await tick();return q('#ohana-start-game');}
(async()=>{
 const dialog=await open(5);assert(q(person(5)).checked);assert(!q('#invite-table'));assert(!q('#table-invite-person'));
 assert.match(q('#invite-summary').textContent,/^1 separate game ·/,'one recipient uses singular game');
 const labelRule=fixture.html.match(/\.invite-people label\{[^}]*\}/)?.[0];assert(labelRule,'production recipient label style exists');
 const style=d.createElement('style');style.textContent=labelRule;d.head.append(style);
 const labelStyle=w.getComputedStyle(q('.invite-people label'));
 assert.equal(labelStyle.paddingLeft,'10px','checkbox has a left inset inside its label');
 assert.equal(labelStyle.paddingRight,'10px','checkbox label keeps both sides inside the dialog');
 assert.equal(labelStyle.boxSizing,'border-box');assert(parseFloat(labelStyle.minHeight)>=44,'recipient hitbox stays touch sized');
 for(const id of [2,3,4])assert(q(person(id)).disabled);assert(!q(person(-1)));assert(!q(person(1)));assert(!q(person(90)));assert(q('[data-invite-type="spades"]').disabled);assert(q('[data-invite-type="solo"]').disabled);
 click('#invite-select-all');assert.equal(d.querySelectorAll('[data-invite-person]:checked').length,4);assert.match(q('#invite-summary').textContent,/4 separate games.*Fixture Person 5, Fixture Person 6, Fixture Person 7, Fixture Person 8/);assert.equal(posts().length,0);
 const marker=w.history.state.ohanaOverlayNav,send=q('#send-ohana-invite').onclick;await Promise.all([send(),send()]);await tick();assert.equal(posts().length,1);assert.deepEqual(posts()[0].body.member_ids,[5,6,7,8]);assert.equal(posts()[0].body.mode,'individual');assert.equal(q('#ohana-start-game'),dialog);assert.equal(w.history.state.ohanaOverlayNav,marker,'success does not close/push another screen');assert.equal(d.querySelectorAll('[data-invite-person]:checked').length,0);assert.match(q('.invite-error').textContent,/keep inviting/);assert(q(person(5)).disabled);
 click('[data-invite-mode="group"]');click('[data-invite-type="memory"]');click(person(5));click(person(6));assert(q('#send-ohana-invite').disabled);
 click('[data-invite-type="spades"]');click(person(5));click(person(6));assert(q('#send-ohana-invite').disabled);click(person(7));assert(!q('#send-ohana-invite').disabled);click(person(8));assert(q('#send-ohana-invite').disabled);click(person(8));assert.match(q('#invite-summary').textContent,/1 group game/);await q('#send-ohana-invite').onclick();assert.equal(posts().at(-1).body.mode,'group');assert.equal(posts().at(-1).body.member_ids.length,3);
 click('[data-invite-type="shuffle"]');click('[data-invite-game-mode="gin"]');click(person(5));click(person(6));assert(q('#send-ohana-invite').disabled,'Gin keeps two-player rule');click(person(6));await q('#send-ohana-invite').onclick();assert.equal(posts().at(-1).body.game_mode,'gin');
 // Lost response: preserve names/mode and safely retry exactly the same request.
 click('[data-invite-type="handfoot"]');click(person(5));click(person(6));run("nextPost=body=>{committed(body);throw Error('Fixture lost response');}");await q('#send-ohana-invite').onclick();const lost=posts().at(-1).body;assert.match(q('#send-ohana-invite').textContent,/Retry same send/);assert.equal(d.querySelectorAll('[data-invite-person]:checked').length,2);assert(q('fieldset').disabled);await q('#send-ohana-invite').onclick();assert.equal(posts().at(-1).body.request_id,lost.request_id);assert(q('#ohana-start-game'));
 // A malformed success response after commit is also uncertain, not a fresh send.
 click('[data-invite-type="tictac"]');click(person(5));run("nextPost=body=>{committed(body);return {ok:false};}");
 await q('#send-ohana-invite').onclick();const malformed=posts().at(-1).body;assert.match(q('#send-ohana-invite').textContent,/Retry same send/);
 await q('#send-ohana-invite').onclick();assert.equal(posts().at(-1).body.request_id,malformed.request_id);assert.match(q('.invite-error').textContent,/keep inviting/);
 // A known rejection leaves the current composer editable.
 click('[data-invite-type="checkers"]');click(person(5));run("nextPost=()=>{throw Object.assign(Error('Fixture table changed; refresh people.'),{status:400});}");await q('#send-ohana-invite').onclick();assert(!q('fieldset').disabled);assert.match(q('.invite-error').textContent,/table changed/);assert(q(person(5)).checked);
 // Cancel/reopen during an in-flight request must share its completion.
 run('nextPost=body=>new Promise(resolve=>window.finishSend=()=>resolve(committed(body)))');const pending=q('#send-ohana-invite').onclick(),before=posts().length;click('#cancel-ohana-invite');await tick();assert(!q('dialog'));await open();assert(q('#send-ohana-invite').disabled);assert.match(q('#invite-summary').textContent,/Fixture Person 5/);w.finishSend();await pending;await tick();assert.equal(posts().length,before);assert(q('#ohana-start-game'));assert.match(q('.invite-error').textContent,/keep inviting/);assert(!q('#invite-table'));
 // Real overlay Back/Forward handling retires closed tokens without reopening.
 w.history.back();await tick();assert(!q('dialog'));w.history.forward();await tick();assert(!q('dialog'));
 // Stale loads cannot replace a newly opened composer.
 run('nextGet=()=>new Promise(resolve=>window.finishLoad=resolve)');run('openOhanaInvite(8)');click('#cancel-ohana-invite');await tick();const newer=await open(7);w.finishLoad(JSON.parse(run('JSON.stringify(options)')));await tick();assert.equal(q('dialog'),newer);click('#cancel-ohana-invite');await tick();
 // Late successful send after close stays closed.
 await open(8);click('[data-invite-type="mahjong"]');click(person(8));run('nextPost=body=>new Promise(resolve=>window.finishSend=()=>resolve(committed(body)))');const late=q('#send-ohana-invite').onclick();click('#cancel-ohana-invite');w.finishSend();await late;await tick();assert(!q('dialog'));
 // A server 503 after committing keeps the exact request through Cancel and
 // reopen; the receipt replay confirms that single send.
 await open(7,'tictac');run("nextPost=body=>{committed(body);throw Object.assign(Error('Could not confirm this send.'),{status:503});}");
 await q('#send-ohana-invite').onclick();const uncertain=posts().at(-1).body;
 assert.match(q('#send-ohana-invite').textContent,/Retry same send/);assert(q('fieldset').disabled);
 click('#cancel-ohana-invite');await tick();await open();
 assert.match(q('#send-ohana-invite').textContent,/Retry same send/);await q('#send-ohana-invite').onclick();
 assert.equal(posts().at(-1).body.request_id,uncertain.request_id);assert.equal(run('receipts.has('+JSON.stringify(uncertain.request_id)+')'),true);assert.match(q('.invite-error').textContent,/keep inviting/);
 click('#cancel-ohana-invite');await tick();
 // Membership/room changes invalidate the owner and old responses.
 run('nextGet=()=>new Promise(resolve=>window.finishLoad=resolve)');run('openOhanaInvite()');run('S.room=2;S.roomEpoch++;if(ohanaInvite&&!ohanaInvite.current())ohanaInvite.close()');w.finishLoad(JSON.parse(run('JSON.stringify(options)')));await tick();assert(!q('dialog'));
 assert(fixture.html.includes('if(ohanaInvite&&!ohanaInvite.current())ohanaInvite.close();'));
 assert(fixture.extract('showOhanaFreshInvites').includes('if(ohanaInvite?.current())return;'),'arrival popup cannot cover current invite workflow');
 assert(!fixture.extract('openOhanaInvite').includes('openGame('),'family success cannot navigate to a table');
 console.log('PASS: production composer modes, bulk eligibility, limits/Gin/robots, current-screen success, 503 same-request recovery across reopen, double-click, Cancel/reopen, real overlay Back/Forward, stale loads and late completion.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>w.close());
