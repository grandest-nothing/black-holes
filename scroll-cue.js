(() => {
  const cue = document.querySelector('.scroll-cue');
  if (!cue) return;
  cue.setAttribute('aria-label', 'Scroll to overview');
  cue.innerHTML = `<svg class="neutron-icon" viewBox="0 0 64 96" width="36" height="54" aria-hidden="true" focusable="false"><defs><radialGradient id="neutron-core"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e6fcff"/><stop offset="1" stop-color="#75d7ff"/></radialGradient><radialGradient id="neutron-aura"><stop stop-color="#66c7ff" stop-opacity=".4"/><stop offset="1" stop-color="#337bff" stop-opacity="0"/></radialGradient><linearGradient id="neutron-jet" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#47bfff" stop-opacity=".1"/><stop offset=".5" stop-color="#cfefff" stop-opacity=".8"/><stop offset="1" stop-color="#6bdfff" stop-opacity=".5"/></linearGradient></defs><circle class="neutron-aura" cx="32" cy="40" r="24" fill="url(#neutron-aura)"/><g class="neutron-axis"><path d="M32 6 L30.8 37 L33.2 37 Z M30.8 43 L33.2 43 L32 79 Z" fill="url(#neutron-jet)"/><path d="M29.8 77 L32 80 L34.2 77" fill="none" stroke="#bfeaff" stroke-opacity=".55" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/></g><circle cx="32" cy="40" r="6.5" fill="url(#neutron-core)"/><path class="neutron-surface" d="M27.5 38 Q32 34 36.5 39 M28 43 Q32.5 40 36.5 41.5" fill="none" stroke="#8dd9f4" stroke-opacity=".5" stroke-width=".9"/></svg><span>Scroll</span>`;
  const style = document.createElement('style');
  style.textContent = `
    .hero .scroll-cue { bottom: 1.25rem; gap: .1rem; color: #7f93a5; font-size: .6rem; opacity: .55; animation: neutron-cue 4s ease-in-out infinite; }
    .neutron-icon { display: block; overflow: visible; filter: drop-shadow(0 0 3px #6cd9ff55); animation: none; }
    .neutron-axis { transform-origin: 32px 40px; animation: neutron-wobble 6s ease-in-out infinite; }
    .neutron-aura { transform-origin: 32px 40px; animation: neutron-pulse 4s ease-in-out infinite; }
    .neutron-surface { transform-origin: 32px 40px; animation: neutron-spin 8s linear infinite; }
    @keyframes neutron-cue { 0%,100% { opacity: .4; } 50% { opacity: .65; } }
    @keyframes neutron-wobble { 0%,100% { transform: rotate(-16deg); } 50% { transform: rotate(16deg); } }
    @keyframes neutron-pulse { 0%,100% { opacity: .6; transform: scale(.95); } 50% { opacity: 1; transform: scale(1.03); } }
    @keyframes neutron-spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .hero .scroll-cue,.neutron-axis,.neutron-aura,.neutron-surface { animation: none; } }
  `;
  document.head.appendChild(style);
})();
