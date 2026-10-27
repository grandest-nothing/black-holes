(() => {
  document.querySelectorAll('.eyebrow').forEach(el=>el.remove());
  document.querySelectorAll('.section p').forEach(p=>p.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode('. '))));
  const intro=document.querySelector('#overview .body');
  if(intro)intro.textContent=intro.textContent.replace(/\.?\s*Most form when massive stars collapse at the end of their lives\.?\s*$/,'').trim().replace(/\.$/,'');
  const anatomy='https://science.nasa.gov/universe/black-holes/anatomy/';
  const topics=[
    {label:'how they form?',title:'The birth of a black hole',text:'When a massive star runs out of nuclear fuel, gravity can collapse its core into a black hole if the remnant is heavy enough. Black holes can later grow by gathering matter or merging',example:'Example: a massive stellar core collapses after the pressure supporting it can no longer balance gravity',kind:'form',source:'https://www.nasa.gov/universe/what-are-black-holes/'},
    {label:'how they live?',title:'A life of feeding and growing',text:'Black holes can gain mass by accreting gas and by merging with other black holes. Gas outside the event horizon can form a bright, hot disk, while a black hole with little nearby material may remain comparatively quiet',example:'Example: in a binary system, a black hole can draw gas from its companion star. The gas shines as it heats up before crossing the horizon — the light comes from the disk, not the black hole itself',kind:'live',source:anatomy},
    {label:'how they die?',title:'An extremely slow farewell',text:'Hawking radiation is predicted to let black holes lose energy and mass. If this loss exceeds the matter and energy they gain, they would eventually evaporate',example:'For a stellar-mass black hole, significant evaporation would take far longer than the current age of the universe. This is a theoretical prediction, not an observed black hole death',kind:'die',source:'https://science.nasa.gov/solar-system/10-questions-you-might-have-about-black-holes/'},
    {label:'Singularity',summary:'Where general relativity reaches its limit',title:'The limit of our physics',text:'General relativity predicts a singularity inside a black hole, where its mathematical description reaches extreme curvature and breaks down. We do not know whether this represents a physical structure or a limit of the theory',example:'Example: the idealized nonrotating model predicts a central point of infinite density. The dot in this diagram is only a symbol — no telescope has photographed a singularity',kind:'singularity',source:anatomy},
    {label:'Event Horizon',summary:'The boundary beyond which light cannot escape',title:'The point of no return',text:'The event horizon is a boundary in spacetime, not a solid surface. After crossing it, light and other signals cannot reach observers outside the black hole',example:'Example: a light signal emitted from inside the horizon cannot carry a message back outside. A black hole shadow in a telescope image is not a direct photograph of this boundary',kind:'horizon',source:anatomy},
    {label:'Accretion Disk',summary:'Hot matter orbiting outside the event horizon',title:'The light around the darkness',text:'Gas with orbital motion can settle into a disk outside a black hole. As it moves inward, energy is released and the gas heats up, producing light that astronomers can detect',example:'Example: gas drawn from a companion star can orbit and heat up in an accretion disk before some of it falls through the horizon. The disk is outside the black hole, and not every black hole has a bright one',kind:'disk',source:anatomy}
  ];
  function diagram(kind){
    const core='<circle cx="200" cy="80" r="30" fill="#000" stroke="#ffa45d" stroke-width="2"/>';
    const disk='<ellipse cx="200" cy="80" rx="116" ry="24" fill="none" stroke="#ff6a22" stroke-width="10" opacity=".5"/><ellipse cx="200" cy="80" rx="102" ry="18" fill="none" stroke="#ffba6b" stroke-width="3"/>';
    const shapes={
      form:'<circle cx="75" cy="80" r="28" fill="url(#study-glow)"/><path d="M125 80 H285 M270 68 L285 80 L270 92" fill="none" stroke="#ffac6b" stroke-width="2"/><circle cx="325" cy="80" r="24" fill="#000" stroke="#ff7e32" stroke-width="3"/>',
      live:'<circle cx="44" cy="65" r="16" fill="url(#study-glow)"/><path d="M63 65 Q115 30 161 77" fill="none" stroke="#ffac6b" stroke-width="3" stroke-dasharray="5 4"/>'+disk+core,
      die:'<circle cx="85" cy="80" r="26" fill="#000" stroke="#ff9a48" stroke-width="3"/><circle cx="200" cy="80" r="15" fill="#000" stroke="#ff9a48" stroke-width="2"/><circle cx="315" cy="80" r="5" fill="#ffd29f"/><path d="M130 80 H165 M240 80 H280 M315 57 V44 M315 103 V116 M292 80 H280 M338 80 H351" stroke="#ffb16b" stroke-width="2"/>',
      singularity:'<circle cx="200" cy="80" r="60" fill="#08080c" stroke="#ff9145" stroke-dasharray="5 5"/><path d="M200 24 V63 M144 80 H182 M218 80 H256 M200 97 V136" stroke="#a66034"/><circle cx="200" cy="80" r="7" fill="url(#study-glow)"/>',
      horizon:'<circle cx="200" cy="80" r="52" fill="#000" stroke="#ffad6b" stroke-width="3"/><path d="M85 80 H185 M173 70 L185 80 L173 90 M180 45 L205 62 M196 50 L205 62 L191 61" fill="none" stroke="#ffb16b" stroke-width="2"/><path d="M250 35 L290 15" stroke="#7b8793" stroke-dasharray="4 4"/>',
      disk:disk+core+'<path d="M96 63 Q120 31 175 48 M304 98 Q275 130 227 111" fill="none" stroke="#ffc68b" stroke-width="2"/>'
    };
    return '<svg viewBox="0 0 400 160" role="img" aria-label="'+kind+' conceptual diagram"><defs><radialGradient id="study-glow"><stop stop-color="#fff1cf"/><stop offset=".5" stop-color="#ffae62"/><stop offset="1" stop-color="#c43c10"/></radialGradient></defs>'+shapes[kind]+'</svg>';
  }
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
  const style=document.createElement('style');
  style.textContent=`
    .learning-card{font:inherit;color:inherit;text-align:left;cursor:pointer;min-height:180px;width:100%}
    .learning-card strong{font-size:clamp(1.7rem,2.8vw,3rem);line-height:1.12}
    .anatomy-card .anatomy-title{display:block;font-size:1.5rem;font-weight:900;line-height:.95;letter-spacing:-.02em;text-transform:uppercase;margin-bottom:.75rem}
    .anatomy-summary{display:block;color:var(--muted);font-weight:500}
    .accretion-panel{position:fixed;z-index:160;width:min(520px,calc(100vw - 32px));box-sizing:border-box;max-height:calc(100svh - 32px);overflow:auto;padding:1.5rem;background:#0c0c12f5;color:#f5f5f7;border:1px solid #ffffff20;border-radius:20px;box-shadow:0 20px 70px #0009;backdrop-filter:blur(14px)}
    .accretion-panel h2{font-size:clamp(1.6rem,3vw,2.3rem);margin-bottom:1rem;line-height:1.05}
    .accretion-panel p{color:#aaaab5;line-height:1.6;margin:0 0 1rem;font-size:.95rem}
    .accretion-panel a{display:inline-block;color:#ffad6b;font-size:.85rem}
    .accretion-panel figure{margin:0 0 1rem;border:1px solid #ffffff0c;border-radius:12px;background:#060609;overflow:hidden}
    .accretion-panel svg{display:block;width:100%;height:auto;max-height:150px}
    .accretion-panel figcaption{padding:.4rem .75rem;color:#888894;font-size:.65rem}
    .learning-card:focus-visible,.accretion-panel a:focus-visible{outline:2px solid #ffad6b;outline-offset:5px}
  `;document.head.append(style);
  const panel=document.createElement('section');panel.className='accretion-panel';panel.id='accretion-details';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-labelledby','accretion-title');
  panel.innerHTML='<h2 id="accretion-title"></h2><figure></figure><p class="description"></p><p class="example"></p><a target="_blank" rel="noopener noreferrer"></a>';document.body.append(panel);
  let active=null,openTimer=0,closeTimer=0,animation=null,epoch=0;let pointer={x:innerWidth/2,y:innerHeight/2};
  const cancelTimers=()=>{clearTimeout(openTimer);clearTimeout(closeTimer);};
  function animate(out){
    animation?.cancel();const ticket=++epoch;const r=panel.getBoundingClientRect();panel.style.transformOrigin=(pointer.x-r.left)+'px '+(pointer.y-r.top)+'px';
    const small=reduced.matches?'none':'scale(.04) rotate(-8deg)';
    animation=panel.animate(out?[{opacity:1,transform:'none'},{opacity:0,transform:small}]:[{opacity:0,transform:small},{opacity:1,transform:'none'}],{duration:reduced.matches?100:360,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});
    animation.finished.then(()=>{if(ticket!==epoch)return;if(out)panel.hidden=true;animation?.cancel();animation=null;}).catch(()=>{});
  }
  function open(card){
    cancelTimers();if(active===card&&!panel.hidden)return;epoch++;animation?.cancel();active?.setAttribute('aria-expanded','false');active=card;const t=topics[Number(card.dataset.topic)];
    panel.querySelector('h2').textContent=t.title;panel.querySelector('.description').textContent=t.text;panel.querySelector('.example').textContent=t.example;
    panel.querySelector('figure').innerHTML=diagram(t.kind)+'<figcaption>Conceptual illustration · not to scale · not a photograph</figcaption>';
    const a=panel.querySelector('a');a.href=t.source;a.textContent='NASA · read more ↗';
    panel.hidden=false;card.setAttribute('aria-expanded','true');
    const b=card.getBoundingClientRect(),w=panel.offsetWidth,h=panel.offsetHeight;panel.style.left=Math.max(16,Math.min(innerWidth-w-16,pointer.x-w/2))+'px';
    let top=b.top-h+6;if(top<16)top=b.bottom-6;panel.style.top=Math.max(16,Math.min(innerHeight-h-16,top))+'px';animate(false);
  }
  function close(force=false){clearTimeout(openTimer);if(!force&&(panel.matches(':hover')||active?.matches(':hover')||panel.contains(document.activeElement)||active===document.activeElement))return;if(panel.hidden)return;active?.setAttribute('aria-expanded','false');active=null;animate(true);}
  const queueClose=()=>{clearTimeout(openTimer);clearTimeout(closeTimer);closeTimer=setTimeout(()=>close(),300);};
  panel.addEventListener('pointerenter',()=>clearTimeout(closeTimer));panel.addEventListener('pointerleave',queueClose);panel.addEventListener('focusin',()=>clearTimeout(closeTimer));panel.addEventListener('focusout',queueClose);
  document.addEventListener('pointermove',e=>{pointer={x:e.clientX,y:e.clientY};},{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){cancelTimers();close(true);}});
  document.addEventListener('pointerdown',e=>{if(!panel.contains(e.target)&&!e.target.closest('.learning-card')){cancelTimers();close(true);}});
  const groups=[['#overview .stats .card',0],['#anatomy .grid .card',3]];
  for(const [selector,offset]of groups)document.querySelectorAll(selector).forEach((old,i)=>{
    const n=offset+i,t=topics[n];if(!t)return;const card=document.createElement('button');card.type='button';card.className='card learning-card gravity-card reveal'+(offset?' anatomy-card':'');card.dataset.topic=n;card.setAttribute('aria-expanded','false');card.setAttribute('aria-controls',panel.id);
    if(offset){const title=document.createElement('span');title.className='anatomy-title';title.textContent=t.label;const summary=document.createElement('span');summary.className='anatomy-summary';summary.textContent=t.summary;card.append(title,summary);}else{const title=document.createElement('strong');title.textContent=t.label;card.append(title);}
    old.replaceWith(card);const observer=new IntersectionObserver(es=>{if(es[0].isIntersecting){card.classList.add('in');observer.disconnect();}},{threshold:.15});observer.observe(card);
    card.addEventListener('pointerenter',e=>{if(!fine.matches)return;cancelTimers();pointer={x:e.clientX,y:e.clientY};openTimer=setTimeout(()=>open(card),300);});card.addEventListener('pointerleave',queueClose);
    card.addEventListener('focus',()=>{cancelTimers();const b=card.getBoundingClientRect();pointer={x:b.left+b.width/2,y:b.top+b.height/2};openTimer=setTimeout(()=>open(card),300);});card.addEventListener('blur',queueClose);
    card.addEventListener('click',()=>{if(!fine.matches){if(active===card)close(true);else open(card);}});
  });
  document.querySelectorAll('.card').forEach(card=>card.classList.add('gravity-card'));
  window.addEventListener('scroll',()=>{cancelTimers();close(true);},{passive:true});window.addEventListener('resize',()=>{cancelTimers();close(true);},{passive:true});
})();
