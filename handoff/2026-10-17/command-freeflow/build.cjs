const fs=require('fs'),crypto=require('crypto'),vm=require('vm');
const base=fs.readFileSync('work/current-user-review-release/app.html','utf8');
const git=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
if(git(base)!=='79de65e43f76315f25eeb7674d3ecc24fb5295a2')throw Error('Source changed');
// Limit the reset to command surfaces. Never apply it to a whole game board.
const targets=[
 '.gr-dialog button','.gr-celebration button','.pz-album-view button','#pz-full-preview button','.ohana-member-profile button','#ohana-game-release-dialog button','#meld-help-dialog button','#ohana-rematch-dialog button','#arrival-invites button','#ohana-notices button','.wild-choice button','#access-help button','.emoji-picker .emoji-heading button','.tunes-editor .tunes-editor-actions button',
 '#ohana-settings-dialog button','.settings-content button','.settings-tools button','.look-tools .setup-choice',
 '#ohana-leaderboard button','#ohana-megaphone button','.ohana-announce button','.ohana-invite-dialog button','.invite-alert button','.invite-game-group button','.invite-table-line button',
 '.room-card button','.room-create button','.room-all-games button','.room-deleted button','.room-name-dialog button',
 '.ohana-warning button','#play-error button','#ohana-own-games button','#faith .faith-seg button','#faith .pr-add button','#faith .pr-filters button','.pr-dialog button',
 '.pz-head button','.pz-tray button','.pz-table-actions button','.pz-room-switch button','.pz-dialog button',
 '.setup-choices .setup-choice','.setup-footer button','.setup-start','.nook-card .nook-go','.game-setup-room header button',
 '.hf-acts button','.o10-actions button','.sp-bidbar button','.mj-tools button','.fm-tools button','.domino-actions button',
 '.game-tray .acts button','#game-controls-dock .acts button','#game-controls-dock .hf-acts button','#game-controls-dock .o10-actions button',
 '.cb-tools button','.cb-actions button','.cb-head button','.cb-shared-tools button','.journey-tools button',
 '.gr-tools button','.gr-toolbar button','.gr-actions button','.gr-head button','.gr-settings button',
 '#ohana-game-rules button','.compact-game-help button','#winbox-play-again',
 '.ohana-room-tour button','.ohana-section-updates button','#ohana-bible-reader button'
];
const exclude=':not(.hf-card,.hf-deck,.hf-pile,.hf-meld,.hf-public-group,.o10-card,.o10-pile,.sp-card,.sp-back,.pz-album-pic,.pz-pic,.pz-table-pic,.cb-swatch,.cb-size,.cb-page,.cb-buddy,.look-preview,[data-pr-color],[data-o10-target],[data-color])';
// Existing legacy CSS uses repeated IDs. This scope wins only for listed commands.
const scope=':is('+['#ohana-settings-dialog'.repeat(140)+' button',...targets].join(',')+')'+exclude;
const css=`/* Menu words with a soft reading light; no raised button face. */
${scope}{background:radial-gradient(ellipse at center,#fff8e8 0%,#fff8e8eb 56%,#fff8e899 70%,transparent 88%)!important;background-color:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;text-shadow:none!important;color:#49351e!important;min-height:44px!important;padding:8px 12px!important;font-weight:800!important;white-space:normal;overflow-wrap:anywhere}
${scope}::before,${scope}::after{display:none!important;content:none!important;box-shadow:none!important;border:0!important}
${scope}:is([aria-pressed="true"],[aria-selected="true"],.on,.active){text-decoration:underline!important;text-decoration-thickness:2px!important;text-underline-offset:5px!important;color:#65421d!important}
${scope}:disabled{opacity:.45!important;cursor:default!important}
${scope}:focus-visible{outline:3px solid #b47c28!important;outline-offset:2px!important}
${scope}.danger,${scope}[data-a="delete"]{color:#8c3f2e!important}
${scope}.room-home-control,${scope}[data-ohana-home],${scope}.hub-home{background:none!important;background-image:none!important;border:0!important;box-shadow:none!important}
`;
const insert='<style id="ohana-command-words-freeflow-v1">\n'+css+'\n</style>\n';
if(base.split('</head>').length!==2)throw Error('Head anchor');const app=base.replace('</head>',insert+'</head>');if(app.replace(insert,'')!==base)throw Error('Non-CSS mutation');
let blocks=0;for(const m of app.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/\bsrc=|application\/(?:json|ld\+json)/.test(m[1])||!m[2].trim())continue;new vm.Script(m[2]);blocks++;}
fs.writeFileSync(__dirname+'/app.html',app);fs.writeFileSync(__dirname+'/controls.css',css);
fs.writeFileSync(__dirname+'/scope-proof.json',JSON.stringify({base:git(base),app:git(app),appBytes:Buffer.byteLength(app),delta:Buffer.byteLength(app)-Buffer.byteLength(base),targetGroups:targets,protectedClasses:exclude,cssOnly:true,exactInverse:true,scriptsUnchanged:true,scriptBlocksParsed:blocks,workerChanged:false,visualBrowserAudit:'NOT RUN; browser connection unavailable',userPhoneReview:'Pending'},null,2));
console.log(JSON.stringify({app:git(app),bytes:Buffer.byteLength(app),delta:Buffer.byteLength(app)-Buffer.byteLength(base),targets:targets.length,cssOnly:true}));

