/* Ohana Home living porch. Clock uses Central Time; decorative light schedule,
   not a forecast. Date-seeded cloud motion does not restart when navigating. */
(() => {
  const zone = new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  const clamp = x => Math.max(0,Math.min(1,x));
  function lighting(date) {
    const p=Object.fromEntries(zone.formatToParts(date).map(x=>[x.type,x.value]));
    const h=+p.hour + +p.minute/60 + +p.second/3600;
    return {day:clamp(Math.min((h-6)/2,(19-h)/2)),night:clamp(Math.max((5.8-h)/1.3,(h-19)/1.5))};
  }
  class OhanaScene extends HTMLElement {
    connectedCallback() {
      if(this.shadowRoot) return;
      const root=this.attachShadow({mode:'open'});
      root.innerHTML=`<style>
      :host{display:block;contain:content}section{position:relative;aspect-ratio:3/2;overflow:hidden;border-radius:18px;border:1px solid #b6976277;background:#173441;box-shadow:0 10px 30px #00181c44}canvas{display:block;width:100%;height:100%}.title,.saying,.verse{position:absolute;pointer-events:none;margin:0;font-family:Georgia,serif}.title{top:4%;left:0;width:100%;text-align:center;font-weight:400;font-size:clamp(12px,2.6vw,19px);color:#ffe6b7;text-shadow:0 1px 4px #163441;white-space:nowrap}.saying{top:24%;right:20%;font-size:clamp(10px,2.2vw,16px);font-style:italic;color:#654a40;opacity:.8}.verse{bottom:0;left:0;right:0;padding:7px 3px;text-align:center;font-size:clamp(9px,1.9vw,14px);color:#fff1d4;background:linear-gradient(transparent,#061f24bd);white-space:normal;line-height:1.2}.pause{position:absolute;right:7px;top:7px;border:1px solid #ead8ad55;background:#132c3870;color:#fff2d7;border-radius:20px;width:27px;height:27px;font-size:12px;cursor:pointer;padding:0}.error{position:absolute;bottom:30px;color:white;font:12px sans-serif}
      </style><section aria-label="Ohana Home ocean porch with two wicker chairs, a family game, soda glasses, and the Good Games Brighter People pillow"><canvas width="960" height="640" aria-hidden="true"></canvas><h2 class="title">Ohana Home · Our family, together</h2><p class="saying">There's always a place for you.</p><p class="verse">Let all that you do be done with love. — 1 Corinthians 16:14 NKJV</p><button class="pause" type="button" aria-label="Pause scene motion" title="Pause scene motion">Ⅱ</button></section>`;
      this.canvas=root.querySelector('canvas');this.ctx=this.canvas.getContext('2d');
      this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.paused=this.reduced.matches;
      const button=root.querySelector('button');
      const sync=()=>{button.textContent=this.paused?'▶':'Ⅱ';button.setAttribute('aria-label',this.paused?'Resume scene motion':'Pause scene motion');};
      button.onclick=()=>{this.paused=!this.paused;sync();};sync();
      this.onReduced=()=>{this.paused=this.reduced.matches;sync();};this.reduced.addEventListener('change',this.onReduced);
      this.visible=true;this.observer=new IntersectionObserver(e=>this.visible=e[0].isIntersecting);this.observer.observe(this);
      this.images={};this.buffer=document.createElement('canvas');this.buffer.width=960;this.buffer.height=640;
      const im=new Image();im.src='/ohana-island.webp';im.decode().then(()=>{this.images.island=im;if(this.isConnected)this.tick();}).catch(()=>{const fallback=document.createElement('img');fallback.src='/ohana-island.webp';fallback.alt='Illustrated Ohana island game table';fallback.style.cssText='width:100%;height:100%;object-fit:cover';this.canvas.replaceWith(fallback);});
    }
    disconnectedCallback(){clearTimeout(this.timer);this.observer?.disconnect();this.reduced?.removeEventListener('change',this.onReduced);}
    tick(){
      if(!this.isConnected)return;
      if(!document.hidden&&this.visible)this.paint(new Date());
      this.timer=setTimeout(()=>this.tick(),this.paused?1000:66);
    }
    paint(date){
      const c=this.ctx,b=this.buffer.getContext('2d'),{day,night}=lighting(date);
      const clock=date.getTime()/1000;if(!this.paused||this.motionTime===undefined)this.motionTime=clock;
      const t=this.motionTime;
      b.globalAlpha=1;b.drawImage(this.images.island,0,0,960,640);
      // Color the same illustration with the Central Time lighting schedule.
      // No photographic frame can replace the illustrated chairs or pillow.
      b.save();b.globalCompositeOperation='multiply';
      b.fillStyle=`rgba(35,53,104,${night*.72})`;b.fillRect(0,0,960,640);b.restore();
      const dusk=(1-day)*(1-night);b.save();
      const tint=b.createLinearGradient(0,0,0,350);tint.addColorStop(0,`rgba(183,111,181,${dusk*.3})`);tint.addColorStop(1,`rgba(255,174,106,${dusk*.38})`);b.fillStyle=tint;b.fillRect(0,0,960,350);b.restore();
      c.drawImage(this.buffer,0,0);
      // Refraction follows the open ocean in the new illustration only.
      c.save();c.beginPath();c.moveTo(220,257);c.lineTo(805,239);c.lineTo(799,274);c.lineTo(706,334);c.lineTo(343,333);c.closePath();c.clip();
      for(let y=238;y<338;y+=2){const dx=Math.sin(y*.19+t*.7)*1.3+Math.sin(y*.07-t*.43)*.8;c.drawImage(this.buffer,0,y,960,2,dx,y,960,2);}c.restore();
      // Broad translucent cloud wisps with independent speeds and date phases.
      c.save();c.beginPath();c.moveTo(335,30);c.lineTo(758,30);c.lineTo(783,225);c.lineTo(482,230);c.lineTo(371,171);c.closePath();c.clip();
      const seed=Math.floor(clock/86400);c.globalCompositeOperation='soft-light';
      for(let i=0;i<8;i++){const x=((t*(.25+i*.031)+i*117+seed*37)%780)-60,y=90+Math.sin(i*41+seed*.73)*72;const g=c.createRadialGradient(x,y,0,x,y,110);g.addColorStop(0,`rgba(${night>.5?'122,145,197':'255,216,181'},.15)`);g.addColorStop(1,'rgba(255,230,190,0)');c.fillStyle=g;c.fillRect(x-110,y-110,220,220);}c.restore();
      if(night>.1){c.save();c.beginPath();c.moveTo(355,40);c.lineTo(750,40);c.lineTo(775,208);c.lineTo(487,213);c.closePath();c.clip();for(let i=0;i<32;i++){const x=350+((i*137+seed*19)%430),y=35+((i*71+seed*11)%185);c.globalAlpha=night*(.35+.35*Math.sin(t*.6+i));c.fillStyle='#fff4c8';c.beginPath();c.arc(x,y,1+(i%3)*.35,0,Math.PI*2);c.fill();}c.restore();}
      this.shadowRoot.querySelector('.saying').style.color=night>.4?'#c8d2e1':day>.5?'#49637a':'#654a40';
    }
  }
  customElements.define('ohana-scene',OhanaScene);
})();
