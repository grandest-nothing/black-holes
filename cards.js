(() => {
  document.querySelectorAll('.section p').forEach(p=>{
    p.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode('. ')));
  });
  const intro=document.querySelector('#overview .body');
  if(intro) intro.textContent=intro.textContent.replace(/\.?\s*Most form when massive stars collapse at the end of their lives\.?\s*$/, '').trim().replace(/\.$/,'');
  const topics=[
    ['how they form?','The birth of a black hole','When a massive star runs out of nuclear fuel, gravity can collapse its core into a black hole if the remnant is heavy enough. Black holes can also grow by gathering matter and merging with other compact objects','https://www.nasa.gov/universe/what-are-black-holes/','NASA'],
    ['how many found?','Counting the discoveries','There is no useful single number without specifying a catalog and what counts as a confirmed discovery. The May 2026 GWTC-5 release reported 390 gravitational-wave signals across its observing runs, including mergers of black holes and neutron stars — these are events, not a count of individual black holes','https://ligo.org/science-summaries/o4b_catalog_omnibus/','LIGO · May 2026 catalog release'],
    ['how they die?','An extremely slow farewell','Hawking radiation is predicted to let black holes lose energy and mass, eventually evaporating if they do not gain enough matter to offset the loss. For stellar-mass black holes, significant evaporation would take far longer than the current age of the universe — this remains a theoretical prediction, not an observed black hole death','https://science.nasa.gov/solar-system/10-questions-you-might-have-about-black-holes/','NASA']
  ];
  const dialog=document.createElement('dialog');
  dialog.className='learning-dialog';dialog.setAttribute('aria-labelledby','learning-title');
  dialog.innerHTML='<button type="button" class="dialog-close" aria-label="Close popup">×</button><p class="eyebrow">Beyond the horizon</p><h2 id="learning-title"></h2><p class="learning-copy"></p><a class="learning-source" target="_blank" rel="noopener noreferrer">Read the source ↗</a>';
  document.body.appendChild(dialog);
  let opener=null, previousOverflow='';
  dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
  dialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;opener?.focus({preventScroll:true});});
  document.querySelectorAll('#overview .stats .card').forEach((old,i)=>{
    const t=topics[i];if(!t)return;
    const button=document.createElement('button');button.type='button';
    button.className='card learning-card reveal';button.setAttribute('aria-haspopup','dialog');
    const title=document.createElement('strong');title.textContent=t[0];button.appendChild(title);
    old.replaceWith(button);
    const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){button.classList.add('in');observer.disconnect();}},{threshold:.15});observer.observe(button);
    button.addEventListener('click',()=>{
      opener=button;dialog.querySelector('h2').textContent=t[1];
      dialog.querySelector('.learning-copy').textContent=t[2];
      const source=dialog.querySelector('a');source.href=t[3];source.textContent=t[4]+' ↗';
      previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();
    });
  });
  const style=document.createElement('style');
  style.textContent=`
    .learning-card { font:inherit;color:inherit;text-align:left;cursor:pointer;min-height:180px;width:100%; }
    .learning-card strong { font-size:clamp(1.7rem,2.8vw,3rem);line-height:1.12; }
    .card { position:relative;isolation:isolate; }
    .gravity-dust { position:absolute;inset:0;border-radius:inherit;overflow:hidden;pointer-events:none;z-index:2; }
    .gravity-pixel { position:absolute;width:2px;height:2px;background:#ffc28e;opacity:0;pointer-events:none; }
    .gravity-active .gravity-pixel { animation:pixel-infall 1.8s linear infinite; }
    @keyframes pixel-infall { 0% { opacity:0;transform:translate(0,0) scale(1); } 20% { opacity:.3; } 100% { opacity:0;transform:translate(var(--dx),var(--dy)) scale(0); } }
    .learning-card:focus-visible,.dialog-close:focus-visible,.learning-source:focus-visible { outline:2px solid #ffad6b;outline-offset:5px; }
    .learning-dialog { position:fixed;inset:0;margin:auto;width:min(620px,calc(100% - 3rem));max-height:85svh;overflow:auto;padding:3rem 2rem;background:#0c0c12;color:#f5f5f7;border:1px solid #ffffff20;border-radius:24px;box-shadow:0 30px 100px #0009; }
    .learning-dialog::backdrop { background:#000b;backdrop-filter:blur(10px); }
    .learning-dialog h2 { font-size:clamp(2rem,5vw,3.5rem);margin-bottom:1.5rem; }
    .learning-dialog .learning-copy { color:#aaaab5;line-height:1.7;margin:1rem 0; }
    .dialog-close { position:absolute;right:1rem;top:.6rem;background:transparent;border:0;color:#aaaab5;font-size:2rem;cursor:pointer; }
    .learning-source { display:inline-block;color:#ffad6b;margin-top:1rem;font-size:.85rem; }
    @media(prefers-reduced-motion:reduce) { .gravity-dust { display:none; } }
  `;
  document.head.appendChild(style);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.card').forEach(card=>{
    const dust=document.createElement('span');dust.className='gravity-dust';dust.setAttribute('aria-hidden','true');card.appendChild(dust);
    let rect, frame=0, px=0,py=0;
    function reset(){cancelAnimationFrame(frame);frame=0;card.style.translate='';card.classList.remove('gravity-active');dust.replaceChildren();rect=null;}
    function paint(){frame=0;if(!rect)return;
      card.style.translate=((px-rect.width/2)*.025)+'px '+((py-rect.height/2)*.025)+'px';
      for(const particle of dust.children){particle.style.setProperty('--dx',(px-Number(particle.dataset.x))+'px');particle.style.setProperty('--dy',(py-Number(particle.dataset.y))+'px');}
    }
    card.addEventListener('pointerenter',e=>{
      if(e.pointerType!=='mouse'||reduced.matches)return;rect=card.getBoundingClientRect();
      for(let j=0;j<14;j++){const p=document.createElement('i');p.className='gravity-pixel';const x=(j*.618%1)*rect.width,y=(j*.371%1)*rect.height;p.dataset.x=x;p.dataset.y=y;p.style.cssText='left:'+x+'px;top:'+y+'px;animation-delay:'+(-j*.13)+'s';dust.appendChild(p);}
      px=e.clientX-rect.left;py=e.clientY-rect.top;card.classList.add('gravity-active');paint();
    });
    card.addEventListener('pointermove',e=>{if(!rect||reduced.matches)return;px=e.clientX-rect.left;py=e.clientY-rect.top;if(!frame)frame=requestAnimationFrame(paint);});
    card.addEventListener('pointerleave',reset);card.addEventListener('pointercancel',reset);
    reduced.addEventListener('change',reset);window.addEventListener('scroll',reset,{passive:true});
  });
})();
