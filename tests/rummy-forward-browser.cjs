const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('playwright');
const out=path.resolve('artifacts/rummy-forward');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:8809/');await page.waitForFunction(()=>typeof S!=='undefined'&&S.me);
 await quiet(page);
 // Actual setup bindings, local Worker create, existing robot and engine.
 await page.evaluate(()=>showGameSetup('shuffle'));
 await page.getByRole('button',{name:'Start Regular Rummy',exact:true}).click();
 await page.locator('[data-setup-key=opponent][data-setup-value=bot]').click();
 await page.locator('[data-new=shuffle]').click();await page.waitForSelector('#game.rd-game');
 await page.waitForFunction(()=>S.gstate?.state?.phase==='draw'&&S.gstate?.players[S.gstate.turn]===S.me.id);
 const id=await page.evaluate(()=>S.game);assert(id);
 await page.locator('[data-dock-shuffle-draw=stock]').click();
 await page.waitForFunction(()=>S.gstate?.state?.phase==='play'&&document.querySelectorAll('.shuffle-rack [data-card]').length===11);
 const initial=await page.locator('.shuffle-rack [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card));const stateBeforeArrange=await page.evaluate(()=>JSON.stringify(S.gstate.state));
 const card=page.locator('.shuffle-rack [data-card]').first();const key=initial[0];
 // Drag uses real mouse pointer events on isolated headless Chrome.
 const a=await card.boundingBox(),b=await page.locator('.shuffle-rack [data-card]').nth(3).boundingBox();
 await page.mouse.move(a.x+10,a.y+35);await page.mouse.down();await page.mouse.move(b.x+15,b.y+35,{steps:12});await page.mouse.up();
 const reordered=await page.locator('.shuffle-rack [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card));assert.notDeepEqual(reordered,initial);assert.deepEqual([...reordered].sort(),[...initial].sort());
 assert.equal(await page.locator('[aria-pressed=true][data-card]').count(),0,'drag never selects');
 await page.evaluate(()=>renderGame());assert.deepEqual(await page.locator('.shuffle-rack [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card)),reordered,'poll preserves drag order');
 const c=page.locator('[data-card="'+key+'"]');await c.focus();await page.keyboard.press('Alt+ArrowRight');
 const keyboardOrder=await page.locator('.shuffle-rack [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card));assert.equal(keyboardOrder.indexOf(key),reordered.indexOf(key)+1);assert.equal(await page.evaluate(()=>JSON.stringify(S.gstate.state)),stateBeforeArrange,'arranging leaves received game state immutable');
 await page.reload();await page.waitForFunction(()=>S.me);await quiet(page);await page.evaluate(id=>openGame(id),id);await page.waitForSelector('.shuffle-rack');await quiet(page);
 assert.deepEqual(await page.locator('.shuffle-rack [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card)),keyboardOrder,'reload preserves private order');
 // Real global move path: duplicate pending submissions are gated; rejection keeps selection/order.
 await page.locator('.shuffle-rack [data-card]').first().click({position:{x:10,y:35}});
 const failureOrder=await page.locator('.shuffle-rack [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card));
 await page.evaluate(()=>{window.savedFixtureApi=api;window.pendingMoveCount=0;api=async(p,b,m)=>{if(p.endsWith('/move')){window.pendingMoveCount++;return new Promise((res,rej)=>{window.rejectFixtureMove=rej;});}return window.savedFixtureApi(p,b,m);};window.pendingFixtureMove=document.querySelector('[data-action=discard]').onclick();});
 await page.evaluate(()=>document.querySelector('[data-action=discard]').onclick());assert.equal(await page.evaluate(()=>window.pendingMoveCount),1);
 await page.evaluate(()=>window.rejectFixtureMove(Error('Synthetic rejection for retry check')));await page.evaluate(()=>window.pendingFixtureMove);await page.evaluate(()=>{api=window.savedFixtureApi;});
 assert.equal(await page.locator('.shuffle-rack [data-card][aria-pressed=true]').count(),1);assert.deepEqual(await page.locator('.shuffle-rack [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card)),failureOrder);await page.locator('.shuffle-rack [data-card][aria-pressed=true]').evaluate(e=>e.click());
 await page.waitForTimeout(3700); // Let the deliberate rejection toast expire before visual evidence.
 const measurements=[];
 for(const [name,viewport]of Object.entries({phone:{width:390,height:844},desktop:{width:1280,height:720},landscape:{width:844,height:390}})){
  await page.setViewportSize(viewport);await page.evaluate(()=>renderGame());await page.waitForTimeout(100);
  measurements.push({mode:'rummy',name,measure:await measure(page)});await page.screenshot({path:path.join(out,'rummy-'+name+'.png')});if(name==='landscape'){await page.locator('.shuffle-rack').evaluate(e=>e.scrollIntoView({block:'end'}));await page.screenshot({path:path.join(out,'rummy-landscape-hand.png')});}
 }
 await page.setViewportSize({width:390,height:844});await page.locator('.shuffle-rack').evaluate(e=>e.scrollLeft=0);
 const first=page.locator('.shuffle-rack [data-card]').first(),selected=await first.getAttribute('data-card');await first.click({position:{x:10,y:36}});
 assert.equal(await page.locator('[data-card="'+selected+'"]').getAttribute('aria-pressed'),'true');
 const revision=await page.evaluate(()=>S.gstate.state.revision);await page.locator('[data-action=discard]').click();
 await page.waitForFunction(rev=>S.gstate?.state?.revision>rev,revision);
 // Privacy: no hidden identity on opponent backs; exact one uniform back markup.
 const privacy=await page.evaluate(()=>({hands:S.gstate.state.hands,backs:[...document.querySelectorAll('.rd-opponent .rd-back')].map(e=>e.innerHTML),own:S.me.id,phase:S.gstate.state.phase}));
 assert(Object.entries(privacy.hands).filter(([k])=>k!=privacy.own).every(([,v])=>typeof v==='number'));assert.equal(new Set(privacy.backs).size,1);
 await page.evaluate(()=>{closeGame();showGameSetup('shuffle')});await page.getByRole('button',{name:'Start Gin Rummy',exact:true}).click();await page.locator('[data-setup-key=opponent][data-setup-value=bot]').click();await page.locator('[data-new=shuffle]').click();await page.waitForSelector('#game.rd-game');
 await page.waitForFunction(()=>S.gstate?.state?.mode==='gin');
 assert.equal(await page.locator('[data-action=meld]').count(),0);
 for(const [name,viewport]of Object.entries({phone:{width:390,height:844},desktop:{width:1280,height:720},landscape:{width:844,height:390}})){
  await page.setViewportSize(viewport);await page.evaluate(()=>renderGame());await page.waitForTimeout(100);measurements.push({mode:'gin',name,measure:await measure(page)});await page.screenshot({path:path.join(out,'gin-'+name+'.png')});if(name==='landscape'){await page.locator('.shuffle-rack').evaluate(e=>e.scrollIntoView({block:'end'}));await page.screenshot({path:path.join(out,'gin-landscape-hand.png')});}
 }
 // Opening pass, stock draw and discard use the real Gin engine and robot response.
 if(await page.locator('[data-action=pass]:enabled').count()){await page.locator('[data-action=pass]').click();await page.waitForFunction(()=>S.gstate.state.phase==='draw');}
 await page.locator('[data-dock-shuffle-draw=stock]:enabled').click();await page.waitForFunction(()=>S.gstate.state.phase==='play');
 assert.equal(await page.locator('[data-action=knock]').count(),1);await page.locator('.shuffle-rack [data-card]').first().click({position:{x:10,y:35}});const ginRev=await page.evaluate(()=>S.gstate.state.revision);await page.locator('[data-action=discard]').click();await page.waitForFunction(rev=>S.gstate.state.revision>rev,ginRev);
 await page.evaluate(()=>showTableHelp('shuffle'));assert(await page.locator('.shuffle-help').isVisible());await page.locator('.shuffle-help [data-close]').click();
 // Preserve optional private groups; saving them submits no move.
 await page.evaluate(()=>{clearTimeout(pollTimer);schedulePoll=()=>{};S.gstate.state.phase='play';S.gstate.turn=S.gstate.players.indexOf(S.me.id);S.gstate.state.hands[S.me.id]=['H1','H2','H3','C4','D5','S6','C7','D8','S9','C10'];S.shuffleDraft=null;renderGame();});
 for(const key of ['H1','H2','H3'])await page.locator('[data-card="'+key+'"]').evaluate(e=>e.click());
 await page.getByRole('button',{name:'Private meld groups',exact:true}).click();await page.locator('dialog [data-group]').click();assert.equal(await page.evaluate(()=>S.shuffleDraft.groups.length),1);assert.equal(await page.locator('dialog[aria-label="Private meld groups"][open]').count(),0);
 // Pointer cancellation restores order. No move is sent while reordering a touch hand.
 await page.setViewportSize({width:390,height:844});const beforeTouch=await page.locator('.shuffle-rack [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card));const touchA=await page.locator('.shuffle-rack [data-card]').first().boundingBox(),touchB=await page.locator('.shuffle-rack [data-card]').nth(2).boundingBox();const cdp=await context.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:touchA.x+10,y:touchA.y+40}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touchB.x+15,y:touchB.y+40}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const touchOrder=await page.locator('.shuffle-rack [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card));assert.notDeepEqual(touchOrder,beforeTouch);assert.deepEqual([...touchOrder].sort(),[...beforeTouch].sort());
 await page.evaluate(()=>{const b=document.querySelector('.shuffle-rack [data-card]'),r=b.getBoundingClientRect();b.dispatchEvent(new PointerEvent('pointerdown',{pointerId:99,button:0,clientX:r.x+10,clientY:r.y+40}));b.dispatchEvent(new PointerEvent('pointermove',{pointerId:99,clientX:r.x+90,clientY:r.y+40}));b.dispatchEvent(new PointerEvent('pointercancel',{pointerId:99}));});assert.deepEqual(await page.locator('.shuffle-rack [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card)),touchOrder);
 await page.evaluate(()=>{closeGame();showGameSetup('shuffle')});await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'decks-phone.png')});
 await page.getByRole('button',{name:'Start Gin Rummy',exact:true}).focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('#game-setup-title')?.getAttribute('aria-label')==='Gin Rummy');
 await page.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());window.OhanaCategoryRooms.open('shuffle')});await page.screenshot({path:path.join(out,'shuffle-phone.png')});
 // Click the label area of the whole collection card, then verify family setup and Back.
 await page.locator('.ohana-category-room [data-setup-game=shuffle] h3').click();await page.getByRole('button',{name:'Start Regular Rummy',exact:true}).click();await page.locator('[data-setup-key=opponent][data-setup-value=family]').click();await page.locator('[data-setup-key=players][data-setup-value="6"]').click();await page.locator('[data-new=shuffle]').click();assert(await page.locator('.setup-invite-people').isVisible());
 await page.locator('[data-setup-back]').click();await page.waitForFunction(()=>document.querySelector('#game-setup-title')?.getAttribute('aria-label')==='Regular Rummy');assert.equal(await page.locator('[data-setup-key=players][data-setup-value="6"]').getAttribute('aria-pressed'),'true');
 const result={testedAt:new Date().toISOString(),syntheticOnly:true,headlessIsolatedChrome:true,sourcePreview:'12d7c6bd96aa71ab06853acaa6de9c49947d9eb8',id,initial,reordered,keyboardOrder,privacy,measurements,errors};
 const baselinePage=await context.newPage(),baselineErrors=[];baselinePage.on('pageerror',e=>baselineErrors.push(e.message));await baselinePage.goto('http://127.0.0.1:8809/?baseline=1');await baselinePage.waitForTimeout(800);await baselinePage.close();result.baselineErrors=baselineErrors;
 fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(result,null,2));assert(errors.every(e=>baselineErrors.includes(e)),'no new browser errors compared with sealed source');
 for(const row of measurements){assert.equal(row.measure.overflow,false);assert(row.measure.approvedSign&&row.measure.headerTitle===(row.mode==='gin'?'Gin Rummy':'Regular Rummy'));assert(row.measure.home.width>=44&&row.measure.home.height>=44);for(const a of row.measure.actions){assert(a.height>=44);assert(a.width>=44);assert(a.x>=0&&a.x+a.width<=row.measure.viewport.width+1);}}
 console.log(JSON.stringify({passed:true,measurements:measurements.length,errors,baselineErrors,syntheticOnly:true}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
async function measure(page){return page.evaluate(()=>{const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}};const dock=document.querySelector('#game-controls-dock');return {viewport:{width:innerWidth,height:innerHeight},overflow:document.documentElement.scrollWidth>innerWidth,approvedSign:!!document.querySelector('#game-head [data-unified-sign]'),headerTitle:document.querySelector('#game-head h2').getAttribute('aria-label'),title:rect(document.querySelector('#game-head h2')),home:rect(document.querySelector('#game-head .room-home-control')),dock:rect(dock),actions:[...dock.querySelectorAll('.dock-actions>button')].map(e=>({text:e.textContent,disabled:e.disabled,...rect(e)})),rack:rect(document.querySelector('.shuffle-rack')),cards:document.querySelectorAll('.shuffle-rack [data-card]').length};});}
async function quiet(page){await page.evaluate(()=>{maybeShowGameReleaseNews=()=>{};maybeShowReleaseNews=()=>{};S._pushAsked=true;});await page.waitForTimeout(400);await page.evaluate(()=>document.querySelectorAll('#ohana-release-dialog[open],#ohana-game-release-dialog[open]').forEach(d=>d.close()));}
