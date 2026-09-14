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
      :host{display:block;contain:content}section{position:relative;aspect-ratio:3/2;overflow:hidden;border-radius:18px;border:1px solid #b6976277;background:#173441;box-shadow:0 10px 30px #00181c44}canvas{display:block;width:100%;height:100%}.title,.saying,.verse{position:absolute;pointer-events:none;margin:0;font-family:Georgia,serif}.title{top:4%;left:0;width:100%;text-align:center;font-weight:400;font-size:clamp(12px,2.6vw,19px);color:#ffe6b7;text-shadow:0 1px 4px #163441;white-space:nowrap}.saying{top:29%;right:23%;font-size:clamp(10px,2.2vw,16px);font-style:italic;color:#654a40;opacity:.8}.verse{bottom:0;left:0;right:0;padding:7px 3px;text-align:center;font-size:clamp(9px,1.9vw,14px);color:#fff1d4;background:linear-gradient(transparent,#061f24bd);white-space:nowrap}.pause{position:absolute;right:7px;top:7px;border:1px solid #ead8ad55;background:#132c3870;color:#fff2d7;border-radius:20px;width:27px;height:27px;font-size:12px;cursor:pointer;padding:0}.error{position:absolute;bottom:30px;color:white;font:12px sans-serif}
      </style><section aria-label="Ohana Home ocean porch with two wicker chairs, a family game, soda glasses, and the Good Games Brighter People pillow"><canvas width="960" height="640" aria-hidden="true"></canvas><h2 class="title">⌂ Ohana Home · Our family, together</h2><p class="saying">There's always a place for you.</p><p class="verse">Let all that you do be done with love. — 1 Corinthians 16:14 NKJV</p><button class="pause" type="button" aria-label="Pause scene motion" title="Pause scene motion">Ⅱ</button></section>`;
      this.canvas=root.querySelector('canvas');this.ctx=this.canvas.getContext('2d');
      this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.paused=this.reduced.matches;
      const button=root.querySelector('button');
      const sync=()=>{button.textContent=this.paused?'▶':'Ⅱ';button.setAttribute('aria-label',this.paused?'Resume scene motion':'Pause scene motion');};
      button.onclick=()=>{this.paused=!this.paused;sync();};sync();
      this.onReduced=()=>{this.paused=this.reduced.matches;sync();};this.reduced.addEventListener('change',this.onReduced);
      this.visible=true;this.observer=new IntersectionObserver(e=>this.visible=e[0].isIntersecting);this.observer.observe(this);
      this.images={};this.buffer=document.createElement('canvas');this.buffer.width=960;this.buffer.height=640;
      Promise.all(['dawn','day','night','played'].map(async name=>{const im=new Image();im.src='/porch-'+name+'.webp';await im.decode();this.images[name]=im;})).then(()=>{if(this.isConnected)this.tick();}).catch(()=>{const im=new Image();im.onload=()=>{this.ctx.drawImage(im,0,0,960,640);};im.src='/ohana-welcome.png';});
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
      b.globalAlpha=1;b.drawImage(this.images.dawn,0,0,960,640);
      // The full matching lighting frames preserve both foreground chairs.
      for(const [name,alpha] of [['day',day],['night',night]]){b.globalAlpha=alpha;b.drawImage(this.images[name],0,0,960,640);}b.globalAlpha=1;
      // A slow, occasional transition between two furnished game states. Restrict
      // it to dusk when the photographed lighting matches both states.
      const cycle=t%540;const visit=clamp(Math.min((cycle-120)/2,(420-cycle)/2));
      b.save();b.beginPath();b.rect(0,448,960,192);b.clip();b.globalAlpha=visit*(1-day)*(1-night);b.drawImage(this.images.played,0,0,960,640);b.restore();
      c.drawImage(this.buffer,0,0);
      // Refraction stays strictly inside unobstructed ocean/pool water.
      c.save();c.beginPath();c.moveTo(272,280);c.lineTo(737,280);c.lineTo(710,316);c.lineTo(650,359);c.lineTo(350,362);c.closePath();c.moveTo(60,554);c.lineTo(246,531);c.lineTo(267,601);c.lineTo(174,626);c.lineTo(83,610);c.closePath();c.clip();
      for(let y=280;y<640;y+=2){const dx=Math.sin(y*.19+t*.7)*1.1+Math.sin(y*.07-t*.43)*.7;c.drawImage(this.buffer,0,y,960,2,dx,y,960,2);}c.restore();
      // Broad translucent cloud wisps with independent speeds and date phases.
      c.save();c.beginPath();c.moveTo(212,10);c.lineTo(710,10);c.lineTo(650,114);c.lineTo(742,165);c.lineTo(742,238);c.lineTo(570,268);c.lineTo(215,265);c.lineTo(205,170);c.closePath();c.clip();
      const seed=Math.floor(clock/86400);c.globalCompositeOperation='soft-light';
      for(let i=0;i<8;i++){const x=((t*(.25+i*.031)+i*117+seed*37)%780)-60,y=90+Math.sin(i*41+seed*.73)*72;const g=c.createRadialGradient(x,y,0,x,y,110);g.addColorStop(0,`rgba(${night>.5?'122,145,197':'255,216,181'},.15)`);g.addColorStop(1,'rgba(255,230,190,0)');c.fillStyle=g;c.fillRect(x-110,y-110,220,220);}c.restore();
      this.shadowRoot.querySelector('.saying').style.color=night>.4?'#c8d2e1':day>.5?'#49637a':'#654a40';
    }
  }
  customElements.define('ohana-scene',OhanaScene);
})();
