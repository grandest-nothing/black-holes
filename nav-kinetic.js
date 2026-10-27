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
    .nav-kinetic-word { display:inline-block; overflow:visible; vertical-align:bottom; }
    .nav-kinetic-letter { display:inline-block; will-change:transform,opacity,filter; transform-origin:center 70%; transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .3s,filter .3s; }
    .nav-rail-anchor { position:fixed; right:48px; top:0; z-index:96; pointer-events:none; display:flex; flex-direction:column; align-items:flex-end; will-change:transform; transform:translate3d(0,0,0); }
    .nav-rail-word-wrap { position:absolute; right:0; top:0; transform:translateY(-50%); display:flex; align-items:center; justify-content:flex-end; white-space:nowrap; }
    .nav-rail-letter { display:inline-block; font-weight:900; font-size:clamp(1.1rem,1.8vw,1.65rem); text-transform:uppercase; letter-spacing:.18em; color:#fff; text-shadow:0 0 16px rgba(255,173,107,.85), 0 0 28px rgba(255,138,61,.45); will-change:transform,opacity,filter; transform-origin:center right; transition:transform .28s cubic-bezier(.2,.8,.2,1),opacity .28s,filter .28s; }
    @media(max-width:860px) {
      .nav-rail-anchor { right:40px; }
      .nav-rail-letter { font-size:1.05rem; letter-spacing:.12em; }
    }
    @media(prefers-reduced-motion:reduce) {
      .nav-kinetic-pill,.nav-kinetic-letter,.nav-rail-letter { transition:none!important; animation:none!important; transform:none!important; }
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
      span.dataset.idx=idx;
      word.append(span);
    });
    a.append(word);
  });
  const railAnchor=document.createElement('div');
  railAnchor.className='nav-rail-anchor';
  railAnchor.setAttribute('aria-hidden','true');
  const railWordWraps=items.map(({label})=>{
    const wrap=document.createElement('div');
    wrap.className='nav-rail-word-wrap';
    const letters=[...label].map((char,idx)=>{
      const span=document.createElement('span');
      span.className='nav-rail-letter';
      span.textContent=char===' '?'\u00A0':char;
      span.dataset.idx=idx;
      wrap.append(span);
      return span;
    });
    railAnchor.append(wrap);
    return {wrap,letters,label};
  });
  document.body.append(railAnchor);
  let activeIndex=-1;
  const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
  function updateKinetic(){
    const y=window.scrollY;
    const vh=innerHeight;
    const overview=document.getElementById('overview');
    const heroBoundary=overview?Math.max(1,overview.getBoundingClientRect().top+y-96):vh*0.8;
    const heroP=clamp(y/heroBoundary);
    const maxScroll=Math.max(1,document.documentElement.scrollHeight-vh);
    const scrollProgress=clamp(y/maxScroll);
    const blackHoleCenterY=108+scrollProgress*Math.max(1,vh-144);
    railAnchor.style.transform=`translate3d(0,${blackHoleCenterY}px,0)`;
    const mid=y+vh*0.45;
    let closestIndex=0;
    let closestDist=Infinity;
    items.forEach(({section},idx)=>{\n      const top=section.offsetTop;\n      const height=section.offsetHeight;\n      const dist=Math.abs(mid-(top+height/2));\n      if(dist<closestDist){closestDist=dist;closestIndex=idx;}\n    });
    activeIndex=closestIndex;
    items.forEach(({a,label},secIdx)=>{
      if(!a)return;
      const isCur=secIdx===activeIndex;
      a.classList.toggle('is-current',isCur);
      a.setAttribute('aria-current',isCur?'true':'false');
      const navbarLetters=a.querySelectorAll('.nav-kinetic-letter');
      const totalLetters=label.length;
      navbarLetters.forEach((letEl,lIdx)=>{
        if(reduced.matches){
          letEl.style.opacity=isCur?'1':'0.6';
          letEl.style.transform='none';
          return;
        }
        const letterProgress=clamp((heroP - (lIdx/totalLetters)*0.55)/0.45);
        if(isCur){
          const disX=(1-letterProgress)*0 + letterProgress*(24 + (totalLetters-lIdx)*12);
          const disY=letterProgress * (Math.sin(lIdx*1.2)*8);
          const disRot=letterProgress * ((lIdx%2===0?1:-1)*18);
          const disScale=Math.max(0.01,1-letterProgress*0.9);
          const disOp=Math.max(0,1-letterProgress*1.2);
          const blur=letterProgress*4;
          letEl.style.transform=`translate3d(${disX}px,${disY}px,0) rotate(${disRot}deg) scale(${disScale})`;
          letEl.style.opacity=String(disOp);
          letEl.style.filter=blur>0?`blur(${blur}px)`:'none';
        }else{
          const otherDis=(1-heroP);
          letEl.style.transform=`translate3d(0,0,0) scale(1)`;
          letEl.style.opacity=String(0.55*otherDis);
          letEl.style.filter='none';
        }
      });
    });
    const curA=items[activeIndex]?.a;
    if(curA && heroP<0.95){
      const trackRect=linksWrap.getBoundingClientRect();
      const aRect=curA.getBoundingClientRect();
      if(aRect.width>0){
        const left=aRect.left-trackRect.left-10;
        const top=aRect.top-trackRect.top-4;
        const w=aRect.width+20;
        const h=aRect.height+8;
        pill.style.opacity=String(1-heroP);
        pill.style.transform=`translate3d(${left}px,${top}px,0)`;
        pill.style.width=w+'px';
        pill.style.height=h+'px';
      }
    }else{
      pill.style.opacity='0';
    }
    railWordWraps.forEach(({wrap,letters,label},secIdx)=>{
      const isCur=secIdx===activeIndex;
      const totalLetters=label.length;
      if(!isCur || heroP<=0.05){
        wrap.style.display='none';
        return;
      }
      wrap.style.display='flex';
      letters.forEach((letEl,lIdx)=>{
        if(reduced.matches){
          letEl.style.opacity='1';
          letEl.style.transform='none';
          return;
        }
        const arriveProgress=clamp((heroP - (lIdx/totalLetters)*0.45)/0.55);
        const startX=(totalLetters-lIdx)*18 + 40;
        const curX=(1-arriveProgress)*startX;
        const curY=(1-arriveProgress)*((lIdx%2===0?-1:1)*14);
        const curRot=(1-arriveProgress)*((lIdx%2===0?25:-25));
        const curScale=0.4 + arriveProgress*0.6;
        const curOp=arriveProgress;
        const curBlur=(1-arriveProgress)*6;
        letEl.style.transform=`translate3d(${curX}px,${curY}px,0) rotate(${curRot}deg) scale(${curScale})`;
        letEl.style.opacity=String(curOp);
        letEl.style.filter=curBlur>0.2?`blur(${curBlur}px)`:'none';
      });
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
