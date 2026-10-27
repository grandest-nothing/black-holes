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
    .nav-kinetic-item { position:relative; display:inline-block; font-weight:800; font-size:.85rem; text-transform:uppercase; letter-spacing:.12em; color:var(--muted); transition:color .25s; padding:.4rem .2rem; background:transparent!important; }
    .nav-kinetic-item.is-current { color:#fff; }
    .nav-kinetic-word { display:inline-block; overflow:visible; vertical-align:bottom; }
    .nav-kinetic-letter { display:inline-block; will-change:transform,opacity,filter; transform-origin:center 70%; transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .3s,filter .3s; }
    .nav-rail-stack { position:fixed; right:52px; top:0; bottom:0; left:auto; width:220px; z-index:96; pointer-events:none; }
    .nav-rail-item { position:absolute; right:0; top:0; display:inline-flex; align-items:center; justify-content:flex-end; text-decoration:none; text-align:right; white-space:nowrap; pointer-events:auto; cursor:pointer; transform-origin:right center; will-change:transform,opacity; }
    .nav-rail-label { font-weight:900; font-size:clamp(.78rem,1.1vw,.92rem); text-transform:uppercase; letter-spacing:.16em; color:#fff; text-shadow:none; filter:none; }
    @media(max-width:860px) {
      .nav-rail-stack { right:42px; width:160px; }
      .nav-rail-label { font-size:.7rem; letter-spacing:.1em; }
    }
    @media(prefers-reduced-motion:reduce) {
      .nav-kinetic-letter,.nav-rail-item { transition:none!important; animation:none!important; transform:none!important; }
    }
  `;
  document.head.append(style);
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
  const railStack=document.createElement('nav');
  railStack.className='nav-rail-stack';
  railStack.setAttribute('aria-label','Sticky section stack navigation');
  const railItems=items.map(({id,label})=>{
    const link=document.createElement('a');
    link.className='nav-rail-item';
    link.href='#'+id;
    link.setAttribute('aria-label',`Jump to ${label}`);
    const text=document.createElement('span');
    text.className='nav-rail-label';
    text.textContent=label;
    link.append(text);
    railStack.append(link);
    link.addEventListener('click',e=>{
      const t=document.getElementById(id);
      if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
    });
    return {link,text,id,label};
  });
  document.body.append(railStack);
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
    const mid=y+vh*0.45;
    let closestIndex=0;
    let closestDist=Infinity;
    items.forEach(({section},idx)=>{
      const top=section.offsetTop;
      const height=section.offsetHeight;
      const dist=Math.abs(mid-(top+height/2));
      if(dist<closestDist){closestDist=dist;closestIndex=idx;}
    });
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
          const disX=(1-letterProgress)*0 + letterProgress*(20 + (totalLetters-lIdx)*10);
          const disY=letterProgress * (Math.sin(lIdx*1.2)*6);
          const disRot=letterProgress * ((lIdx%2===0?1:-1)*14);
          const disScale=Math.max(0.01,1-letterProgress*0.9);
          const disOp=Math.max(0,1-letterProgress*1.2);
          const blur=letterProgress*3;
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
    if(heroP<=0.05){
      railStack.style.opacity='0';
      railStack.style.pointerEvents='none';
    }else{
      railStack.style.opacity=String(heroP);
      railStack.style.pointerEvents='auto';
    }
    const stackTopBase=96;
    const stackGap=22;
    const bottomEntryY=vh - 54;
    railItems.forEach(({link},idx)=>{
      const sec=items[idx].section;
      const secTop=sec.offsetTop;
      const secHeight=sec.offsetHeight;
      const topPinnedY=stackTopBase + idx*stackGap;
      const startTrigger=secTop - vh*0.88;
      const endTrigger=secTop + secHeight*0.25;
      const travelProgress=clamp((y-startTrigger)/Math.max(1,endTrigger-startTrigger));
      const targetY=bottomEntryY - travelProgress*(bottomEntryY-topPinnedY);
      const isPinned=targetY<=topPinnedY+1;
      const isCurrent=idx===activeIndex;
      const distToBH=Math.abs(targetY-blackHoleCenterY);
      const proximity=clamp(1-distToBH/110);
      let isVisible=false;
      if(isPinned){
        isVisible=true;
      }else if(travelProgress>0.04){
        if(idx===0){
          isVisible=true;
        }else{
          const prevSec=items[idx-1].section;
          const prevStart=prevSec.offsetTop - vh*0.88;
          const prevEnd=prevSec.offsetTop + prevSec.offsetHeight*0.25;
          const prevTravel=clamp((y-prevStart)/Math.max(1,prevEnd-prevStart));
          if(prevTravel>=0.85){
            isVisible=true;
          }
        }
      }
      if(!isVisible){
        link.style.display='none';
        return;
      }
      link.style.display='inline-flex';
      let op=0.28;
      let scale=0.84;
      if(isCurrent){
        op=Math.max(0.85,0.45+proximity*0.55);
        scale=Math.max(1.0,0.92+proximity*0.22);
      }else if(isPinned){
        op=idx<activeIndex?0.32:0.42;
        scale=0.82;
      }else{
        const fadeEntry=clamp(travelProgress/0.18);
        op=(0.28+proximity*0.45)*fadeEntry;
        scale=0.8+proximity*0.18;
      }
      if(reduced.matches){
        link.style.transform=`translate3d(0,${targetY}px,0)`;
        link.style.opacity=String(op);
        return;
      }
      link.style.transform=`translate3d(0,${targetY}px,0) scale(${scale})`;
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
