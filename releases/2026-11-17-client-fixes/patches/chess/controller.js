     // Chess has no card-action row: give status, people and captures explicit tracks.
     // A legacy guide column and 70px portrait rail squeezed the phone workstation.
     if(dock.dataset.gameType==='chess'){
      set(dock,{'grid-template-columns':'minmax(0,1fr)','grid-template-rows':'auto auto auto auto auto','align-content':'start'});
      for(const row of dock.querySelectorAll(':scope > .dock-command-row')){
       const empty=!row.querySelector('button,a[href],input,select,textarea,[role="button"]')&&!row.textContent.trim();
       set(row,{'grid-column':'1 / -1','grid-row':'1',width:'calc(100% - 56px)',display:empty?'none':'grid',height:empty?'0px':'auto','min-height':empty?'0px':'44px'});
      }
      for(const guide of dock.querySelectorAll(':scope > .dock-guide')){
       set(guide,{'grid-column':'1 / -1','grid-row':'2',position:'static',transform:'none',width:'calc(100% - 56px)','max-width':'calc(100% - 56px)','min-width':'0','justify-self':'start','text-align':'center','white-space':'normal','overflow-wrap':'anywhere',overflow:'visible',padding:'2px 4px','box-sizing':'border-box'});
      }
      for(const row of dock.querySelectorAll(':scope > .dock-player')){
       set(row,{'grid-column':'1 / -1','grid-row':'3',height:'auto','min-height':'86px','max-height':'none','align-items':'center','overflow-y':'visible'});
      }
      for(const captures of dock.querySelectorAll(':scope > .chess-captures'))set(captures,{'grid-column':'1 / -1','grid-row':'4','min-width':'0',width:'calc(100% - 56px)','max-width':'calc(100% - 56px)','justify-self':'start','box-sizing':'border-box'});
      for(const tools of dock.querySelectorAll(':scope > .dock-bottom-tools'))set(tools,{'grid-column':'1 / -1','grid-row':'5'});
     }
