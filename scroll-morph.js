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
  const logo=document.querySelector('.nav .logo');
  const logoText=logo?.querySelector(':scope > span');
  const logoIcon=logo?.querySelector(':scope > svg');
  const footer=document.querySelector('.footer');
  const signature=footer?.lastElementChild;
  function platformLink(kind,label,href){
    const link=document.createElement('a');link.className='footer-platform footer-platform-'+kind;link.href=href;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',label+(kind==='linkedin'?' on LinkedIn':' on GitHub')+' (opens in a new tab)');
    const tint=kind==='linkedin'?'#62c8ff':'#bd9aff';
    const mark=kind==='linkedin'?'<g fill="#fff"><circle cx="39" cy="36" r="3.5"/><path d="M36 43h6v22h-6zM47 43h6v3c2-3 4-4 7-4 6 0 8 4 8 10v13h-6V53c0-4-1-6-4-6s-5 2-5 6v12h-6z"/></g>':'<g transform="translate(32 32) scale(1.5)" fill="#fff"><path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.334-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.48 5.922.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></g>';
    const art=document.createElement('span');art.className='footer-platform-art';art.setAttribute('aria-hidden','true');art.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" focusable="false" aria-hidden="true"><defs><radialGradient id="footer-'+kind+'-halo"><stop offset="0" stop-color="'+tint+'" stop-opacity=".35"/><stop offset="1" stop-color="'+tint+'" stop-opacity="0"/></radialGradient><radialGradient id="footer-'+kind+'-sphere" cx="32%" cy="28%" r="75%"><stop stop-color="'+tint+'"/><stop offset=".45" stop-color="'+(kind==='linkedin'?'#0a66c2':'#65519c')+'"/><stop offset="1" stop-color="#0a0b1a"/></radialGradient></defs><circle cx="50" cy="50" r="49" fill="url(#footer-'+kind+'-halo)"/><g class="platform-orbits" fill="none" stroke="'+tint+'" stroke-width=".8" opacity=".6"><ellipse cx="50" cy="50" rx="43" ry="20" transform="rotate(-28 50 50)"/><ellipse cx="50" cy="50" rx="38" ry="24" transform="rotate(55 50 50)"/><circle cx="85" cy="30" r="2" fill="'+tint+'"/></g><circle cx="50" cy="50" r="29" fill="url(#footer-'+kind+'-sphere)" stroke="'+tint+'" stroke-opacity=".65"/>'+mark+'</svg>';
    const text=document.createElement('span');text.className='footer-platform-label';text.textContent=label;link.append(art,text);return link;
  }
  let footerSlot=null;
  if(signature){
    footer.classList.add('bh-footer-docking');
    signature.classList.add('bh-footer-signature');
    const creator=platformLink('linkedin','MEET THE CREATOR','https://www.linkedin.com/in/rodolfo-ramosgn/');
    const repository=platformLink('github','GITHUB REPO','https://github.com/grandest-nothing/black-holes');
    footer.firstElementChild.replaceWith(creator);
    footerSlot=document.createElement('span');
    footerSlot.className='bh-footer-slot';
    footerSlot.setAttribute('aria-hidden','true');
    footer.insertBefore(footerSlot,signature);
    footer.insertBefore(repository,signature);
    new IntersectionObserver(entries=>footer.classList.toggle('platforms-visible',entries[0].isIntersecting)).observe(footer);
  }
  const style=document.createElement('style');
  style.textContent=`
    html.bh-scrollbar { scrollbar-width: none; }
    html.bh-scrollbar::-webkit-scrollbar { display: none; }
    .bh-placeholder { width:min(138%,960px); aspect-ratio:1.75/1; margin:0 -19%; flex-shrink:0; }
    .bh-portal { position:fixed; left:0; top:0; z-index:90; pointer-events:none; transform-origin:0 0; }
    .bh-portal>.bh { width:100%!important; height:100%!important; margin:0!important; }
    .bh-portal.is-compact>.bh { animation:none!important; }
    .nav .logo { position:relative; }
    .nav .logo>svg { position:relative; z-index:2; flex-shrink:0; }
    .nav .logo>span { position:relative; z-index:1; transform-origin:0 50%; will-change:transform,opacity; }
    .bh-rail { position:fixed; right:4px; top:96px; bottom:24px; width:44px; z-index:95; opacity:0; pointer-events:none; }
    .bh-rail::before { content:''; position:absolute; left:21px; top:0; bottom:0; width:1px; background:rgba(255,138,61,.15); }
    .bh-rail input { appearance:none; -webkit-appearance:none; writing-mode:vertical-lr; direction:ltr; position:absolute; inset:0; width:100%; height:100%; margin:0; opacity:0; cursor:ns-resize; touch-action:none; }
    .bh-rail:focus-within::before { background:rgba(255,180,110,.7); box-shadow:0 0 5px #ff8a3d55; }
    .bh-rail input::-webkit-slider-thumb { -webkit-appearance:none; width:44px; height:24px; }
    .bh-rail input::-moz-range-thumb { width:44px; height:24px; border:0; }
    .footer.bh-footer-docking { display:grid; grid-template-columns:minmax(0,1fr) auto minmax(0,1fr); align-items:center; gap:1rem 1.5rem; }
    .footer-platform { display:inline-flex; align-items:center; gap:.65rem; color:var(--text); min-width:0; max-width:100%; text-decoration:none; border-radius:12px; }
    .footer-platform-linkedin { grid-column:1; grid-row:1; justify-self:start; }
    .footer-platform-github { grid-column:3; grid-row:1; justify-self:end; }
    .footer-platform-art { display:block; width:76px; height:76px; flex:0 0 76px; transition:filter .35s; }
    .footer-platform-art svg { display:block; width:100%; height:100%; }
    .footer-platform-label { font-size:.75rem; font-weight:800; letter-spacing:.1em; line-height:1.5; }
    .footer-platform:hover .footer-platform-art,.footer-platform:focus-visible .footer-platform-art { filter:drop-shadow(0 0 10px #a8b7ff66); }
    .footer-platform:hover .footer-platform-label { color:var(--accent); }
    .footer-platform:focus-visible { outline:2px solid var(--accent); outline-offset:6px; }
    .platform-orbits { transform-origin:50px 50px; animation:footer-platform-orbit 20s linear infinite; animation-play-state:paused; }
    .platforms-visible .platform-orbits { animation-play-state:running; }
    .footer-platform-github .platform-orbits { animation-direction:reverse; }
    @keyframes footer-platform-orbit { to { transform:rotate(360deg); } }
    .footer.bh-footer-docking .bh-footer-signature { grid-column:1 / -1; grid-row:2; justify-self:center; text-align:center; min-width:0; max-width:100%; }
    .bh-footer-slot { display:block; grid-column:2; grid-row:1; width:clamp(120px,14vw,180px); aspect-ratio:1.75/1; justify-self:center; pointer-events:none; }
    @media(max-width:860px) { .bh-placeholder { width:106%; margin:0 -3%; } .footer-platform { flex-direction:column; gap:.25rem; text-align:center; } .footer-platform-label { font-size:.68rem; } }
    @media(max-width:600px) {
      .footer.bh-footer-docking { grid-template-columns:1fr; grid-template-rows:auto auto auto auto; gap:1rem; text-align:center; }
      .footer.bh-footer-docking .footer-platform-linkedin { grid-column:1; grid-row:1; justify-self:center; }
      .bh-footer-slot { width:140px; grid-column:1; grid-row:2; }
      .footer.bh-footer-docking .footer-platform-github { grid-column:1; grid-row:3; justify-self:center; }
      .footer.bh-footer-docking .bh-footer-signature { grid-column:1; grid-row:4; justify-self:center; text-align:center; margin-top:.5rem; }
      .footer-platform { flex-direction:row; }
    }
    @media(prefers-reduced-motion:reduce) { .platform-orbits { animation:none; } .footer-platform-art { transition:none; } }
  `;
  document.head.appendChild(style);
  hole.replaceWith(slot);
  portal.appendChild(hole);
  document.body.append(portal,rail);
  document.documentElement.classList.add('bh-scrollbar');
  const clamp=n=>Math.max(0,Math.min(1,n));
  const mix=(a,b,t)=>a+(b-a)*t;
  let pending=false;
  function update(){
    pending=false;
    const y=window.scrollY;
    const box=slot.getBoundingClientRect();
    const width=slot.offsetWidth, height=slot.offsetHeight;
    if (!width || !height) return;
    const boundary=Math.max(1,overview.getBoundingClientRect().top+y-96);
    const p=clamp(y/boundary);
    if(logo&&logoText&&logoIcon){
      const icon=logoIcon.getBoundingClientRect(),brand=logo.getBoundingClientRect();
      const center=icon.left-brand.left+icon.width/2;
      const pull=(center-logoText.offsetLeft-logoText.offsetWidth*.01)*p;
      logoText.style.opacity=String(1-p);
      logoText.style.transform=reduced.matches?'none':`translate3d(${pull}px,0,0) rotate(${-24*p}deg) scale(${1-.98*p},${1-.88*p})`;
      logoText.style.filter=reduced.matches?'none':`blur(${p*1.4}px)`;
    }
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
    let opacity=p>=1?1:Number(getComputedStyle(visual).opacity);
    if (reduced.matches && p>0 && p<1) { x=box.left;top=box.top;s=1; }
    let docking=0;
    if(footerSlot&&p>=1){
      const destination=footerSlot.getBoundingClientRect();
      const travel=Math.min(max-boundary,Math.max(180,Math.min(420,innerHeight*.38)));
      const dockStart=max-Math.max(1,travel);
      const raw=clamp((y-dockStart)/Math.max(1,max-dockStart));
      docking=reduced.matches?(raw>=1?1:0):raw*raw*(3-2*raw);
      if(destination.width>0&&destination.height>0){
        const dockScale=destination.width/width;
        const dockTop=destination.top+(destination.height-height*dockScale)/2;
        x=mix(x,destination.left,docking);
        top=mix(top,dockTop,docking);
        s=mix(s,dockScale,docking);
        opacity*=mix(1,Number(getComputedStyle(footer).opacity),docking);
      }
    }
    portal.style.width=width+'px';portal.style.height=height+'px';
    portal.style.transform=`translate3d(${x}px,${top}px,0) scale(${s})`;
    portal.classList.toggle('is-compact',p>=1);
    portal.style.opacity=String(opacity);
    rail.style.opacity=String(p);
    rail.style.pointerEvents=p>=1?'auto':'none';
    control.tabIndex=p>=1?0:-1;
    control.value=String(Math.round(progress*10000));
    control.setAttribute('aria-valuetext',Math.round(progress*100)+' percent');
    if(docking>0&&footer?.getAnimations().some(animation=>animation.playState==='running'))schedule();
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
  if(footer){new ResizeObserver(schedule).observe(footer);footer.addEventListener('transitionrun',schedule);footer.addEventListener('transitionend',schedule);}
  document.fonts?.ready.then(schedule);
  const start=performance.now();
  function revealTick(t){update();if(t-start<1800)requestAnimationFrame(revealTick);}
  requestAnimationFrame(revealTick);
})();
