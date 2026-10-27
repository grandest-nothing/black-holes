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
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

  links.forEach((l) => l.addEventListener('click', (ev) => {
    const t = document.querySelector(l.getAttribute('href'));
    if (t) { ev.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  }));

  const bh = document.createElement('script');
  bh.src = 'blackhole.js';
  document.body.appendChild(bh);
})();
