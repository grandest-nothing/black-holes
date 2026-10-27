(() => {
  const subtitle = document.querySelector('.hero .lead');
  if (subtitle) subtitle.textContent = 'where gravity wins and time bends';
  const heroOverrides = document.createElement('style');
  heroOverrides.textContent = `
    .bh { animation-duration: 12s; }
    .bh__canvas { transform: rotate(-40deg); transform-origin: center; }
    .bh:not(.bh--gl) .bh__scene { rotate: -40deg; }
    .hero .lead { max-width: none; white-space: nowrap; font-size: clamp(.75rem, 1.6vw, 1.5rem); }
    @media (max-width: 860px) { .hero .lead { font-size: clamp(.7rem, 3.2vw, 1.2rem); } }
  `;
  document.head.appendChild(heroOverrides);

  const nav = document.getElementById('nav');
  const cue = document.querySelector('.scroll-cue');
  const backToSurface = document.getElementById('backToSurface');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
    if (cue && backToSurface) {
      const cueRect = cue.getBoundingClientRect();
      const cueGone = cueRect.bottom < 70;
      backToSurface.classList.toggle('is-visible', cueGone);
      backToSurface.setAttribute('aria-hidden', cueGone ? 'false' : 'true');
      backToSurface.setAttribute('tabindex', cueGone ? '0' : '-1');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  const links = [...document.querySelectorAll('.links a')];
  links.forEach((l) => l.addEventListener('click', (ev) => {
    const t = document.querySelector(l.getAttribute('href'));
    if (t) { ev.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  }));

  const bh = document.createElement('script');
  bh.src = 'blackhole.js';
  bh.onload = () => {
    const morph = document.createElement('script');
    morph.src = 'scroll-morph.js';
    document.body.appendChild(morph);
  };
  document.body.appendChild(bh);
  const scrollCue = document.createElement('script');
  scrollCue.src = 'scroll-cue.js';
  document.body.appendChild(scrollCue);
  const starfield = document.createElement('script');
  starfield.src = 'starfield.js';
  document.body.appendChild(starfield);
  const cards = document.createElement('script');
  cards.src = 'cards.js';
  cards.onload = () => {
    const fluid = document.createElement('script');
    fluid.src = 'fluid-cursor.js';
    document.body.appendChild(fluid);
    const types = document.createElement('script');
    types.src = 'types.js';
    document.body.appendChild(types);
  };
  document.body.appendChild(cards);
  const exploration = document.createElement('script');
  exploration.src = 'exploration.js';
  exploration.onload = () => {
    const portals = document.createElement('script');
    portals.src = 'wormhole-ends.js';
    document.body.appendChild(portals);
    const navKinetic = document.createElement('script');
    navKinetic.src = 'nav-kinetic.js';
    document.body.appendChild(navKinetic);
  };
  document.body.appendChild(exploration);
})();
