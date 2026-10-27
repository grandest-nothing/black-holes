(() => {
  if(document.getElementById('mobile-panel-styles'))return;
  const style=document.createElement('style');style.id='mobile-panel-styles';style.textContent=`
    .mobile-explanation-close{display:none}
    @media(max-width:860px){
      #overview .learning-card,#anatomy .learning-card,#types .types-card{min-height:140px;padding:1.25rem;border-radius:16px}
      #overview .learning-card strong{font-size:clamp(1.35rem,5.4vw,1.65rem);line-height:1.15}
      #anatomy .anatomy-card .anatomy-title,#types .types-card .type-title{font-size:1.2rem;line-height:1.15;margin-bottom:.55rem}
      #overview .stats,#anatomy .grid,#types .grid{gap:.85rem;margin-top:1.75rem}
      #anatomy .anatomy-summary,#types .type-summary{font-size:.9rem;line-height:1.5}
      .accretion-panel .mobile-explanation-close{display:flex;position:sticky;top:0;float:right;align-items:center;justify-content:center;z-index:3;width:44px;height:44px;min-width:44px;min-height:44px;margin:-.5rem -.5rem .25rem .5rem;padding:0;border:0;border-radius:50%;background:#0c0c12;color:#f5f5f7;font:400 1.7rem/1 system-ui,sans-serif;cursor:pointer;touch-action:manipulation}
      .accretion-panel .mobile-explanation-close:focus-visible{outline:2px solid #ffad6b;outline-offset:2px}
      .cosmos-panel .cosmos-close{min-width:44px;min-height:44px;touch-action:manipulation}
    }
  `;document.head.append(style);
  const selector='#accretion-details,#type-details';
  function attach(panel){
    if(panel.querySelector('.mobile-explanation-close'))return;
    const button=document.createElement('button');button.type='button';button.className='mobile-explanation-close';button.textContent='×';button.setAttribute('aria-label','Close explanation');button.setAttribute('aria-controls',panel.id);
    button.addEventListener('click',event=>{
      event.preventDefault();event.stopPropagation();
      const opener=[...document.querySelectorAll('[aria-controls]')].find(el=>el.getAttribute('aria-controls')===panel.id&&el.getAttribute('aria-expanded')==='true');
      opener?.focus({preventScroll:true});
      document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    });
    panel.prepend(button);
  }
  document.querySelectorAll(selector).forEach(attach);
  new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes){if(node.nodeType!==1)continue;if(node.matches(selector))attach(node);node.querySelectorAll(selector).forEach(attach);}}).observe(document.body,{childList:true,subtree:true});
})();
