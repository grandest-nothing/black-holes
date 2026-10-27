const nav=document.getElementById('nav');
const cue=document.querySelector('.scroll-cue');
const backToSurface=document.getElementById('backToSurface');
const links=[...document.querySelectorAll('.links a')];
const sections=[...document.querySelectorAll('main section[id]')];
const revealItems=[...document.querySelectorAll('.reveal')];

const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.18,rootMargin:'0px 0px -8% 0px'});

revealItems.forEach(el=>revealObserver.observe(el));

const setActive=()=>{
  const y=scrollY+120;
  let current=sections[0];
  for(const s of sections){
    if(s.offsetTop<=y)current=s;
  }
  links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current?.id}`));
};

const onScroll=()=>{
  nav.classList.toggle('scrolled',scrollY>10);
  setActive();
  if(cue){
    const r=cue.getBoundingClientRect();
    const cueGone=r.bottom<70;
    backToSurface?.classList.toggle('is-visible',cueGone);
    backToSurface?.setAttribute('aria-hidden',cueGone?'false':'true');
    backToSurface?.setAttribute('tabindex',cueGone?'0':'-1');
  }
};

addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',onScroll,{passive:true});
onScroll();
