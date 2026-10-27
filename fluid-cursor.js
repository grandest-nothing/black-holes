(() => {
  const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const canvas=document.createElement('canvas');canvas.id='fluid-cursor';canvas.width=canvas.height=224;canvas.setAttribute('aria-hidden','true');canvas.style.cssText='position:fixed;left:0;top:0;width:224px;height:224px;pointer-events:none;z-index:2147483647;display:none;will-change:transform';
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const map=document.createElement('canvas');map.width=map.height=96;const mc=map.getContext('2d');if(!mc)return;
  const pixels=mc.createImageData(96,96);
  for(let j=0;j<96;j++)for(let i=0;i<96;i++){
    const dx=i/95*128-64,dy=j/95*128-64,f=Math.exp(-(dx*dx+dy*dy)/(36.25*36.25*.65)),k=(j*96+i)*4;
    pixels.data[k]=128+(dx*.65-dy*.12)*f/150*255;pixels.data[k+1]=128+(dy*.65+dx*.12)*f/150*255;pixels.data[k+2]=128;pixels.data[k+3]=255;
  }
  mc.putImageData(pixels,0,0);
  const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('aria-hidden','true');svg.style.cssText='position:absolute;width:0;height:0;pointer-events:none';
  svg.innerHTML='<defs><filter id="fluid-local-pull" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-color="rgb(128,128,128)" result="neutral"/><feImage width="128" height="128" preserveAspectRatio="none" result="patch"/><feComposite in="patch" in2="neutral" operator="over" result="field"/><feDisplacementMap in="SourceGraphic" in2="field" scale="150" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
  const filter=svg.querySelector('filter'),image=svg.querySelector('feImage');image.setAttribute('href',map.toDataURL());
  const style=document.createElement('style');style.textContent='html.fluid-active,html.fluid-active *{cursor:none!important}.gravity-card{translate:0 0!important;rotate:0deg!important}.gravity-content{translate:0 0!important}.gravity-dust{display:none!important}.fluid-warping{transition:translate .16s,rotate .16s,opacity .9s,transform .9s!important}';
  document.head.append(style);document.body.append(svg,canvas);
  const point={x:0,y:0},nodes=Array.from({length:10},()=>({x:0,y:0}));
  let active=false,raf=0,last=0,lastWarp=-Infinity,dirty=false,target=null,old='',scrollTimer=0,scrolling=false;
  function restore(){if(target){target.style.filter=old;target.classList.remove('fluid-warping');target=null;}}
  function stop(){active=false;cancelAnimationFrame(raf);raf=0;canvas.style.display='none';document.documentElement.classList.remove('fluid-active');restore();}
  function warp(){
    dirty=false;if(scrolling)return;
    const hit=document.elementFromPoint(point.x,point.y);
    const el=hit?.closest('.card')||hit?.closest('.accretion-panel,h1,h2,main p,.btn,.logo,.links,.footer,.scroll-cue');
    if(!el){restore();return;}
    const r=el.getBoundingClientRect();
    if(!r.width||!r.height||r.width*r.height>250000){restore();return;}
    if(el!==target){restore();target=el;old=el.style.filter;el.classList.add('fluid-warping');}
    filter.setAttribute('x','-16');filter.setAttribute('y','-16');filter.setAttribute('width',r.width+32);filter.setAttribute('height',r.height+32);
    image.setAttribute('x',point.x-r.left-64);image.setAttribute('y',point.y-r.top-64);el.style.filter='url(#fluid-local-pull)';
  }
  function wake(){if(active&&!raf)raf=requestAnimationFrame(draw);}
  function draw(ms){
    raf=0;if(!active)return;if(document.hidden){stop();return;}
    if(last&&ms-last<16){wake();return;}
    const dt=last?Math.min(50,ms-last):16;last=ms;
    ctx.clearRect(0,0,224,224);ctx.save();ctx.translate(112-point.x,112-point.y);let unsettled=0;
    for(let i=0;i<nodes.length;i++){
      const p=i?nodes[i-1]:point,n=nodes[i],a=1-Math.exp(-dt/(i?30:14));n.x+=(p.x-n.x)*a;n.y+=(p.y-n.y)*a;unsettled+=Math.abs(p.x-n.x)+Math.abs(p.y-n.y);
      if(i){const fade=1-i/nodes.length;ctx.strokeStyle='rgba(255,'+Math.round(75+fade*90)+',32,'+(fade*.5)+')';ctx.lineWidth=.4+fade*2;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.quadraticCurveTo((n.x+p.x)/2+Math.sin(ms*.003-i)*2,(n.y+p.y)/2,p.x,p.y);ctx.stroke();}
    }
    ctx.fillStyle='#050507';ctx.beginPath();ctx.arc(point.x,point.y,2.3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffad6bcc';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(point.x,point.y,5,3.3,-.6,0,Math.PI*2);ctx.stroke();ctx.restore();
    if(dirty&&ms-lastWarp>=50){warp();lastWarp=ms;}
    if(unsettled>.25||dirty)wake();
  }
  document.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse'||!fine.matches||reduced.matches){stop();return;}
    point.x=e.clientX;point.y=e.clientY;
    canvas.style.transform=`translate3d(${point.x-112}px,${point.y-112}px,0)`;
    if(!active){nodes.forEach(n=>{n.x=point.x;n.y=point.y;});active=true;last=0;canvas.style.display='block';document.documentElement.classList.add('fluid-active');}
    dirty=true;wake();
  },{passive:true});
  window.addEventListener('scroll',()=>{scrolling=true;restore();clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{scrolling=false;dirty=true;wake();},120);},{passive:true});
  document.documentElement.addEventListener('pointerleave',stop);document.addEventListener('pointercancel',stop);window.addEventListener('blur',stop);window.addEventListener('resize',stop,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});fine.addEventListener('change',stop);reduced.addEventListener('change',stop);
})();
