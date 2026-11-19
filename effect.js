/* Rolodex menu: https://github.com/sq-assets/rolodex-menu */
document.querySelectorAll('.rolodex').forEach(el=>{
  const ds=el.dataset,wrap=el.parentNode;if(!ds.collection&&!ds.collections)return;
  const num=(v,d)=>{const n=parseFloat(v);return isNaN(n)?d:n};
  const edit=()=>document.body.classList.contains('sqs-edit-mode-active');
  const SWAP=num(ds.swap,1.2)*1000,SPIN=.08*num(ds.spin,1),SCROLL=.04*num(ds.scrollSpin,1),DRAG=(ds.drag||'on')!=='off';
  const COUNT=Math.min(Math.max(Math.round(num(ds.images,3)),1),8),POS=(ds.imagePosition||(COUNT===1?'centre':'random')).toLowerCase(),LINK=(ds.imageLink||'off')==='on',NEWTAB=ds.imageLinkTarget==='new',SIZE=matchMedia('(max-width:767px)').matches?num(ds.imageSizeMobile,Math.round(innerWidth*.5)):num(ds.imageSize,165),SMAX=Math.max(matchMedia('(max-width:767px)').matches?num(ds.imageSizeMaxMobile,Math.round(innerWidth*.62)):num(ds.imageSizeMax,SIZE*1.55),SIZE),PGAP=num(ds.gap,20);
  const css=(p,v)=>v!=null&&v!==''&&el.style.setProperty(p,v);const FRONT=(ds.imagesFront||'off')==='on';
  const MOB=matchMedia('(max-width:767px)').matches,TOUCH=matchMedia('(hover:none)').matches,AUTO=TOUCH&&(ds.autoplayMobile||'on')!=='off',HOLD=num(ds.autoplayHold,2.6)*1000;
  const WRAP=(ds.wrap||'off')==='on',LINES=Math.max(1,Math.round(MOB?num(ds.wrapLinesMobile,3):num(ds.wrapLines,2)));if(WRAP)el.classList.add('rdx-wrap');
  if(ds.height)el.style.height=num(ds.height,640)+'px';if(MOB&&ds.heightMobile)el.style.height=num(ds.heightMobile,520)+'px';
  css('--h',ds.rowHeight&&num(ds.rowHeight,130)+'px');css('--rdx-ts',MOB&&ds.textSizeMobile?ds.textSizeMobile:ds.textSize);css('--rdx-w',ds.fontWeight);css('--rdx-color',ds.textColor);
  if((ds.uppercase||'on')==='off')css('--rdx-case','none');
  css('--rdx-grow',ds.grow);css('--rdx-outline',ds.activeOutline&&num(ds.activeOutline,1)+'px');css('--rdx-outline-color',ds.activeOutlineColor);if((ds.glow||'off')==='on')el.classList.add('rdx-glow');css('--rdx-glow-color',ds.glowColor);css('--rdx-glow-size',ds.glowSize&&num(ds.glowSize,24)+'px');css('--rdx-hit',ds.hitWidth&&num(ds.hitWidth,50)+'%');css('--rdx-active',ds.activeColor);css('--rdx-aw',ds.activeFontWeight);
  if((ds.activeItalic||'off')==='on')css('--rdx-ai','italic');if(ds.activeCase)css('--rdx-acase',ds.activeCase);
  wrap.style.position='relative';if(ds.ratio)wrap.style.setProperty('--rdx-ratio',ds.ratio);if(ds.imageBorder)wrap.style.setProperty('--rdx-img-border',ds.imageBorder);if(ds.imageRadius)wrap.style.setProperty('--rdx-img-radius',num(ds.imageRadius,0)+'px');if(ds.imageFit)wrap.style.setProperty('--rdx-img-fit',ds.imageFit);
  /* fonts: an uploaded file (name + url) or a Google font (name only); none = your heading font */
  const font=(name,url,prop)=>{name=(name||'').trim().replace(/["']/g,'');if(!name)return;url=(url||'').trim();
    css(prop,'"'+name+'", var(--heading-font-font-family, sans-serif)');
    if(url&&window.FontFace)new FontFace(name,'url("'+url+'")').load().then(f=>document.fonts.add(f)).catch(()=>{});
    else{const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+name.replace(/ /g,'+')+':ital,wght@0,100..900;1,100..900&display=swap';document.head.append(l)}};
  font(ds.fontName,ds.fontUrl,'--rdx-font');font(ds.activeFontName,ds.activeFontUrl,'--rdx-afont');
  const dec=s=>{const t=document.createElement('textarea');t.innerHTML=s||'';return t.value.trim()};
  const img=u=>/\.(gif|webp)$/i.test(u)?u:u+'?format=750w';
  const get=u=>fetch(u+'?format=json').then(r=>r.json());
  /* every post, following Squarespace's 20-at-a-time pages */
  const all=async u=>{let items=[],off=null;for(let i=0;i<20;i++){const j=await (await fetch(u+'?format=json'+(off?'&offset='+off:''))).json();items.push(...(j.items||[]));if(!(j.pagination&&j.pagination.nextPage))break;off=j.pagination.nextPageOffset}return items};
  const pops=Array.from({length:COUNT},()=>{const d=document.createElement('div');d.className='rdx-pop';wrap.insertBefore(d,el);return d});
  /* entries: one per post (data-collection) or one per collection (data-collections) */
  const load=ds.collections
    ?Promise.all(ds.collections.split(',').map(s=>s.trim()).filter(Boolean).map(u=>get(u).then(d=>({url:u,title:dec(d.collection.title),imgs:(d.items||[]).filter(i=>i.assetUrl).map(i=>img(i.assetUrl))})).catch(()=>null)))
    :all(ds.collection).then(items=>items.map(i=>({url:i.fullUrl,title:dec(i.title),imgs:i.assetUrl?[img(i.assetUrl)]:[]})));
  load.then(list=>{
    list=list.filter(Boolean).slice(0,num(ds.max,20));if(!list.length)return;
    let cards=[];while(cards.length<24)cards=cards.concat(list);
    const n=cards.length,GAP=num(ds.spacing,30);
    const drum=document.createElement('nav');drum.className='rdx-drum';drum.setAttribute('aria-label',ds.label||'Menu');el.appendChild(drum);
    const cs=cards.map((c,i)=>{const a=document.createElement('a');a.className='rdx-card';a.href=c.url;a.draggable=false;a.c=c;
      if(i>=list.length){a.setAttribute('aria-hidden','true');a.tabIndex=-1}
      const t=document.createElement('span');t.className='rdx-t';t.textContent=c.title;t.dataset.text=c.title;a.append(t);
      drum.appendChild(a);c.imgs.slice(0,COUNT).forEach(s=>new Image().src=s);return a});
    /* layout: fit the text (data-text-size is the maximum), give each row the height of its own title, and space them round the drum */
    let R=300,th=[];
    const layout=()=>{const grow=num(ds.grow,1.15),room=el.clientWidth*num(ds.fitWidth,92)/100/grow,ts=cs.map(a=>a.firstChild);
      el.style.removeProperty('--rdx-fit');css('--rdx-tw',room+'px');
      let fs=parseFloat(getComputedStyle(ts[0]).fontSize);
      if((ds.fit||'on')!=='off'){
        if(!WRAP){const wid=Math.max(...ts.map(t=>t.offsetWidth));if(wid>room)fs=Math.floor(fs*room/wid)}
        else for(let k=0;k<30;k++){el.style.setProperty('--rdx-fit',fs+'px');const lh=parseFloat(getComputedStyle(ts[0]).lineHeight)||fs;
          if(ts.every(t=>t.scrollWidth<=room+1&&Math.round(t.offsetHeight/lh)<=LINES))break;fs=Math.floor(fs*.94)}
        el.style.setProperty('--rdx-fit',fs+'px')}
      const lh=parseFloat(getComputedStyle(ts[0]).lineHeight)||fs,row=num(getComputedStyle(el).getPropertyValue('--h'),130);
      const hs=cs.map(a=>WRAP?a.firstChild.offsetHeight+fs*.12:row);
      const tot=hs.reduce((x,y)=>x+y+GAP,0);R=tot/2/Math.PI;let acc=0;
      th=cs.map((a,i)=>{const hh=hs[i];a.style.height=hh+'px';a.style.marginTop=(-hh/2)+'px';const ang=(acc+(hh+GAP)/2)/R*180/Math.PI;acc+=hh+GAP;
        a.style.transform='rotateX('+(-ang)+'deg) translateZ('+R+'px)';return ang})};
    layout();addEventListener('resize',layout);document.fonts&&document.fonts.ready.then(layout);setTimeout(layout,1500);
    /* images in front: photos sit above the drum, and the active title is copied into a layer above them */
    let front=null,fc=null,ft=null;if(FRONT){wrap.style.setProperty('--rdx-img-z','2');front=document.createElement('div');fc=document.createElement('div');fc.className='rdx-card';ft=document.createElement('span');ft.className='rdx-t';fc.append(ft);front.append(fc);front.style.display='none';wrap.append(front)}
    const lift=a=>{if(!front)return;front.className=el.className+' rdx-front';front.style.cssText=el.style.cssText;Object.assign(front.style,{left:el.offsetLeft+'px',top:el.offsetTop+'px',width:el.offsetWidth+'px',height:el.offsetHeight+'px',display:''});
      const ar=a.getBoundingClientRect(),er=el.getBoundingClientRect();fc.style.top=(ar.top+ar.height/2-er.top)+'px';fc.style.marginTop=(-a.offsetHeight/2)+'px';fc.style.height=a.offsetHeight+'px';ft.textContent=a.c.title;ft.dataset.text=a.c.title;fc.classList.remove('on');a.classList.add('rdx-hide');requestAnimationFrame(()=>fc.classList.add('on'))};
    const drop=a=>{if(!front)return;fc.classList.remove('on');front.style.display='none';if(a)a.classList.remove('rdx-hide')};
    let rot=0,vel=0,hover=null,active=null,drag=null,moved=0,idx=0,slot=0,timer,count=COUNT,lastY=scrollY;
    const place=(d,w)=>{d.style.width=w+'px';const H=d.offsetHeight;let x,y,k=0;
      if(POS==='centre'||POS==='center'){const j=COUNT>1?.08:0;x=(wrap.offsetWidth-w)/2+(Math.random()-.5)*2*j*wrap.offsetWidth;y=(wrap.offsetHeight-H)/2+(Math.random()-.5)*2*j*wrap.offsetHeight}else do{x=Math.random()*Math.max(0,wrap.offsetWidth-w);y=Math.random()*Math.max(0,wrap.offsetHeight-H);k++}
      while(POS==='random'&&k<60&&pops.some(o=>o!==d&&o.r&&x<o.r.x+o.r.w+PGAP&&x+w+PGAP>o.r.x&&y<o.r.y+o.r.h+PGAP&&y+H+PGAP>o.r.y));
      d.r={x,y,w,h:H};d.style.left=x+'px';d.style.top=y+'px'};
    const pop=(d,delay)=>{d.classList.remove('on');d.r=null;setTimeout(()=>{if(!hover)return;place(d,SIZE+Math.random()*(SMAX-SIZE));
      const i=document.createElement('img');i.src=hover.imgs[idx++%hover.imgs.length];i.alt='';d.replaceChildren(i);d.classList.add('on')},delay)};
    const stop=()=>{hover=null;if(active){drop(active);active.classList.remove('on');active=null}clearInterval(timer);pops.forEach(d=>{d.classList.remove('on');d.r=null})};
    /* hover: the row box (not the growing text) is the target, so nothing flickers */
    const on=a=>{stop();vel=0;active=a;a.classList.add('on');lift(a);if(!a.c.imgs.length)return;hover=a.c;idx=0;slot=0;count=Math.min(COUNT,hover.imgs.length);
      pops.slice(0,count).forEach((d,i)=>pop(d,250+i*150));if(hover.imgs.length>count)timer=setInterval(()=>pop(pops[slot++%count],250),SWAP)};
    /* cursor steering (data-steer="on"): top band spins back, bottom band spins forward, middle band picks titles; data-arrows shows hints */
    const STEER=(ds.steer||'off')==='on'&&!AUTO,SSPD=num(ds.steerSpeed,2.5),DEAD=Math.min(.9,Math.max(0,num(ds.steerZone,.35)));let steer=0,zn=0,aUp=null,aDn=null;
    if((ds.arrows||'off')==='on'){const mk=c=>{const a=document.createElement('div');a.className='rdx-arrow '+c;a.setAttribute('aria-hidden','true');wrap.appendChild(a);return a};aUp=mk('rdx-up');aDn=mk('rdx-dn');if(ds.textColor)wrap.style.setProperty('--rdx-arrow',ds.textColor);if(ds.arrowColor)wrap.style.setProperty('--rdx-arrow',ds.arrowColor)}
    /* steering bubble (data-bubble="on"): a small label that follows the cursor in the steering zones */
    let bub=null;const BUP=ds.bubbleUp||'Scroll up',BDN=ds.bubbleDown||'Scroll down';
    if(STEER&&(ds.bubble||'off')==='on'){bub=document.createElement('div');bub.className='rdx-bubble';bub.setAttribute('aria-hidden','true');document.body.appendChild(bub);
      const bs=(p,v)=>v&&bub.style.setProperty(p,v);bs('--rdx-bub-bg',ds.bubbleBg);bs('--rdx-bub-color',ds.bubbleColor);bs('--rdx-bub-font',ds.bubbleFont);bs('--rdx-bub-size',ds.bubbleSize&&num(ds.bubbleSize,10)+'px');if((ds.bubbleUppercase||'on')==='off')bub.style.textTransform='none'}
    if(STEER){el.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||edit()||drag!==null)return;const b=el.getBoundingClientRect();zn=((e.clientY-b.top)/b.height-.5)*2;const m=Math.abs(zn);
      if(m>DEAD){steer=Math.sign(zn)*Math.pow(Math.min(1,(m-DEAD)/(1-DEAD)),1.3)*SSPD;if(active)stop()}else steer=0;if(aUp){aUp.classList.toggle('on',steer<0);aDn.classList.toggle('on',steer>0)}if(bub){if(steer){bub.textContent=steer<0?BUP:BDN;bub.style.left=e.clientX+16+'px';bub.style.top=e.clientY+16+'px';bub.classList.add('on')}else bub.classList.remove('on')}});
      el.addEventListener('pointerleave',()=>{steer=0;zn=0;if(aUp){aUp.classList.remove('on');aDn.classList.remove('on')}if(bub)bub.classList.remove('on')})}
    drum.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse'||edit()||drag!==null||AUTO)return;if(STEER&&Math.abs(zn)>DEAD)return;const a=e.target.closest('.rdx-card');if(a&&a!==active)on(a)});
    el.addEventListener('pointerleave',()=>{el.classList.remove('rdx-over-pop');stop()});
    /* only the centre strip (data-hit-width) is live; moving to the sides lets the drum spin again */
    /* clickable images (data-image-link="on"): the drum sits over them, so check where the cursor is */
    const overPop=e=>LINK&&hover&&pops.some(d=>{if(!d.classList.contains('on'))return false;const b=d.getBoundingClientRect();return e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom});
    let leaveT=null;const keep=()=>{clearTimeout(leaveT);leaveT=null};
    el.addEventListener('pointermove',e=>{const op=overPop(e);el.classList.toggle('rdx-over-pop',op);
      if(!active||e.target.closest('.rdx-card')||op)return keep();if(!LINK)return stop();if(!leaveT)leaveT=setTimeout(()=>{leaveT=null;stop()},400)});
    el.addEventListener('click',e=>{if(moved>5||e.target.closest('.rdx-card')||!overPop(e))return;const u=hover.url;NEWTAB?open(u,'_blank','noopener'):location.href=u});
    const seen=()=>{const b=el.getBoundingClientRect();return b.bottom>0&&b.top<innerHeight};
    /* the page always scrolls normally; the drum spins along with it */
    addEventListener('scroll',()=>{const d=scrollY-lastY;lastY=scrollY;if(AUTO||edit()||!seen()||active)return;vel+=d*SCROLL},{passive:true});
    if(DRAG&&!AUTO){el.addEventListener('pointerdown',e=>{drag=e.clientY;moved=0});
      addEventListener('pointermove',e=>{if(drag===null)return;const d=e.clientY-drag;drag=e.clientY;moved+=Math.abs(d);rot-=d*.4;vel=-d*.4});
      addEventListener('pointerup',()=>drag=null);
      el.addEventListener('click',e=>{if(moved>5)e.preventDefault()},true)}
    /* phones (data-autoplay-mobile): the drum stops on each title in turn, lights it up with its images, then moves on; swipe left/right to skip, tap to open */
    let tgt=0,cur=0,at=null;
    const near=()=>{let b=0,bd=1e9;th.forEach((a,i)=>{const d=Math.abs(((rot-a)%360+540)%360-180);if(d<bd){bd=d;b=i}});return b};
    const goTo=i=>{i=(i%n+n)%n;let d=((th[i]-rot)%360+540)%360-180;tgt=rot+d;cur=i};
    const cycle=dir=>{clearTimeout(at);stop();if(!seen()||edit()){at=setTimeout(()=>cycle(0),800);return}if(dir)goTo(cur+dir);at=setTimeout(()=>{on(cs[cur]);at=setTimeout(()=>cycle(1),HOLD)},650)};
    if(AUTO){goTo(0);rot=tgt;cycle(0);let sx=null,sy=0;
      el.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});
      el.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))cycle(dx<0?1:-1)});
      el.addEventListener('click',e=>{e.preventDefault();if(active)location.href=active.c.url},true)}
    (function loop(){if(AUTO)rot+=(tgt-rot)*.12;else if(drag===null){vel*=.92;rot+=vel+steer+(hover||active||steer||!seen()?0:SPIN)}
      drum.style.transform='translateZ('+(-R)+'px) rotateX('+rot+'deg)';requestAnimationFrame(loop)})();
  }).catch(()=>{});
});
