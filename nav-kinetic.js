(() => {
  const nav=document.getElementById('nav');
  const linksWrap=nav?.querySelector('.links');
  if(!nav||!linksWrap)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const sections=[...document.querySelectorAll('main section[id]')];
  if(!sections.length)return;
  const links=[...linksWrap.querySelectorAll('a')];
  const items=sections.map(s=>{
    const id=s.id;
    const a=links.find(l=>l.getAttribute('href')==='#'+id);
    const label=a?a.textContent.trim():id.toUpperCase();
    return {section:s,id,a,label};
  });
  const style=document.createElement('style');
  style.textContent=`
    .nav .links { position:relative; display:flex; align-items:center; gap:2.2rem; }
    .nav-kinetic-track { position:relative; display:inline-flex; align-items:center; }
    .nav-kinetic-pill { position:absolute; pointer-events:none; border-radius:999px; background:radial-gradient(circle at 50% 50%, rgba(255,138,61,.22), rgba(124,92,255,.08) 70%, transparent); border:1px solid rgba(255,173,107,.35); box-shadow:0 0 16px rgba(255,138,61,.28); transform-origin:center; will-change:transform,opacity,width,height; transition:opacity .35s; }
    .nav-kinetic-item { position:relative; display:inline-block; font-weight:800; font-size:.85rem; text-transform:uppercase; letter-spacing:.12em; color:var(--muted); transition:color .25s; padding:.4rem .2rem; }
    .nav-kinetic-item.is-current { color:#fff; text-shadow:0 0 12px rgba(255,173,107,.6); }
    .nav-kinetic-word { display:inline-block; overflow:hidden; vertical-align:bottom; }
    .nav-kinetic-letter { display:inline-block; will-change:transform,opacity,filter; transform-origin:center 70%; transition:transform .35s var(--ease),opacity .35s,filter .35s; }
    .nav-kinetic-item.is-current .nav-kinetic-letter { animation:kinetic-letter-float 3.2s ease-in-out infinite alternate; }
    @keyframes kinetic-letter-float {
      0% { transform:translate3d(0,0,0) rotate(0deg); }
      50% { transform:translate3d(0,-1.5px,0) rotate(1deg); }
      100% { transform:translate3d(0,1px,0) rotate(-1deg); }
    }
    .nav-kinetic-stack { position:fixed; right:20px; top:50%; transform:translateY(-50%); z-index:92; display:flex; flex-direction:column; align-items:flex-end; gap:1.4rem; pointer-events:auto; mix-blend-mode:difference; }
    .nav-kinetic-stack-item { position:relative; display:flex; align-items:center; gap:.75rem; text-decoration:none; color:#a6a6b3; font-weight:900; font-size:clamp(.75rem,1.2vw,1rem); letter-spacing:.18em; text-transform:uppercase; transform-origin:right center; will-change:transform,opacity,filter; transition:color .3s; }
    .nav-kinetic-stack-item .stack-number { font-size:.65rem; color:var(--accent); font-weight:800; letter-spacing:.1em; opacity:.85; }
    .nav-kinetic-stack-item .stack-bar { width:22px; height:1px; background:#ffffff30; transition:width .35s var(--ease),background .35s; }
    .nav-kinetic-stack-item.is-current { color:#fff; text-shadow:0 0 18px rgba(255,173,107,.85); }
    .nav-kinetic-stack-item.is-current .stack-bar { width:48px; background:linear-gradient(90deg,var(--accent2),var(--accent)); box-shadow:0 0 8px var(--accent); }
    .nav-kinetic-stack-item:hover { color:#fff; }
    @media(max-width:1020px) { .nav-kinetic-stack { display:none; } }
    @media(prefers-reduced-motion:reduce) {
      .nav-kinetic-pill,.nav-kinetic-letter,.nav-kinetic-stack-item { transition:none!important; animation:none!important; transform:none!important; }
    }
  `;
  document.head.append(style);
  linksWrap.classList.add('nav-kinetic-track');
  const pill=document.createElement('span');
  pill.className='nav-kinetic-pill';
  pill.setAttribute('aria-hidden','true');
  linksWrap.prepend(pill);
  items.forEach(({a,label})=>{
    if(!a)return;
    a.classList.add('nav-kinetic-item');
    a.replaceChildren();
    const word=document.createElement('span');
    word.className='nav-kinetic-word';
    [...label].forEach((char,idx)=>{
      const span=document.createElement('span');
      span.className='nav-kinetic-letter';
      span.textContent=char===' '?'\u00A0':char;
      span.style.transitionDelay=(idx*22)+'ms';
      span.style.animationDelay=(idx*90)+'ms';
      word.append(span);
    });
    a.append(word);
  });
  const stack=document.createElement('nav');
  stack.className='nav-kinetic-stack';
  stack.setAttribute('aria-label','Section jump');
  const stackItems=items.map(({id,label},idx)=>{
    const link=document.createElement('a');
    link.className='nav-kinetic-stack-item';
    link.href='#'+id;
    link.setAttribute('aria-label',`Jump to ${label}`);
    const num=document.createElement('span');
    num.className='stack-number';
    num.textContent='0'+(idx+1);
    const text=document.createElement('span');
    text.className='stack-label';
    text.textContent=label;
    const bar=document.createElement('span');
    bar.className='stack-bar';
    bar.setAttribute('aria-hidden','true');
    link.append(num,text,bar);
    stack.append(link);
    link.addEventListener('click',e=>{
      const t=document.getElementById(id);
      if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
    });
    return {link,id,label};
  });
  document.body.append(stack);
  let activeIndex=-1;
  const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
  function updateKinetic(){
    const y=window.scrollY;
    const vh=innerHeight;
    const mid=y+vh*0.45;
    let closestIndex=0;
    let closestDist=Infinity;
    const positions=items.map(({section},idx)=>{
      const top=section.offsetTop;
      const height=section.offsetHeight;
      const dist=Math.abs(mid-(top+height/2));
      if(dist<closestDist){closestDist=dist;closestIndex=idx;}
      const enter=top-vh*0.5;
      const exit=top+height-vh*0.2;
      const progress=clamp((y-enter)/Math.max(1,exit-enter));
      return {top,height,progress};
    });
    activeIndex=closestIndex;
    items.forEach(({a},idx)=>{
      if(!a)return;
      const isCur=idx===activeIndex;
      a.classList.toggle('is-current',isCur);
      a.setAttribute('aria-current',isCur?'true':'false');
      const offset=idx-activeIndex;
      if(!reduced.matches){
        const letters=a.querySelectorAll('.nav-kinetic-letter');
        letters.forEach((letEl,lIdx)=>{
          if(isCur){
            letEl.style.transform='translate3d(0,0,0) scale(1.08)';
            letEl.style.filter='none';
            letEl.style.opacity='1';
          }else{
            const shiftX=offset*2.5;
            const shiftY=Math.abs(offset)*1.2;
            const scale=Math.max(0.88,1-Math.abs(offset)*0.06);
            letEl.style.transform=`translate3d(${shiftX}px,${shiftY}px,0) scale(${scale})`;
            letEl.style.filter='none';
            letEl.style.opacity='0.62';
          }
        });
      }
    });
    const curA=items[activeIndex]?.a;
    if(curA){
      const trackRect=linksWrap.getBoundingClientRect();
      const aRect=curA.getBoundingClientRect();
      if(aRect.width>0){
        const left=aRect.left-trackRect.left-10;
        const top=aRect.top-trackRect.top-4;
        const w=aRect.width+20;
        const h=aRect.height+8;
        pill.style.opacity='1';
        pill.style.transform=`translate3d(${left}px,${top}px,0)`;
        pill.style.width=w+'px';
        pill.style.height=h+'px';
      }
    }else{
      pill.style.opacity='0';
    }
    stackItems.forEach(({link},idx)=>{
      const isCur=idx===activeIndex;
      link.classList.toggle('is-current',isCur);
      if(reduced.matches)return;
      const diff=idx-activeIndex;
      const scale=isCur?1.18:Math.max(0.72,1-Math.abs(diff)*0.16);
      const shiftX=isCur?0:(Math.abs(diff)*14);
      const shiftY=diff*6;
      const op=isCur?1:Math.max(0.25,0.7-Math.abs(diff)*0.2);
      link.style.transform=`translate3d(${shiftX}px,${shiftY}px,0) scale(${scale})`;
      link.style.opacity=String(op);
    });
  }
  let pending=false;
  function schedule(){
    if(!pending){
      pending=true;
      requestAnimationFrame(()=>{pending=false;updateKinetic();});
    }
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener('change',schedule);
  schedule();
  setTimeout(schedule,150);
})();
