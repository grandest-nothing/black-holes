(() => {
  const canvas=document.createElement('canvas');canvas.id='fluid-cursor';canvas.setAttribute('aria-hidden','true');canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2147483647';
  const ctx=canvas.getContext('2d');if(!ctx)return;document.body.append(canvas);
  const style=document.createElement('style');style.textContent=`html.fluid-active,html.fluid-active *{cursor:none!important}.gravity-card{translate:0 0!important;rotate:0deg!important}.gravity-content{translate:0 0!important}.gravity-dust{display:none!important}`;document.head.append(style);
  const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg'),defs=document.createElementNS(NS,'defs');svg.setAttribute('aria-hidden','true');svg.style.cssText='position:absolute;width:0;height:0;pointer-events:none';svg.append(defs);document.body.append(svg);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
  const map=document.createElement('canvas');map.width=192;map.height=128;const mc=map.getContext('2d');if(!mc){canvas.remove();return;}
  const states=new Map();let index=0,w=innerWidth,h=innerHeight,running=false,raf=0,last=0,lastWarp=0,refreshPending=false;
  const point={x:w/2,y:h/2};const nodes=Array.from({length:22},()=>({x:point.x,y:point.y}));
  function refresh(){refreshPending=false;document.querySelectorAll('main>.hero,main>.section,.nav,.footer,.bh-portal,.bh-rail,.accretion-panel,body>canvas:not(#fluid-cursor)').forEach(el=>{
    if(states.has(el))return;
    const filter=document.createElementNS(NS,'filter'),image=document.createElementNS(NS,'feImage'),d=document.createElementNS(NS,'feDisplacementMap'),id='fluid-pull-'+index++;
    filter.id=id;filter.setAttribute('filterUnits','userSpaceOnUse');filter.setAttribute('primitiveUnits','userSpaceOnUse');filter.setAttribute('color-interpolation-filters','sRGB');image.setAttribute('result','field');image.setAttribute('preserveAspectRatio','none');
    d.setAttribute('in','SourceGraphic');d.setAttribute('in2','field');d.setAttribute('xChannelSelector','R');d.setAttribute('yChannelSelector','G');d.setAttribute('scale','150');filter.append(image,d);defs.append(filter);states.set(el,{filter,image,d,id,old:el.style.filter,active:false});
  });}
  function restore(){for(const [el,s]of states){if(s.active){el.style.filter=s.old;s.active=false;}}}
  function stop(){running=false;cancelAnimationFrame(raf);raf=0;ctx.clearRect(0,0,w,h);document.documentElement.classList.remove('fluid-active');restore();}
  function resize(){w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
  function warp(){
    for(const [el,s]of states){
      if(!el.isConnected){s.filter.remove();states.delete(el);continue;}
      const r=el.getBoundingClientRect();const margin=150;
      if(!r.width||!r.height||r.bottom<0||r.top>h||point.x<r.left-margin||point.x>r.right+margin||point.y<r.top-margin||point.y>r.bottom+margin){if(s.active){el.style.filter=s.old;s.active=false;}continue;}
      const pad=48,bw=r.width,bh=r.height,px=point.x-r.left,py=point.y-r.top;
      for(const e of [s.filter,s.image,s.d]){e.setAttribute('x',-pad);e.setAttribute('y',-pad);e.setAttribute('width',bw+pad*2);e.setAttribute('height',bh+pad*2);}
      const data=mc.createImageData(map.width,map.height);
      for(let j=0;j<map.height;j++)for(let i=0;i<map.width;i++){
        const dx=i/(map.width-1)*(bw+pad*2)-pad-px,dy=j/(map.height-1)*(bh+pad*2)-pad-py;
        const f=Math.exp(-(dx*dx+dy*dy)/(145*145*.65));
        const k=(j*map.width+i)*4;
        data.data[k]=Math.max(0,Math.min(255,128+(dx*.65-dy*.12)*f/150*255));
        data.data[k+1]=Math.max(0,Math.min(255,128+(dy*.65+dx*.12)*f/150*255));data.data[k+2]=128;data.data[k+3]=255;
      }
      mc.putImageData(data,0,0);s.image.setAttribute('href',map.toDataURL());el.style.filter='url(#'+s.id+')';s.active=true;
    }
  }
  function draw(ms){
    if(!running)return;if(document.hidden){stop();return;}
    const dt=last?Math.min(40,ms-last):16;last=ms;
    ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';
    for(let i=0;i<nodes.length;i++){
      const p=i?nodes[i-1]:point,n=nodes[i];const a=1-Math.exp(-dt/(i?34:18));n.x+=(p.x-n.x)*a;n.y+=(p.y-n.y)*a;
    }
    for(let i=nodes.length-1;i>0;i--){
      const n=nodes[i],p=nodes[i-1],fade=1-i/nodes.length;
      const radius=2+fade*9;
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,radius);g.addColorStop(0,'rgba(255,135,48,'+(fade*.12)+')');g.addColorStop(.45,'rgba(255,65,8,'+(fade*.08)+')');g.addColorStop(1,'rgba(255,45,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(n.x,n.y,radius,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(255,'+Math.round(70+fade*95)+',35,'+(fade*.38)+')';ctx.lineWidth=.4+fade*2;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.quadraticCurveTo(p.x+Math.sin(ms*.003-i*.55)*3,p.y+Math.cos(ms*.003-i*.55)*3,p.x,p.y);ctx.stroke();
    }
    ctx.globalCompositeOperation='source-over';ctx.fillStyle='#050507';ctx.beginPath();ctx.arc(point.x,point.y,2.3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffad6bcc';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(point.x,point.y,5,3.3,-.6,0,Math.PI*2);ctx.stroke();
    if(ms-lastWarp>33){warp();lastWarp=ms;}
    raf=requestAnimationFrame(draw);
  }
  document.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse'||!fine.matches||reduced.matches){stop();return;}
    point.x=e.clientX;point.y=e.clientY;
    if(!running){nodes.forEach(n=>{n.x=point.x;n.y=point.y;});running=true;last=0;lastWarp=0;document.documentElement.classList.add('fluid-active');raf=requestAnimationFrame(draw);}
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',stop);document.addEventListener('pointercancel',stop);window.addEventListener('blur',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  reduced.addEventListener('change',stop);fine.addEventListener('change',stop);window.addEventListener('resize',()=>{stop();resize();},{passive:true});
  const observer=new MutationObserver(()=>{if(!refreshPending){refreshPending=true;queueMicrotask(refresh);}});observer.observe(document.body,{childList:true,subtree:true});
  resize();refresh();
})();
