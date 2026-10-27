(() => {
  const hole = document.querySelector('.bh');
  const visual = document.querySelector('.hero__visual');
  const overview = document.getElementById('overview');
  if (!hole || !visual || !overview) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const slot = document.createElement('div');
  slot.className = 'bh-placeholder';
  slot.setAttribute('aria-hidden','true');
  const portal = document.createElement('div');
  portal.className = 'bh-portal';
  portal.setAttribute('aria-hidden','true');
  const rail = document.createElement('div');
  rail.className = 'bh-rail';
  const control = document.createElement('input');
  control.type='range'; control.min='0'; control.max='10000'; control.step='1';
  control.value='0'; control.setAttribute('aria-label','Page scroll position');
  control.setAttribute('aria-controls','top');
  rail.appendChild(control);
  const style=document.createElement('style');
  style.textContent=`
    html.bh-scrollbar { scrollbar-width: none; }
    html.bh-scrollbar::-webkit-scrollbar { display: none; }
    .bh-placeholder { width:min(138%,960px); aspect-ratio:1.75/1; margin:0 -19%; flex-shrink:0; }
    .bh-portal { position:fixed; left:0; top:0; z-index:90; pointer-events:none; transform-origin:0 0; }
    .bh-portal>.bh { width:100%!important; height:100%!important; margin:0!important; }
    .bh-portal.is-compact>.bh { animation:none!important; }
    .bh-rail { position:fixed; right:4px; top:96px; bottom:24px; width:44px; z-index:95; opacity:0; pointer-events:none; }
    .bh-rail::before { content:''; position:absolute; left:21px; top:0; bottom:0; width:1px; background:rgba(255,138,61,.15); }
    .bh-rail input { appearance:none; -webkit-appearance:none; writing-mode:vertical-lr; direction:ltr; position:absolute; inset:0; width:100%; height:100%; margin:0; opacity:0; cursor:ns-resize; touch-action:none; }
    .bh-rail:focus-within::before { background:rgba(255,180,110,.7); box-shadow:0 0 5px #ff8a3d55; }
    .bh-rail input::-webkit-slider-thumb { -webkit-appearance:none; width:44px; height:24px; }
    .bh-rail input::-moz-range-thumb { width:44px; height:24px; border:0; }
    @media(max-width:860px) { .bh-placeholder { width:106%; margin:0 -3%; } }
  `;
  document.head.appendChild(style);
  hole.replaceWith(slot);
  portal.appendChild(hole);
  document.body.append(portal,rail);
  document.documentElement.classList.add('bh-scrollbar');
  const clamp=n=>Math.max(0,Math.min(1,n));
  let pending=false;
  function update(){
    pending=false;
    const y=window.scrollY;
    const box=slot.getBoundingClientRect();
    const width=slot.offsetWidth, height=slot.offsetHeight;
    if (!width || !height) return;
    const boundary=Math.max(1,overview.getBoundingClientRect().top+y-96);
    const p=clamp(y/boundary);
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const progress=clamp(y/max);
    const size=44;
    const scale=1+(size/width-1)*p;
    const cx=innerWidth-26;
    const cy=108+progress*Math.max(1,innerHeight-144);
    const targetX=cx-size/2;
    const targetY=cy-(height*size/width)/2;
    const startY=box.top+y;
    let x=box.left+(targetX-box.left)*p;
    let top=(startY-y)+(targetY-(startY-y))*p;
    let s=scale;
    if (reduced.matches && p>0 && p<1) { x=box.left;top=box.top;s=1; }
    portal.style.width=width+'px';portal.style.height=height+'px';
    portal.style.transform=`translate3d(${x}px,${top}px,0) scale(${s})`;
    portal.classList.toggle('is-compact',p>=1);
    portal.style.opacity=p>=1?'1':getComputedStyle(visual).opacity;
    rail.style.opacity=String(p);
    rail.style.pointerEvents=p>=1?'auto':'none';
    control.tabIndex=p>=1?0:-1;
    control.value=String(Math.round(progress*10000));
    control.setAttribute('aria-valuetext',Math.round(progress*100)+' percent');
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
  control.addEventListener('input',()=>{
    const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
    window.scrollTo({top:Number(control.value)/10000*max,behavior:'instant'});
    update();
  });
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener('change',schedule);
  new ResizeObserver(schedule).observe(document.body);
  document.fonts?.ready.then(schedule);
  const start=performance.now();
  function revealTick(t){update();if(t-start<1800)requestAnimationFrame(revealTick);}
  requestAnimationFrame(revealTick);
})();
