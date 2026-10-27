(() => {
  document.querySelectorAll('.eyebrow').forEach(el=>el.remove());
  document.querySelectorAll('.section p').forEach(p=>p.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode('. '))));
  const intro=document.querySelector('#overview .body');
  if(intro)intro.textContent=intro.textContent.replace(/\.?\s*Most form when massive stars collapse at the end of their lives\.?\s*$/,'').trim().replace(/\.$/,'');
  const topics=[
    ['how they form?','The birth of a black hole','When a massive star runs out of nuclear fuel, gravity can collapse its core into a black hole if the remnant is heavy enough. Black holes can also grow by gathering matter and merging with other compact objects','https://www.nasa.gov/universe/what-are-black-holes/','NASA'],
    ['how many found?','Counting the discoveries','There is no useful single number without specifying a catalog and what counts as a confirmed discovery. The May 2026 GWTC-5 release reported 390 gravitational-wave signals across its observing runs, including mergers of black holes and neutron stars — these are events, not a count of individual black holes','https://ligo.org/science-summaries/o4b_catalog_omnibus/','LIGO · May 2026 catalog release'],
    ['how they die?','An extremely slow farewell','Hawking radiation is predicted to let black holes lose energy and mass, eventually evaporating if they do not gain enough matter to offset the loss. For stellar-mass black holes, significant evaporation would take far longer than the current age of the universe — this remains a theoretical prediction, not an observed black hole death','https://science.nasa.gov/solar-system/10-questions-you-might-have-about-black-holes/','NASA']
  ];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const style=document.createElement('style');
  style.textContent=`
    .learning-card{font:inherit;color:inherit;text-align:left;cursor:pointer;min-height:180px;width:100%}
    .learning-card strong{font-size:clamp(1.7rem,2.8vw,3rem);line-height:1.12}
    .gravity-card{position:relative;isolation:isolate;transition:translate .16s ease,rotate .16s ease,border-color .3s,opacity .9s,transform .9s,filter .9s}
    .gravity-content{display:block;position:relative;transition:translate .16s ease}
    .gravity-dust{position:absolute;inset:0;border-radius:inherit;overflow:hidden;pointer-events:none;z-index:2}
    .gravity-pixel{position:absolute;width:2px;height:2px;background:#ffc28e;opacity:0;animation:pixel-infall 1.6s linear infinite}
    @keyframes pixel-infall{0%{opacity:0;transform:translate(0,0) scale(1)}20%{opacity:.28}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)}}
    .accretion-panel{position:fixed;z-index:160;width:min(520px,calc(100vw - 32px));box-sizing:border-box;max-height:calc(100svh - 32px);overflow:auto;padding:1.75rem;background:#0c0c12f5;color:#f5f5f7;border:1px solid #ffffff20;border-radius:20px;box-shadow:0 20px 70px #0009;backdrop-filter:blur(14px)}
    .accretion-panel h2{font-size:clamp(1.7rem,3vw,2.5rem);margin-bottom:1rem;line-height:1.05}
    .accretion-panel p{color:#aaaab5;line-height:1.7;margin:0 0 1rem}
    .accretion-panel a{display:inline-block;color:#ffad6b;font-size:.85rem}
    .accretion-panel .word{display:inline-block}
    .learning-card:focus-visible,.accretion-panel a:focus-visible{outline:2px solid #ffad6b;outline-offset:5px}
    @media(prefers-reduced-motion:reduce){.gravity-dust{display:none}.gravity-card,.gravity-content{transition:none}}
  `;
  document.head.appendChild(style);
  const panel=document.createElement('section');panel.className='accretion-panel';panel.id='accretion-details';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-labelledby','accretion-title');
  panel.innerHTML='<h2 id="accretion-title"></h2><p></p><a target="_blank" rel="noopener noreferrer"></a>';document.body.appendChild(panel);
  let active=null,opentimer=0,closetimer=0,animations=[],generation=0;
  let pointer={x:innerWidth/2,y:innerHeight/2};
  const cancelTimers=()=>{clearTimeout(opentimer);clearTimeout(closetimer);};
  function cancelAnimations(){animations.forEach(a=>a.cancel());animations=[];}
  function words(el,text){el.replaceChildren();text.split(' ').forEach((word,i)=>{if(i)el.append(' ');const s=document.createElement('span');s.className='word';s.textContent=word;el.append(s);});}
  function animateText(out){
    cancelAnimations();const id=++generation;
    const box=panel.getBoundingClientRect();panel.style.transformOrigin=(pointer.x-box.left)+'px '+(pointer.y-box.top)+'px';
    const duration=reduced.matches?100:360;
    animations.push(panel.animate(out?[{opacity:1,transform:'scale(1)'},{opacity:0,transform:reduced.matches?'none':'scale(.04) rotate(8deg)'}]:[{opacity:0,transform:reduced.matches?'none':'scale(.04) rotate(-8deg)'},{opacity:1,transform:'scale(1)'}],{duration,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'}));
    if(!reduced.matches)panel.querySelectorAll('.word').forEach((s,i)=>{const r=s.getBoundingClientRect();const collapsed={opacity:0,transform:`translate(${pointer.x-r.left}px,${pointer.y-r.top}px) scale(.05) rotate(-12deg)`};const expanded={opacity:1,transform:'none'};animations.push(s.animate(out?[expanded,collapsed]:[collapsed,expanded],{duration:300,delay:Math.min(i*4,100),easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'}));});
    if(out)Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>{if(id!==generation)return;panel.hidden=true;cancelAnimations();});
  }
  function open(card){
    cancelTimers();if(active===card&&!panel.hidden)return;
    generation++;cancelAnimations();active?.setAttribute('aria-expanded','false');active=card;const t=topics[Number(card.dataset.topic)];
    words(panel.querySelector('h2'),t[1]);words(panel.querySelector('p'),t[2]);
    const link=panel.querySelector('a');link.href=t[3];link.textContent=t[4]+' ↗';
    panel.hidden=false;card.setAttribute('aria-expanded','true');
    const b=card.getBoundingClientRect(),w=panel.offsetWidth,h=panel.offsetHeight;
    const left=Math.max(16,Math.min(innerWidth-w-16,pointer.x-w/2));
    let top=b.top-h+6;if(top<16)top=b.bottom-6;top=Math.max(16,Math.min(innerHeight-h-16,top));
    panel.style.left=left+'px';panel.style.top=top+'px';animateText(false);
  }
  function close(force=false){
    clearTimeout(opentimer);
    if(!force&&(panel.matches(':hover')||active?.matches(':hover')||panel.contains(document.activeElement)||active===document.activeElement))return;
    if(panel.hidden)return;active?.setAttribute('aria-expanded','false');active=null;animateText(true);
  }
  const queueClose=()=>{clearTimeout(opentimer);clearTimeout(closetimer);closetimer=setTimeout(()=>close(),300);};
  panel.addEventListener('pointerenter',()=>clearTimeout(closetimer));panel.addEventListener('pointerleave',queueClose);
  panel.addEventListener('focusin',()=>clearTimeout(closetimer));panel.addEventListener('focusout',queueClose);
  document.addEventListener('pointermove',e=>{pointer={x:e.clientX,y:e.clientY};},{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){cancelTimers();close(true);}});
  document.addEventListener('pointerdown',e=>{if(!panel.contains(e.target)&&!e.target.closest('.learning-card')){cancelTimers();close(true);}});
  document.querySelectorAll('#overview .stats .card').forEach((old,i)=>{
    if(!topics[i])return;const card=document.createElement('button');card.type='button';card.className='card learning-card reveal';card.dataset.topic=i;card.setAttribute('aria-expanded','false');card.setAttribute('aria-controls',panel.id);
    const strong=document.createElement('strong');strong.textContent=topics[i][0];card.append(strong);old.replaceWith(card);
    const observer=new IntersectionObserver(es=>{if(es[0].isIntersecting){card.classList.add('in');observer.disconnect();}},{threshold:.15});observer.observe(card);
    card.addEventListener('pointerenter',e=>{if(!fine.matches)return;cancelTimers();pointer={x:e.clientX,y:e.clientY};opentimer=setTimeout(()=>open(card),300);});
    card.addEventListener('pointerleave',queueClose);
    card.addEventListener('focus',()=>{cancelTimers();const b=card.getBoundingClientRect();pointer={x:b.left+b.width/2,y:b.top+b.height/2};opentimer=setTimeout(()=>open(card),300);});
    card.addEventListener('blur',queueClose);
    card.addEventListener('click',()=>{if(!fine.matches){if(active===card)close(true);else open(card);}});
  });
  document.querySelectorAll('.card').forEach(card=>{
    card.classList.add('gravity-card');const content=document.createElement('span');content.className='gravity-content';while(card.firstChild)content.append(card.firstChild);card.append(content);
    const dust=document.createElement('span');dust.className='gravity-dust';dust.setAttribute('aria-hidden','true');card.append(dust);let rect,frame=0,x=0,y=0;
    function reset(){cancelAnimationFrame(frame);frame=0;rect=null;card.style.translate='';card.style.rotate='';content.style.translate='';dust.replaceChildren();}
    function paint(){frame=0;if(!rect)return;const dx=x-rect.width/2,dy=y-rect.height/2;card.style.translate=(dx*.045)+'px '+(dy*.045)+'px';card.style.rotate=(dx/Math.max(1,rect.width)*1.5)+'deg';content.style.translate=(dx*.018)+'px '+(dy*.018)+'px';for(const p of dust.children){p.style.setProperty('--dx',(x-Number(p.dataset.x))+'px');p.style.setProperty('--dy',(y-Number(p.dataset.y))+'px');}}
    card.addEventListener('pointerenter',e=>{if(!fine.matches||reduced.matches)return;rect=card.getBoundingClientRect();for(let i=0;i<14;i++){const p=document.createElement('i');p.className='gravity-pixel';const sx=(i*.618%1)*rect.width,sy=(i*.371%1)*rect.height;p.dataset.x=sx;p.dataset.y=sy;p.style.cssText='left:'+sx+'px;top:'+sy+'px;animation-delay:'+(-i*.13)+'s';dust.append(p);}x=e.clientX-rect.left;y=e.clientY-rect.top;paint();});
    card.addEventListener('pointermove',e=>{if(!rect)return;x=e.clientX-rect.left;y=e.clientY-rect.top;if(!frame)frame=requestAnimationFrame(paint);});
    card.addEventListener('pointerleave',reset);card.addEventListener('pointercancel',reset);reduced.addEventListener('change',reset);window.addEventListener('scroll',reset,{passive:true});
  });
  window.addEventListener('scroll',()=>{cancelTimers();close(true);},{passive:true});
  window.addEventListener('resize',()=>{cancelTimers();close(true);},{passive:true});
})();
