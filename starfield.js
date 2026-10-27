(() => {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.75';
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const style = document.createElement('style');
  style.textContent = 'body{isolation:isolate}main,.footer{position:relative;z-index:1}';
  document.head.appendChild(style);
  document.body.prepend(canvas);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const hole = document.querySelector('.bh');
  const copy = [...document.querySelectorAll('h1,h2,h3,p,.links,.logo,.btn,.card,.timeline,.footer')];
  let w = 0, h = 0, stars = [], boxes = [], lastBoxes = -Infinity, lastFrame = 0, time = 0, scroll = window.scrollY;
  let seed = 7341;
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  function resize() {
    w = innerWidth; h = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed = 7341;
    stars = Array.from({length: Math.min(850, Math.round(w*h/2100))}, () => ({x:rand(), y:rand(), z:.2+rand()*.8, r:.3+rand()*.65, a:.08+rand()*.3, phase:rand()*6.283}));
    lastBoxes = -Infinity;
  }
  const wrap = (n, size) => ((n % size) + size) % size;
  function draw(ms) {
    if (document.hidden) { lastFrame = ms; requestAnimationFrame(draw); return; }
    if (!motion.matches && ms-lastFrame < 33) { requestAnimationFrame(draw); return; }
    const dt = lastFrame ? Math.min((ms-lastFrame)/1000, .08) : 0;
    lastFrame = ms;
    if (!motion.matches) time += dt;
    scroll += (window.scrollY-scroll) * (motion.matches ? 1 : .045);
    if (ms-lastBoxes > 180 || motion.matches) {
      boxes = copy.map(el => el.getBoundingClientRect()).filter(b => b.width && b.bottom > 0 && b.top < h);
      lastBoxes = ms;
    }
    const b = hole?.getBoundingClientRect();
    const cx = b ? b.left+b.width/2 : w*.75;
    const cy = b ? b.top+b.height/2 : h*.5;
    const scale = b ? b.width : 600;
    const radius = Math.min(scale*.43, w*.32);
    const influence = b ? Math.max(0,Math.min(1,(b.bottom+radius)/(radius*2),(h-b.top+radius)/(radius*2))) : 0;
    const shadow = scale*.078;
    ctx.clearRect(0,0,w,h);
    for (const s of stars) {
      let x = wrap(s.x*(w+80) + time*(.15+s.z*.45), w+80)-40;
      let y = wrap(s.y*(h+100) + time*(.08+s.z*.2) - scroll*(.025+s.z*.045), h+100)-50;
      const dx=x-cx, dy=y-cy, distance=Math.hypot(dx,dy);
      const strength = influence * Math.pow(Math.max(0,1-distance/Math.max(1,radius)),2);
      let angle=Math.atan2(dy,dx);
      angle += strength * (.45+Math.sin(time*.018+s.phase)*.1);
      const r=distance+strength*scale*.035;
      x=cx+Math.cos(angle)*r; y=cy+Math.sin(angle)*r;
      if (influence>.1 && Math.hypot(x-cx,y-cy)<shadow) continue;
      let alpha=s.a;
      if (boxes.some(q => x>q.left-16 && x<q.right+16 && y>q.top-12 && y<q.bottom+12)) alpha *= .16;
      ctx.strokeStyle=ctx.fillStyle=`rgba(188,205,224,${alpha})`;
      if (strength>.08) {
        ctx.lineWidth=Math.max(.45,s.r*.7);
        ctx.beginPath();
        const arc=Math.min(.035,strength*.04);
        ctx.arc(cx,cy,r,angle-arc,angle+arc);ctx.stroke();
      } else { ctx.beginPath();ctx.arc(x,y,s.r,0,Math.PI*2);ctx.fill(); }
    }
    if (!motion.matches) requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize',()=>{resize();if(motion.matches) draw(performance.now());},{passive:true});
  window.addEventListener('scroll',()=>{if(motion.matches) draw(performance.now());},{passive:true});
  motion.addEventListener('change',()=>{lastFrame=0;requestAnimationFrame(draw);});
  requestAnimationFrame(draw);
})();
