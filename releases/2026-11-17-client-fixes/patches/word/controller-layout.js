     // Word's last-play receipt is an explicit row inside the measured workstation.
     // Keep it above the player portraits, never in an unbounded implicit row.
     if(dock.dataset.gameType==='words'&&dock.querySelector(':scope > .word-opponent-last-play')){
      set(dock,{'grid-template-rows':'44px auto var(--landscape-player-row,112px) auto'});
      const receipt=dock.querySelector(':scope > .word-opponent-last-play');
      set(receipt,{'grid-column':'1 / -1','grid-row':'2','min-width':'0',width:'calc(100% - 56px)','max-width':'calc(100% - 56px)','justify-self':'start','align-self':'center',margin:'0'});
      for(const row of dock.querySelectorAll(':scope > .dock-player'))set(row,{'grid-row':'3'});
      for(const row of dock.querySelectorAll(':scope > .dock-bottom-tools'))set(row,{'grid-row':'4'});
     }
