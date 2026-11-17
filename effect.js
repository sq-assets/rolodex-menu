/* Rolodex menu: https://github.com/sq-assets/rolodex-menu */
document.querySelectorAll('.rolodex').forEach(el=>{
  const ds=el.dataset,wrap=el.parentNode;if(!ds.collection&&!ds.collections)return;
  const num=(v,d)=>{const n=parseFloat(v);return isNaN(n)?d:n};
  const edit=()=>document.body.classList.contains('sqs-edit-mode-active');
  const SWAP=num(ds.swap,1.2)*1000,SPIN=.08*num(ds.spin,1),SCROLL=.04*num(ds.scrollSpin,1),DRAG=(ds.drag||'on')!=='off';
  const COUNT=Math.min(Math.max(Math.round(num(ds.images,3)),1),8),POS=(ds.imagePosition||(COUNT===1?'centre':'random')).toLowerCase(),LINK=(ds.imageLink||'off')==='on',NEWTAB=ds.imageLinkTarget==='new',SIZE=num(ds.imageSize,165),SMAX=Math.max(num(ds.imageSizeMax,SIZE*1.55),SIZE),PGAP=num(ds.gap,20);
  const css=(p,v)=>v!=null&&v!==''&&el.style.setProperty(p,v);
  if(ds.height)el.style.height=num(ds.height,640)+'px';
  css('--h',ds.rowHeight&&num(ds.rowHeight,130)+'px');css('--rdx-ts',ds.textSize);css('--rdx-w',ds.fontWeight);css('--rdx-color',ds.textColor);
  if((ds.uppercase||'on')==='off')css('--rdx-case','none');
  css('--rdx-grow',ds.grow);css('--rdx-hit',ds.hitWidth&&num(ds.hitWidth,50)+'%');css('--rdx-active',ds.activeColor);css('--rdx-aw',ds.activeFontWeight);
  if((ds.activeItalic||'off')==='on')css('--rdx-ai','italic');
  wrap.style.position='relative';if(ds.ratio)wrap.style.setProperty('--rdx-ratio',ds.ratio);
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
    const n=cards.length,h=num(getComputedStyle(el).getPropertyValue('--h'),130),GAP=num(ds.spacing,30),step=360/n,r=(h+GAP)/2/Math.tan(Math.PI/n);
    const drum=document.createElement('nav');drum.className='rdx-drum';drum.setAttribute('aria-label',ds.label||'Menu');el.appendChild(drum);
    cards.forEach((c,i)=>{const a=document.createElement('a');a.className='rdx-card';a.href=c.url;a.draggable=false;a.c=c;
      if(i>=list.length){a.setAttribute('aria-hidden','true');a.tabIndex=-1}
      const t=document.createElement('span');t.className='rdx-t';t.textContent=c.title;a.append(t);
      a.style.transform='rotateX('+(-i*step)+'deg) translateZ('+r+'px)';drum.appendChild(a);c.imgs.slice(0,COUNT).forEach(s=>new Image().src=s)});
    /* fit: shrink the titles so the longest one (including its hover grow) fits the width; data-text-size is the maximum */
    const fit=()=>{if((ds.fit||'on')==='off')return;el.style.removeProperty('--rdx-fit');const ts=[...drum.querySelectorAll('.rdx-t')],wid=Math.max(...ts.map(t=>t.offsetWidth)),fs=parseFloat(getComputedStyle(ts[0]).fontSize),room=el.clientWidth*num(ds.fitWidth,92)/100/num(ds.grow,1.15);if(wid>room)el.style.setProperty('--rdx-fit',Math.floor(fs*room/wid)+'px')};
    fit();addEventListener('resize',fit);document.fonts&&document.fonts.ready.then(fit);setTimeout(fit,1500);
    let rot=0,vel=0,hover=null,active=null,drag=null,moved=0,idx=0,slot=0,timer,count=COUNT,lastY=scrollY;
    const place=(d,w)=>{d.style.width=w+'px';const H=d.offsetHeight;let x,y,k=0;
      if(POS==='centre'||POS==='center'){const j=COUNT>1?.08:0;x=(wrap.offsetWidth-w)/2+(Math.random()-.5)*2*j*wrap.offsetWidth;y=(wrap.offsetHeight-H)/2+(Math.random()-.5)*2*j*wrap.offsetHeight}else do{x=Math.random()*Math.max(0,wrap.offsetWidth-w);y=Math.random()*Math.max(0,wrap.offsetHeight-H);k++}
      while(POS==='random'&&k<60&&pops.some(o=>o!==d&&o.r&&x<o.r.x+o.r.w+PGAP&&x+w+PGAP>o.r.x&&y<o.r.y+o.r.h+PGAP&&y+H+PGAP>o.r.y));
      d.r={x,y,w,h:H};d.style.left=x+'px';d.style.top=y+'px'};
    const pop=(d,delay)=>{d.classList.remove('on');d.r=null;setTimeout(()=>{if(!hover)return;place(d,SIZE+Math.random()*(SMAX-SIZE));
      const i=document.createElement('img');i.src=hover.imgs[idx++%hover.imgs.length];i.alt='';d.replaceChildren(i);d.classList.add('on')},delay)};
    const stop=()=>{hover=null;if(active){active.classList.remove('on');active=null}clearInterval(timer);pops.forEach(d=>{d.classList.remove('on');d.r=null})};
    /* hover: the row box (not the growing text) is the target, so nothing flickers */
    drum.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse'||edit()||drag!==null)return;const a=e.target.closest('.rdx-card');if(!a||a===active)return;
      stop();vel=0;active=a;a.classList.add('on');if(!a.c.imgs.length)return;hover=a.c;idx=0;slot=0;count=Math.min(COUNT,hover.imgs.length);
      pops.slice(0,count).forEach((d,i)=>pop(d,250+i*150));if(hover.imgs.length>count)timer=setInterval(()=>pop(pops[slot++%count],250),SWAP)});
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
    addEventListener('scroll',()=>{const d=scrollY-lastY;lastY=scrollY;if(edit()||!seen()||active)return;vel+=d*SCROLL},{passive:true});
    if(DRAG){el.addEventListener('pointerdown',e=>{drag=e.clientY;moved=0});
      addEventListener('pointermove',e=>{if(drag===null)return;const d=e.clientY-drag;drag=e.clientY;moved+=Math.abs(d);rot-=d*.4;vel=-d*.4});
      addEventListener('pointerup',()=>drag=null);
      el.addEventListener('click',e=>{if(moved>5)e.preventDefault()},true)}
    (function loop(){if(drag===null){vel*=.92;rot+=vel+(hover||active||!seen()?0:SPIN)}
      drum.style.transform='translateZ('+(-r)+'px) rotateX('+rot+'deg)';requestAnimationFrame(loop)})();
  }).catch(()=>{});
});
